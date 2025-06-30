const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const multer = require('multer');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const app = express();
const PORT = process.env.PORT || 8080;

// MongoDB Connection
const MONGODB_URI = "mongodb+srv://iamchandrakanth1618:C1234@cluster0.n43m3rj.mongodb.net/starfinance?retryWrites=true&w=majority&appName=Cluster0";

mongoose.connect(MONGODB_URI)
    .then(() => console.log('✅ Connected to MongoDB'))
    .catch(err => console.error('❌ MongoDB connection error:', err));

// Middleware
app.use(helmet());
app.use(cors({
    origin: ['http://localhost:5173', 'http://localhost:3000'],
    credentials: true
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Rate limiting
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100 // limit each IP to 100 requests per windowMs
});
app.use(limiter);

// File upload configuration
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// JWT Secret
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-here-make-it-long-and-secure-in-production';

// MongoDB Models
const userSchema = new mongoose.Schema({
    email: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    password: { type: String, required: true },
    type: { type: String, enum: ['CUSTOMER', 'BANK_EMPLOYEE', 'ADMIN'], default: 'CUSTOMER' },
    kycNumber: String,
    employeeId: String,
    active: { type: Boolean, default: true },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});

const kycSchema = new mongoose.Schema({
    kycNumber: { type: String, required: true, unique: true },
    userId: { type: String, required: true },
    status: { type: String, enum: ['PENDING', 'VERIFIED', 'REJECTED'], default: 'PENDING' },
    aadhaarNumber: String,
    panNumber: String,
    drivingLicense: String,
    passport: String,
    aadhaarImageUrl: String,
    panImageUrl: String,
    drivingLicenseImageUrl: String,
    passportImageUrl: String,
    verificationNotes: String,
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});

const loanApplicationSchema = new mongoose.Schema({
    requestId: { type: String, required: true, unique: true },
    userId: { type: String, required: true },
    kycNumber: { type: String, required: true },
    status: {
        type: String,
        enum: ['SUBMITTED', 'UNDER_REVIEW', 'DOCUMENT_VERIFICATION', 'PHYSICAL_VERIFICATION', 'GOLD_EVALUATION', 'OFFER_MADE', 'APPROVED', 'REJECTED', 'DISBURSED'],
        default: 'SUBMITTED'
    },
    assetDetails: {
        type: { type: String, required: true },
        weight: { type: Number, required: true },
        purity: { type: String, required: true },
        description: String,
        imageUrls: [String]
    },
    bankDetails: {
        accountNumber: { type: String, required: true },
        ifscCode: { type: String, required: true },
        bankName: { type: String, required: true },
        branchName: String,
        accountHolderName: { type: String, required: true }
    },
    requestedAmount: { type: Number, required: true },
    approvedAmount: Number,
    goldQualityIndex: Number,
    evaluationNotes: String,
    suspiciousFlags: [String],
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});

const User = mongoose.model('User', userSchema);
const KYC = mongoose.model('KYC', kycSchema);
const LoanApplication = mongoose.model('LoanApplication', loanApplicationSchema);

// Swagger Configuration
const swaggerOptions = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'Star Finance API',
            version: '1.0.0',
            description: 'API for Star Finance Gold & Silver Loan Platform',
        },
        servers: [
            {
                url: `http://localhost:${PORT}`,
                description: 'Development server',
            },
        ],
    },
    apis: ['./server.js'],
};

const specs = swaggerJsdoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));

// Authentication Middleware
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({ success: false, message: 'Access token required' });
    }

    jwt.verify(token, JWT_SECRET, (err, user) => {
        if (err) {
            return res.status(403).json({ success: false, message: 'Invalid token' });
        }
        req.user = user;
        next();
    });
};

// Routes

/**
 * @swagger
 * /api/auth/test:
 *   get:
 *     summary: Test API connection
 *     responses:
 *       200:
 *         description: API is running
 */
app.get('/api/auth/test', (req, res) => {
    res.json({ success: true, message: 'Star Finance API is running!' });
});

/**
 * @swagger
 * /api/auth/bank/login:
 *   post:
 *     summary: Bank employee login
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 */
app.post('/api/auth/bank/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email, type: 'BANK_EMPLOYEE' });
        if (!user) {
            return res.status(401).json({ success: false, message: 'Invalid credentials' });
        }

        const isValidPassword = await bcrypt.compare(password, user.password);
        if (!isValidPassword) {
            return res.status(401).json({ success: false, message: 'Invalid credentials' });
        }

        const token = jwt.sign(
            { userId: user._id, email: user.email, type: user.type },
            JWT_SECRET,
            { expiresIn: '24h' }
        );

        res.json({
            success: true,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                type: user.type,
                employeeId: user.employeeId
            },
            token,
            message: 'Login successful'
        });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
});

/**
 * @swagger
 * /api/auth/bank/register:
 *   post:
 *     summary: Register bank employee
 */
app.post('/api/auth/bank/register', async (req, res) => {
    try {
        const { name, email, password } = req.body;

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ success: false, message: 'Email already exists' });
        }

        const hashedPassword = await bcrypt.hash(password, 12);
        const employeeId = 'EMP' + Math.random().toString(36).substr(2, 6).toUpperCase();

        const user = new User({
            name,
            email,
            password: hashedPassword,
            type: 'BANK_EMPLOYEE',
            employeeId
        });

        await user.save();

        res.json({
            success: true,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                type: user.type,
                employeeId: user.employeeId
            },
            message: 'Bank employee registered successfully'
        });
    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
});

/**
 * @swagger
 * /api/kyc/submit:
 *   post:
 *     summary: Submit KYC documents
 */
app.post('/api/kyc/submit', upload.fields([
    { name: 'aadhaarDocument', maxCount: 1 },
    { name: 'panDocument', maxCount: 1 },
    { name: 'drivingLicenseDocument', maxCount: 1 },
    { name: 'passportDocument', maxCount: 1 }
]), async (req, res) => {
    try {
        const { userId, aadhaarNumber, panNumber, drivingLicense, passport } = req.body;

        // Generate KYC number
        const kycNumber = 'KYC' + Date.now();

        // Check if KYC already exists for this user
        const existingKYC = await KYC.findOne({ userId });
        if (existingKYC) {
            return res.status(400).json({
                success: false,
                message: 'KYC already exists for this user',
                kycNumber: existingKYC.kycNumber
            });
        }

        const kyc = new KYC({
            kycNumber,
            userId,
            aadhaarNumber,
            panNumber,
            drivingLicense,
            passport,
            // In a real app, you'd upload files to cloud storage
            aadhaarImageUrl: req.files?.aadhaarDocument ? 'uploaded_aadhaar.jpg' : null,
            panImageUrl: req.files?.panDocument ? 'uploaded_pan.jpg' : null,
            drivingLicenseImageUrl: req.files?.drivingLicenseDocument ? 'uploaded_dl.jpg' : null,
            passportImageUrl: req.files?.passportDocument ? 'uploaded_passport.jpg' : null
        });

        await kyc.save();

        // For Firebase users, we don't update the User collection
        // The KYC number will be stored in the KYC collection and can be retrieved later

        console.log('KYC saved successfully:', kycNumber);

        res.json({
            success: true,
            data: {
                kycNumber,
                status: 'PENDING'
            },
            message: 'KYC submitted successfully'
        });
    } catch (error) {
        console.error('KYC submission error:', error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
});

/**
 * @swagger
 * /api/kyc/status/{userId}:
 *   get:
 *     summary: Get KYC status
 */
app.get('/api/kyc/status/:userId', async (req, res) => {
    try {
        const { userId } = req.params;
        const kyc = await KYC.findOne({ userId });

        if (!kyc) {
            // It's not an error if a user has no KYC record yet.
            return res.status(200).json({ success: true, data: null, message: 'No KYC record found for this user.' });
        }

        res.json({
            success: true,
            data: {
                kycNumber: kyc.kycNumber,
                status: kyc.status,
                createdAt: kyc.createdAt
            }
        });
    } catch (error) {
        console.error('KYC status error:', error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
});

/**
 * @swagger
 * /api/loan/submit:
 *   post:
 *     summary: Submit loan application
 */
app.post('/api/loan/submit', upload.array('assetImages', 5), async (req, res) => {
    try {
        const { userId, kycNumber, assetDetails, bankDetails, requestedAmount } = req.body;

        // Handle both JSON strings and objects
        let parsedAssetDetails, parsedBankDetails;

        try {
            parsedAssetDetails = typeof assetDetails === 'string' ? JSON.parse(assetDetails) : assetDetails;
            parsedBankDetails = typeof bankDetails === 'string' ? JSON.parse(bankDetails) : bankDetails;
        } catch (parseError) {
            console.error('JSON parse error:', parseError);
            return res.status(400).json({ success: false, message: 'Invalid JSON format for assetDetails or bankDetails' });
        }

        const requestId = 'RID' + Date.now();

        const loanApplication = new LoanApplication({
            requestId,
            userId,
            kycNumber,
            assetDetails: {
                ...parsedAssetDetails,
                imageUrls: req.files ? req.files.map(file => `uploaded_${file.originalname}`) : []
            },
            bankDetails: parsedBankDetails,
            requestedAmount: parseFloat(requestedAmount)
        });

        await loanApplication.save();

        console.log('Loan application saved successfully:', requestId);

        res.json({
            success: true,
            data: {
                requestId,
                status: 'SUBMITTED'
            },
            message: 'Loan application submitted successfully'
        });
    } catch (error) {
        console.error('Loan submission error:', error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
});

/**
 * @swagger
 * /api/loan/user/{userId}:
 *   get:
 *     summary: Get user's loan applications
 */
app.get('/api/loan/user/:userId', async (req, res) => {
    try {
        const { userId } = req.params;
        const applications = await LoanApplication.find({ userId }).sort({ createdAt: -1 });

        res.json({
            success: true,
            data: applications
        });
    } catch (error) {
        console.error('Get applications error:', error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
});

/**
 * @swagger
 * /api/bank/applications/pending:
 *   get:
 *     summary: Get pending applications
 */
app.get('/api/bank/applications/pending', async (req, res) => {
    try {
        const applications = await LoanApplication.find({
            status: { $in: ['SUBMITTED', 'UNDER_REVIEW', 'DOCUMENT_VERIFICATION'] }
        }).sort({ createdAt: -1 });

        console.log('Found applications:', applications.length);

        res.json({
            success: true,
            data: applications
        });
    } catch (error) {
        console.error('Get pending applications error:', error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
});

/**
 * @swagger
 * /api/bank/kyc/pending:
 *   get:
 *     summary: Get all pending KYC submissions for review.
 */
app.get('/api/bank/kyc/pending', async (req, res) => {
    try {
        const pendingKycs = await KYC.find({ status: 'PENDING' }).sort({ createdAt: 'desc' });
        res.json({ success: true, data: pendingKycs });
    } catch (error) {
        console.error('Error fetching pending KYCs:', error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
});

/**
 * @swagger
 * /api/bank/kyc/{id}:
 *   get:
 *     summary: Get a single KYC submission by its ID.
 */
app.get('/api/bank/kyc/:id', async (req, res) => {
    try {
        const kyc = await KYC.findById(req.params.id);
        if (!kyc) {
            return res.status(404).json({ success: false, message: 'KYC record not found.' });
        }
        res.json({ success: true, data: kyc });
    } catch (error) {
        console.error('Error fetching KYC record:', error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
});

/**
 * @swagger
 * /api/bank/kyc/{id}/status:
 *   put:
 *     summary: Update the status of a KYC submission.
 */
app.put('/api/bank/kyc/:id/status', async (req, res) => {
    try {
        const { status, notes } = req.body;
        if (!['VERIFIED', 'REJECTED'].includes(status)) {
            return res.status(400).json({ success: false, message: 'Invalid status.' });
        }

        const updatedKyc = await KYC.findByIdAndUpdate(
            req.params.id,
            { status, verificationNotes: notes, updatedAt: new Date() },
            { new: true }
        );

        if (!updatedKyc) {
            return res.status(404).json({ success: false, message: 'KYC record not found.' });
        }
        res.json({ success: true, data: updatedKyc, message: 'KYC status updated.' });
    } catch (error) {
        console.error('Error updating KYC status:', error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
});

/**
 * @swagger
 * /api/bank/applications/{requestId}/status:
 *   put:
 *     summary: Update application status
 */
app.put('/api/bank/applications/:requestId/status', authenticateToken, async (req, res) => {
    try {
        const { requestId } = req.params;
        const { status, notes } = req.body;

        const application = await LoanApplication.findOneAndUpdate(
            { requestId },
            {
                status,
                evaluationNotes: notes,
                updatedAt: new Date()
            },
            { new: true }
        );

        if (!application) {
            return res.status(404).json({ success: false, message: 'Application not found' });
        }

        res.json({
            success: true,
            application,
            message: 'Status updated successfully'
        });
    } catch (error) {
        console.error('Update status error:', error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
});

/**
 * @swagger
 * /api/loan/{requestId}:
 *   get:
 *     summary: Get a single loan application by its request ID.
 */
app.get('/api/loan/:requestId', async (req, res) => {
    try {
        const { requestId } = req.params;
        const application = await LoanApplication.findOne({ requestId });

        if (!application) {
            return res.status(404).json({ success: false, message: 'Application not found.' });
        }

        res.json({ success: true, data: application });
    } catch (error) {
        console.error('Get single application error:', error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
});

// Mock 3rd party API endpoints
app.post('/api/external/aadhaar/verify', (req, res) => {
    // Mock Aadhaar verification
    res.json({ success: true, verified: true, message: 'Aadhaar verified successfully' });
});

app.post('/api/external/pan/verify', (req, res) => {
    // Mock PAN verification
    res.json({ success: true, verified: true, message: 'PAN verified successfully' });
});

app.get('/api/external/bullion/rates', (req, res) => {
    // Mock bullion rates
    res.json({
        success: true,
        rates: {
            gold: { '24K': 5450, '22K': 5000, '18K': 4087 },
            silver: 65000,
            platinum: 3200
        }
    });
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ success: false, message: 'Something went wrong!' });
});

// 404 handler
app.use('*', (req, res) => {
    res.status(404).json({ success: false, message: 'Route not found' });
});

// Start server
app.listen(PORT, () => {
    console.log(`🚀 Star Finance Backend running on port ${PORT}`);
    console.log(`📚 API Documentation: http://localhost:${PORT}/api-docs`);
    console.log(`🔗 Health Check: http://localhost:${PORT}/api/auth/test`);
}); 
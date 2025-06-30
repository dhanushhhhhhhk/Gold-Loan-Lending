# Star Finance - Gold & Silver Loan Automation Platform

A modern, secure, and scalable web application for digitizing gold and silver loan processes.

## 🏗️ Architecture

- **Frontend**: React + TypeScript + Tailwind CSS
- **Backend**: Spring Boot + Java 17
- **Database**: MongoDB Atlas
- **Authentication**: Firebase Auth (Customers) + JWT (Bank Employees)
- **API Documentation**: Swagger/OpenAPI

## 📁 Project Structure

```
project-bolt-sb1-aqapdfre/
├── project/                 # Frontend (React)
│   ├── src/
│   │   ├── components/      # UI Components
│   │   ├── pages/          # Page Components
│   │   ├── contexts/       # React Contexts
│   │   ├── services/       # API Services
│   │   └── ...
│   └── package.json
├── backend/                # Backend (Spring Boot)
│   ├── src/main/java/
│   │   └── com/starfinance/
│   │       ├── controller/ # REST Controllers
│   │       ├── service/    # Business Logic
│   │       ├── repository/ # Data Access
│   │       ├── model/      # MongoDB Models
│   │       └── config/     # Configuration
│   └── pom.xml
└── README.md
```

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ and npm
- Java 17+ and Maven
- MongoDB Atlas account

### 1. Frontend Setup

```bash
# Navigate to frontend directory
cd project

# Install dependencies
npm install

# Start development server
npm run dev
```

Frontend will be available at: http://localhost:5173

### 2. Backend Setup

```bash
# Navigate to backend directory
cd backend

# Build the project
mvn clean install

# Run the application
mvn spring-boot:run
```

Backend will be available at: http://localhost:8080

### 3. MongoDB Connection

The backend is configured to connect to your MongoDB Atlas cluster:
- **Connection String**: `mongodb+srv://iamchandrakanth1618:C1234@cluster0.n43m3rj.mongodb.net/starfinance`
- **Database**: `starfinance`

### 4. API Documentation

Once the backend is running, access Swagger UI at:
http://localhost:8080/swagger-ui.html

## 🔧 Configuration

### Frontend Configuration

1. **Firebase Setup** (for customer authentication):
   - Create a Firebase project
   - Enable Authentication (Email/Password, Google, Facebook)
   - Update `project/src/contexts/AuthContext.tsx` with your Firebase config

2. **API Base URL**:
   - Default: `http://localhost:8080/api`
   - Update in `project/src/services/api.ts` if needed

### Backend Configuration

1. **MongoDB Connection**:
   - Update `backend/src/main/resources/application.yml` with your MongoDB URI
   - Ensure network access is configured in MongoDB Atlas

2. **JWT Secret**:
   - Update the JWT secret in `application.yml` for production

## 📋 Features

### Customer Portal
- ✅ Firebase Authentication (Google/Facebook + Email/Password)
- ✅ KYC Document Upload & Verification
- ✅ Loan Application Submission
- ✅ Application Status Tracking
- ✅ Responsive Design

### Bank Employee Portal
- ✅ JWT-based Authentication
- ✅ Application Review & Processing
- ✅ Gold Evaluation & Quality Index
- ✅ Status Updates & Notifications

### Core Modules
- ✅ User Management (Customer & Bank Employees)
- ✅ KYC Verification System
- ✅ Loan Application Workflow
- ✅ Document Management
- ✅ Status Tracking

## 🔒 Security Features

- HTTPS-ready configuration
- CORS protection
- Password encryption (BCrypt)
- JWT token authentication
- Role-based access control
- Input validation

## 🚧 Development Status

### Completed
- ✅ Project structure setup
- ✅ MongoDB integration
- ✅ Basic authentication
- ✅ API service layer
- ✅ Frontend-backend communication

### In Progress
- 🔄 KYC workflow implementation
- 🔄 Loan application processing
- 🔄 Bank employee dashboard

### Planned
- 📋 3rd party API integrations (Aadhaar, PAN, Bullion)
- 📋 Real-time notifications
- 📋 Advanced reporting
- 📋 Docker & Kubernetes deployment

## 🛠️ Development

### Running in Development Mode

1. **Start Backend**:
   ```bash
   cd backend
   mvn spring-boot:run
   ```

2. **Start Frontend**:
   ```bash
   cd project
   npm run dev
   ```

3. **Access Applications**:
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:8080
   - Swagger UI: http://localhost:8080/swagger-ui.html

### Testing

```bash
# Backend tests
cd backend
mvn test

# Frontend tests
cd project
npm test
```

## 📊 Database Collections

- `users` - Customer and bank employee accounts
- `kyc` - KYC verification data
- `loan_applications` - Loan application details
- `audit_logs` - System activity logs

## 🔗 API Endpoints

### Authentication
- `POST /api/auth/bank/login` - Bank employee login
- `POST /api/auth/bank/register` - Bank employee registration
- `GET /api/auth/test` - Connection test

### KYC
- `POST /api/kyc/submit` - Submit KYC documents
- `GET /api/kyc/status/{userId}` - Get KYC status

### Loan Applications
- `POST /api/loan/submit` - Submit loan application
- `GET /api/loan/user/{userId}` - Get user's applications
- `GET /api/loan/{requestId}` - Get specific application

### Bank Operations
- `GET /api/bank/applications/pending` - Get pending applications
- `PUT /api/bank/applications/{requestId}/status` - Update application status
- `POST /api/bank/applications/{requestId}/evaluate` - Evaluate gold

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is proprietary software for Star Finance.

## 🆘 Support

For technical support or questions:
- Check the API documentation at http://localhost:8080/swagger-ui.html
- Review the console logs for error messages
- Ensure MongoDB connection is working
- Verify all environment variables are set correctly "# Gold-Loan-Lending" 

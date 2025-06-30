import { MongoClient } from 'mongodb';

const MONGODB_URI = "mongodb+srv://iamchandrakanth1618:C1234@cluster0.n43m3rj.mongodb.net/starfinance?retryWrites=true&w=majority&appName=Cluster0";

async function testMongoDB() {
    try {
        console.log('🔌 Connecting to MongoDB...');
        const client = new MongoClient(MONGODB_URI);
        await client.connect();
        console.log('✅ Connected to MongoDB successfully!');

        const db = client.db('starfinance');

        // Check KYC data
        console.log('\n📋 Checking KYC Collection...');
        const kycCollection = db.collection('kycs');
        const kycCount = await kycCollection.countDocuments();
        console.log(`Found ${kycCount} KYC records`);

        if (kycCount > 0) {
            const kycData = await kycCollection.find({}).limit(5).toArray();
            console.log('Sample KYC data:', JSON.stringify(kycData, null, 2));
        }

        // Check Loan Applications data
        console.log('\n📋 Checking Loan Applications Collection...');
        const loanCollection = db.collection('loanapplications');
        const loanCount = await loanCollection.countDocuments();
        console.log(`Found ${loanCount} loan application records`);

        if (loanCount > 0) {
            const loanData = await loanCollection.find({}).limit(5).toArray();
            console.log('Sample loan data:', JSON.stringify(loanData, null, 2));
        }

        // Check Users data
        console.log('\n📋 Checking Users Collection...');
        const userCollection = db.collection('users');
        const userCount = await userCollection.countDocuments();
        console.log(`Found ${userCount} user records`);

        await client.close();
        console.log('\n✅ MongoDB test completed!');

    } catch (error) {
        console.error('❌ MongoDB connection error:', error);
    }
}

testMongoDB(); 
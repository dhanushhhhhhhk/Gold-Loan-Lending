import fetch from 'node-fetch';

async function testKYCSubmission() {
    try {
        console.log('Testing KYC submission...');

        const response = await fetch('http://localhost:8080/api/kyc/submit', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                userId: 'test-user-123',
                aadhaarNumber: '123456789012',
                panNumber: 'ABCDE1234F',
                drivingLicense: 'DL123456789',
                passport: 'A1234567'
            })
        });

        const data = await response.json();
        console.log('KYC Submission Response:', data);

        if (data.success) {
            console.log('✅ KYC submission successful!');
            console.log('KYC Number:', data.data.kycNumber);
        } else {
            console.log('❌ KYC submission failed:', data.message);
        }
    } catch (error) {
        console.error('❌ Error testing KYC submission:', error.message);
    }
}

async function testLoanApplicationSubmission() {
    try {
        console.log('\nTesting Loan Application submission...');

        const response = await fetch('http://localhost:8080/api/loan/submit', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                userId: 'test-user-123',
                kycNumber: 'KYC1750483840972',
                assetDetails: {
                    type: 'Gold Jewelry',
                    weight: 50,
                    purity: '22K (91.6%)',
                    description: 'Gold necklace and earrings',
                    images: []
                },
                bankDetails: {
                    accountNumber: '1234567890',
                    ifscCode: 'SBIN0001234',
                    bankName: 'State Bank of India',
                    branchName: 'Main Branch',
                    accountHolderName: 'Test User'
                },
                requestedAmount: 100000
            })
        });

        const data = await response.json();
        console.log('Loan Application Response:', data);

        if (data.success) {
            console.log('✅ Loan application submission successful!');
            console.log('Request ID:', data.data?.requestId);
        } else {
            console.log('❌ Loan application submission failed:', data.message);
        }
    } catch (error) {
        console.error('❌ Error testing loan application submission:', error.message);
    }
}

async function testBankApplications() {
    try {
        console.log('\nTesting bank applications endpoint...');

        const response = await fetch('http://localhost:8080/api/bank/applications/pending');
        const data = await response.json();

        console.log('Bank Applications Response:', data);

        if (data.success) {
            console.log('✅ Bank applications endpoint working!');
            console.log('Applications found:', data.data.length);
            if (data.data.length > 0) {
                console.log('Sample application:', JSON.stringify(data.data[0], null, 2));
            }
        } else {
            console.log('❌ Bank applications endpoint failed:', data.message);
        }
    } catch (error) {
        console.error('❌ Error testing bank applications:', error.message);
    }
}

async function runTests() {
    console.log('🚀 Starting API tests...\n');

    await testKYCSubmission();
    await testLoanApplicationSubmission();
    await testBankApplications();

    console.log('\n✨ Tests completed!');
}

runTests(); 
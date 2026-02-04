import dotenv from 'dotenv';
import path from 'path';
dotenv.config({ path: path.join(process.cwd(), 'backend', '.env') });
import * as messageCentral from '../utils/messageCentral.js';

const TEST_MOBILE = '9876543210'; // Replace with a real number for manual test if needed

async function testMC() {
  console.log('🚀 Starting Message Central API Test...');
  
  try {
    console.log('📤 Attempting to send WhatsApp OTP to:', TEST_MOBILE);
    const sendResponse = await messageCentral.sendWhatsAppOTP(TEST_MOBILE);
    console.log('✅ Send OTP Response:', sendResponse);

    if (sendResponse.verificationId) {
       console.log('\n--- SUCCESS ---');
       console.log('Verification ID received. API is working.');
       console.log('To test full flow, you would now enter the OTP received on WhatsApp.');
       console.log('Verification ID:', sendResponse.verificationId);
    }

  } catch (error) {
    console.error('❌ Test Failed:', error.message);
    console.log('\nPossible causes:');
    console.log('1. Invalid CUSTOMER_ID or API_KEY in .env');
    console.log('2. Network connectivity issues');
    console.log('3. Message Central service is down');
  }
}

testMC();

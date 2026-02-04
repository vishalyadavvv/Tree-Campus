import fetch from 'node-fetch';

const CUSTOMER_ID = process.env.MESSAGE_CENTRAL_CUSTOMER_ID;
const API_KEY = process.env.MESSAGE_CENTRAL_KEY;
const BASE_URL = process.env.MESSAGE_CENTRAL_BASE_URL || 'https://cpaas.messagecentral.com';
const COUNTRY_CODE = process.env.MESSAGE_CENTRAL_COUNTRY_CODE || '91';

/**
 * Get Authentication Token from Message Central
 */
const getAuthToken = async () => {
  try {
    const customerId = (process.env.MESSAGE_CENTRAL_CUSTOMER_ID || '').trim();
    const apiKey = (process.env.MESSAGE_CENTRAL_KEY || '').trim();
    const email = (process.env.MESSAGE_CENTRAL_EMAIL || '').trim();

    if (!customerId || !apiKey) {
      throw new Error('Message Central credentials (CUSTOMER_ID or KEY) are missing in .env');
    }

    const params = new URLSearchParams({
      customerId: customerId,
      key: apiKey,
      scope: 'NEW'
    });
    if (email) params.append('email', email);

    const url = `${BASE_URL}/auth/v1/authentication/token?${params.toString()}`;
    const response = await fetch(url, { method: 'GET' });
    const data = await response.json();

    if (data && data.token) {
      return data.token;
    }
    if (data && data.data && data.data.token) {
      return data.data.token;
    }

    console.error('❌ Message Central Auth Token Error - Full Response:', JSON.stringify(data));
    throw new Error(data.error || data.message || 'Failed to get Message Central token');
  } catch (error) {
    console.error('❌ Message Central Auth Token Error:', error.message);
    throw error;
  }
};

/**
 * Send WhatsApp OTP
 * @param {string} mobileNumber 10-digit mobile number
 */
export const sendWhatsAppOTP = async (mobileNumber) => {
  try {
    const authToken = await getAuthToken();
    const url = `${BASE_URL}/verification/v3/send`;
    
    // User's working code passes params in query string, null body
    const params = new URLSearchParams({
      countryCode: COUNTRY_CODE,
      customerId: CUSTOMER_ID,
      flowType: 'WHATSAPP',
      mobileNumber: mobileNumber,
      otpLength: '6',
    });

    const response = await fetch(`${url}?${params.toString()}`, {
      method: 'POST',
      headers: {
        'authToken': authToken,
      }
    });

    const data = await response.json();

    if (data && (data.responseCode === 200 || data.status === 200)) {
      return {
        success: true,
        verificationId: data.data.verificationId,
        message: 'OTP sent via WhatsApp'
      };
    }
    
    throw new Error(data.message || data.error || 'Failed to send WhatsApp OTP');
  } catch (error) {
    console.error('❌ Send WhatsApp OTP Error:', error.message);
    throw error;
  }
};

/**
 * Validate WhatsApp OTP
 * @param {string} verificationId The ID returned by sendOtp
 * @param {string} otp The 6-digit OTP entered by user
 */
export const validateOTP = async (verificationId, otp) => {
  try {
    const authToken = await getAuthToken();
    const url = `${BASE_URL}/verification/v3/validateOtp`;
    
    const params = new URLSearchParams({
        countryCode: COUNTRY_CODE,
        verificationId: verificationId,
        customerId: CUSTOMER_ID,
        code: otp,
    });

    // User's code uses GET for validation
    const response = await fetch(`${url}?${params.toString()}`, {
      method: 'GET',
      headers: {
        'authToken': authToken,
      }
    });

    const data = await response.json();

    if (data && (data.responseCode === 200 || data.status === 200)) {
      return {
        success: true,
        message: 'OTP validated successfully'
      };
    }
    
    throw new Error(data.message || data.error || 'Invalid or expired OTP');
  } catch (error) {
    console.error('❌ Validate WhatsApp OTP Error:', error.message);
    throw error;
  }
};

import axios from 'axios';
import crypto from 'crypto';

// Cache for access token
let cachedToken = null;
let tokenExpiry = null;

/**
 * Get Zoom OAuth access token for Server-to-Server app
 */
export async function getAccessToken() {
  // Return cached token if still valid
  if (cachedToken && tokenExpiry && Date.now() < tokenExpiry) {
    return cachedToken;
  }

  const { ZOOM_ACCOUNT_ID, ZOOM_CLIENT_ID, ZOOM_CLIENT_SECRET } = process.env;

  if (!ZOOM_ACCOUNT_ID || !ZOOM_CLIENT_ID || !ZOOM_CLIENT_SECRET) {
    throw new Error('Zoom OAuth credentials not configured');
  }

  try {
    const response = await axios.post(
      `https://zoom.us/oauth/token?grant_type=account_credentials&account_id=${ZOOM_ACCOUNT_ID}`,
      {},
      {
        headers: {
          'Authorization': `Basic ${Buffer.from(`${ZOOM_CLIENT_ID}:${ZOOM_CLIENT_SECRET}`).toString('base64')}`
        }
      }
    );

    cachedToken = response.data.access_token;
    // Set expiry to 5 minutes before actual expiry
    tokenExpiry = Date.now() + (response.data.expires_in - 300) * 1000;

    return cachedToken;
  } catch (error) {
    console.error('Error getting Zoom access token:', error.response?.data || error.message);
    throw new Error('Failed to authenticate with Zoom API');
  }
}

/**
 * Helper to convert object to base64url string
 */
function toBase64URL(obj) {
  const str = typeof obj === 'string' ? obj : JSON.stringify(obj);
  return Buffer.from(str)
    .toString('base64')
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=/g, '');
}

/**
 * Generate Meeting SDK JWT signature for joining meetings
 * @param {string} meetingNumber - The Zoom meeting number
 * @param {number} role - 0 for participant, 1 for host
 */
export function generateSDKSignature(meetingNumber, role = 0) {
  const { ZOOM_SDK_KEY, ZOOM_SDK_SECRET } = process.env;

  if (!ZOOM_SDK_KEY || !ZOOM_SDK_SECRET) {
    throw new Error('Zoom SDK credentials not configured');
  }

  // Use seconds for timestamp
  const iat = Math.floor(Date.now() / 1000) - 30;
  const exp = iat + 60 * 60 * 2; // 2 hours expiry

  const header = { alg: 'HS256', typ: 'JWT' };
  const payload = {
    sdkKey: ZOOM_SDK_KEY,
    mn: meetingNumber.toString(), // Meeting number as string
    role: parseInt(role),         // Role as integer
    iat: iat,
    exp: exp,
    tokenExp: exp
  };

  const base64Header = toBase64URL(header);
  const base64Payload = toBase64URL(payload);
  
  const signatureString = `${base64Header}.${base64Payload}`;
  const hash = crypto
    .createHmac('sha256', ZOOM_SDK_SECRET)
    .update(signatureString)
    .digest('base64')
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=/g, '');

  const signature = `${signatureString}.${hash}`;

  return signature;
}

/**
 * Verify webhook signature from Zoom
 */
export function verifyWebhookSignature(payload, receivedSignature) {
  const { ZOOM_WEBHOOK_SECRET_TOKEN } = process.env;

  if (!ZOOM_WEBHOOK_SECRET_TOKEN) {
    console.warn('Webhook secret token not configured - skipping verification');
    return true; // Allow in development
  }

  const message = `v0:${payload}`;
  const hashForVerify = crypto
    .createHmac('sha256', ZOOM_WEBHOOK_SECRET_TOKEN)
    .update(message)
    .digest('hex');

  const computedSignature = `v0=${hashForVerify}`;

  return computedSignature === receivedSignature;
}

/**
 * Make authenticated request to Zoom API
 */
export async function zoomApiRequest(endpoint, method = 'GET', data = null) {
  const token = await getAccessToken();
  const url = `https://api.zoom.us/v2${endpoint}`;

  const config = {
    method,
    url,
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  };

  if (data && (method === 'POST' || method === 'PATCH' || method === 'PUT')) {
    config.data = data;
  }

  try {
    const response = await axios(config);
    return response.data;
  } catch (error) {
    console.error('Zoom API Error:', error.response?.data || error.message);
    throw error;
  }
}

# OTP Integration Guide - Tree Campus

## Overview
This guide explains the OTP (One-Time Password) implementation for registration and verification across all forms in Tree Campus.

## Environment Variables Required

Add these to your `.env` file:

```env
# Email Configuration
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-password
EMAIL_FROM=Tree Campus <noreply@treecampus.com>

# Frontend URL for password reset links
FRONTEND_URL=http://localhost:5173

# Node Environment
NODE_ENV=development
```

## API Endpoints

### 1. User Registration with OTP

#### Register New User
**POST** `/api/auth/signup`

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "phone": "1234567890",
  "password": "securePassword123",
  "role": "student"
}
```

**Response (201):**
```json
{
  "success": true,
  "message": "User registered successfully. Please verify your email with the OTP sent.",
  "data": {
    "userId": "user_id",
    "email": "john@example.com",
    "name": "John Doe",
    "phone": "1234567890"
  }
}
```

> **Note:** OTP will be logged in console for development mode

#### Verify OTP
**POST** `/api/auth/verify-otp`

**Request Body:**
```json
{
  "email": "john@example.com",
  "otp": "123456"
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Email verified successfully",
  "data": {
    "accessToken": "jwt_token",
    "refreshToken": "refresh_token",
    "user": {
      "id": "user_id",
      "name": "John Doe",
      "email": "john@example.com",
      "isVerified": true
    }
  }
}
```

---

### 2. Volunteer Registration with OTP

#### Submit Volunteer Application
**POST** `/api/volunteer`

**Request Body:**
```json
{
  "name": "Jane Smith",
  "email": "jane@example.com",
  "phone": "9876543210",
  "address": "123 Main Street, City",
  "motivation": "I want to contribute to education..."
}
```

**Response (201):**
```json
{
  "success": true,
  "message": "Volunteer application submitted successfully! Please verify your email with the OTP sent.",
  "data": {
    "id": "volunteer_id",
    "name": "Jane Smith",
    "email": "jane@example.com",
    "createdAt": "2025-12-07T10:00:00Z"
  }
}
```

#### Verify Volunteer OTP
**POST** `/api/volunteer/verify-otp`

**Request Body:**
```json
{
  "email": "jane@example.com",
  "otp": "123456"
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Volunteer application verified successfully",
  "data": {
    "id": "volunteer_id",
    "name": "Jane Smith",
    "email": "jane@example.com",
    "status": "verified"
  }
}
```

---

### 3. School Registration with OTP

#### Submit School Registration
**POST** `/api/registerSchool`

**Request Body:**
```json
{
  "schoolName": "ABC Public School",
  "schoolEmail": "school@example.com",
  "schoolAddress": "456 School Lane",
  "schoolPhone": "1122334455",
  "contactPersonName": "Mr. Principal",
  "contactPersonEmail": "principal@example.com",
  "contactPersonPhone": "5544332211",
  "termsAccepted": true
}
```

**Response (201):**
```json
{
  "success": true,
  "message": "School registration submitted successfully! Please verify your email with the OTP sent.",
  "data": {
    "id": "school_id",
    "schoolName": "ABC Public School",
    "schoolEmail": "school@example.com"
  }
}
```

#### Verify School OTP
**POST** `/api/registerSchool/verify-otp`

**Request Body:**
```json
{
  "schoolEmail": "school@example.com",
  "otp": "123456"
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "School registration verified successfully",
  "data": {
    "id": "school_id",
    "schoolName": "ABC Public School",
    "schoolEmail": "school@example.com",
    "status": "verified"
  }
}
```

---

### 4. Account Deletion with OTP

#### Submit Account Deletion Request
**POST** `/api/account-deletion-request`

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "phone": "1234567890",
  "reason": "No longer needed, switching to different platform"
}
```

**Response (201):**
```json
{
  "success": true,
  "message": "Account deletion request submitted successfully. Please verify with the OTP sent to your email.",
  "data": {
    "id": "deletion_id",
    "email": "john@example.com",
    "status": "pending_verification"
  }
}
```

#### Verify Account Deletion OTP
**POST** `/api/account-deletion-request/verify-otp`

**Request Body:**
```json
{
  "email": "john@example.com",
  "otp": "123456"
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Account deletion verified. Your account will be deleted within 30 days.",
  "data": {
    "id": "deletion_id",
    "email": "john@example.com",
    "status": "verified",
    "verifiedAt": "2025-12-07T10:05:00Z"
  }
}
```

---

## OTP Configuration

### OTP Generation
- **Length:** 6 digits
- **Validity:** 10 minutes
- **Format:** `Math.floor(100000 + Math.random() * 900000)`

### Development Mode
In development (`NODE_ENV=development`), OTPs are logged to console:
```
✅ [DEV] OTP for jane@example.com: 123456
✅ [DEV] OTP for school@example.com: 789012
✅ [DEV] OTP for account deletion john@example.com: 345678
```

### Production Mode
In production, emails are sent automatically with formatted HTML templates.

---

## Email Templates

### User Registration OTP
- Header: Gradient purple (registration)
- Content: Welcome message with OTP box
- Colors: Purple/Blue theme

### Volunteer OTP
- Header: Gradient green
- Content: Volunteer program welcome with OTP
- Colors: Green theme

### School Registration OTP
- Header: Gradient blue
- Content: School partnership welcome with OTP
- Colors: Blue theme

### Account Deletion OTP
- Header: Gradient red
- Content: Warning about irreversible action with OTP
- Colors: Red theme (warning)

---

## Database Fields Added

### User Model
- `otp` (String, not selected by default)
- `otpExpiry` (Date, not selected by default)
- `isVerified` (Boolean, default: false)

### Volunteer Model
- `otp` (String, not selected by default)
- `otpExpiry` (Date, not selected by default)
- `isVerified` (Boolean, default: false)
- Updated `status` enum: `['pending', 'verified', 'approved', 'rejected']`

### SchoolRegistration Model
- `otp` (String, not selected by default)
- `otpExpiry` (Date, not selected by default)
- `isVerified` (Boolean, default: false)
- Updated `status` enum: `['pending', 'verified', 'approved', 'rejected']`

### AccountDeletion Model
- `otp` (String, not selected by default)
- `otpExpiry` (Date, not selected by default)

---

## Frontend Implementation Guide

### Step 1: Registration Form
Create a multi-step form:
1. **Step 1:** Collect name, email, phone, password, role
2. **Step 2:** Display OTP input field after registration

### Step 2: OTP Verification Component
```javascript
// Component structure
<VerifyOTPComponent>
  - Display email/form type
  - OTP input (6 digit boxes)
  - Resend OTP button (60s timer)
  - Submit verification button
  - Error/success messages
</VerifyOTPComponent>
```

### Step 3: API Integration
```javascript
// Registration
const registerUser = async (userData) => {
  const res = await api.post('/auth/signup', userData);
  // Show OTP verification component
};

// OTP Verification
const verifyOTP = async (email, otp) => {
  const res = await api.post('/auth/verify-otp', { email, otp });
  // Store tokens in localStorage
  // Redirect to dashboard
};
```

### Step 4: Resend OTP
Add endpoint to resend OTP:
```javascript
// POST /api/auth/resend-otp
{
  "email": "user@example.com"
}
```

---

## Error Handling

### Common Errors

| Code | Message | Solution |
|------|---------|----------|
| 400 | Invalid OTP | Check OTP matches exactly |
| 400 | OTP has expired | Request new OTP |
| 404 | User/Application not found | Verify email is correct |
| 400 | Already verified | User already completed verification |

### Error Response Format
```json
{
  "success": false,
  "message": "Error message here",
  "statusCode": 400
}
```

---

## Security Considerations

1. **OTP Storage:** Only store hashed OTP in production (current: plain text for demo)
2. **Rate Limiting:** Implement rate limiting on OTP requests (max 5 attempts per hour)
3. **HTTPS:** Always use HTTPS in production
4. **Token Expiry:** OTP expires after 10 minutes
5. **Email Validation:** Verify email format before sending
6. **IP Logging:** Track IP addresses for account deletion requests

---

## Testing Checklist

- [ ] User registration with OTP
- [ ] OTP verification completes user registration
- [ ] Volunteer registration with OTP
- [ ] Volunteer OTP verification
- [ ] School registration with OTP
- [ ] School OTP verification
- [ ] Account deletion request with OTP
- [ ] Account deletion OTP verification
- [ ] OTP expiry (wait 10+ minutes)
- [ ] Resend OTP functionality
- [ ] Email templates render correctly
- [ ] Development console logging works
- [ ] Production email sending works

---

## Future Enhancements

1. Add resend OTP endpoint with rate limiting
2. Implement SMS OTP as alternative
3. Add 2FA with OTP for login
4. Hash OTP before storing in database
5. Add OTP retry counter and lockout
6. Implement OTP analytics and monitoring

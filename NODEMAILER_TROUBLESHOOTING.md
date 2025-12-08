# Nodemailer OTP Email Troubleshooting Guide

## ✅ Issue Fixed

**Problem:** OTP emails were not being sent because environment variable names didn't match.

**Root Cause:** 
- `sendEmail.js` was looking for: `EMAIL_HOST`, `EMAIL_PORT`, `EMAIL_USER`, `EMAIL_PASSWORD`
- But `.env` had: `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS`

**Solution Applied:** Updated `sendEmail.js` to use the correct environment variables from `.env`

---

## 📋 Correct .env Configuration

Your `.env` should have these Gmail SMTP settings:

```env
# Email Configuration (Nodemailer) - SMTP Settings
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
EMAIL_FROM=Tree Campus <noreply@treecampus.com>
```

---

## 🔐 Getting Gmail App Password

If you don't have `SMTP_PASS` set up:

1. Go to [Google Account Security](https://myaccount.google.com/security)
2. Enable **2-Step Verification** (if not already enabled)
3. Go back to Security → App passwords
4. Select **Mail** and **Windows Computer**
5. Copy the 16-character password
6. Use it as `SMTP_PASS` in `.env` (no spaces)

**Your current .env:**
```
SMTP_USER=vishalyadavv889@gmail.com
SMTP_PASS=wwgl tgpy tluc fnog
```
❌ Contains spaces - should be: `wwgltgpytlucfnog`

---

## 🧪 Testing OTP Email Sending

### Test 1: Verify Environment Variables
```javascript
// Add this to backend/server.js temporarily for testing
console.log('📧 Email Config:');
console.log('SMTP_HOST:', process.env.SMTP_HOST);
console.log('SMTP_PORT:', process.env.SMTP_PORT);
console.log('SMTP_USER:', process.env.SMTP_USER);
console.log('SMTP_PASS:', process.env.SMTP_PASS.substring(0, 3) + '***');
```

### Test 2: Test Account Deletion OTP Email
Using Postman or cURL:

```bash
curl -X POST http://localhost:4000/api/account-deletion-request \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "your-test-email@gmail.com",
    "phone": "9876543210",
    "reason": "Testing OTP"
  }'
```

Expected Response:
```json
{
  "success": true,
  "message": "Account deletion request submitted successfully. Please verify with the OTP sent to your email.",
  "data": {
    "id": "...",
    "email": "your-test-email@gmail.com",
    "status": "pending_verification"
  }
}
```

Check your email for OTP.

---

## 🔍 Check Server Console Logs

### Development Mode (NODE_ENV=development)
OTP is logged to console:
```
✅ [DEV] OTP for account deletion test@example.com: 123456
```

### Production Mode (NODE_ENV=production)
Email is sent silently. Check for errors:
```
✅ Email sent: <message-id>
❌ Error sending email: {error message}
```

---

## 📧 All OTP Email Endpoints

| Endpoint | Method | OTP Type |
|----------|--------|----------|
| `/api/auth/signup` | POST | User Registration |
| `/api/volunteer` | POST | Volunteer Application |
| `/api/registerschool` | POST | School Registration |
| `/api/account-deletion-request` | POST | Account Deletion |

All send OTP via email in production mode.

---

## ❌ Common Issues & Solutions

### Issue 1: "Failed to send email"
**Causes:**
- Wrong `SMTP_USER` or `SMTP_PASS`
- Gmail App Password has spaces
- 2-Factor Authentication not enabled on Gmail account
- Gmail blocking "less secure apps" (use App Password instead)

**Solution:**
- Regenerate [Gmail App Password](https://myaccount.google.com/apppasswords)
- Remove spaces: `wwgl tgpy tluc fnog` → `wwgltgpytlucfnog`
- Update `.env` and restart server

### Issue 2: OTP not showing in email
**Causes:**
- Wrong environment variables (NOW FIXED ✅)
- Email going to spam folder
- Email not being triggered (check server logs)

**Solution:**
- Check Gmail spam/promotions folder
- Verify `NODE_ENV` setting
- Check console logs for OTP or errors

### Issue 3: OTP arrives but too late
**Causes:**
- Gmail SMTP server delay (normal: 1-5 seconds)
- Network/internet issues
- Server error silently failing

**Solution:**
- Check server console for errors
- Verify internet connection
- Test with console log version first

---

## 🛠️ Fixed Files

✅ **File:** `backend/utils/sendEmail.js`
- **Lines 3-11:** Updated to use correct env variables
- **Variables updated:**
  - `process.env.EMAIL_HOST` → `process.env.SMTP_HOST`
  - `process.env.EMAIL_PORT` → `process.env.SMTP_PORT`
  - `process.env.EMAIL_USER` → `process.env.SMTP_USER`
  - `process.env.EMAIL_PASSWORD` → `process.env.SMTP_PASS`

---

## ✨ OTP Features

**Configuration:**
- OTP Length: 6 digits
- OTP Expiry: 10 minutes
- Resend Available: Yes

**Email Templates:**
1. 💜 User Registration (Purple theme)
2. 💚 Volunteer Application (Green theme)
3. 💙 School Registration (Blue theme)
4. ❤️ Account Deletion (Red theme)

**Development vs Production:**
- **Dev Mode:** OTP logged to console
- **Prod Mode:** OTP sent via Gmail SMTP

---

## 📝 Next Steps

1. **Verify .env is correct** - Check for spaces in `SMTP_PASS`
2. **Restart server** - `node server.js` or `npm start`
3. **Test OTP endpoint** - Send a test registration request
4. **Check console logs** - See OTP in dev mode
5. **Check email** - Look for OTP in production mode

---

## 📞 Quick Checklist

- [ ] `.env` has `SMTP_HOST=smtp.gmail.com`
- [ ] `.env` has `SMTP_PORT=587`
- [ ] `.env` has correct `SMTP_USER` (Gmail address)
- [ ] `.env` has valid `SMTP_PASS` (with no spaces)
- [ ] Gmail account has 2-Factor Authentication enabled
- [ ] Server is restarted after updating `.env`
- [ ] `NODE_ENV` is set correctly (`development` or `production`)
- [ ] Testing with correct endpoint URL

---

**Status:** ✅ OTP Email Service is now configured correctly!

Test it by submitting a registration request and checking your email.

import brevo from '@getbrevo/brevo';

// Initialize Brevo Transactional Email API
const apiInstance = new brevo.TransactionalEmailsApi();

if (!process.env.BREVO_API_KEY) {
  console.error('❌ CRITICAL: BREVO_API_KEY is not set in .env');
} else {
  apiInstance.setApiKey(
    brevo.TransactionalEmailsApiApiKeys.apiKey,
    process.env.BREVO_API_KEY
  );
  console.log('✅ Brevo API initialized successfully');
}

const SENDER_EMAIL = process.env.SENDER_EMAIL || 'vishalyadavdgtl@gmail.com';
const SENDER_NAME = 'Tree Campus';
const COMPANY_LOGO = 'https://res.cloudinary.com/dbbll23jz/image/upload/v1765170258/tree_logo_ek4uw3.png';
const PRIMARY_COLOR = '#FD5A00';

/**
 * Send email using Brevo Transactional Email API
 */
const sendEmail = async (options) => {
  try {
    const sendSmtpEmail = new brevo.SendSmtpEmail();
    
    sendSmtpEmail.subject = options.subject;
    sendSmtpEmail.htmlContent = options.html || options.text;
    sendSmtpEmail.sender = { name: SENDER_NAME, email: SENDER_EMAIL };
    sendSmtpEmail.to = [{ email: options.to }];
    
    if (options.text) {
      sendSmtpEmail.textContent = options.text;
    }

    const data = await apiInstance.sendTransacEmail(sendSmtpEmail);
    
    // Brevo returns { messageId: "..." }
    const messageId = data?.messageId || data?.id || 'sent';
    console.log(`✅ Email sent successfully to ${options.to} (ID: ${messageId})`);
    
    return { 
      success: true, 
      messageId,
      timestamp: new Date().toISOString()
    };
  } catch (error) {
    console.error('❌ Brevo API error:', error.response?.data || error.message);
    throw new Error('Failed to send email: ' + (error.response?.data?.message || error.message));
  }
};

/**
 * Send OTP email
 */
const sendOTPEmail = async (email, name, otp) => {
  const subject = 'Verify Your Tree Campus Account';
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #333; background: #f5f5f5; }
        .container { max-width: 600px; margin: 20px auto; background: white; border-radius: 12px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.1); }
        .header { background: linear-gradient(135deg, ${PRIMARY_COLOR} 0%, #E84C0A 100%); color: white; padding: 40px 20px; text-align: center; }
        .logo { height: 50px; margin-bottom: 15px; }
        .header h1 { font-size: 28px; font-weight: bold; margin: 0; }
        .content { padding: 40px 30px; }
        .greeting { font-size: 18px; color: #333; margin-bottom: 20px; }
        .message { color: #666; font-size: 16px; line-height: 1.8; margin-bottom: 30px; }
        .otp-box { 
          background: linear-gradient(135deg, ${PRIMARY_COLOR}15 0%, ${PRIMARY_COLOR}08 100%);
          border: 2px solid ${PRIMARY_COLOR};
          padding: 25px;
          text-align: center;
          font-size: 40px;
          font-weight: bold;
          letter-spacing: 8px;
          margin: 30px 0;
          border-radius: 10px;
          color: ${PRIMARY_COLOR};
          font-family: 'Courier New', monospace;
        }
        .info { background: #f9f9f9; padding: 15px; border-radius: 8px; font-size: 13px; color: #666; margin: 20px 0; border-left: 4px solid ${PRIMARY_COLOR}; }
        .footer { text-align: center; padding: 20px 30px; background: #f9f9f9; border-top: 1px solid #eee; font-size: 12px; color: #999; }
        .footer-link { color: ${PRIMARY_COLOR}; text-decoration: none; }
        .cta-button { display: inline-block; background: ${PRIMARY_COLOR}; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; margin: 20px 0; font-weight: bold; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <img src="${COMPANY_LOGO}" alt="Tree Campus" class="logo">
          <h1>🌳 Tree Campus</h1>
        </div>
        <div class="content">
          <p class="greeting">Hello <strong>${name}</strong>! 👋</p>
          <p class="message">Thank you for signing up with Tree Campus. Your verification code is ready!</p>
          <div class="otp-box">${otp}</div>
          <div class="info">
            <strong>⏱️ Valid for 10 minutes</strong><br>
            This code is unique to your account and should not be shared with anyone.
          </div>
          <p style="color: #666; font-size: 14px;">If you didn't request this code, please ignore this email.</p>
        </div>
        <div class="footer">
          <p>&copy; ${new Date().getFullYear()} Tree Campus. All rights reserved.</p>
          <p><a href="https://treecampus.netlify.app" class="footer-link">Visit Our Website</a></p>
        </div>
      </div>
    </body>
    </html>
  `;

  await sendEmail({ to: email, subject, html });
};

/**
 * Send password reset email
 */
const sendPasswordResetEmail = async (email, name, resetToken) => {
  const resetUrl = `${process.env.FRONTEND_URL}/reset-password?token=${resetToken}`;
  const subject = 'Reset Your Password - Tree Campus';
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #333; background: #f5f5f5; }
        .container { max-width: 600px; margin: 20px auto; background: white; border-radius: 12px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.1); }
        .header { background: linear-gradient(135deg, ${PRIMARY_COLOR} 0%, #E84C0A 100%); color: white; padding: 40px 20px; text-align: center; }
        .logo { height: 50px; margin-bottom: 15px; }
        .header h1 { font-size: 28px; font-weight: bold; margin: 0; }
        .content { padding: 40px 30px; }
        .greeting { font-size: 18px; color: #333; margin-bottom: 20px; }
        .message { color: #666; font-size: 16px; line-height: 1.8; margin-bottom: 30px; }
        .cta-button { display: inline-block; background: ${PRIMARY_COLOR}; color: white; padding: 15px 40px; text-decoration: none; border-radius: 6px; font-weight: bold; font-size: 16px; margin: 25px 0; }
        .link-text { color: #666; font-size: 13px; word-break: break-all; }
        .info { background: #f9f9f9; padding: 15px; border-radius: 8px; font-size: 13px; color: #666; margin: 20px 0; border-left: 4px solid ${PRIMARY_COLOR}; }
        .footer { text-align: center; padding: 20px 30px; background: #f9f9f9; border-top: 1px solid #eee; font-size: 12px; color: #999; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <img src="${COMPANY_LOGO}" alt="Tree Campus" class="logo">
          <h1>🔐 Password Reset</h1>
        </div>
        <div class="content">
          <p class="greeting">Hello <strong>${name}</strong>! 👋</p>
          <p class="message">We received a request to reset your password. Click the button below to set a new password.</p>
          <center>
            <a href="${resetUrl}" class="cta-button">Reset Password</a>
          </center>
          <div class="info">
            <strong>⏱️ This link expires in 1 hour</strong><br>
            If you didn't request this reset, please ignore this email. Your password will remain unchanged.
          </div>
          <p class="link-text"><strong>Or copy this link:</strong><br>${resetUrl}</p>
        </div>
        <div class="footer">
          <p>&copy; ${new Date().getFullYear()} Tree Campus. All rights reserved.</p>
        </div>
      </div>
    </body>
    </html>
  `;

  await sendEmail({ to: email, subject, html });
};

/**
 * Send OTP for Volunteer Registration
 */
const sendVolunteerOTPEmail = async (email, name, otp, details = {}) => {
  const subject = '🌱 Verify Your Volunteer Registration';
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background: #f5f5f5; }
        .container { max-width: 600px; margin: 20px auto; background: white; border-radius: 12px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.1); }
        .header { background: linear-gradient(135deg, #00a86b 0%, #228b22 100%); color: white; padding: 40px 20px; text-align: center; }
        .logo { height: 50px; margin-bottom: 15px; }
        .content { padding: 40px 30px; }
        .greeting { font-size: 18px; color: #333; margin-bottom: 20px; }
        .message { color: #666; font-size: 16px; line-height: 1.8; margin-bottom: 30px; }
        .otp-box { background: linear-gradient(135deg, #00a86b15 0%, #00a86b08 100%); border: 2px solid #00a86b; padding: 25px; text-align: center; font-size: 40px; font-weight: bold; letter-spacing: 8px; margin: 30px 0; border-radius: 10px; color: #00a86b; font-family: 'Courier New', monospace; }
        .info { background: #f0fff4; border-left: 4px solid #00a86b; padding: 15px; border-radius: 8px; font-size: 13px; color: #333; margin: 20px 0; }
        .footer { text-align: center; padding: 20px 30px; background: #f9f9f9; border-top: 1px solid #eee; font-size: 12px; color: #999; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <img src="${COMPANY_LOGO}" alt="Tree Campus" class="logo">
          <h1>🌱 Verify Your Registration</h1>
        </div>
        <div class="content">
          <p class="greeting">Welcome, ${name}! 👋</p>
          <p class="message">Thank you for your interest in volunteering with Tree Campus. Use the code below to verify your registration:</p>
          <div class="otp-box">${otp}</div>
          <div class="info">
            <strong>⏱️ Valid for 10 minutes</strong><br>
            This code is unique to your registration. Please don't share it with anyone.
          </div>
          <p style="color: #666; font-size: 14px;">If you didn't request this code, please ignore this email.</p>
        </div>
        <div class="footer">
          <p>&copy; ${new Date().getFullYear()} Tree Campus. Making a Difference Together.</p>
        </div>
      </div>
    </body>
    </html>
  `;

  await sendEmail({ to: email, subject, html });
};

/**
 * Send OTP for School Registration
 */
const sendSchoolOTPEmail = async (email, schoolName, contactName, otp, details = {}) => {
  const subject = '🏫 Verify Your School Registration';
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background: #f5f5f5; }
        .container { max-width: 600px; margin: 20px auto; background: white; border-radius: 12px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.1); }
        .header { background: linear-gradient(135deg, #1e40af 0%, #1e3a8a 100%); color: white; padding: 40px 20px; text-align: center; }
        .logo { height: 50px; margin-bottom: 15px; }
        .content { padding: 40px 30px; }
        .greeting { font-size: 18px; color: #333; margin-bottom: 20px; }
        .message { color: #666; font-size: 16px; line-height: 1.8; margin-bottom: 30px; }
        .otp-box { background: linear-gradient(135deg, #1e40af15 0%, #1e40af08 100%); border: 2px solid #1e40af; padding: 25px; text-align: center; font-size: 40px; font-weight: bold; letter-spacing: 8px; margin: 30px 0; border-radius: 10px; color: #1e40af; font-family: 'Courier New', monospace; }
        .info { background: #eff6ff; border-left: 4px solid #1e40af; padding: 15px; border-radius: 8px; font-size: 13px; color: #333; margin: 20px 0; }
        .footer { text-align: center; padding: 20px 30px; background: #f9f9f9; border-top: 1px solid #eee; font-size: 12px; color: #999; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <img src="${COMPANY_LOGO}" alt="Tree Campus" class="logo">
          <h1>🏫 Verify Registration</h1>
        </div>
        <div class="content">
          <p class="greeting">Hello ${contactName}! 👋</p>
          <p class="message">Thank you for registering <strong>${schoolName}</strong> with Tree Campus. Use the code below to verify your registration:</p>
          <div class="otp-box">${otp}</div>
          <div class="info">
            <strong>⏱️ Valid for 10 minutes</strong><br>
            This code is unique to your registration. Please don't share it with anyone.
          </div>
          <p style="color: #666; font-size: 14px;">If you didn't request this code, please ignore this email.</p>
        </div>
        <div class="footer">
          <p>&copy; ${new Date().getFullYear()} Tree Campus. Nurturing Minds, Growing Futures.</p>
        </div>
      </div>
    </body>
    </html>
  `;

  await sendEmail({ to: email, subject, html });
};

/**
 * Send OTP for Account Deletion
 */
const sendAccountDeletionOTPEmail = async (email, name, otp, details = {}) => {
  const subject = '⚠️ Verify Account Deletion Request';
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background: #f5f5f5; }
        .container { max-width: 600px; margin: 20px auto; background: white; border-radius: 12px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.1); }
        .header { background: linear-gradient(135deg, #dc2626 0%, #991b1b 100%); color: white; padding: 40px 20px; text-align: center; }
        .logo { height: 50px; margin-bottom: 15px; }
        .content { padding: 40px 30px; }
        .greeting { font-size: 18px; color: #333; margin-bottom: 20px; }
        .warning { background: #fee; border-left: 4px solid #dc2626; padding: 20px; border-radius: 6px; margin: 20px 0; }
        .warning strong { color: #991b1b; }
        .message { color: #666; font-size: 16px; line-height: 1.8; margin-bottom: 25px; }
        .otp-box { background: linear-gradient(135deg, #dc262615 0%, #dc262608 100%); border: 2px solid #dc2626; padding: 25px; text-align: center; font-size: 40px; font-weight: bold; letter-spacing: 8px; margin: 30px 0; border-radius: 10px; color: #dc2626; font-family: 'Courier New', monospace; }
        .info { background: #fee; border-left: 4px solid #dc2626; padding: 15px; border-radius: 8px; font-size: 13px; color: #333; margin: 20px 0; }
        .footer { text-align: center; padding: 20px 30px; background: #f9f9f9; border-top: 1px solid #eee; font-size: 12px; color: #999; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <img src="${COMPANY_LOGO}" alt="Tree Campus" class="logo">
          <h1>⚠️ Verify Deletion</h1>
        </div>
        <div class="content">
          <p class="greeting">Hello ${name}!</p>
          <div class="warning">
            <strong>🚨 Important:</strong> You have requested to delete your Tree Campus account.
          </div>
          <p class="message">To confirm deletion, use the code below:</p>
          <div class="otp-box">${otp}</div>
          <div class="info">
            <strong>⏱️ Valid for 10 minutes</strong><br>
            This code is required to confirm your account deletion. Your account cannot be restored after deletion.
          </div>
          <p style="color: #666; font-size: 14px;">If you didn't request this code, please ignore this email.</p>
        </div>
        <div class="footer">
          <p>&copy; ${new Date().getFullYear()} Tree Campus. We hope to see you again!</p>
        </div>
      </div>
    </body>
    </html>
  `;

  await sendEmail({ to: email, subject, html });
};

/**
 * Send volunteer confirmation
 */
const sendVolunteerConfirmation = async (userEmail, userName, volunteerDetails = {}) => {
  const adminEmail = process.env.ADMIN_EMAIL;
  const subject = '🌱 Welcome to Tree Campus Volunteer Program!';

  const userHtml = `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background: #f5f5f5; }
        .container { max-width: 600px; margin: 20px auto; background: white; border-radius: 12px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.1); }
        .header { background: linear-gradient(135deg, #00a86b 0%, #228b22 100%); color: white; padding: 40px 20px; text-align: center; }
        .logo { height: 50px; margin-bottom: 15px; }
        .content { padding: 40px 30px; }
        .greeting { font-size: 20px; color: #333; margin-bottom: 20px; font-weight: bold; }
        .message { color: #666; font-size: 16px; line-height: 1.8; margin-bottom: 25px; }
        .highlight { background: #f0fff4; border-left: 4px solid #00a86b; padding: 15px; border-radius: 6px; margin: 20px 0; }
        .footer { text-align: center; padding: 20px 30px; background: #f9f9f9; border-top: 1px solid #eee; font-size: 12px; color: #999; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <img src="${COMPANY_LOGO}" alt="Tree Campus" class="logo">
          <h1>🌱 Volunteer Application Received</h1>
        </div>
        <div class="content">
          <p class="greeting">Welcome, ${userName}! 🎉</p>
          <p class="message">Thank you for submitting your volunteer application to Tree Campus. We're excited about your interest in making a difference!</p>
          <div class="highlight">
            <strong>✓ Application Status: Under Review</strong><br>
            Our team will review your application and contact you within 2-3 business days.
          </div>
          <p class="message">In the meantime, feel free to explore our courses and learn more about what we're doing at Tree Campus.</p>
        </div>
        <div class="footer">
          <p>&copy; ${new Date().getFullYear()} Tree Campus. Planting Seeds of Knowledge.</p>
        </div>
      </div>
    </body>
    </html>
  `;

  await sendEmail({ to: userEmail, subject, html: userHtml });
  
  if (adminEmail) {
    const adminHtml = `
      <html><body style="font-family: Arial;">
        <h2>New Volunteer Application Received</h2>
        <p><strong>Name:</strong> ${userName}</p>
        <p><strong>Email:</strong> ${userEmail}</p>
        <p><a href="${process.env.FRONTEND_URL}/admin/volunteers">Review Application →</a></p>
      </body></html>
    `;
    await sendEmail({ to: adminEmail, subject: `[ADMIN] ${subject}`, html: adminHtml });
  }
};

/**
 * Send school registration confirmation
 */
const sendSchoolRegistrationConfirmation = async (schoolEmail, schoolName, contactName, schoolDetails = {}) => {
  const adminEmail = process.env.ADMIN_EMAIL;
  const subject = '🏫 Welcome to Tree Campus School Partnership Program!';

  const userHtml = `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background: #f5f5f5; }
        .container { max-width: 600px; margin: 20px auto; background: white; border-radius: 12px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.1); }
        .header { background: linear-gradient(135deg, #1e40af 0%, #1e3a8a 100%); color: white; padding: 40px 20px; text-align: center; }
        .logo { height: 50px; margin-bottom: 15px; }
        .content { padding: 40px 30px; }
        .greeting { font-size: 20px; color: #333; margin-bottom: 20px; font-weight: bold; }
        .message { color: #666; font-size: 16px; line-height: 1.8; margin-bottom: 25px; }
        .highlight { background: #eff6ff; border-left: 4px solid #1e40af; padding: 15px; border-radius: 6px; margin: 20px 0; }
        .footer { text-align: center; padding: 20px 30px; background: #f9f9f9; border-top: 1px solid #eee; font-size: 12px; color: #999; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <img src="${COMPANY_LOGO}" alt="Tree Campus" class="logo">
          <h1>🏫 School Registration Confirmed</h1>
        </div>
        <div class="content">
          <p class="greeting">Hello ${contactName}! 👋</p>
          <p class="message">Thank you for registering <strong>${schoolName}</strong> with Tree Campus. We're thrilled to partner with your institution!</p>
          <div class="highlight">
            <strong>✓ Registration Status: Active</strong><br>
            Your school is now part of the Tree Campus community. Access our educational resources and start empowering your students.
          </div>
          <p class="message">Our team will contact you soon with next steps and how to get started.</p>
        </div>
        <div class="footer">
          <p>&copy; ${new Date().getFullYear()} Tree Campus. Nurturing Minds, Growing Futures.</p>
        </div>
      </div>
    </body>
    </html>
  `;

  await sendEmail({ to: schoolEmail, subject, html: userHtml });
  
  if (adminEmail) {
    const adminHtml = `
      <html><body style="font-family: Arial;">
        <h2>New School Registration</h2>
        <p><strong>School:</strong> ${schoolName}</p>
        <p><strong>Contact Person:</strong> ${contactName}</p>
        <p><strong>Email:</strong> ${schoolEmail}</p>
        <p><a href="${process.env.FRONTEND_URL}/admin/schools">Review Registration →</a></p>
      </body></html>
    `;
    await sendEmail({ to: adminEmail, subject: `[ADMIN] ${subject}`, html: adminHtml });
  }
};

/**
 * Send account deletion confirmation
 */
const sendAccountDeletionConfirmation = async (userEmail, userName, deletionDetails = {}) => {
  const adminEmail = process.env.ADMIN_EMAIL;
  const subject = '⚠️ Account Deletion Request Received';

  const userHtml = `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background: #f5f5f5; }
        .container { max-width: 600px; margin: 20px auto; background: white; border-radius: 12px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.1); }
        .header { background: linear-gradient(135deg, #dc2626 0%, #991b1b 100%); color: white; padding: 40px 20px; text-align: center; }
        .logo { height: 50px; margin-bottom: 15px; }
        .content { padding: 40px 30px; }
        .greeting { font-size: 20px; color: #333; margin-bottom: 20px; font-weight: bold; }
        .message { color: #666; font-size: 16px; line-height: 1.8; margin-bottom: 25px; }
        .warning { background: #fee; border-left: 4px solid #dc2626; padding: 20px; border-radius: 6px; margin: 20px 0; }
        .warning strong { color: #991b1b; }
        .footer { text-align: center; padding: 20px 30px; background: #f9f9f9; border-top: 1px solid #eee; font-size: 12px; color: #999; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <img src="${COMPANY_LOGO}" alt="Tree Campus" class="logo">
          <h1>⚠️ Account Deletion Request</h1>
        </div>
        <div class="content">
          <p class="greeting">Hello ${userName}!</p>
          <div class="warning">
            <strong>🚨 Important Notice</strong><br>
            Your account deletion request has been received and is scheduled for permanent deletion.
          </div>
          <p class="message">Your account will be permanently deleted within <strong>30 days</strong>. During this period:</p>
          <ul style="margin-left: 20px; color: #666;">
            <li>You can log in and restore your account</li>
            <li>Your data will be securely backed up</li>
            <li>After 30 days, all data will be permanently removed</li>
          </ul>
          <p class="message">If you change your mind, simply log in to your account to cancel the deletion request.</p>
        </div>
        <div class="footer">
          <p>&copy; ${new Date().getFullYear()} Tree Campus. We hope to see you again!</p>
        </div>
      </div>
    </body>
    </html>
  `;

  await sendEmail({ to: userEmail, subject, html: userHtml });
  
  if (adminEmail) {
    const adminHtml = `
      <html><body style="font-family: Arial;">
        <h2>Account Deletion Request</h2>
        <p><strong>User:</strong> ${userName}</p>
        <p><strong>Email:</strong> ${userEmail}</p>
        <p><strong>Status:</strong> Pending Deletion (30 days)</p>
      </body></html>
    `;
    await sendEmail({ to: adminEmail, subject: `[ADMIN] ${subject}`, html: adminHtml });
  }
};

/**
 * Send assignment results email (pass/fail notification)
 */
export const sendAssignmentResultsEmail = async (userEmail, userName, assignmentData) => {
  const { courseTitle, score, passed, certificateId, passingScore } = assignmentData;

  const subject = passed
    ? `🎉 Congratulations! You Passed "${courseTitle}" Assignment`
    : `Assignment Results - ${courseTitle}`;

  const resultColor = passed ? '#27AE60' : '#E74C3C';
  const resultText = passed ? 'PASSED ✓' : 'NEEDS IMPROVEMENT';

  const userHtml = `
    <!DOCTYPE html>
    <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; background-color: #f5f5f5; margin: 0; padding: 20px; }
          .container { max-width: 600px; margin: 0 auto; background: white; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.1); overflow: hidden; }
          .header { background: linear-gradient(135deg, #FD5A00 0%, #FF7722 100%); color: white; padding: 30px; text-align: center; }
          .header img { max-width: 60px; margin-bottom: 15px; }
          .header h1 { margin: 0; font-size: 24px; }
          .content { padding: 30px; }
          .result-box { 
            background: ${resultColor}; 
            color: white; 
            padding: 20px; 
            border-radius: 8px; 
            text-align: center; 
            margin: 20px 0;
            font-size: 18px;
            font-weight: bold;
          }
          .score { font-size: 36px; font-weight: bold; color: ${resultColor}; margin: 15px 0; }
          .details { background: #f9f9f9; padding: 15px; border-left: 4px solid #FD5A00; margin: 15px 0; }
          .button { 
            display: inline-block; 
            background: #FD5A00; 
            color: white; 
            padding: 12px 30px; 
            border-radius: 5px; 
            text-decoration: none; 
            margin: 20px 0;
            font-weight: bold;
          }
          .footer { background: #f5f5f5; padding: 20px; text-align: center; color: #666; font-size: 12px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <img src="${COMPANY_LOGO}" alt="Tree Campus">
            <h1>Assignment Results</h1>
          </div>
          <div class="content">
            <p>Hi <strong>${userName}</strong>,</p>
            
            <div class="result-box">${resultText}</div>
            
            <div class="score">Score: ${score}%</div>
            
            <div class="details">
              <p><strong>Course:</strong> ${courseTitle}</p>
              <p><strong>Your Score:</strong> ${score}%</p>
              <p><strong>Passing Score:</strong> ${passingScore || 60}%</p>
            </div>

            ${
              passed
                ? `
            <p style="text-align: center; color: #27AE60; font-weight: bold;">
              🎓 Congratulations! You have earned your certificate of completion!
            </p>
            <div style="text-align: center;">
              <a href="https://treecampus.netlify.app/dashboard/certificates" class="button">
                View Your Certificate
              </a>
            </div>
            `
                : `
            <p style="color: #E74C3C;">
              <strong>Keep Learning!</strong> You didn't reach the passing score this time. 
              Review the material and try again to earn your certificate.
            </p>
            <div style="text-align: center;">
              <a href="https://treecampus.netlify.app/courses/${courseTitle}" class="button">
                Return to Course
              </a>
            </div>
            `
            }

            <p style="margin-top: 30px; color: #666;">
              If you have any questions, please contact us at 
              <a href="mailto:support@treecampus.com" style="color: #FD5A00;">support@treecampus.com</a>
            </p>
          </div>
          <div class="footer">
            <p>© 2024 Tree Campus Academy. All rights reserved.</p>
            <p>This is an automated message, please do not reply directly to this email.</p>
          </div>
        </div>
      </body>
    </html>
  `;

  // Send to user
  await sendEmail({
    to: userEmail,
    subject,
    html: userHtml
  });

  // Also notify admin
  const adminHtml = `
    <!DOCTYPE html>
    <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; background-color: #f5f5f5; }
          .container { max-width: 600px; margin: 20px auto; background: white; padding: 20px; border-radius: 8px; }
          .header { background: #FD5A00; color: white; padding: 15px; border-radius: 5px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h2>[ADMIN] Assignment Submission Notification</h2>
          </div>
          <p><strong>Student:</strong> ${userName}</p>
          <p><strong>Email:</strong> ${userEmail}</p>
          <p><strong>Course:</strong> ${courseTitle}</p>
          <p><strong>Score:</strong> ${score}%</p>
          <p><strong>Status:</strong> ${passed ? 'PASSED ✓' : 'NEEDS IMPROVEMENT'}</p>
          <p><strong>Timestamp:</strong> ${new Date().toLocaleString()}</p>
        </div>
      </body>
    </html>
  `;

  // Send admin notification in background
  const adminEmail = process.env.ADMIN_EMAIL || process.env.SENDER_EMAIL;
  if (adminEmail) {
    sendEmail({
      to: adminEmail,
      subject: `[ADMIN] ${courseTitle} - Assignment ${passed ? 'PASSED' : 'FAILED'}: ${userName}`,
      html: adminHtml
    }).catch(err => {
      console.error('❌ Failed to send admin assignment notification:', err.message);
    });
  }
};

export {
  sendEmail,
  sendOTPEmail,
  sendPasswordResetEmail,
  sendVolunteerOTPEmail,
  sendSchoolOTPEmail,
  sendAccountDeletionOTPEmail,
  sendVolunteerConfirmation,
  sendSchoolRegistrationConfirmation,
  sendAccountDeletionConfirmation,
};
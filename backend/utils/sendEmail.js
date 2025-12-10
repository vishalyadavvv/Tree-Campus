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
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <style>
        body { font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; background-color: #f4f4f7; color: #51545e; margin: 0; padding: 0; -webkit-text-size-adjust: 100%; }
        .container { max-width: 600px; margin: 40px auto; background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.05); }
        .header { background-color: #ffffff; padding: 30px 0; text-align: center; border-bottom: 1px solid #edf2f7; }
        .logo { max-height: 60px; width: auto; object-fit: contain; }
        .content { padding: 40px; }
        .greeting { font-size: 20px; font-weight: 600; color: #333333; margin-bottom: 20px; }
        .text { font-size: 16px; line-height: 1.6; color: #51545e; margin-bottom: 24px; }
        .otp-box { 
          background: linear-gradient(135deg, ${PRIMARY_COLOR}0D 0%, ${PRIMARY_COLOR}1A 100%);
          border: 1px dashed ${PRIMARY_COLOR};
          border-radius: 6px;
          padding: 24px;
          text-align: center;
          font-size: 32px;
          font-weight: 700;
          letter-spacing: 6px;
          color: ${PRIMARY_COLOR};
          margin: 32px 0;
          font-family: 'Courier New', monospace;
        }
        .info-box { background-color: #fafafa; border-left: 4px solid ${PRIMARY_COLOR}; padding: 16px; border-radius: 4px; font-size: 14px; color: #666; margin-top: 24px; }
        .footer { background-color: #f8f9fa; padding: 24px 40px; text-align: center; font-size: 12px; color: #999; border-top: 1px solid #edf2f7; }
        .footer-link { color: ${PRIMARY_COLOR}; text-decoration: none; font-weight: 500; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <img src="${COMPANY_LOGO}" alt="Tree Campus" class="logo">
        </div>
        <div class="content">
          <div class="greeting">Hello ${name},</div>
          <p class="text">Thank you for signing up with Tree Campus. To complete your registration, please use the verification code below:</p>
          
          <div class="otp-box">${otp}</div>
          
          <div class="info-box">
            <strong>⚠️ Note:</strong> This code is valid for 10 minutes. Please do not share it with anyone.
          </div>
          
          <p class="text" style="margin-top: 24px; font-size: 14px; color: #888;">If you didn't create an account with Tree Campus, you can safely ignore this email.</p>
        </div>
        <div class="footer">
          <p>&copy; ${new Date().getFullYear()} Tree Campus. All rights reserved.</p>
          <p><a href="https://treecampus.netlify.app" class="footer-link">Visit Our Website</a> | <a href="mailto:support@treecampus.com" class="footer-link">Contact Support</a></p>
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
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <style>
        body { font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; background-color: #f4f4f7; color: #51545e; margin: 0; padding: 0; -webkit-text-size-adjust: 100%; }
        .container { max-width: 600px; margin: 40px auto; background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.05); }
        .header { background-color: #ffffff; padding: 30px 0; text-align: center; border-bottom: 1px solid #edf2f7; }
        .logo { max-height: 60px; width: auto; object-fit: contain; }
        .content { padding: 40px; }
        .greeting { font-size: 20px; font-weight: 600; color: #333333; margin-bottom: 20px; }
        .text { font-size: 16px; line-height: 1.6; color: #51545e; margin-bottom: 24px; }
        .btn { 
          display: inline-block; 
          background-color: ${PRIMARY_COLOR}; 
          color: #ffffff; 
          border-radius: 6px; 
          padding: 14px 30px; 
          text-decoration: none; 
          font-weight: bold; 
          margin: 20px 0; 
          text-align: center;
          box-shadow: 0 4px 6px rgba(253, 90, 0, 0.2);
        }
        .info-box { background-color: #fafafa; border-left: 4px solid ${PRIMARY_COLOR}; padding: 16px; border-radius: 4px; font-size: 14px; color: #666; margin-top: 24px; }
        .link-text { font-size: 12px; color: #999; word-break: break-all; margin-top: 10px; }
        .footer { background-color: #f8f9fa; padding: 24px 40px; text-align: center; font-size: 12px; color: #999; border-top: 1px solid #edf2f7; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <img src="${COMPANY_LOGO}" alt="Tree Campus" class="logo">
        </div>
        <div class="content">
          <div class="greeting">Hi ${name},</div>
          <p class="text">We received a request to reset your password for your Tree Campus account. Click the button below to proceed:</p>
          
          <center>
            <a href="${resetUrl}" class="btn">Reset Password</a>
          </center>
          
          <div class="info-box">
            <strong>⏱️ Expiry:</strong> This link is valid for 1 hour.
          </div>
          
          <p class="text" style="font-size: 14px; margin-top: 20px;">If you didn't request a password reset, please ignore this email.</p>
          
          <div style="margin-top: 30px; border-top: 1px solid #eee; padding-top: 20px;">
            <p class="link-text">If the button above doesn't work, copy and paste this link into your browser:<br>${resetUrl}</p>
          </div>
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
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <style>
        body { font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; background-color: #f4f4f7; color: #51545e; margin: 0; padding: 0; -webkit-text-size-adjust: 100%; }
        .container { max-width: 600px; margin: 40px auto; background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.05); }
        .header { background-color: #ffffff; padding: 30px 0; text-align: center; border-bottom: 1px solid #edf2f7; }
        .logo { max-height: 60px; width: auto; object-fit: contain; }
        .content { padding: 40px; }
        .greeting { font-size: 20px; font-weight: 600; color: #333333; margin-bottom: 20px; }
        .text { font-size: 16px; line-height: 1.6; color: #51545e; margin-bottom: 24px; }
        .otp-box { 
          background: linear-gradient(135deg, #00A86B0D 0%, #00A86B1A 100%);
          border: 1px dashed #00A86B;
          border-radius: 6px;
          padding: 24px;
          text-align: center;
          font-size: 32px;
          font-weight: 700;
          letter-spacing: 6px;
          color: #00A86B;
          margin: 32px 0;
          font-family: 'Courier New', monospace;
        }
        .info-box { background-color: #f0fff4; border-left: 4px solid #00A86B; padding: 16px; border-radius: 4px; font-size: 14px; color: #2d3748; margin-top: 24px; }
        .footer { background-color: #f8f9fa; padding: 24px 40px; text-align: center; font-size: 12px; color: #999; border-top: 1px solid #edf2f7; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <img src="${COMPANY_LOGO}" alt="Tree Campus" class="logo">
        </div>
        <div class="content">
          <div class="greeting">Welcome, ${name}! 👋</div>
          <p class="text">Thank you for your interest in volunteering with Tree Campus. We are excited to have you on board! To continue, please verify your email address.</p>
          
          <div class="otp-box">${otp}</div>
          
          <div class="info-box">
            <strong>⏱️ Valid for 10 minutes</strong><br>
            Please use this code to complete your registration.
          </div>
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
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <style>
        body { font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; background-color: #f4f4f7; color: #51545e; margin: 0; padding: 0; -webkit-text-size-adjust: 100%; }
        .container { max-width: 600px; margin: 40px auto; background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.05); }
        .header { background-color: #ffffff; padding: 30px 0; text-align: center; border-bottom: 1px solid #edf2f7; }
        .logo { max-height: 60px; width: auto; object-fit: contain; }
        .content { padding: 40px; }
        .greeting { font-size: 20px; font-weight: 600; color: #333333; margin-bottom: 20px; }
        .text { font-size: 16px; line-height: 1.6; color: #51545e; margin-bottom: 24px; }
        .otp-box { 
          background: linear-gradient(135deg, #1E40AF0D 0%, #1E40AF1A 100%);
          border: 1px dashed #1E40AF;
          border-radius: 6px;
          padding: 24px;
          text-align: center;
          font-size: 32px;
          font-weight: 700;
          letter-spacing: 6px;
          color: #1E40AF;
          margin: 32px 0;
          font-family: 'Courier New', monospace;
        }
        .info-box { background-color: #eff6ff; border-left: 4px solid #1E40AF; padding: 16px; border-radius: 4px; font-size: 14px; color: #2d3748; margin-top: 24px; }
        .footer { background-color: #f8f9fa; padding: 24px 40px; text-align: center; font-size: 12px; color: #999; border-top: 1px solid #edf2f7; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <img src="${COMPANY_LOGO}" alt="Tree Campus" class="logo">
        </div>
        <div class="content">
          <div class="greeting">Hello ${contactName},</div>
          <p class="text">Thank you for registering <strong>${schoolName}</strong> with Tree Campus. We are honored to partner with you.</p>
          <p class="text">Please use the verification code below to confirm your registration:</p>

          <div class="otp-box">${otp}</div>
          
          <div class="info-box">
            <strong>⏱️ Valid for 10 minutes</strong><br>
            Please don't share this code with anyone.
          </div>
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
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <style>
        body { font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; background-color: #f4f4f7; color: #51545e; margin: 0; padding: 0; -webkit-text-size-adjust: 100%; }
        .container { max-width: 600px; margin: 40px auto; background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.05); }
        .header { background-color: #ffffff; padding: 30px 0; text-align: center; border-bottom: 2px solid #DC2626; }
        .logo { max-height: 60px; width: auto; object-fit: contain; }
        .content { padding: 40px; }
        .greeting { font-size: 20px; font-weight: 600; color: #333333; margin-bottom: 20px; }
        .text { font-size: 16px; line-height: 1.6; color: #51545e; margin-bottom: 24px; }
        .warning-box { background-color: #FEF2F2; border: 1px solid #DC2626; padding: 16px; border-radius: 6px; font-size: 14px; color: #991B1B; margin-bottom: 20px; }
        .otp-box { 
          background: linear-gradient(135deg, #DC26260D 0%, #DC26261A 100%);
          border: 1px dashed #DC2626;
          border-radius: 6px;
          padding: 24px;
          text-align: center;
          font-size: 32px;
          font-weight: 700;
          letter-spacing: 6px;
          color: #DC2626;
          margin: 32px 0;
          font-family: 'Courier New', monospace;
        }
        .footer { background-color: #f8f9fa; padding: 24px 40px; text-align: center; font-size: 12px; color: #999; border-top: 1px solid #edf2f7; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <img src="${COMPANY_LOGO}" alt="Tree Campus" class="logo">
        </div>
        <div class="content">
          <div class="greeting">Hello ${name},</div>
          
          <div class="warning-box">
            <strong>⚠️ Critical Action:</strong> You have initiated a request to delete your Tree Campus account. This action cannot be undone once confirmed.
          </div>
          
          <p class="text">To confirm deletion, please enter the following verification code:</p>

          <div class="otp-box">${otp}</div>
          
          <p class="text" style="font-size: 14px;">If you did not request this, please change your password immediately and contact support.</p>
        </div>
        <div class="footer">
          <p>&copy; ${new Date().getFullYear()} Tree Campus.</p>
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
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <style>
        body { font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; background-color: #f4f4f7; color: #51545e; margin: 0; padding: 0; -webkit-text-size-adjust: 100%; }
        .container { max-width: 600px; margin: 40px auto; background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.05); }
        .header { background-color: #ffffff; padding: 30px 0; text-align: center; border-bottom: 1px solid #edf2f7; }
        .logo { max-height: 60px; width: auto; object-fit: contain; }
        .content { padding: 40px; }
        .greeting { font-size: 20px; font-weight: 600; color: #333333; margin-bottom: 20px; }
        .text { font-size: 16px; line-height: 1.6; color: #51545e; margin-bottom: 24px; }
        .status-box { background-color: #f0fff4; border-left: 4px solid #00A86B; padding: 20px; border-radius: 4px; color: #2d3748; margin: 24px 0; }
        .footer { background-color: #f8f9fa; padding: 24px 40px; text-align: center; font-size: 12px; color: #999; border-top: 1px solid #edf2f7; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <img src="${COMPANY_LOGO}" alt="Tree Campus" class="logo">
        </div>
        <div class="content">
          <div class="greeting">Welcome, ${userName}! 🎉</div>
          <p class="text">Thank you for submitting your volunteer application to Tree Campus. We are thrilled to see your enthusiasm for making a positive impact!</p>
          
          <div class="status-box">
            <strong style="color: #00A86B; font-size: 18px; display: block; margin-bottom: 8px;">✓ Application Received</strong>
            Our team is currently reviewing your application. You can expect to hear from us within 2-3 business days.
          </div>
          
          <p class="text">In the meantime, feel free to explore our platform and see what we are achieving together.</p>
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
      <html><body style="font-family: Arial, sans-serif; padding: 20px;">
        <h2 style="color: #00A86B;">New Volunteer Application</h2>
        <p><strong>Name:</strong> ${userName}</p>
        <p><strong>Email:</strong> ${userEmail}</p>
        <p><a href="${process.env.FRONTEND_URL}/admin/volunteers" style="background: #00A86B; color: white; padding: 10px 15px; text-decoration: none; border-radius: 4px;">Review Application</a></p>
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
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <style>
        body { font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; background-color: #f4f4f7; color: #51545e; margin: 0; padding: 0; -webkit-text-size-adjust: 100%; }
        .container { max-width: 600px; margin: 40px auto; background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.05); }
        .header { background-color: #ffffff; padding: 30px 0; text-align: center; border-bottom: 1px solid #edf2f7; }
        .logo { max-height: 60px; width: auto; object-fit: contain; }
        .content { padding: 40px; }
        .greeting { font-size: 20px; font-weight: 600; color: #333333; margin-bottom: 20px; }
        .text { font-size: 16px; line-height: 1.6; color: #51545e; margin-bottom: 24px; }
        .status-box { background-color: #eff6ff; border-left: 4px solid #1E40AF; padding: 20px; border-radius: 4px; color: #2d3748; margin: 24px 0; }
        .footer { background-color: #f8f9fa; padding: 24px 40px; text-align: center; font-size: 12px; color: #999; border-top: 1px solid #edf2f7; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <img src="${COMPANY_LOGO}" alt="Tree Campus" class="logo">
        </div>
        <div class="content">
          <div class="greeting">Hello ${contactName},</div>
          <p class="text">We are delighted to confirm the registration of <strong>${schoolName}</strong> with Tree Campus. Welcome to our partnership program!</p>
          
          <div class="status-box">
            <strong style="color: #1E40AF; font-size: 18px; display: block; margin-bottom: 8px;">✓ Registration Active</strong>
            Your institution is now part of the Tree Campus family, connecting education with nature.
          </div>
          
          <p class="text">Our partnership team will reach out to you shortly with resources and the next steps to get started.</p>
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
      <html><body style="font-family: Arial, sans-serif; padding: 20px;">
        <h2 style="color: #1E40AF;">New School Signed Up</h2>
        <p><strong>School:</strong> ${schoolName}</p>
        <p><strong>Contact:</strong> ${contactName}</p>
        <p><strong>Email:</strong> ${schoolEmail}</p>
        <p><a href="${process.env.FRONTEND_URL}/admin/schools" style="background: #1E40AF; color: white; padding: 10px 15px; text-decoration: none; border-radius: 4px;">View Details</a></p>
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
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <style>
        body { font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; background-color: #f4f4f7; color: #51545e; margin: 0; padding: 0; -webkit-text-size-adjust: 100%; }
        .container { max-width: 600px; margin: 40px auto; background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.05); }
        .header { background-color: #ffffff; padding: 30px 0; text-align: center; border-bottom: 2px solid #DC2626; }
        .logo { max-height: 60px; width: auto; object-fit: contain; }
        .content { padding: 40px; }
        .greeting { font-size: 20px; font-weight: 600; color: #333333; margin-bottom: 20px; }
        .text { font-size: 16px; line-height: 1.6; color: #51545e; margin-bottom: 24px; }
        .warning-box { background-color: #FEF2F2; border: 1px solid #DC2626; padding: 20px; border-radius: 6px; margin: 24px 0; }
        .footer { background-color: #f8f9fa; padding: 24px 40px; text-align: center; font-size: 12px; color: #999; border-top: 1px solid #edf2f7; }
        ul { margin: 0; padding-left: 20px; color: #51545e; }
        li { margin-bottom: 10px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <img src="${COMPANY_LOGO}" alt="Tree Campus" class="logo">
        </div>
        <div class="content">
          <div class="greeting">Hello ${userName},</div>
          
          <div class="warning-box">
            <strong style="color: #991B1B; font-size: 18px; display: block; margin-bottom: 10px;">Account Deletion Scheduled</strong>
            Your request to delete your account has been confirmed. Your account will be permanently deleted in <strong>30 days</strong>.
          </div>
          
          <p class="text">What you need to know:</p>
          <ul>
            <li>You can restore your account by logging in within the next 30 days.</li>
            <li>After 30 days, your data will be permanently erased and cannot be recovered.</li>
          </ul>
          
          <p class="text" style="margin-top: 24px;">We're sorry to see you go. If this was a mistake, please log in immediately to cancel the request.</p>
        </div>
        <div class="footer">
          <p>&copy; ${new Date().getFullYear()} Tree Campus.</p>
        </div>
      </div>
    </body>
    </html>
  `;

  await sendEmail({ to: userEmail, subject, html: userHtml });
  
  if (adminEmail) {
    const adminHtml = `
      <html><body style="font-family: Arial, sans-serif; padding: 20px;">
        <h2 style="color: #DC2626;">Account Deletion Scheduled</h2>
        <p><strong>User:</strong> ${userName}</p>
        <p><strong>Email:</strong> ${userEmail}</p>
        <p><strong>Status:</strong> Pending (30 Days)</p>
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
    ? `🎉 Congratulations! You Passed "${courseTitle}"`
    : `Assignment Results - ${courseTitle}`;

  // Colors
  const statusColor = passed ? '#10B981' : '#EF4444'; // Green or Red
  const statusIcon = passed ? '🏆' : '📚';
  const statusText = passed ? 'Passed Successfully' : 'Needs Improvement';

  const userHtml = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <style>
        body { font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; background-color: #f4f4f7; color: #51545e; margin: 0; padding: 0; -webkit-text-size-adjust: 100%; }
        .container { max-width: 600px; margin: 40px auto; background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.05); }
        .header { background-color: #ffffff; padding: 30px 0; text-align: center; border-bottom: 1px solid #edf2f7; }
        .logo { max-height: 60px; width: auto; object-fit: contain; }
        .content { padding: 40px; }
        .greeting { font-size: 20px; font-weight: 600; color: #333333; margin-bottom: 20px; }
        .score-card { 
          background-color: ${passed ? '#ECFDF5' : '#FEF2F2'}; 
          border: 1px solid ${passed ? '#10B981' : '#EF4444'}; 
          border-radius: 8px; 
          padding: 30px; 
          text-align: center; 
          margin: 30px 0; 
        }
        .score-val { font-size: 48px; font-weight: 700; color: ${statusColor}; margin: 10px 0; }
        .score-label { font-size: 14px; text-transform: uppercase; letter-spacing: 1px; color: #666; }
        .btn { 
          display: inline-block; 
          background-color: ${PRIMARY_COLOR}; 
          color: #ffffff; 
          border-radius: 6px; 
          padding: 14px 30px; 
          text-decoration: none; 
          font-weight: bold; 
          margin-top: 20px;
          box-shadow: 0 4px 6px rgba(253, 90, 0, 0.2);
        }
        .footer { background-color: #f8f9fa; padding: 24px 40px; text-align: center; font-size: 12px; color: #999; border-top: 1px solid #edf2f7; }
        .details-table { width: 100%; margin: 20px 0; border-collapse: collapse; }
        .details-table td { padding: 12px 0; border-bottom: 1px solid #eee; }
        .details-label { font-weight: 600; color: #333; }
        .details-value { text-align: right; color: #666; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <img src="${COMPANY_LOGO}" alt="Tree Campus" class="logo">
        </div>
        <div class="content">
          <div class="greeting">Hello ${userName},</div>
          <p style="font-size: 16px; line-height: 1.6; color: #51545e;">
            Here are the results for your recent assignment in <strong>${courseTitle}</strong>.
          </p>
          
          <div class="score-card">
            <div style="font-size: 40px; margin-bottom: 10px;">${statusIcon}</div>
            <div class="score-label">Your Score</div>
            <div class="score-val">${score}%</div>
            <div style="color: ${statusColor}; font-weight: 600;">${statusText}</div>
          </div>
          
          <table class="details-table">
            <tr>
              <td class="details-label">Course</td>
              <td class="details-value">${courseTitle}</td>
            </tr>
            <tr>
              <td class="details-label">Status</td>
              <td class="details-value" style="color: ${statusColor}; font-weight: bold;">${passed ? 'Passed' : 'Failed'}</td>
            </tr>
            <tr>
              <td class="details-label">Passing Score</td>
              <td class="details-value">${passingScore || 60}%</td>
            </tr>
          </table>

          <div style="text-align: center;">
            ${passed 
              ? `<p>You have successfully completed this assignment. You can now view your certificate.</p>
                 <a href="https://treecampus.netlify.app/certificate/${certificateId}" class="btn">View Certificate</a>` 
              : `<p>Don't worry! You can review the course material and try again.</p>
                 <a href="https://treecampus.netlify.app/courses" class="btn">Return to Course</a>`
            }
          </div>
        </div>
        <div class="footer">
          <p>&copy; ${new Date().getFullYear()} Tree Campus. All rights reserved.</p>
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

  // Notify admin
  const adminEmail = process.env.ADMIN_EMAIL;
  if (adminEmail) {
    const adminHtml = `
      <html><body style="font-family: Arial, sans-serif; padding: 20px;">
        <h2>Assignment Submission</h2>
        <p><strong>Student:</strong> ${userName}</p>
        <p><strong>Course:</strong> ${courseTitle}</p>
        <p><strong>Score:</strong> ${score}% (${passed ? 'Passed' : 'Failed'})</p>
      </body></html>
    `;
    
    sendEmail({
      to: adminEmail,
      subject: `[ADMIN] Assignment Result: ${userName}`,
      html: adminHtml
    }).catch(console.error);
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
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
 * Enhanced Professional Email Styles
 */
const EMAIL_STYLES = `
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body { 
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Helvetica Neue', Arial, sans-serif; 
    background-color: #f5f7fa;
    color: #2d3748; 
    margin: 0; 
    padding: 0; 
    -webkit-text-size-adjust: 100%;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }
  .email-wrapper { 
    width: 100%; 
    background-color: #f5f7fa;
    padding: 40px 20px; 
  }
  .container { 
    max-width: 600px; 
    margin: 0 auto; 
    background-color: #ffffff; 
    border-radius: 16px; 
    overflow: hidden; 
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  }
  .header { 
    background-color: #ffffff;
    padding: 40px 40px 30px; 
    text-align: center; 
    border-bottom: 3px solid ${PRIMARY_COLOR};
  }
  .logo { 
    max-height: 70px; 
    width: auto; 
    height: auto;
    display: inline-block;
    object-fit: contain;
  }
  .content { 
    padding: 48px 40px; 
    background-color: #ffffff;
  }
  .greeting { 
    font-size: 24px; 
    font-weight: 700; 
    color: #1a202c; 
    margin-bottom: 16px;
    letter-spacing: -0.5px;
  }
  .text { 
    font-size: 16px; 
    line-height: 1.75; 
    color: #4a5568; 
    margin-bottom: 24px;
  }
  .btn { 
    display: inline-block; 
    background-color: ${PRIMARY_COLOR};
    color: #ffffff !important; 
    border-radius: 10px; 
    padding: 16px 40px; 
    text-decoration: none !important; 
    font-weight: 600;
    font-size: 16px;
    margin: 24px 0; 
    text-align: center; 
    box-shadow: 0 4px 12px rgba(253, 90, 0, 0.25);
    border: none;
  }
  .otp-box { 
    background-color: rgba(253, 90, 0, 0.08);
    border: 2px dashed ${PRIMARY_COLOR}; 
    border-radius: 12px; 
    padding: 32px 24px; 
    text-align: center; 
    font-size: 38px; 
    font-weight: 800; 
    letter-spacing: 10px; 
    color: ${PRIMARY_COLOR}; 
    margin: 36px 0; 
    font-family: 'Courier New', monospace;
  }
  .info-box { 
    background-color: #f8f9fa;
    border-left: 4px solid ${PRIMARY_COLOR}; 
    padding: 20px 24px; 
    border-radius: 8px; 
    font-size: 14px; 
    color: #4a5568; 
    margin-top: 28px;
  }
  .info-box strong {
    color: #2d3748;
    display: block;
    margin-bottom: 6px;
    font-weight: 700;
  }
  .footer { 
    background-color: #2d3748;
    padding: 32px 40px; 
    text-align: center; 
    font-size: 13px; 
    color: #cbd5e0;
  }
  .footer p {
    margin: 8px 0;
    line-height: 1.6;
    color: #cbd5e0;
  }
  .footer a {
    color: ${PRIMARY_COLOR};
    text-decoration: none;
  }
  .admin-label { 
    display: inline-block;
    background-color: #667eea;
    color: #ffffff;
    font-size: 10px; 
    text-transform: uppercase; 
    letter-spacing: 1.5px; 
    margin-top: 12px;
    padding: 6px 16px;
    border-radius: 20px;
    font-weight: 700;
  }
  .data-table { 
    width: 100%; 
    border-collapse: collapse;
    margin: 28px 0;
    border: 1px solid #e2e8f0;
    border-radius: 8px;
  }
  .data-table td { 
    padding: 16px 20px; 
    border-bottom: 1px solid #e2e8f0;
    background-color: #ffffff;
  }
  .data-table tr:last-child td {
    border-bottom: none;
  }
  .data-label { 
    font-weight: 700; 
    color: #2d3748; 
    width: 140px;
    font-size: 12px;
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }
  .divider {
    height: 1px;
    background-color: #e2e8f0;
    margin: 32px 0;
  }
  .status-badge {
    display: inline-block;
    padding: 6px 16px;
    border-radius: 20px;
    font-size: 12px;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }
  .status-success {
    background-color: #d4edda;
    color: #155724;
    border: 1px solid #c3e6cb;
  }
  .status-warning {
    background-color: #fff3cd;
    color: #856404;
    border: 1px solid #ffeeba;
  }
  .status-danger {
    background-color: #f8d7da;
    color: #721c24;
    border: 1px solid #f5c6cb;
  }
  @media only screen and (max-width: 600px) {
    .email-wrapper { padding: 20px 10px; }
    .content { padding: 32px 24px; }
    .header { padding: 32px 24px 24px; }
    .footer { padding: 24px 24px; }
    .greeting { font-size: 20px; }
    .text { font-size: 15px; }
    .otp-box { 
      font-size: 32px; 
      letter-spacing: 6px;
      padding: 28px 16px;
    }
    .btn {
      padding: 14px 32px;
      font-size: 15px;
    }
  }
`;

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
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <meta http-equiv="X-UA-Compatible" content="IE=edge">
      <title>${subject}</title>
      <style>${EMAIL_STYLES}</style>
    </head>
    <body>
      <div class="email-wrapper">
        <div class="container">
          <div class="header">
            <img src="${COMPANY_LOGO}" alt="Tree Campus" class="logo">
          </div>
          <div class="content">
            <div class="greeting">Hello ${name},</div>
            <p class="text">Thank you for signing up with Tree Campus. To complete your registration and verify your account, please use the verification code below:</p>
            
            <div class="otp-box">${otp}</div>
            
            <div class="info-box">
              <strong>⚠️ Important Note</strong>
              This verification code is valid for 10 minutes only. Please do not share this code with anyone for your account security.
            </div>
            
            <div class="divider"></div>
            
            <p class="text" style="margin-top: 24px; font-size: 14px; color: #718096;">If you didn't create an account with Tree Campus, you can safely ignore this email. Your security is our priority.</p>
          </div>
          <div class="footer">
            <p style="margin-bottom: 12px; font-weight: 600; color: #cbd5e0;">Tree Campus</p>
            <p>&copy; ${new Date().getFullYear()} Tree Campus. All rights reserved.</p>
            <p style="margin-top: 12px;">Growing knowledge, nurturing futures.</p>
          </div>
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
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <meta http-equiv="X-UA-Compatible" content="IE=edge">
      <title>${subject}</title>
      <style>${EMAIL_STYLES}</style>
    </head>
    <body>
      <div class="email-wrapper">
        <div class="container">
          <div class="header">
            <img src="${COMPANY_LOGO}" alt="Tree Campus" class="logo">
          </div>
          <div class="content">
            <div class="greeting">Hi ${name},</div>
            <p class="text">We received a request to reset your password for your Tree Campus account. Don't worry, this happens to the best of us!</p>
            
            <p class="text">Click the button below to create a new password:</p>
            
            <center>
              <a href="${resetUrl}" class="btn">Reset Password</a>
            </center>
            
            <div class="info-box">
              <strong>⏱️ Link Expiration</strong>
              This password reset link is valid for 1 hour. After that, you'll need to request a new one.
            </div>
            
            <div class="divider"></div>
            
            <p class="text" style="font-size: 14px; margin-top: 20px;">If you didn't request a password reset, please ignore this email or contact our support team if you have concerns about your account security.</p>
            
            <div style="margin-top: 32px; padding: 20px; background-color: #f7fafc; border-radius: 8px; font-size: 13px; color: #718096;">
              <p style="margin-bottom: 8px; font-weight: 600; color: #4a5568;">Button not working?</p>
              <p style="margin: 0;">Copy and paste this link into your browser:</p>
              <p style="margin-top: 8px; word-break: break-all;"><a href="${resetUrl}" style="color: ${PRIMARY_COLOR}; text-decoration: none;">${resetUrl}</a></p>
            </div>
          </div>
          <div class="footer">
            <p style="margin-bottom: 12px; font-weight: 600; color: #cbd5e0;">Tree Campus</p>
            <p>&copy; ${new Date().getFullYear()} Tree Campus. All rights reserved.</p>
            <p style="margin-top: 12px;">Your trusted learning partner.</p>
          </div>
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
  const volunteerColor = '#00A86B';
  const subject = '🌱 Verify Your Volunteer Registration';
  const html = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <meta http-equiv="X-UA-Compatible" content="IE=edge">
      <title>${subject}</title>
      <style>
        ${EMAIL_STYLES}
        .header::after { background-color: ${volunteerColor}; }
        .otp-box { 
          border-color: ${volunteerColor}; 
          color: ${volunteerColor}; 
          background: linear-gradient(135deg, rgba(0, 168, 107, 0.05) 0%, rgba(0, 168, 107, 0.12) 100%);
        }
        .info-box { border-left-color: ${volunteerColor}; }
      </style>
    </head>
    <body>
      <div class="email-wrapper">
        <div class="container">
          <div class="header">
            <img src="${COMPANY_LOGO}" alt="Tree Campus" class="logo">
          </div>
          <div class="content">
            <div class="greeting">Welcome, ${name}! 👋</div>
            <p class="text">Thank you for your interest in volunteering with Tree Campus. We are excited to have passionate individuals like you join our mission to make a difference!</p>
            
            <p class="text">To continue with your volunteer registration, please verify your email address using the code below:</p>
            
            <div class="otp-box">${otp}</div>
            
            <div class="info-box" style="border-left-color: ${volunteerColor};">
              <strong>⏱️ Valid for 10 minutes</strong>
              Please use this code to complete your volunteer registration process.
            </div>
            
            <div class="divider"></div>
            
            <p class="text" style="font-size: 14px; color: #718096;">Once verified, you'll be able to access volunteer opportunities and start making an impact in your community.</p>
          </div>
          <div class="footer">
            <p style="margin-bottom: 12px; font-weight: 600; color: #cbd5e0;">Tree Campus</p>
            <p>&copy; ${new Date().getFullYear()} Tree Campus. All rights reserved.</p>
            <p style="margin-top: 12px;">Making a difference together.</p>
          </div>
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
  const schoolColor = '#1E40AF';
  const subject = '🏫 Verify Your School Registration';
  const html = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <meta http-equiv="X-UA-Compatible" content="IE=edge">
      <title>${subject}</title>
      <style>
        ${EMAIL_STYLES}
        .header::after { background-color: ${schoolColor}; }
        .otp-box { 
          border-color: ${schoolColor}; 
          color: ${schoolColor}; 
          background: linear-gradient(135deg, rgba(30, 64, 175, 0.05) 0%, rgba(30, 64, 175, 0.12) 100%);
        }
        .info-box { border-left-color: ${schoolColor}; }
      </style>
    </head>
    <body>
      <div class="email-wrapper">
        <div class="container">
          <div class="header">
            <img src="${COMPANY_LOGO}" alt="Tree Campus" class="logo">
          </div>
          <div class="content">
            <div class="greeting">Hello ${contactName},</div>
            <p class="text">Thank you for registering <strong>${schoolName}</strong> with Tree Campus. We are honored to partner with your institution in nurturing young minds and creating brighter futures.</p>
            
            <p class="text">Please use the verification code below to confirm your school registration:</p>

            <div class="otp-box">${otp}</div>
            
            <div class="info-box" style="border-left-color: ${schoolColor};">
              <strong>⏱️ Valid for 10 minutes</strong>
              Please don't share this code with anyone. This is for authorized school representatives only.
            </div>
            
            <div class="divider"></div>
            
            <p class="text" style="font-size: 14px; color: #718096;">After verification, you'll gain access to our comprehensive educational resources and partnership programs.</p>
          </div>
          <div class="footer">
            <p style="margin-bottom: 12px; font-weight: 600; color: #cbd5e0;">Tree Campus</p>
            <p>&copy; ${new Date().getFullYear()} Tree Campus. All rights reserved.</p>
            <p style="margin-top: 12px;">Nurturing minds, growing futures.</p>
          </div>
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
  const dangerColor = '#DC2626';
  const subject = '⚠️ Verify Account Deletion Request';
  const html = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <meta http-equiv="X-UA-Compatible" content="IE=edge">
      <title>${subject}</title>
      <style>
        ${EMAIL_STYLES}
        .header { border-bottom-color: ${dangerColor}; }
        .header::after { background-color: ${dangerColor}; }
        .otp-box { 
          border-color: ${dangerColor}; 
          color: ${dangerColor}; 
          background: linear-gradient(135deg, rgba(220, 38, 38, 0.05) 0%, rgba(220, 38, 38, 0.12) 100%);
        }
        .warning-box { 
          background: linear-gradient(135deg, #FEF2F2 0%, #FEE2E2 100%);
          border: 2px solid ${dangerColor}; 
          padding: 24px; 
          border-radius: 10px; 
          font-size: 14px; 
          color: #991B1B; 
          margin-bottom: 28px;
          box-shadow: 0 4px 16px rgba(220, 38, 38, 0.1);
        }
        .warning-box strong {
          display: block;
          font-size: 16px;
          margin-bottom: 8px;
          color: ${dangerColor};
        }
      </style>
    </head>
    <body>
      <div class="email-wrapper">
        <div class="container">
          <div class="header">
            <img src="${COMPANY_LOGO}" alt="Tree Campus" class="logo">
          </div>
          <div class="content">
            <div class="greeting">Hello ${name},</div>
            
            <div class="warning-box">
              <strong>⚠️ Critical Action Required</strong>
              You have initiated a request to permanently delete your Tree Campus account. This action cannot be undone once confirmed.
            </div>
            
            <p class="text">To confirm that you want to proceed with account deletion, please enter the following verification code:</p>

            <div class="otp-box">${otp}</div>
            
            <div class="divider"></div>
            
            <p class="text" style="font-size: 14px; color: #718096; background-color: #fffbeb; padding: 16px; border-radius: 8px; border-left: 4px solid #f59e0b;">
              <strong style="color: #92400e; display: block; margin-bottom: 6px;">Didn't request this?</strong>
              If you did not request account deletion, please change your password immediately and contact our support team.
            </p>
          </div>
          <div class="footer">
            <p style="margin-bottom: 12px; font-weight: 600; color: #cbd5e0;">Tree Campus</p>
            <p>&copy; ${new Date().getFullYear()} Tree Campus. All rights reserved.</p>
          </div>
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
  const volunteerColor = '#00A86B';
  const subject = '🌱 Welcome to Tree Campus Volunteer Program!';

  // Generate Admin HTML
  const getAdminHtml = () => `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <meta http-equiv="X-UA-Compatible" content="IE=edge">
      <title>New Volunteer Application</title>
      <style>
        ${EMAIL_STYLES}
        .btn { background-color: ${volunteerColor}; }
      </style>
    </head>
    <body>
      <div class="email-wrapper">
        <div class="container">
          <div class="header">
            <img src="${COMPANY_LOGO}" alt="Tree Campus Logo" class="logo">
            <div class="admin-label">Admin Notification</div>
          </div>
          <div class="content">
            <div class="greeting">🔔 New Volunteer Application</div>
            <p class="text">A new volunteer application has been submitted and is pending your review.</p>
            
            <table class="data-table">
              <tr>
                <td class="data-label">Name</td>
                <td style="font-weight: 600; color: #2d3748;">${userName}</td>
              </tr>
              <tr>
                <td class="data-label">Email</td>
                <td><a href="mailto:${userEmail}" style="color: ${volunteerColor}; text-decoration: none; font-weight: 500;">${userEmail}</a></td>
              </tr>
              <tr>
                <td class="data-label">Date</td>
                <td>${new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</td>
              </tr>
              <tr>
                <td class="data-label">Status</td>
                <td><span class="status-badge status-warning">Pending Review</span></td>
              </tr>
            </table>

            <center>
              <a href="${process.env.FRONTEND_URL}/admin/volunteers" class="btn">Review Application</a>
            </center>
          </div>
          <div class="footer">
            <p style="margin-bottom: 12px; font-weight: 600; color: #cbd5e0;">Tree Campus Admin System</p>
            <p>&copy; ${new Date().getFullYear()} Tree Campus. All rights reserved.</p>
          </div>
        </div>
      </div>
    </body>
    </html>
  `;

  // User HTML
  const userHtml = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <meta http-equiv="X-UA-Compatible" content="IE=edge">
      <title>${subject}</title>
      <style>
        ${EMAIL_STYLES}
        .status-box { 
          background-color: #ECFDF5;
          border: 2px solid ${volunteerColor}; 
          border-radius: 12px; 
          padding: 28px; 
          color: #065f46; 
          margin: 32px 0;
        }
        .status-title {
          color: ${volunteerColor};
          font-size: 20px;
          font-weight: 700;
          margin-bottom: 12px;
        }
      </style>
    </head>
    <body>
      <div class="email-wrapper">
        <div class="container">
          <div class="header">
            <img src="${COMPANY_LOGO}" alt="Tree Campus Logo" class="logo">
          </div>
          <div class="content">
            <div class="greeting">Welcome, ${userName}! 🎉</div>
            <p class="text">Thank you for submitting your volunteer application to Tree Campus. We are absolutely thrilled to see your enthusiasm for making a positive impact in our community!</p>
            
            <div class="status-box">
              <div class="status-title">✓ Application Received</div>
              <p style="margin: 0; font-size: 15px; line-height: 1.6;">Our team is currently reviewing your application carefully. You can expect to hear from us within 2-3 business days with the next steps.</p>
            </div>
            
            <div class="divider"></div>
            
            <p class="text">In the meantime, feel free to explore our platform and discover the incredible impact we're making together as a community.</p>
            
            <div style="background-color: #f7fafc; padding: 20px; border-radius: 10px; margin-top: 24px;">
              <p style="margin: 0; font-size: 14px; color: #4a5568; line-height: 1.6;">
                <strong style="color: #2d3748; display: block; margin-bottom: 8px;">What happens next?</strong>
                1. We review your application<br>
                2. You'll receive an email with your status<br>
                3. If approved, you can start volunteering right away!
              </p>
            </div>
          </div>
          <div class="footer">
            <p style="margin-bottom: 12px; font-weight: 600; color: #cbd5e0;">Tree Campus</p>
            <p>&copy; ${new Date().getFullYear()} Tree Campus. All rights reserved.</p>
            <p style="margin-top: 12px;">Planting seeds of knowledge.</p>
          </div>
        </div>
      </div>
    </body>
    </html>
  `;

  await sendEmail({ to: userEmail, subject, html: userHtml });
  
  if (adminEmail) {
    await sendEmail({ to: adminEmail, subject: `[ADMIN] ${subject}`, html: getAdminHtml() });
  }
};

/**
 * Send school registration confirmation
 */
const sendSchoolRegistrationConfirmation = async (schoolEmail, schoolName, contactName, schoolDetails = {}) => {
  const adminEmail = process.env.ADMIN_EMAIL;
  const schoolColor = '#1E40AF';
  const subject = '🏫 Welcome to Tree Campus School Partnership Program!';

  // Admin HTML
  const getAdminHtml = () => `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <meta http-equiv="X-UA-Compatible" content="IE=edge">
      <title>New School Registration</title>
      <style>
        ${EMAIL_STYLES}
        .btn { background: linear-gradient(135deg, ${schoolColor} 0%, #3b82f6 100%); box-shadow: 0 6px 20px rgba(30, 64, 175, 0.3); }
      </style>
    </head>
    <body>
      <div class="email-wrapper">
        <div class="container">
          <div class="header">
            <img src="${COMPANY_LOGO}" alt="Tree Campus" class="logo">
            <div class="admin-label">Admin Notification</div>
          </div>
          <div class="content">
            <div class="greeting">🔔 New School Registration</div>
            <p class="text">A new school has successfully registered with the Tree Campus platform.</p>
            
            <table class="data-table">
              <tr>
                <td class="data-label">School Name</td>
                <td style="font-weight: 700; color: #2d3748; font-size: 16px;">${schoolName}</td>
              </tr>
              <tr>
                <td class="data-label">Contact Person</td>
                <td style="font-weight: 600; color: #2d3748;">${contactName}</td>
              </tr>
              <tr>
                <td class="data-label">Email</td>
                <td><a href="mailto:${schoolEmail}" style="color: ${schoolColor}; text-decoration: none; font-weight: 500;">${schoolEmail}</a></td>
              </tr>
              <tr>
                <td class="data-label">Date</td>
                <td>${new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</td>
              </tr>
              <tr>
                <td class="data-label">Status</td>
                <td><span class="status-badge status-success">Active</span></td>
              </tr>
            </table>

            <center>
              <a href="${process.env.FRONTEND_URL}/admin/schools" class="btn">View School Details</a>
            </center>
          </div>
          <div class="footer">
            <p style="margin-bottom: 12px; font-weight: 600; color: #cbd5e0;">Tree Campus Admin System</p>
            <p>&copy; ${new Date().getFullYear()} Tree Campus. All rights reserved.</p>
          </div>
        </div>
      </div>
    </body>
    </html>
  `;

  const userHtml = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <meta http-equiv="X-UA-Compatible" content="IE=edge">
      <title>${subject}</title>
      <style>
        ${EMAIL_STYLES}
        .status-box { 
          background: linear-gradient(135deg, #EFF6FF 0%, #DBEAFE 100%);
          border: 2px solid ${schoolColor}; 
          border-radius: 12px; 
          padding: 28px; 
          color: #1e3a8a; 
          margin: 32px 0;
          box-shadow: 0 6px 20px rgba(30, 64, 175, 0.15);
        }
        .status-box strong {
          color: ${schoolColor};
          font-size: 20px;
          display: flex;
          align-items: center;
          gap: 10px;
          margin-bottom: 12px;
        }
      </style>
    </head>
    <body>
      <div class="email-wrapper">
        <div class="container">
          <div class="header">
            <img src="${COMPANY_LOGO}" alt="Tree Campus" class="logo">
          </div>
          <div class="content">
            <div class="greeting">Hello ${contactName},</div>
            <p class="text">We are delighted to confirm the registration of <strong style="color: ${schoolColor};">${schoolName}</strong> with Tree Campus. Welcome to our partnership program!</p>
            
            <div class="status-box">
              <strong>
                <span style="font-size: 28px;">✓</span>
                <span>Registration Active</span>
              </strong>
              <p style="margin: 0; font-size: 15px; line-height: 1.6;">Your institution is now part of the Tree Campus family, connecting education with nature and innovation.</p>
            </div>
            
            <div class="divider"></div>
            
            <p class="text">Our partnership team will reach out to you shortly with comprehensive resources, training materials, and the next steps to get your school started on this exciting journey.</p>
            
            <div style="background-color: #f7fafc; padding: 24px; border-radius: 10px; margin-top: 28px;">
              <p style="margin: 0 0 16px 0; font-size: 15px; font-weight: 700; color: #2d3748;">Benefits of Partnership:</p>
              <ul style="margin: 0; padding-left: 20px; color: #4a5568; line-height: 1.8;">
                <li>Access to educational resources and curriculum</li>
                <li>Priority support from our team</li>
                <li>Exclusive workshops and training sessions</li>
                <li>Community engagement opportunities</li>
              </ul>
            </div>
          </div>
          <div class="footer">
            <p style="margin-bottom: 12px; font-weight: 600; color: #cbd5e0;">Tree Campus</p>
            <p>&copy; ${new Date().getFullYear()} Tree Campus. All rights reserved.</p>
            <p style="margin-top: 12px;">Nurturing minds, growing futures.</p>
          </div>
        </div>
      </div>
    </body>
    </html>
  `;

  await sendEmail({ to: schoolEmail, subject, html: userHtml });
  
  if (adminEmail) {
    await sendEmail({ to: adminEmail, subject: `[ADMIN] ${subject}`, html: getAdminHtml() });
  }
};

/**
 * Send account deletion confirmation
 */
const sendAccountDeletionConfirmation = async (userEmail, userName, deletionDetails = {}) => {
  const adminEmail = process.env.ADMIN_EMAIL;
  const dangerColor = '#DC2626';
  const subject = '⚠️ Account Deletion Request Confirmed';

  // Admin HTML
  const getAdminHtml = () => `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <meta http-equiv="X-UA-Compatible" content="IE=edge">
      <title>Account Deletion Request</title>
      <style>
        ${EMAIL_STYLES}
        .header::after { background-color: ${dangerColor}; }
        .greeting { color: ${dangerColor}; }
      </style>
    </head>
    <body>
      <div class="email-wrapper">
        <div class="container">
          <div class="header">
            <img src="${COMPANY_LOGO}" alt="Tree Campus" class="logo">
            <div class="admin-label">Admin Notification</div>
          </div>
          <div class="content">
            <div class="greeting">⚠️ Account Deletion Request</div>
            <p class="text">A user has confirmed their request for permanent account deletion.</p>
            
            <table class="data-table">
              <tr>
                <td class="data-label">User Name</td>
                <td style="font-weight: 600; color: #2d3748;">${userName}</td>
              </tr>
              <tr>
                <td class="data-label">Email</td>
                <td>${userEmail}</td>
              </tr>
              <tr>
                <td class="data-label">Status</td>
                <td><span class="status-badge status-danger">Pending Deletion</span></td>
              </tr>
              <tr>
                <td class="data-label">Grace Period</td>
                <td style="font-weight: 600; color: #dc2626;">30 Days</td>
              </tr>
              <tr>
                <td class="data-label">Request Date</td>
                <td>${new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</td>
              </tr>
              <tr>
                <td class="data-label">Final Deletion</td>
                <td style="font-weight: 600;">${new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</td>
              </tr>
            </table>
          </div>
          <div class="footer">
            <p style="margin-bottom: 12px; font-weight: 600; color: #cbd5e0;">Tree Campus Admin System</p>
            <p>&copy; ${new Date().getFullYear()} Tree Campus. All rights reserved.</p>
          </div>
        </div>
      </div>
    </body>
    </html>
  `;

  const userHtml = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <meta http-equiv="X-UA-Compatible" content="IE=edge">
      <title>${subject}</title>
      <style>
        ${EMAIL_STYLES}
        .header { border-bottom-color: ${dangerColor}; }
        .header::after { background-color: ${dangerColor}; }
        .warning-box { 
          background: linear-gradient(135deg, #FEF2F2 0%, #FEE2E2 100%);
          border: 2px solid ${dangerColor}; 
          border-radius: 12px; 
          padding: 28px; 
          margin: 32px 0;
          box-shadow: 0 6px 20px rgba(220, 38, 38, 0.15);
        }
        .warning-box strong {
          color: ${dangerColor};
          font-size: 20px;
          display: block;
          margin-bottom: 12px;
        }
        .warning-box p {
          margin: 0;
          font-size: 15px;
          color: #991B1B;
          line-height: 1.7;
        }
        .info-list {
          background-color: #fffbeb;
          border-left: 4px solid #f59e0b;
          border-radius: 8px;
          padding: 20px 24px;
          margin: 24px 0;
        }
        .info-list ul {
          margin: 12px 0 0 0;
          padding-left: 20px;
          color: #78350f;
        }
        .info-list li {
          margin-bottom: 10px;
          line-height: 1.6;
        }
      </style>
    </head>
    <body>
      <div class="email-wrapper">
        <div class="container">
          <div class="header">
            <img src="${COMPANY_LOGO}" alt="Tree Campus" class="logo">
          </div>
          <div class="content">
            <div class="greeting">Hello ${userName},</div>
            
            <div class="warning-box">
              <strong>⚠️ Account Deletion Scheduled</strong>
              <p>Your request to permanently delete your Tree Campus account has been confirmed. Your account and all associated data will be permanently deleted in <strong>30 days</strong>.</p>
            </div>
            
            <div class="info-list">
              <p style="margin: 0 0 8px 0; font-weight: 700; color: #92400e;">📋 What you need to know:</p>
              <ul>
                <li><strong>Grace Period:</strong> You have 30 days to change your mind</li>
                <li><strong>Restore Account:</strong> Simply log in within 30 days to cancel the deletion</li>
                <li><strong>After 30 Days:</strong> All your data will be permanently erased and cannot be recovered</li>
                <li><strong>Data Included:</strong> Profile, courses, certificates, and activity history</li>
              </ul>
            </div>
            
            <div class="divider"></div>
            
            <p class="text" style="margin-top: 24px; text-align: center; font-size: 15px;">We're sorry to see you go. If this was a mistake or you'd like to stay, please log in immediately to cancel this request.</p>
            
            <center>
              <a href="${process.env.FRONTEND_URL}/login" class="btn" style="background: linear-gradient(135deg, #059669 0%, #10b981 100%); box-shadow: 0 6px 20px rgba(5, 150, 105, 0.3);">Cancel Deletion & Keep My Account</a>
            </center>
          </div>
          <div class="footer">
            <p style="margin-bottom: 12px; font-weight: 600; color: #cbd5e0;">Tree Campus</p>
            <p>&copy; ${new Date().getFullYear()} Tree Campus. All rights reserved.</p>
          </div>
        </div>
      </div>
    </body>
    </html>
  `;

  await sendEmail({ to: userEmail, subject, html: userHtml });
  
  if (adminEmail) {
    await sendEmail({ to: adminEmail, subject: `[ADMIN] ${subject}`, html: getAdminHtml() });
  }
};

/**
 * Send assignment results email (pass/fail notification)
 */
export const sendAssignmentResultsEmail = async (userEmail, userName, assignmentData) => {
  const { courseTitle, score, passed, certificateId, passingScore } = assignmentData;

  const statusColor = passed ? '#10B981' : '#EF4444';
  const statusIcon = passed ? '🏆' : '📚';
  const statusText = passed ? 'Passed Successfully' : 'Needs Improvement';

  const subject = passed
    ? `🎉 Congratulations! You Passed "${courseTitle}"`
    : `📊 Assignment Results - ${courseTitle}`;

  // Admin HTML
  const getAdminHtml = () => `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <meta http-equiv="X-UA-Compatible" content="IE=edge">
      <title>Assignment Submission</title>
      <style>${EMAIL_STYLES}</style>
    </head>
    <body>
      <div class="email-wrapper">
        <div class="container">
          <div class="header">
            <img src="${COMPANY_LOGO}" alt="Tree Campus" class="logo">
            <div class="admin-label">Admin Notification</div>
          </div>
          <div class="content">
            <div class="greeting">📝 Assignment Submission</div>
            <p class="text">A student has completed an assignment with the following results:</p>
            
            <table class="data-table">
              <tr>
                <td class="data-label">Student Name</td>
                <td style="font-weight: 600; color: #2d3748;">${userName}</td>
              </tr>
              <tr>
                <td class="data-label">Course</td>
                <td style="font-weight: 600;">${courseTitle}</td>
              </tr>
              <tr>
                <td class="data-label">Score</td>
                <td style="font-weight: 700; font-size: 18px; color: ${statusColor};">${score}%</td>
              </tr>
              <tr>
                <td class="data-label">Result</td>
                <td><span class="status-badge ${passed ? 'status-success' : 'status-danger'}">${passed ? 'PASSED' : 'FAILED'}</span></td>
              </tr>
              <tr>
                <td class="data-label">Date</td>
                <td>${new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</td>
              </tr>
            </table>
          </div>
          <div class="footer">
            <p style="margin-bottom: 12px; font-weight: 600; color: #cbd5e0;">Tree Campus Admin System</p>
            <p>&copy; ${new Date().getFullYear()} Tree Campus. All rights reserved.</p>
          </div>
        </div>
      </div>
    </body>
    </html>
  `;

  const userHtml = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <meta http-equiv="X-UA-Compatible" content="IE=edge">
      <title>${subject}</title>
      <style>
        ${EMAIL_STYLES}
        .score-card { 
          background: linear-gradient(135deg, ${passed ? '#ECFDF5' : '#FEF2F2'} 0%, ${passed ? '#D1FAE5' : '#FEE2E2'} 100%);
          border: 2px solid ${statusColor}; 
          border-radius: 16px; 
          padding: 40px 30px; 
          text-align: center; 
          margin: 36px 0;
          box-shadow: 0 8px 24px ${passed ? 'rgba(16, 185, 129, 0.2)' : 'rgba(239, 68, 68, 0.2)'};
        }
        .score-val { 
          font-size: 56px; 
          font-weight: 800; 
          color: ${statusColor}; 
          margin: 16px 0;
          line-height: 1;
          text-shadow: 0 2px 4px ${passed ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)'};
        }
        .score-label { 
          font-size: 13px; 
          text-transform: uppercase; 
          letter-spacing: 2px; 
          color: #6b7280;
          font-weight: 700;
        }
        .score-status {
          margin-top: 12px;
          font-size: 18px;
          font-weight: 700;
          color: ${statusColor};
        }
      </style>
    </head>
    <body>
      <div class="email-wrapper">
        <div class="container">
          <div class="header">
            <img src="${COMPANY_LOGO}" alt="Tree Campus" class="logo">
          </div>
          <div class="content">
            <div class="greeting">Hello ${userName},</div>
            <p class="text">
              ${passed 
                ? `Congratulations! 🎉 You've successfully completed the assignment for <strong>${courseTitle}</strong>. Great work!` 
                : `Thank you for completing the assignment for <strong>${courseTitle}</strong>. Here are your results:`
              }
            </p>
            
            <div class="score-card">
              <div style="font-size: 48px; margin-bottom: 16px;">${statusIcon}</div>
              <div class="score-label">Your Score</div>
              <div class="score-val">${score}%</div>
              <div class="score-status">${statusText}</div>
            </div>
            
            <table class="data-table">
              <tr>
                <td class="data-label">Course</td>
                <td style="font-weight: 600;">${courseTitle}</td>
              </tr>
              <tr>
                <td class="data-label">Status</td>
                <td><span class="status-badge ${passed ? 'status-success' : 'status-danger'}">${passed ? 'Passed' : 'Failed'}</span></td>
              </tr>
              <tr>
                <td class="data-label">Your Score</td>
                <td style="font-weight: 700; font-size: 16px; color: ${statusColor};">${score}%</td>
              </tr>
              <tr>
                <td class="data-label">Passing Score</td>
                <td style="font-weight: 600;">${passingScore || 60}%</td>
              </tr>
              <tr>
                <td class="data-label">Completion Date</td>
                <td>${new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</td>
              </tr>
            </table>

            <div class="divider"></div>

            <div style="text-align: center; margin-top: 32px;">
              ${passed 
                ? `
                <p class="text" style="font-size: 15px; margin-bottom: 24px;">
                  🎓 You've earned your certificate! Click below to view and download it.
                </p>
                <a href="https://treecampus.netlify.app/certificate/${certificateId}" class="btn" style="background: linear-gradient(135deg, #10B981 0%, #059669 100%); box-shadow: 0 6px 20px rgba(16, 185, 129, 0.3);">View My Certificate</a>
                <p style="margin-top: 20px; font-size: 13px; color: #6b7280;">Share your achievement with friends and on social media!</p>
                ` 
                : `
                <p class="text" style="font-size: 15px; margin-bottom: 24px;">
                  Don't worry! Learning is a journey. Review the course material and you can try the assignment again.
                </p>
                <a href="https://treecampus.netlify.app/courses" class="btn" style="background: linear-gradient(135deg, #6366f1 0%, #4f46e5 100%); box-shadow: 0 6px 20px rgba(99, 102, 241, 0.3);">Return to Course</a>
                <p style="margin-top: 20px; font-size: 13px; color: #6b7280;">Take your time to review and try again when you're ready!</p>
                `
              }
            </div>
          </div>
          <div class="footer">
            <p style="margin-bottom: 12px; font-weight: 600; color: #cbd5e0;">Tree Campus</p>
            <p>&copy; ${new Date().getFullYear()} Tree Campus. All rights reserved.</p>
            <p style="margin-top: 12px;">Keep learning, keep growing.</p>
          </div>
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
    sendEmail({
      to: adminEmail,
      subject: `[ADMIN] Assignment Result: ${userName} - ${courseTitle}`,
      html: getAdminHtml()
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
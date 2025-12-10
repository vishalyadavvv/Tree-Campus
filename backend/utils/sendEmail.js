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
 * Common Email Styles
 */
const EMAIL_STYLES = `
  body { font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; background-color: #f4f4f7; color: #51545e; margin: 0; padding: 0; -webkit-text-size-adjust: 100%; }
  .container { max-width: 600px; margin: 40px auto; background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.05); }
  .header { background-color: #ffffff; padding: 30px 0; text-align: center; border-bottom: 1px solid #edf2f7; }
  .logo { max-height: 60px; width: auto; object-fit: contain; }
  .content { padding: 40px; }
  .greeting { font-size: 20px; font-weight: 600; color: #333333; margin-bottom: 20px; }
  .text { font-size: 16px; line-height: 1.6; color: #51545e; margin-bottom: 24px; }
  .btn { display: inline-block; background-color: ${PRIMARY_COLOR}; color: #ffffff; border-radius: 6px; padding: 14px 30px; text-decoration: none; font-weight: bold; margin: 20px 0; text-align: center; box-shadow: 0 4px 6px rgba(253, 90, 0, 0.2); }
  .otp-box { background: linear-gradient(135deg, ${PRIMARY_COLOR}0D 0%, ${PRIMARY_COLOR}1A 100%); border: 1px dashed ${PRIMARY_COLOR}; border-radius: 6px; padding: 24px; text-align: center; font-size: 32px; font-weight: 700; letter-spacing: 6px; color: ${PRIMARY_COLOR}; margin: 32px 0; font-family: 'Courier New', monospace; }
  .info-box { background-color: #fafafa; border-left: 4px solid ${PRIMARY_COLOR}; padding: 16px; border-radius: 4px; font-size: 14px; color: #666; margin-top: 24px; }
  .footer { background-color: #f8f9fa; padding: 24px 40px; text-align: center; font-size: 12px; color: #999; border-top: 1px solid #edf2f7; }
  .admin-label { font-size: 11px; text-transform: uppercase; letter-spacing: 1px; color: #999; margin-top: 10px; }
  .data-table { width: 100%; border-collapse: collapse; margin: 20px 0; }
  .data-table td { padding: 10px; border-bottom: 1px solid #eee; }
  .data-label { font-weight: 600; color: #333; width: 120px; }
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
    <html>
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <style>${EMAIL_STYLES}</style>
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
      <style>${EMAIL_STYLES}</style>
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
          
          <div style="margin-top: 30px; border-top: 1px solid #eee; padding-top: 20px; font-size: 12px; color: #999;">
            <p>If the button above doesn't work, copy and paste this link into your browser:<br>${resetUrl}</p>
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
      <style>${EMAIL_STYLES}
        .otp-box { border-color: #00A86B; color: #00A86B; background: #00A86B0D; }
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
          
          <div class="info-box" style="border-left-color: #00A86B;">
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
      <style>${EMAIL_STYLES}
        .otp-box { border-color: #1E40AF; color: #1E40AF; background: #1E40AF0D; }
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
          
          <div class="info-box" style="border-left-color: #1E40AF;">
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
      <style>${EMAIL_STYLES}
        .header { border-bottom: 2px solid #DC2626; }
        .otp-box { border-color: #DC2626; color: #DC2626; background: #DC26260D; }
        .warning-box { background-color: #FEF2F2; border: 1px solid #DC2626; padding: 16px; border-radius: 6px; font-size: 14px; color: #991B1B; margin-bottom: 20px; }
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

  // Generate Admin HTML
  const getAdminHtml = () => `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <style>${EMAIL_STYLES}
         .btn { background-color: #00A86B; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <img src="${COMPANY_LOGO}" alt="Tree Campus" class="logo">
          <div class="admin-label">Admin Notification</div>
        </div>
        <div class="content">
          <div class="greeting">New Volunteer Application</div>
          <p class="text">A new volunteer application has been submitted and is pending review.</p>
          
          <table class="data-table">
            <tr>
              <td class="data-label">Name</td>
              <td>${userName}</td>
            </tr>
            <tr>
              <td class="data-label">Email</td>
              <td><a href="mailto:${userEmail}" style="color: #00A86B; text-decoration: none;">${userEmail}</a></td>
            </tr>
            <tr>
              <td class="data-label">Date</td>
              <td>${new Date().toLocaleDateString()}</td>
            </tr>
          </table>

          <center>
            <a href="${process.env.FRONTEND_URL}/admin/volunteers" class="btn">Review Application</a>
          </center>
        </div>
        <div class="footer">
          <p>&copy; ${new Date().getFullYear()} Tree Campus Admin System</p>
        </div>
      </div>
    </body>
    </html>
  `;

  // User HTML
  const userHtml = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <style>${EMAIL_STYLES}
        .status-box { background-color: #f0fff4; border-left: 4px solid #00A86B; padding: 20px; border-radius: 4px; color: #2d3748; margin: 24px 0; }
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
    await sendEmail({ to: adminEmail, subject: `[ADMIN] ${subject}`, html: getAdminHtml() });
  }
};

/**
 * Send school registration confirmation
 */
const sendSchoolRegistrationConfirmation = async (schoolEmail, schoolName, contactName, schoolDetails = {}) => {
  const adminEmail = process.env.ADMIN_EMAIL;
  const subject = '🏫 Welcome to Tree Campus School Partnership Program!';

  // Admin HTML
  const getAdminHtml = () => `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <style>${EMAIL_STYLES}
        .btn { background-color: #1E40AF; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <img src="${COMPANY_LOGO}" alt="Tree Campus" class="logo">
          <div class="admin-label">Admin Notification</div>
        </div>
        <div class="content">
          <div class="greeting">New School Registration</div>
          <p class="text">A new school has successfully identified and registered with the platform.</p>
          
          <table class="data-table">
            <tr>
              <td class="data-label">School Name</td>
              <td>${schoolName}</td>
            </tr>
            <tr>
              <td class="data-label">Contact Person</td>
              <td>${contactName}</td>
            </tr>
            <tr>
              <td class="data-label">Email</td>
              <td><a href="mailto:${schoolEmail}" style="color: #1E40AF; text-decoration: none;">${schoolEmail}</a></td>
            </tr>
            <tr>
              <td class="data-label">Date</td>
              <td>${new Date().toLocaleDateString()}</td>
            </tr>
          </table>

          <center>
            <a href="${process.env.FRONTEND_URL}/admin/schools" class="btn">View Details</a>
          </center>
        </div>
        <div class="footer">
          <p>&copy; ${new Date().getFullYear()} Tree Campus Admin System</p>
        </div>
      </div>
    </body>
    </html>
  `;

  const userHtml = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <style>${EMAIL_STYLES}
        .status-box { background-color: #eff6ff; border-left: 4px solid #1E40AF; padding: 20px; border-radius: 4px; color: #2d3748; margin: 24px 0; }
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
    await sendEmail({ to: adminEmail, subject: `[ADMIN] ${subject}`, html: getAdminHtml() });
  }
};

/**
 * Send account deletion confirmation
 */
const sendAccountDeletionConfirmation = async (userEmail, userName, deletionDetails = {}) => {
  const adminEmail = process.env.ADMIN_EMAIL;
  const subject = '⚠️ Account Deletion Request Received';

  // Admin HTML
  const getAdminHtml = () => `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <style>${EMAIL_STYLES}
        .greeting { color: #DC2626; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <img src="${COMPANY_LOGO}" alt="Tree Campus" class="logo">
          <div class="admin-label">Admin Notification</div>
        </div>
        <div class="content">
          <div class="greeting">Account Deletion Request</div>
          <p class="text">A user has confirmed their request for account deletion.</p>
          
          <table class="data-table">
            <tr>
              <td class="data-label">User Name</td>
              <td>${userName}</td>
            </tr>
            <tr>
              <td class="data-label">Email</td>
              <td>${userEmail}</td>
            </tr>
            <tr>
              <td class="data-label">Status</td>
              <td style="color: #DC2626; font-weight: bold;">Pending Deletion (30 Days)</td>
            </tr>
            <tr>
              <td class="data-label">Request Date</td>
              <td>${new Date().toLocaleDateString()}</td>
            </tr>
          </table>
        </div>
        <div class="footer">
          <p>&copy; ${new Date().getFullYear()} Tree Campus Admin System</p>
        </div>
      </div>
    </body>
    </html>
  `;

  const userHtml = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <style>${EMAIL_STYLES}
        .header { border-bottom: 2px solid #DC2626; }
        .warning-box { background-color: #FEF2F2; border: 1px solid #DC2626; padding: 20px; border-radius: 6px; margin: 24px 0; }
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
    await sendEmail({ to: adminEmail, subject: `[ADMIN] ${subject}`, html: getAdminHtml() });
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

  // Admin HTML
  const getAdminHtml = () => `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <style>${EMAIL_STYLES}</style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <img src="${COMPANY_LOGO}" alt="Tree Campus" class="logo">
          <div class="admin-label">Admin Notification</div>
        </div>
        <div class="content">
          <div class="greeting">Assignment Submission</div>
          <p class="text">A student has completed an assignment.</p>
          
          <table class="data-table">
            <tr>
              <td class="data-label">Student Name</td>
              <td>${userName}</td>
            </tr>
            <tr>
              <td class="data-label">Course</td>
              <td>${courseTitle}</td>
            </tr>
            <tr>
              <td class="data-label">Score</td>
              <td style="font-weight: bold; font-size: 16px;">${score}%</td>
            </tr>
            <tr>
              <td class="data-label">Result</td>
              <td style="color: ${statusColor}; font-weight: bold;">${passed ? 'PASSED' : 'FAILED'}</td>
            </tr>
          </table>
        </div>
        <div class="footer">
          <p>&copy; ${new Date().getFullYear()} Tree Campus Admin System</p>
        </div>
      </div>
    </body>
    </html>
  `;

  const userHtml = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <style>${EMAIL_STYLES}
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
          
          <table class="data-table">
            <tr>
              <td class="data-label">Course</td>
              <td>${courseTitle}</td>
            </tr>
            <tr>
              <td class="data-label">Status</td>
              <td style="color: ${statusColor}; font-weight: bold;">${passed ? 'Passed' : 'Failed'}</td>
            </tr>
            <tr>
              <td class="data-label">Passing Score</td>
              <td>${passingScore || 60}%</td>
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
    sendEmail({
      to: adminEmail,
      subject: `[ADMIN] Assignment Result: ${userName}`,
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
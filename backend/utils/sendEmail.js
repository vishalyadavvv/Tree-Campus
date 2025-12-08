import brevo from '@getbrevo/brevo';

// Initialize Brevo API
if (!process.env.BREVO_API_KEY) {
  console.error('❌ CRITICAL: BREVO_API_KEY is not set!');
  throw new Error('BREVO_API_KEY is required');
}

const apiInstance = new brevo.TransactionalEmailsApi();
apiInstance.setApiKey(
  brevo.TransactionalEmailsApiApiKeys.apiKey,
  process.env.BREVO_API_KEY
);

const SENDER_EMAIL = process.env.SENDER_EMAIL || 'noreply@treecampus.com';
const SENDER_NAME = 'Tree Campus';

/**
 * Send email using Brevo
 */
const sendEmail = async (options) => {
  try {
    const sendSmtpEmail = new brevo.SendSmtpEmail();
    
    sendSmtpEmail.subject = options.subject;
    sendSmtpEmail.htmlContent = options.html;
    sendSmtpEmail.sender = { name: SENDER_NAME, email: SENDER_EMAIL };
    sendSmtpEmail.to = [{ email: options.to }];
    if (options.text) sendSmtpEmail.textContent = options.text;
    
    const data = await apiInstance.sendTransacEmail(sendSmtpEmail);
    console.log('✅ Email sent via Brevo:', data.messageId);
    return data;
  } catch (error) {
    console.error('❌ Brevo error:', error);
    throw new Error('Failed to send email: ' + error.message);
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
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
        .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
        .otp-box { background: white; border: 2px dashed #667eea; padding: 20px; text-align: center; font-size: 32px; font-weight: bold; letter-spacing: 5px; margin: 20px 0; border-radius: 5px; }
        .footer { text-align: center; margin-top: 20px; color: #666; font-size: 12px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>🌳 Tree Campus</h1>
        </div>
        <div class="content">
          <h2>Hello ${name}!</h2>
          <p>Thank you for signing up with Tree Campus. Please use the following OTP to verify your account:</p>
          <div class="otp-box">${otp}</div>
          <p>This OTP will expire in 10 minutes.</p>
          <p>If you didn't request this, please ignore this email.</p>
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
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
        .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
        .button { display: inline-block; background: #667eea; color: white; padding: 15px 30px; text-decoration: none; border-radius: 5px; margin: 20px 0; }
        .footer { text-align: center; margin-top: 20px; color: #666; font-size: 12px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>🌳 Tree Campus</h1>
        </div>
        <div class="content">
          <h2>Hello ${name}!</h2>
          <p>You requested to reset your password. Click the button below to reset it:</p>
          <a href="${resetUrl}" class="button">Reset Password</a>
          <p>This link will expire in 1 hour.</p>
          <p>If you didn't request this, please ignore this email.</p>
          <p style="color: #666; font-size: 12px; margin-top: 20px;">Or copy this link: ${resetUrl}</p>
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
  const subject = 'Verify Your Volunteer Registration - Tree Campus';
  
  const detailsHTML = `
    ${details.phone ? `<div class="detail-row"><div class="detail-label">Phone:</div><div class="detail-value">${details.phone}</div></div>` : ''}
    ${details.address ? `<div class="detail-row"><div class="detail-label">Address:</div><div class="detail-value">${details.address}</div></div>` : ''}
    ${details.motivation ? `<div class="detail-row"><div class="detail-label">Motivation:</div><div class="detail-value">${details.motivation}</div></div>` : ''}
  `;

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #00a86b 0%, #228b22 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
        .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
        .otp-box { background: white; border: 2px dashed #00a86b; padding: 20px; text-align: center; font-size: 32px; font-weight: bold; letter-spacing: 5px; margin: 20px 0; border-radius: 5px; }
        .details-box { background: white; border: 1px solid #00a86b; padding: 20px; margin: 20px 0; border-radius: 5px; }
        .detail-row { display: flex; margin: 10px 0; }
        .detail-label { font-weight: bold; color: #00a86b; width: 120px; }
        .detail-value { color: #333; }
        .footer { text-align: center; margin-top: 20px; color: #666; font-size: 12px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>🌳 Tree Campus - Volunteer Program</h1>
        </div>
        <div class="content">
          <h2>Welcome, ${name}!</h2>
          <p>Thank you for your interest in volunteering with Tree Campus.</p>
          
          <div class="details-box">
            <div class="detail-row">
              <div class="detail-label">Name:</div>
              <div class="detail-value">${name}</div>
            </div>
            <div class="detail-row">
              <div class="detail-label">Email:</div>
              <div class="detail-value">${email}</div>
            </div>
            ${detailsHTML}
          </div>

          <p><strong>Please verify your email using the OTP below:</strong></p>
          <div class="otp-box">${otp}</div>
          <p style="color: #666; font-size: 12px;">This OTP will expire in 10 minutes.</p>
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
 * Send OTP for School Registration
 */
const sendSchoolOTPEmail = async (email, schoolName, contactName, otp, details = {}) => {
  const subject = 'Verify School Registration - Tree Campus';
  
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #1e40af 0%, #1e3a8a 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
        .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
        .otp-box { background: white; border: 2px dashed #1e40af; padding: 20px; text-align: center; font-size: 32px; font-weight: bold; letter-spacing: 5px; margin: 20px 0; border-radius: 5px; }
        .details-box { background: white; border: 1px solid #1e40af; padding: 20px; margin: 20px 0; border-radius: 5px; }
        .section-title { font-weight: bold; color: #1e40af; margin-top: 15px; margin-bottom: 10px; border-bottom: 1px solid #1e40af; padding-bottom: 5px; }
        .footer { text-align: center; margin-top: 20px; color: #666; font-size: 12px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>🏫 Tree Campus - School Partnership</h1>
        </div>
        <div class="content">
          <h2>Hello ${contactName}!</h2>
          <p>Thank you for registering <strong>${schoolName}</strong> with Tree Campus.</p>
          
          <div class="details-box">
            <div class="section-title">School Information</div>
            <p><strong>School Name:</strong> ${schoolName}</p>
            ${details.schoolAddress ? `<p><strong>Address:</strong> ${details.schoolAddress}</p>` : ''}
            
            <div class="section-title">Contact Person</div>
            <p><strong>Name:</strong> ${contactName}</p>
            <p><strong>Email:</strong> ${email}</p>
          </div>

          <p><strong>Please verify your email using the OTP below:</strong></p>
          <div class="otp-box">${otp}</div>
          <p style="color: #666; font-size: 12px;">This OTP will expire in 10 minutes.</p>
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
 * Send OTP for Account Deletion
 */
const sendAccountDeletionOTPEmail = async (email, name, otp, details = {}) => {
  const subject = 'Verify Account Deletion Request - Tree Campus';
  
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #dc2626 0%, #991b1b 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
        .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
        .warning { background: #fee; border-left: 4px solid #dc2626; padding: 15px; margin: 15px 0; border-radius: 5px; }
        .otp-box { background: white; border: 2px dashed #dc2626; padding: 20px; text-align: center; font-size: 32px; font-weight: bold; letter-spacing: 5px; margin: 20px 0; border-radius: 5px; }
        .footer { text-align: center; margin-top: 20px; color: #666; font-size: 12px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>⚠️ Account Deletion Verification</h1>
        </div>
        <div class="content">
          <h2>Hello ${name},</h2>
          <div class="warning">
            <strong>Important:</strong> You have requested to delete your Tree Campus account.
          </div>
          <p><strong>To confirm deletion, use the OTP below:</strong></p>
          <div class="otp-box">${otp}</div>
          <p style="color: #666; font-size: 12px;">This OTP will expire in 10 minutes.</p>
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
 * Send volunteer confirmation
 */
const sendVolunteerConfirmation = async (userEmail, userName, volunteerDetails = {}) => {
  const adminEmail = process.env.ADMIN_EMAIL;
  const subject = 'Volunteer Application Received - Tree Campus';

  const userHtml = `
    <html>
      <body style="font-family: Arial, sans-serif;">
        <div style="max-width: 650px; margin: 20px auto; background: #fff; border-radius: 10px; overflow: hidden;">
          <div style="background: linear-gradient(135deg, #4CAF50 0%, #45a049 100%); color: white; padding: 40px 20px; text-align: center;">
            <h1>🌱 Application Received</h1>
          </div>
          <div style="padding: 40px 30px;">
            <p>Dear <strong>${userName}</strong>,</p>
            <p>Thank you for submitting your volunteer application!</p>
            <p>Best regards,<br><strong>Tree Campus Team</strong></p>
          </div>
        </div>
      </body>
    </html>
  `;

  await sendEmail({ to: userEmail, subject, html: userHtml });
  
  if (adminEmail) {
    const adminHtml = `<html><body><h1>New Volunteer Application</h1><p><strong>Name:</strong> ${userName}</p><p><strong>Email:</strong> ${userEmail}</p></body></html>`;
    await sendEmail({ to: adminEmail, subject: `[ADMIN] ${subject}`, html: adminHtml });
  }
};

/**
 * Send school registration confirmation
 */
const sendSchoolRegistrationConfirmation = async (schoolEmail, schoolName, contactName, schoolDetails = {}) => {
  const adminEmail = process.env.ADMIN_EMAIL;
  const subject = 'School Registration Received - Tree Campus';

  const userHtml = `
    <html>
      <body style="font-family: Arial, sans-serif;">
        <div style="max-width: 650px; margin: 20px auto; background: #fff;">
          <div style="background: #4CAF50; color: white; padding: 40px 20px; text-align: center;">
            <h1>🏫 School Registration Received</h1>
          </div>
          <div style="padding: 40px 30px;">
            <p>Dear <strong>${contactName}</strong>,</p>
            <p>Thank you for registering ${schoolName} with Tree Campus!</p>
          </div>
        </div>
      </body>
    </html>
  `;

  await sendEmail({ to: schoolEmail, subject, html: userHtml });
  
  if (adminEmail) {
    const adminHtml = `<html><body><h1>New School Registration</h1><p><strong>School:</strong> ${schoolName}</p><p><strong>Contact:</strong> ${contactName}</p></body></html>`;
    await sendEmail({ to: adminEmail, subject: `[ADMIN] ${subject}`, html: adminHtml });
  }
};

/**
 * Send account deletion confirmation
 */
const sendAccountDeletionConfirmation = async (userEmail, userName, deletionDetails = {}) => {
  const adminEmail = process.env.ADMIN_EMAIL;
  const subject = 'Account Deletion Request Received - Tree Campus';

  const userHtml = `
    <html>
      <body>
        <div style="max-width: 650px; margin: 20px auto; background: #fff;">
          <div style="background: #d32f2f; color: white; padding: 40px 20px; text-align: center;">
            <h1>🚨 Account Deletion Request</h1>
          </div>
          <div style="padding: 40px 30px;">
            <p>Dear <strong>${userName}</strong>,</p>
            <p>Your account will be permanently deleted within 30 days.</p>
          </div>
        </div>
      </body>
    </html>
  `;

  await sendEmail({ to: userEmail, subject, html: userHtml });
  
  if (adminEmail) {
    const adminHtml = `<html><body><h1>Account Deletion Request</h1><p><strong>User:</strong> ${userName}</p><p><strong>Email:</strong> ${userEmail}</p></body></html>`;
    await sendEmail({ to: adminEmail, subject: `[ADMIN] ${subject}`, html: adminHtml });
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
import nodemailer from 'nodemailer';

// Create transporter with proper error handling
const transporter = nodemailer.createTransport({
  service: 'gmail', // Use Gmail service
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

// Verify transporter configuration on startup
transporter.verify(function (error, success) {
  if (error) {
    console.error('❌ Email transporter configuration error:', error);
  } else {
    console.log('✅ Email server is ready to send messages');
  }
});

/**
 * Send email
 * @param {object} options - Email options
 * @param {string} options.to - Recipient email
 * @param {string} options.subject - Email subject
 * @param {string} options.text - Plain text content
 * @param {string} options.html - HTML content
 */
const sendEmail = async (options) => {
  try {
    const mailOptions = {
      from: `"Tree Campus" <${process.env.SMTP_USER}>`,
      to: options.to,
      subject: options.subject,
      text: options.text,
      html: options.html,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('✅ Email sent:', info.messageId);
    return info;
  } catch (error) {
    console.error('❌ Error sending email:', error.message);
    throw new Error('Failed to send email: ' + error.message);
  }
};

/**
 * Send OTP email
 * @param {string} email - Recipient email
 * @param {string} name - Recipient name
 * @param {string} otp - OTP code
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
 * @param {string} email - Recipient email
 * @param {string} name - Recipient name
 * @param {string} resetToken - Reset token
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
 * @param {string} email - Recipient email
 * @param {string} name - Recipient name
 * @param {string} otp - OTP code
 * @param {object} details - Volunteer details (phone, address, motivation)
 */
const sendVolunteerOTPEmail = async (email, name, otp, details = {}) => {
  const subject = 'Verify Your Volunteer Registration - Tree Campus';
  console.log('📧 Sending volunteer email with details:', { name, email, phone: details.phone, address: details.address, motivation: details.motivation });
  
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
          <p>Thank you for your interest in volunteering with Tree Campus. Here are your submitted details:</p>
          
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
 * Send OTP for School Registration
 * @param {string} email - Recipient email
 * @param {string} schoolName - School name
 * @param {string} contactName - Contact person name
 * @param {string} otp - OTP code
 * @param {object} details - School details
 */
const sendSchoolOTPEmail = async (email, schoolName, contactName, otp, details = {}) => {
  const subject = 'Verify School Registration - Tree Campus';
  console.log('📧 Sending school email with details:', { schoolName, email, schoolPhone: details.schoolPhone, schoolAddress: details.schoolAddress });
  
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
        .detail-row { display: flex; margin: 10px 0; }
        .detail-label { font-weight: bold; color: #1e40af; width: 150px; }
        .detail-value { color: #333; }
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
          <p>Thank you for registering <strong>${schoolName}</strong> with Tree Campus. Here are your submitted details:</p>
          
          <div class="details-box">
            <div class="section-title">School Information</div>
            <div class="detail-row">
              <div class="detail-label">School Name:</div>
              <div class="detail-value">${schoolName}</div>
            </div>
            ${details.schoolAddress ? `<div class="detail-row"><div class="detail-label">Address:</div><div class="detail-value">${details.schoolAddress}</div></div>` : ''}
            ${details.schoolPhone ? `<div class="detail-row"><div class="detail-label">Phone:</div><div class="detail-value">${details.schoolPhone}</div></div>` : ''}
            ${details.schoolEmail ? `<div class="detail-row"><div class="detail-label">School Email:</div><div class="detail-value">${details.schoolEmail}</div></div>` : ''}

            <div class="section-title">Contact Person</div>
            <div class="detail-row">
              <div class="detail-label">Name:</div>
              <div class="detail-value">${contactName}</div>
            </div>
            <div class="detail-row">
              <div class="detail-label">Email:</div>
              <div class="detail-value">${email}</div>
            </div>
            ${details.contactPersonPhone ? `<div class="detail-row"><div class="detail-label">Phone:</div><div class="detail-value">${details.contactPersonPhone}</div></div>` : ''}
          </div>

          <p><strong>Please verify your email using the OTP below:</strong></p>
          <div class="otp-box">${otp}</div>
          <p style="color: #666; font-size: 12px;">This OTP will expire in 10 minutes.</p>
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
 * Send OTP for Account Deletion Verification
 * @param {string} email - Recipient email
 * @param {string} name - Recipient name
 * @param {string} otp - OTP code
 * @param {object} details - Deletion request details
 */
const sendAccountDeletionOTPEmail = async (email, name, otp, details = {}) => {
  const subject = 'Verify Account Deletion Request - Tree Campus';
  console.log('📧 Sending deletion email with details:', { name, email, phone: details.phone, reason: details.reason });
  
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
        .details-box { background: white; border: 1px solid #dc2626; padding: 20px; margin: 20px 0; border-radius: 5px; }
        .detail-row { display: flex; margin: 10px 0; }
        .detail-label { font-weight: bold; color: #dc2626; width: 120px; }
        .detail-value { color: #333; }
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
            <strong>Important:</strong> You have requested to delete your Tree Campus account. This action is irreversible and all your data will be permanently removed.
          </div>

          <p><strong>Request Details:</strong></p>
          <div class="details-box">
            <div class="detail-row">
              <div class="detail-label">Name:</div>
              <div class="detail-value">${name}</div>
            </div>
            <div class="detail-row">
              <div class="detail-label">Email:</div>
              <div class="detail-value">${email}</div>
            </div>
            ${details.phone ? `<div class="detail-row"><div class="detail-label">Phone:</div><div class="detail-value">${details.phone}</div></div>` : ''}
            ${details.reason ? `<div class="detail-row"><div class="detail-label">Reason:</div><div class="detail-value">${details.reason}</div></div>` : ''}
          </div>

          <p><strong>To confirm your account deletion, please use the OTP below:</strong></p>
          <div class="otp-box">${otp}</div>
          <p style="color: #666; font-size: 12px;">This OTP will expire in 10 minutes.</p>
          <p>If you didn't request this, please ignore this email and your account will remain active.</p>
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

export {
  sendEmail,
  sendOTPEmail,
  sendPasswordResetEmail,
  sendVolunteerOTPEmail,
  sendSchoolOTPEmail,
  sendAccountDeletionOTPEmail,
};
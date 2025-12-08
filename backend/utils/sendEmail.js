import nodemailer from 'nodemailer';

// Create transporter with proper error handling
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.gmail.com',
  port: parseInt(process.env.SMTP_PORT || '465'),
  secure: false, // Use TLS (not SSL)
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
  connectionTimeout: 10000,
  socketTimeout: 10000,
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

/**
 * Send volunteer submission confirmation to user and admin
 */
const sendVolunteerConfirmation = async (userEmail, userName, volunteerDetails = {}) => {
  const adminEmail = process.env.SMTP_USER;
  const subject = 'Volunteer Application Received - Tree Campus';
  const logoUrl = 'https://res.cloudinary.com/dbbll23jz/image/upload/v1765170258/tree_logo_ek4uw3.png';

  const userHtml = `
    <html>
      <head>
        <style>
          body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; margin: 0; padding: 0; background-color: #f5f5f5; }
          .container { max-width: 650px; margin: 20px auto; background-color: #ffffff; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); overflow: hidden; }
          .header { background: linear-gradient(135deg, #4CAF50 0%, #45a049 100%); color: white; padding: 40px 20px; text-align: center; }
          .header img { height: 60px; margin-bottom: 15px; }
          .header h1 { margin: 0; font-size: 24px; font-weight: 600; }
          .content { padding: 40px 30px; }
          .content p { margin: 15px 0; line-height: 1.6; color: #333; font-size: 15px; }
          .details-box { background-color: #f9f9f9; border-left: 4px solid #4CAF50; padding: 20px; margin: 25px 0; border-radius: 5px; }
          .details-box h3 { margin: 0 0 15px 0; color: #4CAF50; font-size: 16px; }
          .detail-row { margin: 10px 0; padding: 8px 0; border-bottom: 1px solid #eee; }
          .detail-row:last-child { border-bottom: none; }
          .detail-label { font-weight: 600; color: #555; display: inline-block; width: 120px; }
          .detail-value { color: #333; }
          .footer { background-color: #f5f5f5; padding: 20px; text-align: center; border-top: 1px solid #ddd; font-size: 12px; color: #666; }
          .footer p { margin: 5px 0; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <img src="${logoUrl}" alt="Tree Campus Logo">
            <h1>🌱 Volunteer Application Received</h1>
          </div>
          
          <div class="content">
            <p>Dear <strong>${userName}</strong>,</p>
            
            <p>Thank you for submitting your volunteer application to Tree Campus! We're excited to learn more about your passion for education and community service.</p>
            
            <p>We have successfully received your application and details. Our team will review your submission and get back to you within 3-5 business days.</p>
            
            <div class="details-box">
              <h3>📋 Application Details:</h3>
              <div class="detail-row">
                <span class="detail-label">Name:</span>
                <span class="detail-value">${volunteerDetails.name || 'N/A'}</span>
              </div>
              <div class="detail-row">
                <span class="detail-label">Email:</span>
                <span class="detail-value">${volunteerDetails.email || 'N/A'}</span>
              </div>
              <div class="detail-row">
                <span class="detail-label">Phone:</span>
                <span class="detail-value">${volunteerDetails.phone || 'N/A'}</span>
              </div>
              <div class="detail-row">
                <span class="detail-label">Address:</span>
                <span class="detail-value">${volunteerDetails.address || 'N/A'}</span>
              </div>
              <div class="detail-row">
                <span class="detail-label">Motivation:</span>
                <span class="detail-value">${volunteerDetails.motivation || 'N/A'}</span>
              </div>
            </div>
            
            <p>If you have any questions, feel free to reach out to us. We look forward to hearing from you!</p>
            
            <p>Best regards,<br><strong>Tree Campus Team</strong></p>
          </div>
          
          <div class="footer">
            <p>&copy; ${new Date().getFullYear()} Tree Campus. All rights reserved.</p>
            <p>Empowering Education, Inspiring Change</p>
          </div>
        </div>
      </body>
    </html>
  `;

  const adminHtml = `
    <html>
      <head>
        <style>
          body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; margin: 0; padding: 0; background-color: #f5f5f5; }
          .container { max-width: 650px; margin: 20px auto; background-color: #ffffff; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); overflow: hidden; }
          .header { background: linear-gradient(135deg, #FF9800 0%, #FB8C00 100%); color: white; padding: 40px 20px; text-align: center; }
          .header img { height: 60px; margin-bottom: 15px; }
          .header h1 { margin: 0; font-size: 24px; font-weight: 600; }
          .content { padding: 40px 30px; }
          .content p { margin: 15px 0; line-height: 1.6; color: #333; font-size: 15px; }
          .alert-box { background-color: #fff3e0; border-left: 4px solid #FF9800; padding: 15px; margin: 20px 0; border-radius: 5px; }
          .alert-box strong { color: #FF9800; }
          .details-box { background-color: #f9f9f9; border-left: 4px solid #FF9800; padding: 20px; margin: 25px 0; border-radius: 5px; }
          .details-box h3 { margin: 0 0 15px 0; color: #FF9800; font-size: 16px; }
          .detail-row { margin: 10px 0; padding: 8px 0; border-bottom: 1px solid #eee; }
          .detail-row:last-child { border-bottom: none; }
          .detail-label { font-weight: 600; color: #555; display: inline-block; width: 120px; }
          .detail-value { color: #333; }
          .action-btn { display: inline-block; background-color: #FF9800; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; margin: 15px 0; }
          .footer { background-color: #f5f5f5; padding: 20px; text-align: center; border-top: 1px solid #ddd; font-size: 12px; color: #666; }
          .footer p { margin: 5px 0; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <img src="${logoUrl}" alt="Tree Campus Logo">
            <h1>🌱 New Volunteer Application</h1>
          </div>
          
          <div class="content">
            <div class="alert-box">
              <strong>⚡ New Action Required:</strong> A volunteer application has been submitted and is awaiting your review.
            </div>
            
            <p>A new volunteer has applied to Tree Campus. Please review the details below and take appropriate action.</p>
            
            <div class="details-box">
              <h3>👤 Applicant Details:</h3>
              <div class="detail-row">
                <span class="detail-label">Name:</span>
                <span class="detail-value">${volunteerDetails.name || 'N/A'}</span>
              </div>
              <div class="detail-row">
                <span class="detail-label">Email:</span>
                <span class="detail-value">${volunteerDetails.email || 'N/A'}</span>
              </div>
              <div class="detail-row">
                <span class="detail-label">Phone:</span>
                <span class="detail-value">${volunteerDetails.phone || 'N/A'}</span>
              </div>
              <div class="detail-row">
                <span class="detail-label">Address:</span>
                <span class="detail-value">${volunteerDetails.address || 'N/A'}</span>
              </div>
              <div class="detail-row">
                <span class="detail-label">Motivation:</span>
                <span class="detail-value">${volunteerDetails.motivation || 'N/A'}</span>
              </div>
            </div>
            
            <p>Please review this application and send a response to the applicant.</p>
          </div>
          
          <div class="footer">
            <p>&copy; ${new Date().getFullYear()} Tree Campus Admin Panel</p>
            <p>Empowering Education, Inspiring Change</p>
          </div>
        </div>
      </body>
    </html>
  `;

  // Send to user
  await sendEmail({ to: userEmail, subject, html: userHtml });
  
  // Send to admin
  await sendEmail({ to: adminEmail, subject: `[ADMIN] ${subject}`, html: adminHtml });
};

/**
 * Send school registration confirmation to user and admin
 */
const sendSchoolRegistrationConfirmation = async (schoolEmail, schoolName, contactName, schoolDetails = {}) => {
  const adminEmail = process.env.SMTP_USER;
  const subject = 'School Registration Received - Tree Campus';
  const logoUrl = 'https://res.cloudinary.com/dbbll23jz/image/upload/v1765170258/tree_logo_ek4uw3.png';

  const userHtml = `
    <html>
      <head>
        <style>
          body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; margin: 0; padding: 0; background-color: #f5f5f5; }
          .container { max-width: 650px; margin: 20px auto; background-color: #ffffff; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); overflow: hidden; }
          .header { background: linear-gradient(135deg, #4CAF50 0%, #45a049 100%); color: white; padding: 40px 20px; text-align: center; }
          .header img { height: 60px; margin-bottom: 15px; }
          .header h1 { margin: 0; font-size: 24px; font-weight: 600; }
          .content { padding: 40px 30px; }
          .content p { margin: 15px 0; line-height: 1.6; color: #333; font-size: 15px; }
          .details-box { background-color: #f9f9f9; border-left: 4px solid #4CAF50; padding: 20px; margin: 25px 0; border-radius: 5px; }
          .details-box h3 { margin: 0 0 15px 0; color: #4CAF50; font-size: 16px; }
          .detail-row { margin: 10px 0; padding: 8px 0; border-bottom: 1px solid #eee; }
          .detail-row:last-child { border-bottom: none; }
          .detail-label { font-weight: 600; color: #555; display: inline-block; width: 140px; }
          .detail-value { color: #333; }
          .footer { background-color: #f5f5f5; padding: 20px; text-align: center; border-top: 1px solid #ddd; font-size: 12px; color: #666; }
          .footer p { margin: 5px 0; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <img src="${logoUrl}" alt="Tree Campus Logo">
            <h1>🏫 School Registration Received</h1>
          </div>
          
          <div class="content">
            <p>Dear <strong>${contactName}</strong>,</p>
            
            <p>Thank you for registering your school with Tree Campus! We're thrilled to partner with ${schoolName} in our mission to transform education.</p>
            
            <p>We have successfully received your registration. Our team will verify your school details and reach out within 3-5 business days to provide you with access and next steps.</p>
            
            <div class="details-box">
              <h3>🏢 School Registration Details:</h3>
              <div class="detail-row">
                <span class="detail-label">School Name:</span>
                <span class="detail-value">${schoolName || 'N/A'}</span>
              </div>
              <div class="detail-row">
                <span class="detail-label">School Email:</span>
                <span class="detail-value">${schoolDetails.schoolEmail || 'N/A'}</span>
              </div>
              <div class="detail-row">
                <span class="detail-label">School Address:</span>
                <span class="detail-value">${schoolDetails.schoolAddress || 'N/A'}</span>
              </div>
              <div class="detail-row">
                <span class="detail-label">School Phone:</span>
                <span class="detail-value">${schoolDetails.schoolPhone || 'N/A'}</span>
              </div>
              <div class="detail-row">
                <span class="detail-label">Contact Person:</span>
                <span class="detail-value">${contactName || 'N/A'}</span>
              </div>
              <div class="detail-row">
                <span class="detail-label">Contact Email:</span>
                <span class="detail-value">${schoolDetails.contactPersonEmail || 'N/A'}</span>
              </div>
            </div>
            
            <p>If you have any questions before we contact you, please don't hesitate to reach out.</p>
            
            <p>Best regards,<br><strong>Tree Campus Team</strong></p>
          </div>
          
          <div class="footer">
            <p>&copy; ${new Date().getFullYear()} Tree Campus. All rights reserved.</p>
            <p>Empowering Education, Inspiring Change</p>
          </div>
        </div>
      </body>
    </html>
  `;

  const adminHtml = `
    <html>
      <head>
        <style>
          body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; margin: 0; padding: 0; background-color: #f5f5f5; }
          .container { max-width: 650px; margin: 20px auto; background-color: #ffffff; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); overflow: hidden; }
          .header { background: linear-gradient(135deg, #FF9800 0%, #FB8C00 100%); color: white; padding: 40px 20px; text-align: center; }
          .header img { height: 60px; margin-bottom: 15px; }
          .header h1 { margin: 0; font-size: 24px; font-weight: 600; }
          .content { padding: 40px 30px; }
          .content p { margin: 15px 0; line-height: 1.6; color: #333; font-size: 15px; }
          .alert-box { background-color: #fff3e0; border-left: 4px solid #FF9800; padding: 15px; margin: 20px 0; border-radius: 5px; }
          .alert-box strong { color: #FF9800; }
          .details-box { background-color: #f9f9f9; border-left: 4px solid #FF9800; padding: 20px; margin: 25px 0; border-radius: 5px; }
          .details-box h3 { margin: 0 0 15px 0; color: #FF9800; font-size: 16px; }
          .detail-row { margin: 10px 0; padding: 8px 0; border-bottom: 1px solid #eee; }
          .detail-row:last-child { border-bottom: none; }
          .detail-label { font-weight: 600; color: #555; display: inline-block; width: 140px; }
          .detail-value { color: #333; }
          .footer { background-color: #f5f5f5; padding: 20px; text-align: center; border-top: 1px solid #ddd; font-size: 12px; color: #666; }
          .footer p { margin: 5px 0; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <img src="${logoUrl}" alt="Tree Campus Logo">
            <h1>🌱 New School Registration</h1>
          </div>
          
          <div class="content">
            <div class="alert-box">
              <strong>⚡ New Action Required:</strong> A school has registered and is awaiting your verification.
            </div>
            
            <p>A new school has registered with Tree Campus. Please review the details below and verify their information.</p>
            
            <div class="details-box">
              <h3>🏢 School Details:</h3>
              <div class="detail-row">
                <span class="detail-label">School Name:</span>
                <span class="detail-value">${schoolName || 'N/A'}</span>
              </div>
              <div class="detail-row">
                <span class="detail-label">School Email:</span>
                <span class="detail-value">${schoolDetails.schoolEmail || 'N/A'}</span>
              </div>
              <div class="detail-row">
                <span class="detail-label">School Address:</span>
                <span class="detail-value">${schoolDetails.schoolAddress || 'N/A'}</span>
              </div>
              <div class="detail-row">
                <span class="detail-label">School Phone:</span>
                <span class="detail-value">${schoolDetails.schoolPhone || 'N/A'}</span>
              </div>
              <div class="detail-row">
                <span class="detail-label">Contact Person:</span>
                <span class="detail-value">${contactName || 'N/A'}</span>
              </div>
              <div class="detail-row">
                <span class="detail-label">Contact Email:</span>
                <span class="detail-value">${schoolDetails.contactPersonEmail || 'N/A'}</span>
              </div>
              <div class="detail-row">
                <span class="detail-label">Contact Phone:</span>
                <span class="detail-value">${schoolDetails.contactPersonPhone || 'N/A'}</span>
              </div>
            </div>
            
            <p>Please verify this school and send them their login credentials.</p>
          </div>
          
          <div class="footer">
            <p>&copy; ${new Date().getFullYear()} Tree Campus Admin Panel</p>
            <p>Empowering Education, Inspiring Change</p>
          </div>
        </div>
      </body>
    </html>
  `;

  // Send to user
  await sendEmail({ to: schoolEmail, subject, html: userHtml });
  
  // Send to admin
  await sendEmail({ to: adminEmail, subject: `[ADMIN] ${subject}`, html: adminHtml });
};

/**
 * Send account deletion confirmation to user and admin
 */
const sendAccountDeletionConfirmation = async (userEmail, userName, deletionDetails = {}) => {
  const adminEmail = process.env.SMTP_USER;
  const subject = 'Account Deletion Request Received - Tree Campus';
  const logoUrl = 'https://res.cloudinary.com/dbbll23jz/image/upload/v1765170258/tree_logo_ek4uw3.png';

  const userHtml = `
    <html>
      <head>
        <style>
          body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; margin: 0; padding: 0; background-color: #f5f5f5; }
          .container { max-width: 650px; margin: 20px auto; background-color: #ffffff; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); overflow: hidden; }
          .header { background: linear-gradient(135deg, #d32f2f 0%, #c62828 100%); color: white; padding: 40px 20px; text-align: center; }
          .header img { height: 60px; margin-bottom: 15px; filter: brightness(0) invert(1); }
          .header h1 { margin: 0; font-size: 24px; font-weight: 600; }
          .content { padding: 40px 30px; }
          .content p { margin: 15px 0; line-height: 1.6; color: #333; font-size: 15px; }
          .warning-box { background-color: #ffebee; border-left: 4px solid #d32f2f; padding: 20px; margin: 25px 0; border-radius: 5px; }
          .warning-box h3 { margin: 0 0 10px 0; color: #d32f2f; font-size: 16px; }
          .warning-box p { margin: 5px 0; color: #c62828; font-size: 14px; }
          .details-box { background-color: #f9f9f9; border-left: 4px solid #d32f2f; padding: 20px; margin: 25px 0; border-radius: 5px; }
          .details-box h3 { margin: 0 0 15px 0; color: #d32f2f; font-size: 16px; }
          .detail-row { margin: 10px 0; padding: 8px 0; border-bottom: 1px solid #eee; }
          .detail-row:last-child { border-bottom: none; }
          .detail-label { font-weight: 600; color: #555; display: inline-block; width: 120px; }
          .detail-value { color: #333; }
          .footer { background-color: #f5f5f5; padding: 20px; text-align: center; border-top: 1px solid #ddd; font-size: 12px; color: #666; }
          .footer p { margin: 5px 0; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <img src="${logoUrl}" alt="Tree Campus Logo">
            <h1>🚨 Account Deletion Request</h1>
          </div>
          
          <div class="content">
            <p>Dear <strong>${userName}</strong>,</p>
            
            <p>We have received your account deletion request. We understand your decision and respect your choice.</p>
            
            <div class="warning-box">
              <h3>⚠️ Important Notice:</h3>
              <p><strong>Your account will be permanently deleted within 30 days.</strong></p>
              <p>This action cannot be undone. All your data, progress, and achievements will be permanently removed from our system.</p>
            </div>
            
            <div class="details-box">
              <h3>📋 Deletion Request Details:</h3>
              <div class="detail-row">
                <span class="detail-label">Email:</span>
                <span class="detail-value">${deletionDetails.email || 'N/A'}</span>
              </div>
              <div class="detail-row">
                <span class="detail-label">Phone:</span>
                <span class="detail-value">${deletionDetails.phone || 'N/A'}</span>
              </div>
              <div class="detail-row">
                <span class="detail-label">Reason:</span>
                <span class="detail-value">${deletionDetails.reason || 'Not specified'}</span>
              </div>
            </div>
            
            <p>If you have any questions or wish to cancel this request, please contact us immediately at ${process.env.SMTP_USER}.</p>
            
            <p>Thank you for being part of the Tree Campus community.</p>
            
            <p>Best regards,<br><strong>Tree Campus Team</strong></p>
          </div>
          
          <div class="footer">
            <p>&copy; ${new Date().getFullYear()} Tree Campus. All rights reserved.</p>
            <p>Empowering Education, Inspiring Change</p>
          </div>
        </div>
      </body>
    </html>
  `;

  const adminHtml = `
    <html>
      <head>
        <style>
          body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; margin: 0; padding: 0; background-color: #f5f5f5; }
          .container { max-width: 650px; margin: 20px auto; background-color: #ffffff; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); overflow: hidden; }
          .header { background: linear-gradient(135deg, #d32f2f 0%, #c62828 100%); color: white; padding: 40px 20px; text-align: center; }
          .header img { height: 60px; margin-bottom: 15px; filter: brightness(0) invert(1); }
          .header h1 { margin: 0; font-size: 24px; font-weight: 600; }
          .content { padding: 40px 30px; }
          .content p { margin: 15px 0; line-height: 1.6; color: #333; font-size: 15px; }
          .alert-box { background-color: #ffebee; border-left: 4px solid #d32f2f; padding: 15px; margin: 20px 0; border-radius: 5px; }
          .alert-box strong { color: #d32f2f; }
          .details-box { background-color: #f9f9f9; border-left: 4px solid #d32f2f; padding: 20px; margin: 25px 0; border-radius: 5px; }
          .details-box h3 { margin: 0 0 15px 0; color: #d32f2f; font-size: 16px; }
          .detail-row { margin: 10px 0; padding: 8px 0; border-bottom: 1px solid #eee; }
          .detail-row:last-child { border-bottom: none; }
          .detail-label { font-weight: 600; color: #555; display: inline-block; width: 120px; }
          .detail-value { color: #333; }
          .footer { background-color: #f5f5f5; padding: 20px; text-align: center; border-top: 1px solid #ddd; font-size: 12px; color: #666; }
          .footer p { margin: 5px 0; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <img src="${logoUrl}" alt="Tree Campus Logo">
            <h1>🚨 Account Deletion Request</h1>
          </div>
          
          <div class="content">
            <div class="alert-box">
              <strong>⚠️ Alert:</strong> A user has requested account deletion. The account will be permanently deleted in 30 days unless cancelled.
            </div>
            
            <p>A user has submitted an account deletion request. Please review the details below.</p>
            
            <div class="details-box">
              <h3>👤 User Details:</h3>
              <div class="detail-row">
                <span class="detail-label">Name:</span>
                <span class="detail-value">${userName || 'N/A'}</span>
              </div>
              <div class="detail-row">
                <span class="detail-label">Email:</span>
                <span class="detail-value">${deletionDetails.email || 'N/A'}</span>
              </div>
              <div class="detail-row">
                <span class="detail-label">Phone:</span>
                <span class="detail-value">${deletionDetails.phone || 'N/A'}</span>
              </div>
              <div class="detail-row">
                <span class="detail-label">Reason:</span>
                <span class="detail-value">${deletionDetails.reason || 'Not specified'}</span>
              </div>
            </div>
            
            <p>The account will be automatically deleted after 30 days if not cancelled. Consider reaching out to the user to understand their concerns.</p>
          </div>
          
          <div class="footer">
            <p>&copy; ${new Date().getFullYear()} Tree Campus Admin Panel</p>
            <p>Empowering Education, Inspiring Change</p>
          </div>
        </div>
      </body>
    </html>
  `;

  // Send to user
  await sendEmail({ to: userEmail, subject, html: userHtml });
  
  // Send to admin
  await sendEmail({ to: adminEmail, subject: `[ADMIN] ${subject}`, html: adminHtml });
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
import { Resend } from 'resend';

// Initialize Resend with API key
const resend = new Resend(process.env.RESEND_API_KEY);

// Sender email - use your verified domain or Resend's test domain
const SENDER_EMAIL = process.env.SENDER_EMAIL || 'Tree Campus <onboarding@resend.dev>';

/**
 * Send email using Resend
 * @param {object} options - Email options
 * @param {string} options.to - Recipient email
 * @param {string} options.subject - Email subject
 * @param {string} options.text - Plain text content
 * @param {string} options.html - HTML content
 */
const sendEmail = async (options) => {
  try {
    const { data, error } = await resend.emails.send({
      from: SENDER_EMAIL,
      to: [options.to],
      subject: options.subject,
      html: options.html,
      text: options.text,
    });

    if (error) {
      console.error('❌ Error sending email:', error);
      throw new Error('Failed to send email: ' + error.message);
    }

    console.log('✅ Email sent successfully:', data.id);
    return data;
  } catch (error) {
    console.error('❌ Error sending email:', error.message);
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
  console.log('📧 Sending volunteer email:', { name, email });
  
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
  console.log('📧 Sending school email:', { schoolName, email });
  
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
          <p>Thank you for registering <strong>${schoolName}</strong> with Tree Campus.</p>
          
          <div class="details-box">
            <div class="section-title">School Information</div>
            <div class="detail-row">
              <div class="detail-label">School Name:</div>
              <div class="detail-value">${schoolName}</div>
            </div>
            ${details.schoolAddress ? `<div class="detail-row"><div class="detail-label">Address:</div><div class="detail-value">${details.schoolAddress}</div></div>` : ''}
            ${details.schoolPhone ? `<div class="detail-row"><div class="detail-label">Phone:</div><div class="detail-value">${details.schoolPhone}</div></div>` : ''}

            <div class="section-title">Contact Person</div>
            <div class="detail-row">
              <div class="detail-label">Name:</div>
              <div class="detail-value">${contactName}</div>
            </div>
            <div class="detail-row">
              <div class="detail-label">Email:</div>
              <div class="detail-value">${email}</div>
            </div>
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
            <strong>Important:</strong> You have requested to delete your Tree Campus account. This action is irreversible.
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
 * Send volunteer confirmation emails
 */
const sendVolunteerConfirmation = async (userEmail, userName, volunteerDetails = {}) => {
  const adminEmail = process.env.ADMIN_EMAIL;
  const subject = 'Volunteer Application Received - Tree Campus';
  const logoUrl = 'https://res.cloudinary.com/dbbll23jz/image/upload/v1765170258/tree_logo_ek4uw3.png';

  const userHtml = `
    <html>
      <body style="font-family: Arial, sans-serif; margin: 0; padding: 0; background-color: #f5f5f5;">
        <div style="max-width: 650px; margin: 20px auto; background: #fff; border-radius: 10px; overflow: hidden; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
          <div style="background: linear-gradient(135deg, #4CAF50 0%, #45a049 100%); color: white; padding: 40px 20px; text-align: center;">
            <img src="${logoUrl}" alt="Tree Campus" style="height: 60px; margin-bottom: 15px;">
            <h1 style="margin: 0; font-size: 24px;">🌱 Application Received</h1>
          </div>
          <div style="padding: 40px 30px;">
            <p>Dear <strong>${userName}</strong>,</p>
            <p>Thank you for submitting your volunteer application! We'll review it and get back to you within 3-5 business days.</p>
            <div style="background: #f9f9f9; border-left: 4px solid #4CAF50; padding: 20px; margin: 25px 0; border-radius: 5px;">
              <h3 style="margin: 0 0 15px 0; color: #4CAF50;">📋 Application Details:</h3>
              <p style="margin: 10px 0;"><strong>Name:</strong> ${volunteerDetails.name || 'N/A'}</p>
              <p style="margin: 10px 0;"><strong>Email:</strong> ${volunteerDetails.email || 'N/A'}</p>
              <p style="margin: 10px 0;"><strong>Phone:</strong> ${volunteerDetails.phone || 'N/A'}</p>
              <p style="margin: 10px 0;"><strong>Address:</strong> ${volunteerDetails.address || 'N/A'}</p>
            </div>
            <p>Best regards,<br><strong>Tree Campus Team</strong></p>
          </div>
          <div style="background: #f5f5f5; padding: 20px; text-align: center; font-size: 12px; color: #666;">
            <p>&copy; ${new Date().getFullYear()} Tree Campus. All rights reserved.</p>
          </div>
        </div>
      </body>
    </html>
  `;

  await sendEmail({ to: userEmail, subject, html: userHtml });
  
  if (adminEmail) {
    const adminHtml = `
      <html>
        <body style="font-family: Arial, sans-serif; margin: 0; padding: 0; background-color: #f5f5f5;">
          <div style="max-width: 650px; margin: 20px auto; background: #fff; border-radius: 10px; overflow: hidden;">
            <div style="background: linear-gradient(135deg, #FF9800 0%, #FB8C00 100%); color: white; padding: 40px 20px; text-align: center;">
              <h1 style="margin: 0;">🌱 New Volunteer Application</h1>
            </div>
            <div style="padding: 40px 30px;">
              <div style="background: #fff3e0; border-left: 4px solid #FF9800; padding: 15px; margin: 20px 0;">
                <strong style="color: #FF9800;">⚡ Action Required:</strong> Review volunteer application
              </div>
              <div style="background: #f9f9f9; padding: 20px; margin: 25px 0; border-radius: 5px;">
                <h3 style="color: #FF9800;">👤 Applicant Details:</h3>
                <p><strong>Name:</strong> ${volunteerDetails.name || 'N/A'}</p>
                <p><strong>Email:</strong> ${volunteerDetails.email || 'N/A'}</p>
                <p><strong>Phone:</strong> ${volunteerDetails.phone || 'N/A'}</p>
                <p><strong>Motivation:</strong> ${volunteerDetails.motivation || 'N/A'}</p>
              </div>
            </div>
          </div>
        </body>
      </html>
    `;
    await sendEmail({ to: adminEmail, subject: `[ADMIN] ${subject}`, html: adminHtml });
  }
};

/**
 * Send school registration confirmation
 */
const sendSchoolRegistrationConfirmation = async (schoolEmail, schoolName, contactName, schoolDetails = {}) => {
  const adminEmail = process.env.ADMIN_EMAIL;
  const subject = 'School Registration Received - Tree Campus';
  const logoUrl = 'https://res.cloudinary.com/dbbll23jz/image/upload/v1765170258/tree_logo_ek4uw3.png';

  const userHtml = `
    <html>
      <body style="font-family: Arial, sans-serif; margin: 0; padding: 0; background-color: #f5f5f5;">
        <div style="max-width: 650px; margin: 20px auto; background: #fff; border-radius: 10px; overflow: hidden;">
          <div style="background: linear-gradient(135deg, #4CAF50 0%, #45a049 100%); color: white; padding: 40px 20px; text-align: center;">
            <img src="${logoUrl}" alt="Tree Campus" style="height: 60px; margin-bottom: 15px;">
            <h1 style="margin: 0;">🏫 School Registration Received</h1>
          </div>
          <div style="padding: 40px 30px;">
            <p>Dear <strong>${contactName}</strong>,</p>
            <p>Thank you for registering ${schoolName} with Tree Campus! We'll verify your details and reach out within 3-5 business days.</p>
            <div style="background: #f9f9f9; border-left: 4px solid #4CAF50; padding: 20px; margin: 25px 0;">
              <h3 style="color: #4CAF50;">🏢 School Details:</h3>
              <p><strong>School:</strong> ${schoolName}</p>
              <p><strong>Contact:</strong> ${contactName}</p>
              <p><strong>Email:</strong> ${schoolEmail}</p>
            </div>
            <p>Best regards,<br><strong>Tree Campus Team</strong></p>
          </div>
        </div>
      </body>
    </html>
  `;

  await sendEmail({ to: schoolEmail, subject, html: userHtml });
  
  if (adminEmail) {
    const adminHtml = `
      <html>
        <body style="font-family: Arial, sans-serif;">
          <div style="max-width: 650px; margin: 20px auto; background: #fff; border-radius: 10px; overflow: hidden;">
            <div style="background: linear-gradient(135deg, #FF9800 0%, #FB8C00 100%); color: white; padding: 40px 20px; text-align: center;">
              <h1>🏫 New School Registration</h1>
            </div>
            <div style="padding: 40px 30px;">
              <div style="background: #fff3e0; border-left: 4px solid #FF9800; padding: 15px; margin: 20px 0;">
                <strong style="color: #FF9800;">⚡ Action Required:</strong> Verify school registration
              </div>
              <p><strong>School:</strong> ${schoolName}</p>
              <p><strong>Contact:</strong> ${contactName}</p>
              <p><strong>Email:</strong> ${schoolEmail}</p>
            </div>
          </div>
        </body>
      </html>
    `;
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
      <body style="font-family: Arial, sans-serif;">
        <div style="max-width: 650px; margin: 20px auto; background: #fff; border-radius: 10px; overflow: hidden;">
          <div style="background: linear-gradient(135deg, #d32f2f 0%, #c62828 100%); color: white; padding: 40px 20px; text-align: center;">
            <h1>🚨 Account Deletion Request</h1>
          </div>
          <div style="padding: 40px 30px;">
            <p>Dear <strong>${userName}</strong>,</p>
            <div style="background: #ffebee; border-left: 4px solid #d32f2f; padding: 20px; margin: 20px 0;">
              <p><strong>Your account will be permanently deleted within 30 days.</strong></p>
              <p>This action cannot be undone.</p>
            </div>
            <p>If you wish to cancel this request, please contact us immediately.</p>
            <p>Best regards,<br><strong>Tree Campus Team</strong></p>
          </div>
        </div>
      </body>
    </html>
  `;

  await sendEmail({ to: userEmail, subject, html: userHtml });
  
  if (adminEmail) {
    const adminHtml = `
      <html>
        <body style="font-family: Arial, sans-serif;">
          <div style="max-width: 650px; margin: 20px auto; background: #fff;">
            <div style="background: #d32f2f; color: white; padding: 40px 20px; text-align: center;">
              <h1>🚨 Account Deletion Request</h1>
            </div>
            <div style="padding: 40px 30px;">
              <p><strong>User:</strong> ${userName}</p>
              <p><strong>Email:</strong> ${userEmail}</p>
              <p><strong>Reason:</strong> ${deletionDetails.reason || 'Not specified'}</p>
            </div>
          </div>
        </body>
      </html>
    `;
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
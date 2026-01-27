const apiKey = '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';
const senderEmail = 'dgtlmart.tech@gmail.com';

// Main email sending function used by contest module
export const sendEmail = async (toEmail, toName, subject, type, context = {}) => {
  let htmlContent = '';

  if (type === 'verification') {
    htmlContent = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #ddd; border-radius: 10px;">
        <h2 style="color: #007bff; text-align: center;">Welcome to TreeCampus!</h2>
        <p>Hi ${toName},</p>
        <p>Thank you for registering. Please verify your email address by clicking the button below:</p>
        <div style="text-align: center; margin: 30px 0;">
          <a href="${context.verifyUrl}" style="background-color: #007bff; color: white; padding: 12px 25px; text-decoration: none; border-radius: 5px; font-weight: bold;">Verify Email Address</a>
        </div>
        <p>If the button doesn't work, you can copy and paste this link into your browser:</p>
        <p><a href="${context.verifyUrl}">${context.verifyUrl}</a></p>
        <p>Best regards,<br>TreeCampus Team</p>
      </div>
    `;
  } else if (type === 'reset') {
    htmlContent = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #ddd; border-radius: 10px;">
        <h2 style="color: #007bff; text-align: center;">Password Reset Request</h2>
        <p>Hi ${toName},</p>
        <p>You requested to reset your password. Click the button below to set a new one:</p>
        <div style="text-align: center; margin: 30px 0;">
          <a href="${context.resetUrl}" style="background-color: #007bff; color: white; padding: 12px 25px; text-decoration: none; border-radius: 5px; font-weight: bold;">Reset Password</a>
        </div>
        <p>This link will expire in 1 hour.</p>
        <p>If you didn't request this, you can safely ignore this email.</p>
        <p>Best regards,<br>TreeCampus Team</p>
      </div>
    `;
  } else if (type === 'coupon') {
    htmlContent = `
      <div style="max-width:600px;margin:auto;background:#ffffff;padding:24px;font-family:Arial,sans-serif;text-align:center;border-radius:12px;border:1px solid #e0e0e0;box-shadow:0 2px 8px rgba(0,0,0,0.05);">
        <table width="100%" cellpadding="0" cellspacing="0" role="presentation" style="margin-bottom:24px;">
          <tr>
            <td align="center" style="padding:0 0 12px;">
              <img src="https://treecampus.in/wp-content/uploads/2022/01/cropped-small-final-png-web-e1641813989375.png" alt="TreeCampus Logo" style="height:48px;display:inline-block;margin-right:16px;" />
              <img src="https://i.ibb.co/fGLBwGs5/SS-logo.png" alt="SastaSundar Logo" style="height:48px;display:inline-block;" />
            </td>
          </tr>
        </table>
        <h2 style="color:#28a745;font-size:24px;margin:10px 0;">🎉 Congratulations, ${toName}! 🎉</h2>
        <p style="font-size:18px;color:#333;margin:0 0 20px;">You've Won An Exclusive Discount Coupon From Our Latest Campaign!</p>
        <div style="background:#007bff;color:#fff;font-size:20px;padding:14px 28px;display:inline-block;border-radius:8px;margin:20px 0;letter-spacing:1px;font-weight:bold;">
          ${context.coupon}
        </div>
        <p style="font-size:16px;color:#333;margin:10px 0;">
          Redeem Your Coupon At 
          <a href="https://www.sastasundar.com/" style="color:#007bff;text-decoration:none;">sastasundar.com</a> (App & Website).
        </p>
        <table align="center" cellpadding="0" cellspacing="0" role="presentation" style="margin:20px auto;">
          <tr>
            <td style="padding:8px;">
              <a href="https://www.sastasundar.com/" target="_blank" style="display:inline-block;background:#0069d9;color:#fff;text-decoration:none;font-size:16px;padding:12px 20px;border-radius:6px;">Redeem Now</a>
            </td>
            <td style="padding:8px;">
              <a href="https://play.google.com/store/apps/details?id=com.shtpl.sastasundar" target="_blank" style="display:inline-block;background:#0056b3;color:#fff;text-decoration:none;font-size:16px;padding:12px 20px;border-radius:6px;">Get the App</a>
            </td>
          </tr>
        </table>
        <hr style="margin:30px 0;border:none;border-top:1px solid #ddd;" />
        <p style="color:#6c757d;font-size:14px;line-height:1.5;">
          💡 <strong>Note:</strong> This Coupon Is <strong>Valid For One-Time Use Only</strong>, Is <strong>Non-Transferable</strong>, And Subject To Our 
          <a href="https://contest.treecampus.in/terms-and-conditions" style="color:#007bff;text-decoration:none;">Terms & Conditions</a>.
        </p>
      </div>
    `;
  }

  const data = {
    sender: { email: senderEmail, name: "Treecampus" },
    to: [{ email: toEmail, name: toName }],
    subject: subject,
    htmlContent: htmlContent,
  };

  try {
    const response = await fetch("https://api.brevo.com/v3/smtp/email", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "api-key": apiKey,
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`Email failed: ${errorText}`);
      throw new Error(`Email failed: ${errorText}`);
    }
    console.log(`✅ ${type} email sent successfully to ${toEmail}`);
  } catch (error) {
    console.error("Email send error:", error);
  }
};

// Wrapper function for OTP emails (used by authController)
export const sendOTPEmail = async (email, name, otp, subject = 'Your OTP Code') => {
  const htmlContent = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #ddd; border-radius: 10px;">
      <h2 style="color: #007bff; text-align: center;">TreeCampus OTP Verification</h2>
      <p>Hi ${name},</p>
      <p>Your OTP code is:</p>
      <div style="text-align: center; margin: 30px 0;">
        <div style="background-color: #f0f0f0; color: #333; padding: 15px 25px; text-decoration: none; border-radius: 5px; font-weight: bold; font-size: 24px; letter-spacing: 5px; display: inline-block;">
          ${otp}
        </div>
      </div>
      <p>This OTP will expire in 10 minutes.</p>
      <p>If you didn't request this, you can safely ignore this email.</p>
      <p>Best regards,<br>TreeCampus Team</p>
    </div>
  `;

  const data = {
    sender: { email: senderEmail, name: "Treecampus" },
    to: [{ email: email, name: name }],
    subject: subject,
    htmlContent: htmlContent,
  };

  try {
    const response = await fetch("https://api.brevo.com/v3/smtp/email", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "api-key": apiKey,
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Email failed: ${errorText}`);
    }
    console.log(`✅ OTP email sent successfully to ${email}`);
  } catch (error) {
    console.error("OTP email send error:", error);
    throw error;
  }
};

// Wrapper function for password reset emails (used by authController)
export const sendPasswordResetEmail = async (email, name, resetUrl) => {
  const htmlContent = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #ddd; border-radius: 10px;">
      <h2 style="color: #007bff; text-align: center;">Password Reset Request</h2>
      <p>Hi ${name},</p>
      <p>You requested to reset your password. Click the button below to set a new one:</p>
      <div style="text-align: center; margin: 30px 0;">
        <a href="${resetUrl}" style="background-color: #007bff; color: white; padding: 12px 25px; text-decoration: none; border-radius: 5px; font-weight: bold;">Reset Password</a>
      </div>
      <p>This link will expire in 1 hour.</p>
      <p>If you didn't request this, you can safely ignore this email.</p>
      <p>Best regards,<br>TreeCampus Team</p>
    </div>
  `;

  const data = {
    sender: { email: senderEmail, name: "Treecampus" },
    to: [{ email: email, name: name }],
    subject: 'Password Reset Request',
    htmlContent: htmlContent,
  };

  try {
    const response = await fetch("https://api.brevo.com/v3/smtp/email", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "api-key": apiKey,
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Email failed: ${errorText}`);
    }
    console.log(`✅ Password reset email sent successfully to ${email}`);
  } catch (error) {
    console.error("Password reset email send error:", error);
    throw error;
  }
};

// Wrapper function for volunteer confirmations
export const sendVolunteerConfirmation = async (email, name, details) => {
  const htmlContent = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #ddd; border-radius: 10px;">
      <h2 style="color: #28a745; text-align: center;">Volunteer Registration Confirmed</h2>
      <p>Hi ${name},</p>
      <p>Thank you for registering as a volunteer with TreeCampus!</p>
      <p>We have received your application and will contact you shortly.</p>
      <p>Best regards,<br>TreeCampus Team</p>
    </div>
  `;

  const data = {
    sender: { email: senderEmail, name: "Treecampus" },
    to: [{ email: email, name: name }],
    subject: 'Volunteer Registration Confirmation',
    htmlContent: htmlContent,
  };

  try {
    const response = await fetch("https://api.brevo.com/v3/smtp/email", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "api-key": apiKey,
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Email failed: ${errorText}`);
    }
    console.log(`✅ Volunteer confirmation email sent to ${email}`);
  } catch (error) {
    console.error("Volunteer confirmation email error:", error);
    throw error;
  }
};

// Wrapper function for assignment results
export const sendAssignmentResultsEmail = async (email, name, results) => {
  const htmlContent = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #ddd; border-radius: 10px;">
      <h2 style="color: #007bff; text-align: center;">Assignment Results</h2>
      <p>Hi ${name},</p>
      <p>Your assignment results are ready!</p>
      <p>Please log in to your account to view your detailed results.</p>
      <p>Best regards,<br>TreeCampus Team</p>
    </div>
  `;

  const data = {
    sender: { email: senderEmail, name: "Treecampus" },
    to: [{ email: email, name: name }],
    subject: 'Your Assignment Results',
    htmlContent: htmlContent,
  };

  try {
    const response = await fetch("https://api.brevo.com/v3/smtp/email", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "api-key": apiKey,
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Email failed: ${errorText}`);
    }
    console.log(`✅ Assignment results email sent to ${email}`);
  } catch (error) {
    console.error("Assignment results email error:", error);
    throw error;
  }
};

// Wrapper function for school registration
export const sendSchoolRegistrationConfirmation = async (email, name, details) => {
  const htmlContent = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #ddd; border-radius: 10px;">
      <h2 style="color: #28a745; text-align: center;">School Registration Confirmed</h2>
      <p>Hi ${name},</p>
      <p>Thank you for registering your school with TreeCampus!</p>
      <p>We have received your registration and will review it shortly.</p>
      <p>Best regards,<br>TreeCampus Team</p>
    </div>
  `;

  const data = {
    sender: { email: senderEmail, name: "Treecampus" },
    to: [{ email: email, name: name }],
    subject: 'School Registration Confirmation',
    htmlContent: htmlContent,
  };

  try {
    const response = await fetch("https://api.brevo.com/v3/smtp/email", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "api-key": apiKey,
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Email failed: ${errorText}`);
    }
    console.log(`✅ School registration confirmation sent to ${email}`);
  } catch (error) {
    console.error("School registration email error:", error);
    throw error;
  }
};

// Wrapper function for account deletion
export const sendAccountDeletionConfirmation = async (email, name) => {
  const htmlContent = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #ddd; border-radius: 10px;">
      <h2 style="color: #dc3545; text-align: center;">Account Deletion Request</h2>
      <p>Hi ${name},</p>
      <p>We have received your request to delete your TreeCampus account.</p>
      <p>Your account will be deleted within 30 days as per our policy.</p>
      <p>If you did not request this, please contact us immediately.</p>
      <p>Best regards,<br>TreeCampus Team</p>
    </div>
  `;

  const data = {
    sender: { email: senderEmail, name: "Treecampus" },
    to: [{ email: email, name: name }],
    subject: 'Account Deletion Confirmation',
    htmlContent: htmlContent,
  };

  try {
    const response = await fetch("https://api.brevo.com/v3/smtp/email", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "api-key": apiKey,
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Email failed: ${errorText}`);
    }
    console.log(`✅ Account deletion confirmation sent to ${email}`);
  } catch (error) {
    console.error("Account deletion email error:", error);
    throw error;
  }
};
const cloudinary = require('../config/cloudinary');

/**
 * Generate certificate image and upload to Cloudinary
 * @param {object} data - Certificate data
 * @param {string} data.userName - Student name
 * @param {string} data.courseName - Course name
 * @param {string} data.certificateId - Unique certificate ID
 * @param {string} data.completionDate - Date of completion
 * @returns {string} Cloudinary URL of certificate
 */
const generateCertificate = async (data) => {
  try {
    const { userName, courseName, certificateId, completionDate } = data;
    
    // Create certificate text overlay
    const certificateText = `
      Certificate of Completion
      
      This certifies that
      ${userName}
      
      has successfully completed
      ${courseName}
      
      Date: ${new Date(completionDate).toLocaleDateString()}
      Certificate ID: ${certificateId}
    `;

    // Use Cloudinary's text overlay feature to generate certificate
    // You can customize this with a template image
    const result = await cloudinary.uploader.upload(
      'https://res.cloudinary.com/demo/image/upload/sample.jpg', // Replace with your certificate template
      {
        folder: 'tree-campus/certificates',
        public_id: certificateId,
        transformation: [
          {
            overlay: {
              font_family: 'Arial',
              font_size: 60,
              font_weight: 'bold',
              text: userName,
            },
            gravity: 'center',
            y: -50,
            color: '#333333',
          },
          {
            overlay: {
              font_family: 'Arial',
              font_size: 40,
              text: courseName,
            },
            gravity: 'center',
            y: 50,
            color: '#666666',
          },
          {
            overlay: {
              font_family: 'Arial',
              font_size: 20,
              text: `Certificate ID: ${certificateId}`,
            },
            gravity: 'south',
            y: 30,
            color: '#999999',
          },
        ],
      }
    );

    return result.secure_url;
  } catch (error) {
    console.error('❌ Error generating certificate:', error.message);
    throw new Error('Failed to generate certificate');
  }
};

/**
 * Simple certificate generation (alternative approach)
 * Returns a data URL that can be used to generate PDF on frontend
 * @param {object} data - Certificate data
 * @returns {object} Certificate data for frontend rendering
 */
const generateCertificateData = (data) => {
  const { userName, courseName, certificateId, completionDate, instructorName } = data;
  
  return {
    userName,
    courseName,
    certificateId,
    completionDate: new Date(completionDate).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }),
    issuedDate: new Date().toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }),
    instructorName: instructorName || 'Tree Campus',
    organizationName: 'Tree Campus',
  };
};

module.exports = {
  generateCertificate,
  generateCertificateData,
};

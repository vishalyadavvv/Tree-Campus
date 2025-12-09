import React from 'react';

const Certificate = ({ certificate }) => {
  if (!certificate) return null;

  const handleDownload = async () => {
    try {
      const response = await fetch(`/api/certificates/${certificate._id}/download`);
      const blob = await response.blob();
      
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `certificate-${certificate._id}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.parentChild.removeChild(link);
    } catch (error) {
      console.error('Error downloading certificate:', error);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-8">
      <div className="border-4 border-[#FD5A00] rounded-lg p-8 relative bg-gradient-to-br from-white to-orange-50">
        {/* Header with logo */}
        <div className="text-center mb-8">
          <img 
            src="https://res.cloudinary.com/dbbll23jz/image/upload/v1765170258/tree_logo_ek4uw3.png" 
            alt="Tree Campus" 
            className="w-20 h-20 mx-auto mb-4"
          />
          <h1 className="text-4xl font-bold text-[#FD5A00] mb-2">Certificate</h1>
          <p className="text-gray-700 text-lg">Of Achievement from Tree Campus Academy</p>
        </div>

        {/* Decorative line */}
        <div className="border-t-2 border-[#FD5A00] my-8"></div>

        {/* Certificate content */}
        <div className="text-center mb-8">
          <p className="text-gray-700 mb-6">This Certificate is Proudly Presented to</p>
          <h2 className="text-3xl font-bold text-gray-800 mb-6 border-b-2 border-[#FD5A00] pb-4">
            {certificate.userName}
          </h2>

          <p className="text-gray-700 mb-2">has successfully completed</p>
          <h3 className="text-2xl font-bold text-gray-800 mb-6">
            {certificate.courseTitle}
          </h3>

          {certificate.score && (
            <p className="text-gray-700 mb-6">
              With a score of <span className="font-bold text-[#FD5A00]">{certificate.score}%</span>
            </p>
          )}
        </div>

        {/* Footer */}
        <div className="flex justify-between items-end mt-12 pt-8 border-t border-gray-300">
          <div className="text-center">
            <p className="text-gray-700 text-sm">Date Issued</p>
            <p className="text-gray-800 font-bold">
              {new Date(certificate.createdAt).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </p>
          </div>
          <div className="text-center">
            <p className="text-gray-700 text-sm">Certificate ID</p>
            <p className="text-gray-800 font-bold text-sm">{certificate._id}</p>
          </div>
          <div className="text-center">
            <p className="text-[#FD5A00] font-bold text-xl">Tree Campus</p>
          </div>
        </div>
      </div>

      {/* Download button */}
      <div className="text-center mt-8">
        <button
          onClick={handleDownload}
          className="bg-[#FD5A00] text-white px-8 py-3 rounded-lg font-bold hover:bg-orange-600 transition inline-flex items-center gap-2"
        >
          <span>⬇️</span>
          Download Certificate
        </button>
      </div>
    </div>
  );
};

export default Certificate;

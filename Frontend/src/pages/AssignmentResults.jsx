import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import api from '../services/api';

const AssignmentResults = () => {
  const { courseId, assignmentId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [certificate, setCertificate] = useState(null);
  const [loading, setLoading] = useState(false);

  const { score, passed, totalScore, totalPoints, certificateId } = location.state || {};

  useEffect(() => {
    if (passed && certificateId) {
      fetchCertificate();
    }
  }, [certificateId, passed]);

  const fetchCertificate = async () => {
    try {
      setLoading(true);
      const res = await api.get(`/certificates/${certificateId}`);
      setCertificate(res.data.data);
    } catch (error) {
      console.error('Error fetching certificate:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadCertificate = async () => {
    try {
      const res = await api.get(`/certificates/${certificateId}/download`, {
        responseType: 'blob'
      });
      
      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `certificate-${certificateId}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.parentChild.removeChild(link);
    } catch (error) {
      console.error('Error downloading certificate:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-2xl mx-auto px-4">
        {/* Result Card */}
        <div className="bg-white rounded-lg shadow-2xl p-8 mb-8">
          {/* Result Header */}
          <div className="text-center mb-8">
            {passed ? (
              <>
                <div className="text-6xl mb-4">🎉</div>
                <h1 className="text-4xl font-bold text-green-600 mb-2">Congratulations!</h1>
                <p className="text-xl text-gray-700">You have successfully completed the assignment</p>
              </>
            ) : (
              <>
                <div className="text-6xl mb-4">📚</div>
                <h1 className="text-4xl font-bold text-blue-600 mb-2">Keep Learning</h1>
                <p className="text-xl text-gray-700">Review the material and try again</p>
              </>
            )}
          </div>

          {/* Score Display */}
          <div className="bg-gradient-to-r from-[#FD5A00] to-orange-600 rounded-lg p-8 text-white text-center mb-8">
            <p className="text-lg mb-2">Your Score</p>
            <p className="text-6xl font-bold mb-2">{score}%</p>
            <p className="text-lg">
              {totalScore !== undefined && totalPoints !== undefined
                ? `${totalScore} out of ${totalPoints} points`
                : ''}
            </p>
          </div>

          {/* Result Details */}
          <div className="bg-gray-50 rounded-lg p-6 mb-8">
            <div className="grid grid-cols-2 gap-6">
              <div>
                <p className="text-gray-600 text-sm">Result</p>
                <p className={`text-2xl font-bold ${passed ? 'text-green-600' : 'text-red-600'}`}>
                  {passed ? '✓ PASSED' : '✗ FAILED'}
                </p>
              </div>
              <div>
                <p className="text-gray-600 text-sm">Status</p>
                <p className="text-2xl font-bold text-gray-800">
                  {passed ? 'Certified' : 'Incomplete'}
                </p>
              </div>
            </div>
          </div>

          {/* Certificate Section */}
          {passed && certificate && (
            <div className="border-2 border-[#FD5A00] rounded-lg p-6 mb-8 bg-orange-50">
              <h3 className="text-xl font-bold text-[#FD5A00] mb-4">🎓 Certificate Earned</h3>
              <p className="text-gray-700 mb-4">
                Your certificate of completion has been generated and is available on your dashboard.
              </p>
              <button
                onClick={handleDownloadCertificate}
                disabled={loading}
                className="w-full bg-[#FD5A00] text-white py-3 rounded-lg font-bold hover:bg-orange-600 disabled:opacity-50 transition"
              >
                {loading ? 'Generating...' : '⬇️ Download Certificate'}
              </button>
            </div>
          )}

          {!passed && (
            <div className="border-2 border-blue-400 rounded-lg p-6 mb-8 bg-blue-50">
              <h3 className="text-xl font-bold text-blue-600 mb-4">💡 Next Steps</h3>
              <ul className="text-gray-700 space-y-2">
                <li>✓ Review the course materials</li>
                <li>✓ Focus on challenging topics</li>
                <li>✓ Take the assignment again to earn your certificate</li>
                <li>✓ Minimum passing score: 60%</li>
              </ul>
            </div>
          )}

          {/* Buttons */}
          <div className="flex flex-col sm:flex-row gap-4">
            <button
              onClick={() => navigate(`/courses/${courseId}`)}
              className="flex-1 bg-[#FD5A00] text-white py-3 rounded-lg font-bold hover:bg-orange-600 transition"
            >
              Back to Course
            </button>
            <button
              onClick={() => navigate('/dashboard')}
              className="flex-1 bg-gray-300 text-gray-800 py-3 rounded-lg font-bold hover:bg-gray-400 transition"
            >
              Go to Dashboard
            </button>
          </div>
        </div>

        {/* Tips Section */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-bold text-gray-800 mb-4">💪 Study Tips</h3>
          <ul className="space-y-2 text-gray-700">
            <li>• Break down the content into smaller chunks</li>
            <li>• Take notes while watching the video lessons</li>
            <li>• Review the material before taking the assignment</li>
            <li>• Practice with similar questions</li>
            <li>• Don't hesitate to reach out for help</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default AssignmentResults;

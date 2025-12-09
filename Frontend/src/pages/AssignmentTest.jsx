import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../services/api';
import Loader from '../components/common/Loader';

const AssignmentTest = () => {
  const { assignmentId, courseId } = useParams();
  const navigate = useNavigate();

  const [assignment, setAssignment] = useState(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(null);
  const [testStarted, setTestStarted] = useState(false);
  const [eligibilityError, setEligibilityError] = useState(null);

  useEffect(() => {
    fetchAssignmentAndCheckEligibility();
  }, [assignmentId]);

  const fetchAssignmentAndCheckEligibility = async () => {
    try {
      setLoading(true);

      // Check eligibility first
      const eligibilityRes = await api.get(`/assignments/${assignmentId}/check-eligibility`);
      
      if (!eligibilityRes.data.canTake) {
        setEligibilityError(eligibilityRes.data.reason);
        setLoading(false);
        return;
      }

      if (eligibilityRes.data.alreadySubmitted) {
        navigate(`/courses/${courseId}/assignment/${assignmentId}/results`, {
          state: { score: eligibilityRes.data.score, passed: eligibilityRes.data.passed }
        });
        return;
      }

      // Fetch assignment
      const res = await api.get(`/assignments/${assignmentId}`);
      setAssignment(res.data.data);
      setTimeRemaining(res.data.data.timeLimit * 60); // Convert to seconds
      setLoading(false);
    } catch (error) {
      console.error('Error fetching assignment:', error);
      setLoading(false);
    }
  };

  // Timer effect
  useEffect(() => {
    if (!testStarted || !timeRemaining || timeRemaining <= 0) return;

    const timer = setInterval(() => {
      setTimeRemaining(prev => {
        if (prev <= 1) {
          handleSubmit();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [testStarted, timeRemaining]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const currentQuestion = assignment?.questions[currentQuestionIndex];
  const answeredCount = Object.keys(answers).length;

  const handleAnswerChange = (questionId, answer) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: answer
    }));
  };

  const handleNext = () => {
    if (currentQuestionIndex < assignment.questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const handleSubmit = async () => {
    if (submitting) return;

    if (Object.keys(answers).length < assignment.questions.length) {
      if (!window.confirm('You have not answered all questions. Submit anyway?')) {
        return;
      }
    }

    try {
      setSubmitting(true);

      const submissionData = assignment.questions.map((q, index) => ({
        questionId: q._id,
        userAnswer: answers[q._id] || ''
      }));

      const res = await api.post(`/assignments/${assignmentId}/submit`, {
        answers: submissionData
      });

      // Navigate to results page
      navigate(`/courses/${courseId}/assignment/${assignmentId}/results`, {
        state: {
          score: res.data.data.submission.percentageScore,
          passed: res.data.data.submission.passed,
          totalScore: res.data.data.submission.totalScore,
          totalPoints: res.data.data.submission.totalPoints,
          certificateId: res.data.data.certificate?._id
        }
      });
    } catch (error) {
      console.error('Error submitting assignment:', error);
      alert('Failed to submit assignment. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <Loader />;
  }

  if (eligibilityError) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
        <div className="bg-white p-8 rounded-lg shadow-lg text-center max-w-md">
          <h2 className="text-2xl font-bold text-red-600 mb-4">⚠️ Not Eligible</h2>
          <p className="text-gray-700 mb-6">{eligibilityError}</p>
          <button
            onClick={() => navigate(`/courses/${courseId}`)}
            className="bg-[#FD5A00] text-white px-6 py-2 rounded-lg hover:bg-orange-600 transition"
          >
            Back to Course
          </button>
        </div>
      </div>
    );
  }

  if (!assignment || !currentQuestion) {
    return <Loader />;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-800 mb-2">{assignment.title}</h1>
              <p className="text-gray-600">{assignment.description}</p>
            </div>
            {testStarted && (
              <div className={`text-3xl font-bold p-3 rounded-lg ${
                timeRemaining < 300 ? 'bg-red-100 text-red-600' : 'bg-blue-100 text-blue-600'
              }`}>
                {formatTime(timeRemaining)}
              </div>
            )}
          </div>

          {!testStarted ? (
            <button
              onClick={() => setTestStarted(true)}
              className="w-full bg-[#FD5A00] text-white py-3 rounded-lg font-semibold hover:bg-orange-600 transition text-lg"
            >
              Start Test
            </button>
          ) : (
            <div className="flex items-center gap-4">
              <div className="flex-1 bg-gray-200 rounded-full h-2 overflow-hidden">
                <div
                  className="bg-[#FD5A00] h-full transition-all duration-300"
                  style={{ width: `${((currentQuestionIndex + 1) / assignment.totalQuestions) * 100}%` }}
                ></div>
              </div>
              <span className="text-gray-700 font-semibold whitespace-nowrap">
                Q{currentQuestionIndex + 1}/{assignment.totalQuestions}
              </span>
            </div>
          )}
        </div>

        {testStarted && (
          <>
            {/* Question Card */}
            <div className="bg-white rounded-lg shadow-lg p-8 mb-6">
              <div className="mb-6">
                <h2 className="text-xl font-bold text-gray-800 mb-4">
                  {currentQuestionIndex + 1}. {currentQuestion.questionText}
                </h2>

                {currentQuestion.type === 'multiple-choice' ? (
                  <div className="space-y-3">
                    {currentQuestion.options.map((option, idx) => (
                      <label key={idx} className="flex items-center p-4 border-2 rounded-lg cursor-pointer hover:bg-gray-50 transition"
                        style={{
                          borderColor: answers[currentQuestion._id] === option ? '#FD5A00' : '#e5e7eb',
                          backgroundColor: answers[currentQuestion._id] === option ? '#FFF5F0' : 'transparent'
                        }}
                      >
                        <input
                          type="radio"
                          name={`question-${currentQuestion._id}`}
                          value={option}
                          checked={answers[currentQuestion._id] === option}
                          onChange={(e) => handleAnswerChange(currentQuestion._id, e.target.value)}
                          className="w-4 h-4 text-[#FD5A00]"
                        />
                        <span className="ml-3 text-gray-700">{option}</span>
                      </label>
                    ))}
                  </div>
                ) : (
                  <textarea
                    value={answers[currentQuestion._id] || ''}
                    onChange={(e) => handleAnswerChange(currentQuestion._id, e.target.value)}
                    placeholder="Type your answer here..."
                    className="w-full p-4 border-2 border-gray-300 rounded-lg focus:border-[#FD5A00] outline-none min-h-32"
                  />
                )}
              </div>
            </div>

            {/* Navigation */}
            <div className="flex gap-4 mb-6">
              <button
                onClick={handlePrevious}
                disabled={currentQuestionIndex === 0}
                className="px-6 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 disabled:opacity-50 disabled:cursor-not-allowed transition"
              >
                ← Previous
              </button>

              <div className="flex-1 grid grid-cols-2 sm:grid-cols-4 gap-2">
                {assignment.questions.map((q, idx) => (
                  <button
                    key={q._id}
                    onClick={() => setCurrentQuestionIndex(idx)}
                    className={`py-2 rounded-lg font-semibold transition ${
                      idx === currentQuestionIndex
                        ? 'bg-[#FD5A00] text-white'
                        : answers[q._id]
                        ? 'bg-green-200 text-green-800'
                        : 'bg-gray-200 text-gray-700'
                    }`}
                  >
                    {idx + 1}
                  </button>
                ))}
              </div>

              <button
                onClick={handleNext}
                disabled={currentQuestionIndex === assignment.questions.length - 1}
                className="px-6 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 disabled:opacity-50 disabled:cursor-not-allowed transition"
              >
                Next →
              </button>
            </div>

            {/* Submit Button */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <div className="mb-4 flex justify-between items-center">
                <p className="text-gray-700">
                  Answered: <span className="font-bold text-[#FD5A00]">{answeredCount}/{assignment.totalQuestions}</span>
                </p>
              </div>
              <button
                onClick={handleSubmit}
                disabled={submitting}
                className="w-full bg-[#FD5A00] text-white py-3 rounded-lg font-bold hover:bg-orange-600 disabled:opacity-50 disabled:cursor-not-allowed transition text-lg"
              >
                {submitting ? 'Submitting...' : 'Submit Assignment'}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default AssignmentTest;

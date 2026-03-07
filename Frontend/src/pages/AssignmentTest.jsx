import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../services/api';
import Loader from '../components/common/Loader';
import { FiClock, FiFileText, FiCheckCircle, FiAlertCircle, FiAward, FiPlay, FiChevronLeft } from 'react-icons/fi';
import toast from 'react-hot-toast';

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
  const [eligibilityStatus, setEligibilityStatus] = useState(null);

  useEffect(() => {
    fetchAssignmentAndCheckEligibility();
  }, [assignmentId]);

  const fetchAssignmentAndCheckEligibility = async () => {
    try {
      setLoading(true);

      // Check eligibility first
      const eligibilityRes = await api.get(`/assignments/${assignmentId}/check-eligibility`);
      
      // Store eligibility status for later use
      setEligibilityStatus(eligibilityRes.data);

      if (!eligibilityRes.data.canTake) {
        setEligibilityError(eligibilityRes.data.message || eligibilityRes.data.reason);
        setLoading(false);
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
          score: res.data.data.submission.score ?? res.data.data.submission.percentageScore ?? 0,
          passed: res.data.data.submission.passed,
          totalScore: res.data.data.submission.totalScore,
          totalPoints: res.data.data.submission.totalPoints,
          certificateId: res.data.data.certificate?._id
        }
      });
    } catch (error) {
      console.error('Error submitting assignment:', error);
      toast.error('Failed to submit assignment. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <Loader />;
  }

  if (eligibilityError) {
    // Check if already passed
    if (eligibilityStatus?.alreadyPassed) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-emerald-50 px-4">
          <div className="bg-white p-8 rounded-lg shadow-xl text-center max-w-md border-2 border-green-500">
            <div className="mb-6">
              <svg className="w-20 h-20 text-green-500 mx-auto" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path>
              </svg>
            </div>
            <h2 className="text-3xl font-bold text-green-600 mb-4">🎉 Already Passed!</h2>
            <div className="bg-green-50 p-6 rounded-lg mb-6 border border-green-200">
              <p className="text-gray-700 mb-3 text-lg">
                You have successfully passed this assignment
              </p>
              <div className="text-4xl font-bold text-green-600 mb-2">
                {eligibilityStatus?.score}%
              </div>
              {eligibilityStatus?.certificateId && (
                <div className="mt-4 bg-blue-50 p-4 rounded-lg border-l-4 border-blue-500">
                  <p className="text-blue-700 font-semibold">
                    ✓ Certificate Earned
                  </p>
                  <p className="text-blue-600 text-sm mt-1">You have earned a certificate for this achievement.</p>
                </div>
              )}
            </div>
            <p className="text-gray-600 mb-6">
              You are not allowed to retake this assignment since you have already passed and earned the certificate.
            </p>
            <button
              onClick={() => navigate(`/courses/${courseId}`)}
              className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition font-semibold"
            >
              Back to Course
            </button>
          </div>
        </div>
      );
    }

    // Check if attempts exhausted
    if (eligibilityStatus?.attemptsExhausted) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50 to-teal-50 px-4">
          <div className="bg-white p-8 rounded-lg shadow-xl text-center max-w-md border-2 border-red-500">
            <div className="mb-6">
              <svg className="w-20 h-20 text-red-500 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.35 16.5c-.77.833.192 2.5 1.732 2.5z"></path>
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-red-600 mb-4">❌ Attempts Exhausted</h2>
            <div className="bg-red-50 p-6 rounded-lg mb-6 border border-red-200">
              <p className="text-gray-700 mb-4">
                You have used all allowed attempts for this assignment.
              </p>
              <div className="text-lg font-bold text-gray-800 mb-3">
                Attempts Used: <span className="text-red-600">{eligibilityStatus?.attemptCount}/{eligibilityStatus?.maxAttempts}</span>
              </div>
              <div className="text-lg font-bold text-gray-800">
                Best Score: <span className="text-teal-600">{eligibilityStatus?.score}%</span>
              </div>
            </div>
            <p className="text-gray-600 mb-6">
              Unfortunately, you did not pass this assignment within the allowed attempts. Please contact your instructor for assistance or consider reviewing the course materials.
            </p>
            <button
              onClick={() => navigate(`/courses/${courseId}`)}
              className="bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700 transition font-semibold"
            >
              Back to Course
            </button>
          </div>
        </div>
      );
    }

    // Default eligibility error (course progress, series requirements, etc.)
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
        <div className="bg-white p-8 rounded-lg shadow-lg text-center max-w-md">
          <h2 className="text-2xl font-bold text-red-600 mb-4">⚠️ Not Eligible</h2>
          <p className="text-gray-700 mb-6">{eligibilityError}</p>
          <button
            onClick={() => navigate(`/courses/${courseId}`)}
            className="bg-[#115E59] text-white px-6 py-2 rounded-lg hover:bg-[#0F766E] transition"
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
      <div className="max-w-2xl mx-auto px-4">
        {/* Back Button */}
        <div className="mb-4">
          <button
            onClick={() => navigate(`/courses/${courseId}`)}
            className="flex items-center text-gray-600 hover:text-[#14B8A6] transition-colors font-medium"
          >
            <FiChevronLeft className="mr-1" size={20} />
            Back to Course
          </button>
        </div>

        {/* Header */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-800 mb-2">{assignment.title}</h1>
              <p className="text-gray-600">{assignment.description}</p>
              
              {/* Attempt Counter */}
              {eligibilityStatus?.attemptCount !== undefined && !testStarted && (
                <div className="mt-4 inline-block bg-blue-50 border-l-4 border-blue-500 p-3 rounded">
                  <p className="text-blue-700 font-semibold">
                    Attempt {eligibilityStatus.attemptCount + 1} of {eligibilityStatus.maxAttempts}
                  </p>
                  {eligibilityStatus.remainingAttempts > 0 && (
                    <p className="text-blue-600 text-sm">
                      {eligibilityStatus.remainingAttempts} attempt{eligibilityStatus.remainingAttempts > 1 ? 's' : ''} remaining
                    </p>
                  )}
                </div>
              )}
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
            <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
                <div className="bg-gradient-to-r from-teal-500 to-pink-500 p-8 text-white text-center">
                    <div className="w-20 h-20 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center mx-auto mb-6">
                        <FiFileText className="w-10 h-10 text-white" />
                    </div>
                    <h2 className="text-3xl font-bold mb-2">Ready to start?</h2>
                    <p className="text-teal-50 opacity-90 text-lg">Please review the assignment details below before beginning.</p>
                </div>
                
                <div className="p-6">
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                        <div className="bg-teal-50 p-3 rounded-lg text-center border border-teal-100">
                            <FiClock className="w-5 h-5 text-teal-500 mx-auto mb-1" />
                            <p className="text-gray-500 text-xs font-medium">Duration</p>
                            <p className="text-gray-900 font-bold text-base">{assignment.timeLimit} mins</p>
                        </div>
                        <div className="bg-blue-50 p-3 rounded-lg text-center border border-blue-100">
                            <FiFileText className="w-5 h-5 text-blue-500 mx-auto mb-1" />
                            <p className="text-gray-500 text-xs font-medium">Questions</p>
                            <p className="text-gray-900 font-bold text-base">{assignment.totalQuestions}</p>
                        </div>
                        <div className="bg-green-50 p-3 rounded-lg text-center border border-green-100">
                            <FiCheckCircle className="w-5 h-5 text-green-500 mx-auto mb-1" />
                            <p className="text-gray-500 text-xs font-medium">Passing</p>
                            <p className="text-gray-900 font-bold text-base">{assignment.passingScore}%</p>
                        </div>
                        <div className="bg-purple-50 p-3 rounded-lg text-center border border-purple-100">
                            <FiAward className="w-5 h-5 text-purple-500 mx-auto mb-1" />
                            <p className="text-gray-500 text-xs font-medium">Points</p>
                            <p className="text-gray-900 font-bold text-base">{assignment.totalPoints}</p>
                        </div>
                    </div>

                    <div className="bg-gray-50 rounded-lg p-5 mb-8 border border-gray-100">
                        <h3 className="text-base font-bold text-gray-900 mb-3 flex items-center gap-2">
                             <FiAlertCircle className="text-teal-500" />
                             Important Instructions
                        </h3>
                        <ul className="space-y-2 text-gray-600 text-sm">
                            <li className="flex items-start gap-2">
                                <span className="w-1.5 h-1.5 bg-gray-400 rounded-full mt-1.5 flex-shrink-0"></span>
                                You have up to <span className="font-bold text-gray-900">{eligibilityStatus?.maxAttempts || 3} attempts</span> to pass this assignment.
                            </li>
                            {eligibilityStatus?.attemptCount > 0 && (
                              <li className="flex items-start gap-2">
                                <span className="w-1.5 h-1.5 bg-gray-400 rounded-full mt-1.5 flex-shrink-0"></span>
                                This is attempt <span className="font-bold text-teal-600">{eligibilityStatus.attemptCount + 1} of {eligibilityStatus.maxAttempts}</span>
                              </li>
                            )}
                            <li className="flex items-start gap-2">
                                <span className="w-1.5 h-1.5 bg-gray-400 rounded-full mt-1.5 flex-shrink-0"></span>
                                The timer will start immediately once you click the button below.
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="w-1.5 h-1.5 bg-gray-400 rounded-full mt-1.5 flex-shrink-0"></span>
                                Please do not refresh the page or navigate away during the test.
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="w-1.5 h-1.5 bg-gray-400 rounded-full mt-1.5 flex-shrink-0"></span>
                                Answer all questions. You can revisit previous questions.
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="w-1.5 h-1.5 bg-gray-400 rounded-full mt-1.5 flex-shrink-0"></span>
                                The test will auto-submit when the time expires.
                            </li>
                        </ul>
                    </div>

                    <button
                        onClick={() => setTestStarted(true)}
                        className="w-full bg-gradient-to-r from-teal-500 to-pink-500 text-white py-3 rounded-lg font-bold text-lg hover:from-teal-600 hover:to-pink-600 transition-all duration-300 transform hover:-translate-y-1 shadow-md hover:shadow-lg flex items-center justify-center gap-2"
                    >
                        <FiPlay className="w-5 h-5 fill-current" />
                        Start Assignment
                    </button>
                </div>
            </div>
          ) : (
            <div className="flex items-center gap-4">
              <div className="flex-1 bg-gray-200 rounded-full h-2 overflow-hidden">
                <div
                  className="bg-[#115E59] h-full transition-all duration-300"
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
            <div className="bg-white rounded-lg shadow-md p-6 mb-6">
              <div className="mb-6">
                <div className="flex items-center justify-between mb-4">
                  <span className="inline-block bg-[#115E59]/10 text-[#14B8A6] px-3 py-1 rounded-full text-sm font-semibold">
                    Question {currentQuestionIndex + 1}
                  </span>
                  <span className="text-gray-400 text-sm">
                    {currentQuestion.type === 'multiple-choice' ? 'Multiple Choice' : 'Text Answer'}
                  </span>
                </div>
                <h2 className="text-xl font-bold text-gray-800 mb-4 leading-relaxed">
                  {currentQuestion.questionText}
                </h2>

                {currentQuestion.type === 'multiple-choice' ? (
                  <div className="space-y-3">
                    {currentQuestion.options.map((option, idx) => (
                      <label key={idx} className="flex items-center p-4 border rounded-lg cursor-pointer hover:bg-gray-50 transition duration-200"
                        style={{
                          borderColor: answers[currentQuestion._id] === option ? '#14B8A6' : '#e5e7eb',
                          backgroundColor: answers[currentQuestion._id] === option ? '#F0FDFA' : 'transparent',
                          boxShadow: answers[currentQuestion._id] === option ? '0 2px 4px rgba(20, 184, 166, 0.1)' : 'none'
                        }}
                      >
                        <div className={`w-5 h-5 rounded-full border flex items-center justify-center flex-shrink-0 mr-3 ${
                           answers[currentQuestion._id] === option ? 'border-[#14B8A6] bg-[#115E59]' : 'border-gray-300'
                        }`}>
                           {answers[currentQuestion._id] === option && <FiCheckCircle className="text-white w-3 h-3" />}
                        </div>
                        <input
                          type="radio"
                          name={`question-${currentQuestion._id}`}
                          value={option}
                          checked={answers[currentQuestion._id] === option}
                          onChange={(e) => handleAnswerChange(currentQuestion._id, e.target.value)}
                          className="hidden"
                        />
                        <span className="text-gray-700 font-medium">{option}</span>
                      </label>
                    ))}
                  </div>
                ) : (
                  <textarea
                    value={answers[currentQuestion._id] || ''}
                    onChange={(e) => handleAnswerChange(currentQuestion._id, e.target.value)}
                    placeholder="Type your answer here..."
                    className="w-full p-4 border border-gray-300 rounded-lg focus:border-[#14B8A6] focus:ring-1 focus:ring-[#14B8A6] outline-none min-h-32 text-gray-700"
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
                        ? 'bg-[#115E59] text-white'
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
                  Answered: <span className="font-bold text-[#14B8A6]">{answeredCount}/{assignment.totalQuestions}</span>
                </p>
              </div>
              <button
                onClick={handleSubmit}
                disabled={submitting}
                className="w-full bg-[#115E59] text-white py-3 rounded-lg font-bold hover:bg-[#0F766E] disabled:opacity-50 disabled:cursor-not-allowed transition text-base shadow-md hover:shadow-lg"
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

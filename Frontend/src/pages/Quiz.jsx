import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../services/api';
import { 
  FiClock, 
  FiCheckCircle, 
  FiXCircle, 
  FiAward, 
  FiShare2, 
  FiTwitter, 
  FiFacebook, 
  FiLinkedin,
  FiRefreshCw,
  FiArrowLeft,
  FiAlertCircle
} from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';

const Quiz = () => {
  const { courseId, sectionId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [quiz, setQuiz] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState([]);
  const [timeLeft, setTimeLeft] = useState(null);
  const [quizStarted, setQuizStarted] = useState(false);
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [results, setResults] = useState(null);
  const [showShareMenu, setShowShareMenu] = useState(false);

  useEffect(() => {
    fetchQuiz();
  }, [sectionId]);

  useEffect(() => {
    if (quizStarted && timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0 && quizStarted && !quizSubmitted) {
      handleSubmitQuiz();
    }
  }, [timeLeft, quizStarted]);

  const fetchQuiz = async () => {
    try {
      const response = await api.get(`/courses/sections/${sectionId}/quiz`);
      const quizData = response.data.data;
      
      // Validate quiz data
      if (!quizData || !quizData.questions || !Array.isArray(quizData.questions)) {
        console.error('Invalid quiz data:', quizData);
        setQuiz(null);
        setLoading(false);
        return;
      }
      
      setQuiz(quizData);
      setTimeLeft(quizData.timeLimit * 60); // Convert minutes to seconds
      setSelectedAnswers(new Array(quizData.questions.length).fill(null));
    } catch (error) {
      console.error('Error fetching quiz:', error);
      setQuiz(null);
    } finally {
      setLoading(false);
    }
  };

  const handleStartQuiz = () => {
    setQuizStarted(true);
  };

  const handleAnswerSelect = (answerIndex) => {
    const newAnswers = [...selectedAnswers];
    newAnswers[currentQuestion] = answerIndex;
    setSelectedAnswers(newAnswers);
  };

  const handleNextQuestion = () => {
    if (currentQuestion < quiz.questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    }
  };

  const handlePreviousQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const handleSubmitQuiz = async () => {
    try {
      const response = await api.post(`/courses/quiz/${quiz._id}/submit`, {
        answers: selectedAnswers
      });
      setResults(response.data.data);
      setQuizSubmitted(true);
    } catch (error) {
      console.error('Error submitting quiz:', error);
      alert('Failed to submit quiz. Please try again.');
    }
  };

  const handleRetry = () => {
    setQuizStarted(false);
    setQuizSubmitted(false);
    setCurrentQuestion(0);
    setSelectedAnswers(new Array(quiz.questions.length).fill(null));
    setTimeLeft(quiz.timeLimit * 60);
    setResults(null);
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getShareText = () => {
    return `I just scored ${results.score}% on "${quiz.title}"! 🎉`;
  };

  const handleShare = (platform) => {
    const text = getShareText();
    const url = window.location.href;
    
    const shareUrls = {
      twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`,
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}&quote=${encodeURIComponent(text)}`,
      linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`
    };

    if (shareUrls[platform]) {
      window.open(shareUrls[platform], '_blank', 'width=600,height=400');
    }
  };

  const copyToClipboard = () => {
    const text = getShareText();
    navigator.clipboard.writeText(text);
    alert('Copied to clipboard!');
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#FC5A00]"></div>
      </div>
    );
  }

  if (!quiz) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl p-8 max-w-md w-full text-center shadow-xl">
          <FiAlertCircle className="mx-auto text-red-500 mb-4" size={48} />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Quiz Not Found</h2>
          <p className="text-gray-600 mb-6">This section doesn't have a quiz yet.</p>
          <button
            onClick={() => navigate(`/courses/${courseId}`)}
            className="bg-[#FC5A00] hover:bg-[#FF6B1A] text-white px-6 py-3 rounded-xl font-bold transition-all duration-300"
          >
            Back to Course
          </button>
        </div>
      </div>
    );
  }

  // Quiz Start Screen
  if (!quizStarted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#FC5A00]/10 via-orange-50 to-white p-4 md:p-8">
        <div className="max-w-4xl mx-auto">
          <button
            onClick={() => navigate(`/courses/${courseId}`)}
            className="flex items-center gap-2 text-gray-600 hover:text-[#FC5A00] font-bold mb-6 transition-colors duration-200"
          >
            <FiArrowLeft size={20} />
            Back to Course
          </button>

          <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">
            <div className="bg-gradient-to-r from-[#FC5A00] to-orange-600 p-8 md:p-12 text-white">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center">
                  <FiAward size={32} />
                </div>
                <div>
                  <h1 className="text-3xl md:text-4xl font-bold">{quiz.title}</h1>
                  <p className="text-white/90 mt-1">{quiz.description}</p>
                </div>
              </div>
            </div>

            <div className="p-8 md:p-12">
              <div className="grid md:grid-cols-3 gap-6 mb-8">
                <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl p-6 border border-blue-200">
                  <div className="flex items-center gap-3 mb-2">
                    <FiCheckCircle className="text-blue-600" size={24} />
                    <span className="text-gray-600 font-bold">Questions</span>
                  </div>
                  <p className="text-3xl font-bold text-blue-600">{quiz.questions.length}</p>
                </div>

                <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-2xl p-6 border border-purple-200">
                  <div className="flex items-center gap-3 mb-2">
                    <FiClock className="text-purple-600" size={24} />
                    <span className="text-gray-600 font-bold">Time Limit</span>
                  </div>
                  <p className="text-3xl font-bold text-purple-600">{quiz.timeLimit} min</p>
                </div>

                <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-2xl p-6 border border-green-200">
                  <div className="flex items-center gap-3 mb-2">
                    <FiAward className="text-green-600" size={24} />
                    <span className="text-gray-600 font-bold">Passing Score</span>
                  </div>
                  <p className="text-3xl font-bold text-green-600">{quiz.passingScore}%</p>
                </div>
              </div>

              <div className="bg-yellow-50 border border-yellow-200 rounded-2xl p-6 mb-8">
                <h3 className="font-bold text-yellow-900 mb-3 flex items-center gap-2">
                  <FiAlertCircle size={20} />
                  Important Instructions
                </h3>
                <ul className="space-y-2 text-yellow-800">
                  <li className="flex items-start gap-2">
                    <span className="text-yellow-600 mt-1">•</span>
                    <span>You have <strong>{quiz.timeLimit} minutes</strong> to complete this quiz</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-yellow-600 mt-1">•</span>
                    <span>You need to score at least <strong>{quiz.passingScore}%</strong> to pass</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-yellow-600 mt-1">•</span>
                    <span>You can navigate between questions before submitting</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-yellow-600 mt-1">•</span>
                    <span>The quiz will auto-submit when time runs out</span>
                  </li>
                </ul>
              </div>

              <button
                onClick={handleStartQuiz}
                className="w-full bg-gradient-to-r from-[#FC5A00] to-orange-600 hover:from-[#FF6B1A] hover:to-orange-700 text-white py-4 rounded-xl font-bold text-lg transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl flex items-center justify-center gap-3"
              >
                <FiCheckCircle size={24} />
                Start Quiz
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Quiz Results Screen
  if (quizSubmitted && results) {
    const passed = results.passed;
    
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 md:p-8">
        <div className="max-w-4xl mx-auto">
          <div className={`bg-white rounded-3xl shadow-2xl overflow-hidden ${passed ? 'border-4 border-green-500' : 'border-4 border-red-500'}`}>
            {/* Results Header */}
            <div className={`p-8 md:p-12 text-white ${passed ? 'bg-gradient-to-r from-green-500 to-emerald-600' : 'bg-gradient-to-r from-red-500 to-rose-600'}`}>
              <div className="text-center">
                {passed ? (
                  <div className="animate-bounce mb-4">
                    <FiAward className="mx-auto" size={80} />
                  </div>
                ) : (
                  <div className="mb-4">
                    <FiXCircle className="mx-auto" size={80} />
                  </div>
                )}
                
                <h1 className="text-4xl md:text-5xl font-bold mb-4">
                  {passed ? '🎉 Congratulations!' : '😔 Not Quite There'}
                </h1>
                
                <p className="text-xl md:text-2xl text-white/90">
                  {passed 
                    ? 'You passed the quiz with flying colors!' 
                    : 'Don\'t worry, you can try again!'}
                </p>
              </div>
            </div>

            {/* Score Display */}
            <div className="p-8 md:p-12">
              <div className="text-center mb-8">
                <div className="inline-block relative">
                  <svg className="transform -rotate-90 w-48 h-48">
                    <circle
                      cx="96"
                      cy="96"
                      r="88"
                      stroke="#e5e7eb"
                      strokeWidth="12"
                      fill="none"
                    />
                    <circle
                      cx="96"
                      cy="96"
                      r="88"
                      stroke={passed ? '#10b981' : '#ef4444'}
                      strokeWidth="12"
                      fill="none"
                      strokeDasharray={`${(results.score / 100) * 553} 553`}
                      strokeLinecap="round"
                      className="transition-all duration-1000 ease-out"
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div>
                      <div className={`text-6xl font-bold ${passed ? 'text-green-600' : 'text-red-600'}`}>
                        {results.score}%
                      </div>
                      <div className="text-gray-500 font-bold">Your Score</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Stats */}
              <div className="grid md:grid-cols-3 gap-4 mb-8">
                <div className="bg-gray-50 rounded-2xl p-6 text-center border border-gray-200">
                  <div className="text-3xl font-bold text-gray-900">{results.correctAnswers}</div>
                  <div className="text-gray-600 font-bold">Correct</div>
                </div>
                <div className="bg-gray-50 rounded-2xl p-6 text-center border border-gray-200">
                  <div className="text-3xl font-bold text-gray-900">{results.totalQuestions - results.correctAnswers}</div>
                  <div className="text-gray-600 font-bold">Incorrect</div>
                </div>
                <div className="bg-gray-50 rounded-2xl p-6 text-center border border-gray-200">
                  <div className="text-3xl font-bold text-gray-900">{results.passingScore}%</div>
                  <div className="text-gray-600 font-bold">Required</div>
                </div>
              </div>

              {/* Share Section (only if passed) */}
              {passed && (
                <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-6 mb-6 border border-blue-200">
                  <h3 className="font-bold text-gray-900 mb-4 text-center text-lg">
                    🎊 Share Your Achievement!
                  </h3>
                  <div className="flex flex-wrap justify-center gap-3">
                    <button
                      onClick={() => handleShare('twitter')}
                      className="flex items-center gap-2 bg-[#1DA1F2] hover:bg-[#1a8cd8] text-white px-6 py-3 rounded-xl font-bold transition-all duration-300 transform hover:scale-105"
                    >
                      <FiTwitter size={20} />
                      Twitter
                    </button>
                    <button
                      onClick={() => handleShare('facebook')}
                      className="flex items-center gap-2 bg-[#4267B2] hover:bg-[#365899] text-white px-6 py-3 rounded-xl font-bold transition-all duration-300 transform hover:scale-105"
                    >
                      <FiFacebook size={20} />
                      Facebook
                    </button>
                    <button
                      onClick={() => handleShare('linkedin')}
                      className="flex items-center gap-2 bg-[#0077B5] hover:bg-[#006399] text-white px-6 py-3 rounded-xl font-bold transition-all duration-300 transform hover:scale-105"
                    >
                      <FiLinkedin size={20} />
                      LinkedIn
                    </button>
                    <button
                      onClick={copyToClipboard}
                      className="flex items-center gap-2 bg-gray-700 hover:bg-gray-800 text-white px-6 py-3 rounded-xl font-bold transition-all duration-300 transform hover:scale-105"
                    >
                      <FiShare2 size={20} />
                      Copy
                    </button>
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4">
                <button
                  onClick={handleRetry}
                  className="flex-1 bg-gradient-to-r from-[#FC5A00] to-orange-600 hover:from-[#FF6B1A] hover:to-orange-700 text-white py-4 rounded-xl font-bold text-lg transition-all duration-300 transform hover:scale-105 shadow-lg flex items-center justify-center gap-3"
                >
                  <FiRefreshCw size={24} />
                  Try Again
                </button>
                <button
                  onClick={() => navigate(`/courses/${courseId}`)}
                  className="flex-1 bg-gray-700 hover:bg-gray-800 text-white py-4 rounded-xl font-bold text-lg transition-all duration-300 transform hover:scale-105 shadow-lg flex items-center justify-center gap-3"
                >
                  <FiArrowLeft size={24} />
                  Back to Course
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Quiz Questions Screen
  // Safety check
  if (!quiz || !quiz.questions || quiz.questions.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl p-8 max-w-md w-full text-center shadow-xl">
          <FiAlertCircle className="mx-auto text-red-500 mb-4" size={48} />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Quiz Data Error</h2>
          <p className="text-gray-600 mb-6">Unable to load quiz questions. Please try again.</p>
          <button
            onClick={() => navigate(`/courses/${courseId}`)}
            className="bg-[#FC5A00] hover:bg-[#FF6B1A] text-white px-6 py-3 rounded-xl font-bold transition-all duration-300"
          >
            Back to Course
          </button>
        </div>
      </div>
    );
  }
  
  const question = quiz.questions[currentQuestion];
  const progress = ((currentQuestion + 1) / quiz.questions.length) * 100;
  const allQuestionsAnswered = selectedAnswers.every(answer => answer !== null);

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        {/* Back Button */}
        <button
          onClick={() => navigate(`/courses/${courseId}`)}
          className="flex items-center gap-2 text-gray-600 hover:text-[#FC5A00] font-bold mb-6 transition-colors duration-200"
        >
          <FiArrowLeft size={20} />
          Back to Course
        </button>

        {/* Header with Timer */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-3">
              <FiAward className="text-[#FC5A00]" size={28} />
              <div>
                <h2 className="text-xl font-bold text-gray-900">{quiz.title}</h2>
                <p className="text-gray-600">Question {currentQuestion + 1} of {quiz.questions.length}</p>
              </div>
            </div>
            
            <div className={`flex items-center gap-3 px-6 py-3 rounded-xl font-bold text-lg ${
              timeLeft < 60 ? 'bg-red-100 text-red-600' : 'bg-blue-100 text-blue-600'
            }`}>
              <FiClock size={24} />
              {formatTime(timeLeft)}
            </div>
          </div>

          {/* Progress Bar */}
          <div className="mt-4">
            <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
              <div
                className="bg-gradient-to-r from-[#FC5A00] to-orange-600 h-full transition-all duration-300 rounded-full"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        </div>

        {/* Question Card */}
        <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12 mb-6">
          <div className="mb-8">
            <div className="inline-block bg-[#FC5A00]/10 text-[#FC5A00] px-4 py-2 rounded-lg font-bold mb-4">
              Question {currentQuestion + 1}
            </div>
            <h3 className="text-2xl md:text-3xl font-bold text-gray-900 leading-relaxed">
              {question.questionText || question.question || 'Question text not available'}
            </h3>
          </div>

          {/* Answer Options */}
          <div className="space-y-4">
            {question?.options && Array.isArray(question.options) && question.options.length > 0 ? (
              question.options.map((option, index) => (
                <button
                  key={index}
                  onClick={() => handleAnswerSelect(index)}
                  className={`w-full text-left p-6 rounded-xl border-2 transition-all duration-300 transform hover:scale-102 ${
                    selectedAnswers[currentQuestion] === index
                      ? 'border-[#FC5A00] bg-[#FC5A00]/10 shadow-lg'
                      : 'border-gray-200 hover:border-[#FC5A00]/50 hover:bg-gray-50'
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${
                      selectedAnswers[currentQuestion] === index
                        ? 'border-[#FC5A00] bg-[#FC5A00]'
                        : 'border-gray-300'
                    }`}>
                      {selectedAnswers[currentQuestion] === index && (
                        <FiCheckCircle className="text-white" size={20} />
                      )}
                    </div>
                    <span className="text-lg font-bold text-gray-900">{option}</span>
                  </div>
                </button>
              ))
            ) : (
              <div className="bg-red-50 border-2 border-red-200 rounded-2xl p-8 text-center">
                <FiAlertCircle className="mx-auto text-red-500 mb-4" size={48} />
                <h3 className="text-xl font-bold text-red-900 mb-2">Missing Answer Options</h3>
                <p className="text-red-700 mb-4">
                  This question doesn't have answer options configured in the backend.
                </p>
                <p className="text-sm text-red-600">
                  Please contact the course administrator to add answer options to this quiz.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Navigation Buttons */}
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <button
              onClick={handlePreviousQuestion}
              disabled={currentQuestion === 0}
              className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-700 py-4 rounded-xl font-bold text-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              <FiArrowLeft size={20} />
              Previous
            </button>

            {currentQuestion === quiz.questions.length - 1 ? (
              <button
                onClick={handleSubmitQuiz}
                disabled={!allQuestionsAnswered}
                className="flex-1 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white py-4 rounded-xl font-bold text-lg transition-all duration-300 transform hover:scale-105 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-2"
              >
                <FiCheckCircle size={24} />
                Submit Quiz
              </button>
            ) : (
              <button
                onClick={handleNextQuestion}
                className="flex-1 bg-gradient-to-r from-[#FC5A00] to-orange-600 hover:from-[#FF6B1A] hover:to-orange-700 text-white py-4 rounded-xl font-bold text-lg transition-all duration-300 transform hover:scale-105 shadow-lg flex items-center justify-center gap-2"
              >
                Next
                <FiCheckCircle size={20} />
              </button>
            )}
          </div>

          {/* Question Navigator */}
          <div className="mt-6 pt-6 border-t border-gray-200">
            <p className="text-gray-600 font-bold mb-3 text-center">Quick Navigation</p>
            <div className="flex flex-wrap gap-2 justify-center">
              {quiz.questions.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentQuestion(index)}
                  className={`w-12 h-12 rounded-lg font-bold transition-all duration-300 ${
                    index === currentQuestion
                      ? 'bg-[#FC5A00] text-white shadow-lg scale-110'
                      : selectedAnswers[index] !== null
                      ? 'bg-green-100 text-green-600 border-2 border-green-300'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {index + 1}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Quiz;

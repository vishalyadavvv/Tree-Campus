import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import Confetti from 'react-confetti';
import { FiClock, FiCheck, FiX, FiAward, FiAlertCircle, FiLock, FiUnlock, FiPlay } from 'react-icons/fi';
import toast from 'react-hot-toast';

// Mock data for contest quizzes with 5 sets
const CONTEST_QUIZZES = [
  {
    id: 'contest-set-1',
    title: 'Set 1: Vital Vocabulary',
    description: 'Start your journey with these essential English vocabulary questions.',
    questions: [
      {
        id: 1,
        question: "Which of the following is a synonym for 'Ephemeral'?",
        options: ["Lasting", "Short-lived", "Eternal", "Permanent"],
        correctAnswer: "Short-lived",
        points: 10
      },
      {
        id: 2,
        question: "Choose the correct preposition: 'She is interested ___ learning French.'",
        options: ["at", "on", "in", "with"],
        correctAnswer: "in",
        points: 10
      },
      {
        id: 3,
        question: "What is the past participle of 'write'?",
        options: ["wrote", "written", "writing", "writes"],
        correctAnswer: "written",
        points: 10
      },
      {
        id: 4,
        question: "Identify the antonym of 'Benevolent'.",
        options: ["Kind", "Malevolent", "Generous", "Helpful"],
        correctAnswer: "Malevolent",
        points: 10
      },
      {
        id: 5,
        question: "Which sentence is grammatically correct?",
        options: [
          "He don't like coffee.",
          "He doesn't likes coffee.",
          "He doesn't like coffee.",
          "He not like coffee."
        ],
        correctAnswer: "He doesn't like coffee.",
        points: 10
      }
    ],
    duration: 300,
    totalPoints: 50,
    passingScore: 30,
    setNumber: 1
  },
  {
    id: 'contest-set-2',
    title: 'Set 2: Grammar Guru',
    description: 'Level up! Test your understanding of complex grammar rules.',
    questions: [
      {
        id: 1,
        question: "Which is the correct conditional sentence?",
        options: [
          "If I was you, I would go.",
          "If I were you, I would go.",
          "If I am you, I will go.",
          "If I be you, I would go."
        ],
        correctAnswer: "If I were you, I would go.",
        points: 10
      },
      {
        id: 2,
        question: "Choose the correct verb form: 'By next year, I ___ established my business.'",
        options: ["will have", "have", "had", "will had"],
        correctAnswer: "will have",
        points: 10
      },
      {
        id: 3,
        question: "Identiy the passive voice sentence.",
        options: [
          "The chef cooked the meal.",
          "The meal was cooked by the chef.",
          "The chef is cooking the meal.",
          "The chef has cooked the meal."
        ],
        correctAnswer: "The meal was cooked by the chef.",
        points: 10
      },
      {
        id: 4,
        question: "Select the correct plural form of 'Crisis'.",
        options: ["Crisises", "Crises", "Crisese", "Crisis"],
        correctAnswer: "Crises",
        points: 10
      },
      {
        id: 5,
        question: "Which word is an adverb?",
        options: ["Quick", "Quickly", "Quicker", "Quickness"],
        correctAnswer: "Quickly",
        points: 10
      }
    ],
    duration: 300,
    totalPoints: 50,
    passingScore: 30,
    setNumber: 2
  },
  {
    id: 'contest-set-3',
    title: 'Set 3: Idioms & Phrases',
    description: 'Can you crack these common English idioms? Prove your skills!',
    questions: [
      {
        id: 1,
        question: "What does 'Break a leg' mean?",
        options: ["Get hurt", "Good luck", "Give up", "Dance well"],
        correctAnswer: "Good luck",
        points: 10
      },
      {
        id: 2,
        question: "Meaning of 'Bite the bullet'?",
        options: ["Eat quickly", "Face a difficult situation", "Attack someone", "Chew metal"],
        correctAnswer: "Face a difficult situation",
        points: 10
      },
      {
        id: 3,
        question: "Complete the idiom: 'The ball is in your ___.'",
        options: ["park", "hands", "court", "field"],
        correctAnswer: "court",
        points: 10
      },
      {
        id: 4,
        question: "What does 'Hit the sack' mean?",
        options: ["Go to sleep", "Hit a bag", "Go to work", "Start fighting"],
        correctAnswer: "Go to sleep",
        points: 10
      },
      {
        id: 5,
        question: "If something costs 'an arm and a leg', it is:",
        options: ["Cheap", "Painful", "Very expensive", "Useless"],
        correctAnswer: "Very expensive",
        points: 10
      }
    ],
    duration: 300,
    totalPoints: 50,
    passingScore: 30,
    setNumber: 3
  },
  {
    id: 'contest-set-4',
    title: 'Set 4: Reading Comprehension',
    description: 'Read carefully and choose the best answers. Precision matters here.',
    questions: [
      {
        id: 1,
        question: "Choose the correct spelling:",
        options: ["Accomodate", "Accommodate", "Acommodate", "Acommodate"],
        correctAnswer: "Accommodate",
        points: 10
      },
      {
        id: 2,
        question: "Which word means 'Excessive pride'?",
        options: ["Humility", "Hubris", "Modesty", "Empathy"],
        correctAnswer: "Hubris",
        points: 10
      },
      {
        id: 3,
        question: "Select the sentence with correct punctuation.",
        options: [
          "Its a beautiful day.",
          "It's a beautiful day.",
          "Its' a beautiful day.",
          "It,s a beautiful day."
        ],
        correctAnswer: "It's a beautiful day.",
        points: 10
      },
      {
        id: 4,
        question: "What is a 'Metaphor'?",
        options: [
          "A comparison using like/as",
          "A direct comparison without like/as",
          "giving human traits to objects",
          "An exaggeration"
        ],
        correctAnswer: "A direct comparison without like/as",
        points: 10
      },
      {
        id: 5,
        question: "Synonym for 'Pragmatic':",
        options: ["Idealistic", "Practical", "Theoretical", "Dreamy"],
        correctAnswer: "Practical",
        points: 10
      }
    ],
    duration: 300,
    totalPoints: 50,
    passingScore: 30,
    setNumber: 4
  },
  {
    id: 'contest-set-5',
    title: 'Set 5: The Grand Finale',
    description: 'The ultimate challenge. Only for the true English masters!',
    questions: [
      {
        id: 1,
        question: "Identify the figure of speech: 'The wind howled in the night.'",
        options: ["Simile", "Metaphor", "Personification", "Hyperbole"],
        correctAnswer: "Personification",
        points: 10
      },
      {
        id: 2,
        question: "What is the meaning of 'Ubiquitous'?",
        options: ["Rare", "Found everywhere", "Expensive", "Hidden"],
        correctAnswer: "Found everywhere",
        points: 10
      },
      {
        id: 3,
        question: "Choose the correct sentence:",
        options: [
          "Neither of them represent us.",
          "Neither of them represents us.",
          "Neither of them are representing us.",
          "Neither of they represent us."
        ],
        correctAnswer: "Neither of them represents us.",
        points: 10
      },
      {
        id: 4,
        question: "Which is a 'Palindrome'?",
        options: ["Hello", "Racecar", "World", "Tree"],
        correctAnswer: "Racecar",
        points: 10
      },
      {
        id: 5,
        question: "Meaning of 'Serendipity'?",
        options: [
          "Bad luck",
          "Finding something good without looking for it",
          "Planning carefully",
          "Being fearful"
        ],
        correctAnswer: "Finding something good without looking for it",
        points: 10
      }
    ],
    duration: 300,
    totalPoints: 50,
    passingScore: 30,
    setNumber: 5
  }
];

const ContestQuiz = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  
  // State
  const [activeQuiz, setActiveQuiz] = useState(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [quizStarted, setQuizStarted] = useState(false);
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [timeLeft, setTimeLeft] = useState(0);
  const [score, setScore] = useState(0);
  const [showConfetti, setShowConfetti] = useState(false);
  const [completedQuizIds, setCompletedQuizIds] = useState([]);

  // Load progress from localStorage on mount
  useEffect(() => {
    const savedProgress = localStorage.getItem('tree_campus_contest_progress');
    if (savedProgress) {
      setCompletedQuizIds(JSON.parse(savedProgress));
    }
  }, []);

  // Timer logic
  useEffect(() => {
    let timer;
    if (quizStarted && !quizSubmitted && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            handleSubmit();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [quizStarted, quizSubmitted, timeLeft]);

  const handleStartQuiz = (quiz) => {
    if (!user) {
      toast.error('Please login to participate in the contest');
      navigate('/login');
      return;
    }

    // Identify the next contest set that needs to be played.
    // Logic: Find the first quiz ID in the list that is NOT in completedQuizIds.
    // If the user tries to start a quiz that is "locked" (i.e., previous one not done), warn them.
    // For simplicity, we can enforce linear progression or just allow them to replay old ones.
    
    // Check if previous set is completed
    const currentIndex = CONTEST_QUIZZES.findIndex(q => q.id === quiz.id);
    if (currentIndex > 0) {
      const prevQuizId = CONTEST_QUIZZES[currentIndex - 1].id;
      if (!completedQuizIds.includes(prevQuizId)) {
        toast.error(`Please complete Set ${currentIndex} first!`);
        return;
      }
    }

    setActiveQuiz(quiz);
    setQuizStarted(true);
    setTimeLeft(quiz.duration);
    setCurrentQuestionIndex(0);
    setSelectedAnswers({});
    setQuizSubmitted(false);
    setScore(0);
    window.scrollTo(0, 0);
  };

  const handleOptionSelect = (option) => {
    if (quizSubmitted) return;
    
    setSelectedAnswers(prev => ({
      ...prev,
      [currentQuestionIndex]: option
    }));
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < activeQuiz.questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    }
  };

  const handlePrevQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1);
    }
  };

  const handleSubmit = () => {
    if (quizSubmitted) return;
    
    let calculatedScore = 0;
    activeQuiz.questions.forEach((q, index) => {
      if (selectedAnswers[index] === q.correctAnswer) {
        calculatedScore += q.points;
      }
    });

    setScore(calculatedScore);
    setQuizSubmitted(true);
    setQuizStarted(false);
    
    const passed = calculatedScore >= activeQuiz.passingScore;
    if (passed) {
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 8000);
      
      // Save progress
      if (!completedQuizIds.includes(activeQuiz.id)) {
        const newCompleted = [...completedQuizIds, activeQuiz.id];
        setCompletedQuizIds(newCompleted);
        localStorage.setItem('tree_campus_contest_progress', JSON.stringify(newCompleted));
      }
    }

    toast.success('Quiz submitted successfully!');
    window.scrollTo(0, 0);
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // Determine quiz status (Locked, Active, Completed)
  const getQuizStatus = (quiz, index) => {
    const isCompleted = completedQuizIds.includes(quiz.id);
    if (isCompleted) return 'completed';
    
    // First quiz is always unlocked
    if (index === 0) return 'active';
    
    // Check if previous quiz is completed
    const prevQuizId = CONTEST_QUIZZES[index - 1].id;
    if (completedQuizIds.includes(prevQuizId)) return 'active';
    
    return 'locked';
  };

  // If no quiz selected, show quiz list
  if (!quizStarted && !quizSubmitted) {
    return (
      <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-extrabold text-gray-900 sm:text-5xl mb-4">
              Daily Contest Challenges
            </h1>
            <p className="text-lg text-gray-600">
              Complete sets to unlock new challenges! Prove your English mastery.
            </p>
          </div>

          <div className="space-y-6">
            {CONTEST_QUIZZES.map((quiz, index) => {
              const status = getQuizStatus(quiz, index);
              const isLocked = status === 'locked';
              const isCompleted = status === 'completed';

              return (
                <div 
                  key={quiz.id} 
                  className={`relative bg-white rounded-xl shadow-md overflow-hidden transition-all duration-300 border-l-4 ${
                    isLocked ? 'border-gray-300 opacity-75' : 
                    isCompleted ? 'border-green-500 shadow-md' : 'border-teal-500 hover:shadow-lg'
                  }`}
                >
                  <div className="p-6 md:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <span className={`px-3 py-1 text-xs font-bold rounded-full uppercase tracking-wider ${
                          isLocked ? 'bg-gray-100 text-gray-500' :
                          isCompleted ? 'bg-green-100 text-green-700' : 'bg-teal-100 text-teal-700'
                        }`}>
                          {isCompleted ? 'Completed' : isLocked ? 'Locked' : 'Active Set'}
                        </span>
                        <div className="flex items-center text-gray-500 text-xs font-medium">
                          <FiClock className="mr-1" />
                          {Math.ceil(quiz.duration / 60)} mins
                        </div>
                      </div>
                      
                      <h3 className="text-xl font-bold text-gray-900 mb-1">{quiz.title}</h3>
                      <p className="text-sm text-gray-600">{quiz.description}</p>
                    </div>

                    <div className="flex items-center gap-4">
                      {isCompleted ? (
                        <div className="flex items-center text-green-600 font-bold bg-green-50 px-4 py-2 rounded-lg">
                          <FiCheck className="mr-2 h-5 w-5" />
                          Done
                        </div>
                      ) : (
                        <button
                          onClick={() => !isLocked && handleStartQuiz(quiz)}
                          disabled={isLocked}
                          className={`inline-flex items-center px-6 py-3 border border-transparent text-sm font-medium rounded-lg transition-colors shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 w-full md:w-auto justify-center ${
                            isLocked 
                              ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                              : 'bg-teal-600 text-white hover:bg-teal-700 focus:ring-[#14B8A6]'
                          }`}
                        >
                          {isLocked ? (
                            <>
                              <FiLock className="mr-2 h-4 w-4" />
                              Locked
                            </>
                          ) : (
                            <>
                              <FiPlay className="mr-2 h-4 w-4" />
                              Start
                            </>
                          )}
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  }

  // Quiz Results View (Same structure but allows navigation back to list)
  if (quizSubmitted) {
    const isPassed = score >= activeQuiz.passingScore;
    
    // Find next quiz to suggest
    const currentQuizIndex = CONTEST_QUIZZES.findIndex(q => q.id === activeQuiz.id);
    const nextQuiz = CONTEST_QUIZZES[currentQuizIndex + 1];

    return (
      <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
        {showConfetti && <Confetti recycle={false} numberOfPieces={500} />}
        
        <div className="bg-white max-w-2xl w-full rounded-2xl shadow-xl overflow-hidden animate-fade-in-up">
          <div className={`p-8 text-center ${isPassed ? 'bg-green-50' : 'bg-red-50'}`}>
            <div className={`w-20 h-20 mx-auto rounded-full flex items-center justify-center mb-6 shadow-sm ${isPassed ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
              {isPassed ? <FiAward size={40} /> : <FiAlertCircle size={40} />}
            </div>
            
            <h2 className={`text-3xl font-bold mb-2 ${isPassed ? 'text-green-800' : 'text-red-800'}`}>
              {isPassed ? 'Congratulations!' : 'Almost There!'}
            </h2>
            <p className={`text-lg mb-6 ${isPassed ? 'text-green-600' : 'text-red-600'}`}>
              {isPassed ? 'Set completed successfully! You have unlocked the next challenge.' : 'You need to score higher to unlock the next set.'}
            </p>
            
            <div className="text-5xl font-extrabold text-gray-900 mb-4 tracking-tight">
              {score} <span className="text-2xl text-gray-500 font-medium">/ {activeQuiz.totalPoints}</span>
            </div>
          </div>

          <div className="p-8">
            <h3 className="text-lg font-bold text-gray-900 mb-6 border-b pb-2">Review Your Answers</h3>
            
            <div className="space-y-4 max-h-96 overflow-y-auto pr-2 custom-scrollbar">
              {activeQuiz.questions.map((q, index) => {
                const isCorrect = selectedAnswers[index] === q.correctAnswer;
                return (
                  <div key={q.id} className={`p-4 rounded-lg border ${isCorrect ? 'border-green-200 bg-green-50' : 'border-red-200 bg-red-50'}`}>
                    <p className="font-semibold text-gray-800 mb-2 text-sm">
                      <span className="mr-2 text-gray-500">{index + 1}.</span> {q.question}
                    </p>
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 text-xs">
                      <span className={`font-semibold ${isCorrect ? 'text-green-700' : 'text-red-700'}`}>
                        Your Answer: {selectedAnswers[index] || 'Skipped'}
                      </span>
                      {!isCorrect && (
                        <span className="text-green-700 font-semibold">
                          Correct: {q.correctAnswer}
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="mt-8 pt-6 border-t border-gray-100 flex flex-col sm:flex-row gap-3 justify-center">
               <button
                onClick={() => {
                  setQuizSubmitted(false);
                  setQuizStarted(false);
                  setActiveQuiz(null);
                  window.scrollTo(0, 0);
                }}
                className="px-6 py-3 bg-gray-100 text-gray-800 font-medium rounded-lg hover:bg-gray-200 transition-colors"
              >
                Back to Contest List
              </button>
              
              {isPassed && nextQuiz && (
                <button
                  onClick={() => {
                    handleStartQuiz(nextQuiz);
                  }}
                  className="px-6 py-3 bg-teal-600 text-white font-medium rounded-lg hover:bg-teal-700 transition-colors shadow-md flex items-center justify-center"
                >
                  Start Next Set <FiPlay className="ml-2" />
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Active Quiz View (Unchanged from previous except for prop usage if needed)
  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white rounded-xl shadow-sm border p-6 mb-6 flex flex-col sm:flex-row items-center justify-between gap-4 sticky top-20 z-10">
          <div>
            <h2 className="text-xl font-bold text-gray-900">{activeQuiz.title}</h2>
            <div className="text-sm text-gray-500 mt-1">
              Question {currentQuestionIndex + 1} of {activeQuiz.questions.length}
            </div>
          </div>
          <div className={`flex items-center px-4 py-2 rounded-lg font-mono font-bold text-lg ${
            timeLeft < 60 ? 'bg-red-100 text-red-600 animate-pulse' : 'bg-teal-100 text-teal-600'
          }`}>
            <FiClock className="mr-2" />
            {formatTime(timeLeft)}
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg border overflow-hidden">
          <div className="p-8">
            <h3 className="text-xl font-medium text-gray-900 mb-8 leading-relaxed">
              {activeQuiz.questions[currentQuestionIndex].question}
            </h3>

            <div className="space-y-3">
              {activeQuiz.questions[currentQuestionIndex].options.map((option, idx) => (
                <button
                  key={idx}
                  onClick={() => handleOptionSelect(option)}
                  className={`w-full text-left p-4 rounded-xl border-2 transition-all duration-200 flex items-center ${
                    selectedAnswers[currentQuestionIndex] === option
                      ? 'border-teal-500 bg-teal-50 text-teal-900 shadow-sm'
                      : 'border-gray-200 hover:border-teal-200 hover:bg-gray-50 text-gray-700'
                  }`}
                >
                  <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center mr-4 flex-shrink-0 ${
                    selectedAnswers[currentQuestionIndex] === option
                      ? 'border-teal-500 bg-[#115E59]'
                      : 'border-gray-300'
                  }`}>
                    {selectedAnswers[currentQuestionIndex] === option && (
                      <div className="w-2.5 h-2.5 bg-white rounded-full" />
                    )}
                  </div>
                  <span className="font-medium">{option}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="bg-gray-50 px-8 py-6 border-t border-gray-100 flex justify-between items-center">
            <button
              onClick={handlePrevQuestion}
              disabled={currentQuestionIndex === 0}
              className={`px-6 py-2 rounded-lg font-medium transition-colors ${
                currentQuestionIndex === 0
                  ? 'text-gray-300 cursor-not-allowed'
                  : 'text-gray-600 hover:bg-gray-200'
              }`}
            >
              Previous
            </button>
            
            {currentQuestionIndex === activeQuiz.questions.length - 1 ? (
              <button
                onClick={handleSubmit}
                className="px-8 py-3 bg-red-600 text-white font-bold rounded-lg shadow-md hover:bg-red-700 transition-transform transform hover:-translate-y-0.5 active:translate-y-0"
              >
                Submit Contest
              </button>
            ) : (
              <button
                onClick={handleNextQuestion}
                className="px-8 py-3 bg-teal-600 text-white font-bold rounded-lg shadow-md hover:bg-teal-700 transition-transform transform hover:-translate-y-0.5 active:translate-y-0"
              >
                Next Question
              </button>
            )}
          </div>
        </div>
        
        <div className="mt-8">
          <div className="h-2 w-full bg-gray-200 rounded-full overflow-hidden">
            <div 
              className="h-full bg-[#115E59] transition-all duration-300 ease-out"
              style={{ width: `${((currentQuestionIndex + 1) / activeQuiz.questions.length) * 100}%` }}
            />
          </div>
          <p className="text-center text-xs text-gray-500 mt-2">
            Your progress: {Math.round(((currentQuestionIndex + 1) / activeQuiz.questions.length) * 100)}%
          </p>
        </div>
      </div>
    </div>
  );
};

export default ContestQuiz;

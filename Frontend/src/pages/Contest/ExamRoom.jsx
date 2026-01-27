import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function ExamRoom({ examId, setSelectedExamId, email }) {
  const [exam, setExam] = useState(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [timeLeft, setTimeLeft] = useState(0);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [result, setResult] = useState(null);

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000/api';

  useEffect(() => {
    fetchExam();
  }, [examId]);

  const fetchExam = async () => {
    try {
      const token = sessionStorage.getItem("token");
      const res = await fetch(`${API_URL}/contest/exams/${examId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      setExam(data);
      setTimeLeft(data.timeLimit * 60);
      setLoading(false);
    } catch (err) {
      console.error(err);
      setSelectedExamId(null);
    }
  };

  useEffect(() => {
    if (timeLeft <= 0 || result) return;
    const timer = setInterval(() => setTimeLeft((prev) => prev - 1), 1000);
    return () => clearInterval(timer);
  }, [timeLeft, result]);

  useEffect(() => {
      if (timeLeft === 0 && !result && exam) {
          handleSubmit();
      }
  }, [timeLeft]);

  const handleAnswerSelect = (optIndex) => {
    setAnswers({ ...answers, [currentQuestionIndex]: optIndex });
  };

  const handleSubmit = async () => {
    if (Object.keys(answers).length < exam.questions.length) {
        alert("All questions are mandatory! Don't worry, there is no negative marking.");
        return;
    }

    if (isSubmitting) return;
    setIsSubmitting(true);
    try {
      const token = sessionStorage.getItem("token");
      const answersArray = exam.questions.map((_, index) => 
        answers[index] !== undefined ? answers[index] : null
      );

      const res = await fetch(`${API_URL}/contest/exams/${examId}/submit`, {
        method: "POST",
        headers: { 
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ 
          answers: answersArray, 
          timeSpent: (exam.timeLimit * 60) - timeLeft 
        }),
      });
      const data = await res.json();
      if (res.ok) {
          setResult(data);
      } else {
          alert(data.message || "Submission failed");
      }
    } catch (err) {
      alert("Submission failed. Please check your connection.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) return (
    <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <div className="w-16 h-16 border-2 border-slate-900 border-t-transparent rounded-full animate-spin mb-4"></div>
        <p className="text-slate-500 font-bold animate-pulse text-xs uppercase tracking-widest">Initialising Secure Environment...</p>
    </div>
  );

  if (result) {
    const score = result.score;
    const total = result.totalQuestions;
    const percent = total > 0 ? Math.round((score / total) * 100) : 0;
    const passed = result.passed;
    const passingRequired = result.passingPercentage;

    return (
      <motion.div 
        initial={{ opacity: 0, y: 20 }} 
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md mx-auto py-12 px-4"
      >
        <div className="bg-white rounded-[32px] shadow-2xl shadow-slate-200/50 overflow-hidden border border-gray-100">
           <div className={`p-10 text-center ${passed ? 'bg-slate-900' : 'bg-slate-800'} text-white`}>
              <div className="text-6xl mb-4">{passed ? '🎉' : '💫'}</div>
              <h2 className="text-2xl font-bold mb-2">{passed ? 'Excellent Work!' : 'Keep Going!'}</h2>
              <p className="opacity-50 font-bold uppercase tracking-[0.2em] text-[10px]">Assessment Outcome</p>
           </div>
           
           <div className="p-8 space-y-8">
              <div className="flex justify-around items-center">
                 <div className="text-center">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Final Score</p>
                    <p className="text-4xl font-bold text-slate-900">{score} <span className="text-xl text-slate-300">/ {total}</span></p>
                 </div>
                 <div className={`w-20 h-20 rounded-3xl flex items-center justify-center font-bold text-2xl border-4 ${passed ? 'bg-blue-50 text-blue-600 border-blue-100' : 'bg-gray-50 text-slate-400 border-gray-100'}`}>
                    {percent}%
                 </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                  <div className="bg-gray-50 rounded-2xl p-4 border border-gray-100">
                    <p className="text-[9px] font-bold text-slate-400 uppercase mb-1">Status</p>
                    <p className={`font-bold text-sm ${passed ? 'text-green-600' : 'text-rose-600'}`}>{passed ? 'PASSED' : 'FAILED'}</p>
                  </div>
                  <div className="bg-gray-50 rounded-2xl p-4 border border-gray-100">
                    <p className="text-[9px] font-bold text-slate-400 uppercase mb-1">Requirement</p>
                    <p className="font-bold text-sm text-slate-900">{passingRequired}%</p>
                  </div>
              </div>

              <div className="space-y-4">
                  {passed ? (
                    <div className="bg-blue-50/50 rounded-2xl p-5 border border-blue-100/50">
                        <p className="text-slate-900 font-bold text-sm mb-1">Congratulations on passing!</p>
                        <p className="text-slate-500 text-[11px] leading-relaxed">
                            You've qualified for potential rewards. If you're among the top {exam.winner_numbers || '3'} performers, your voucher will appear in the <strong>Participated</strong> section soon.
                        </p>
                    </div>
                  ) : (
                    <div className="bg-amber-50/50 rounded-2xl p-5 border border-amber-100/50">
                        <p className="text-amber-900 font-bold text-sm mb-1">Supportive Feedback</p>
                        <p className="text-amber-700/70 text-[11px] leading-relaxed italic">
                            "Success is the sum of small efforts, repeated day in and day out." Review your results and strive for perfection in the next contest!
                        </p>
                    </div>
                  )}
              </div>

              <button 
                onClick={() => setSelectedExamId(null)}
                className="w-full py-4 bg-slate-900 text-white rounded-2xl font-bold text-sm hover:shadow-xl hover:bg-slate-800 transition-all active:scale-95"
              >
                Return to Dashboard
              </button>
           </div>
        </div>
      </motion.div>
    );
  }

  const currentQuestion = exam.questions[currentQuestionIndex];

  return (
    <div className="max-w-4xl mx-auto py-10 px-4">
      <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
          <div className="p-8 pb-4">
              <h2 className="text-3xl font-bold text-slate-700 text-center mb-6">{exam.title}</h2>
              <div className="flex justify-between items-center mb-8 px-2">
                  <p className="text-lg text-slate-500 font-semibold">Question {currentQuestionIndex + 1} of {exam.questions.length}</p>
                  <p className="text-xl font-bold text-red-500">{Math.floor(timeLeft / 60)}:{String(timeLeft % 60).padStart(2, "0")}</p>
              </div>

              <div className="bg-[#1e293b] p-8 rounded-xl mb-8">
                  <h3 className="text-xl font-bold text-white mb-8">
                      {currentQuestion.question}
                  </h3>
                  
                  <div className="space-y-4">
                      {currentQuestion.options.map((option, idx) => (
                          <button
                            key={idx}
                            onClick={() => handleAnswerSelect(idx)}
                            className={`w-full p-4 rounded-lg text-left text-white font-semibold border-2 transition-all ${
                                answers[currentQuestionIndex] === idx 
                                ? "bg-green-600 border-green-400" 
                                : "bg-blue-600 border-blue-400 hover:bg-blue-700"
                            }`}
                          >
                            {option}
                          </button>
                      ))}
                  </div>
              </div>

              <div className="flex justify-center gap-4 py-4">
                  <button 
                      disabled={currentQuestionIndex === 0}
                      onClick={() => setCurrentQuestionIndex(prev => prev - 1)}
                      className="px-8 py-2.5 bg-gray-400 text-white rounded-lg font-bold text-sm disabled:opacity-50 transition-colors"
                  >
                      Previous
                  </button>
                  
                  {currentQuestionIndex === exam.questions.length - 1 ? (
                    <button 
                        onClick={handleSubmit} 
                        disabled={isSubmitting}
                        className="px-8 py-2.5 bg-gray-400 text-white rounded-lg font-bold text-sm hover:bg-green-600 transition-colors disabled:opacity-50"
                    >
                        {isSubmitting ? 'Submitting...' : 'Submit'}
                    </button>
                  ) : (
                    <button 
                        onClick={() => setCurrentQuestionIndex(prev => prev + 1)}
                        className="px-8 py-2.5 bg-blue-600 text-white rounded-lg font-bold text-sm hover:bg-blue-700 transition-colors"
                    >
                        Next
                    </button>
                  )}
              </div>
          </div>
      </div>
    </div>
  );
}

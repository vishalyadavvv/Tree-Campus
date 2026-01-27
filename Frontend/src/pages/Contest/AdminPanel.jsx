import React, { useState, useReducer, useCallback, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const examReducer = (state, action) => {
  switch (action.type) {
    case "UPDATE_FIELD":
      return { ...state, [action.field]: action.value };
    case "INITIALIZE_QUESTIONS":
      return {
        ...state,
        questions: Array.from({ length: action.numQuestions }, () => ({
          question: "",
          options: ["", "", "", ""],
          answer: "",
        })),
      };
    case "UPDATE_QUESTION":
      return {
        ...state,
        questions: state.questions.map((q, i) =>
          i === action.index ? { ...q, [action.field]: action.value } : q
        ),
      };
    case "SET_EXAM":
      return { ...action.exam };
    case "SET_QUESTIONS":
      return { ...state, questions: action.questions };
    default:
      return state;
  }
};

const AdminPanel = () => {
    const [mode, setMode] = useState("create");
    const [step, setStep] = useState(1);
    const [numQuestions, setNumQuestions] = useState(0);
    const [questionEntryMode, setQuestionEntryMode] = useState("manual");
    const [jsonInput, setJsonInput] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [exams, setExams] = useState([]);
    const [updateExamId, setUpdateExamId] = useState(null);

    const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000/api';

    const [examDetails, dispatch] = useReducer(examReducer, {
        title: "",
        description: "",
        timeLimit: "30",
        startDate: "",
        duration: "1",
        passingScore: "",
        winner_numbers: "",
        questions: [],
    });

    const fetchExams = async () => {
        setLoading(true);
        try {
            const token = sessionStorage.getItem("token");
            const response = await fetch(`${API_URL}/admin/contest/exams`, {
                 headers: { Authorization: `Bearer ${token}` }
            });
            if (!response.ok) throw new Error("Failed to fetch exams");
            const data = await response.json();
            setExams(data);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (mode === "update") fetchExams();
    }, [mode, API_URL]);

    const handleNumQuestionsChange = (e) => setNumQuestions(Number(e.target.value));

    const initializeQuestions = useCallback(() => {
        if (numQuestions > 0) {
            if (questionEntryMode === "manual") {
                dispatch({ type: "INITIALIZE_QUESTIONS", numQuestions });
            }
            setStep(2);
        } else {
            alert("Please enter a valid number of questions.");
        }
    }, [numQuestions, questionEntryMode]);

    const handleJsonParse = () => {
        try {
            const parsed = JSON.parse(jsonInput);
            dispatch({ type: "SET_QUESTIONS", questions: parsed });
            setStep(2);
        } catch (err) {
            alert("Invalid JSON: " + err.message);
        }
    };

    const handleChange = (e) => dispatch({ type: "UPDATE_FIELD", field: e.target.name, value: e.target.value });
    
    const handleQuestionChange = (index, field, value) => {
        dispatch({ type: "UPDATE_QUESTION", index, field, value });
    };

    const handleOptionChange = (index, optIndex, value) => {
        const updatedOptions = examDetails.questions[index].options.map((opt, i) =>
          i === optIndex ? value : opt
        );
        dispatch({ type: "UPDATE_QUESTION", index, field: "options", value: updatedOptions });
    };

    const handleSubmit = async () => {
        setLoading(true);
        try {
          const start = new Date(examDetails.startDate);
          const end = new Date(start);
          end.setDate(start.getDate() + parseInt(examDetails.duration, 10));
    
          const examDataToSend = { 
            ...examDetails,
            endDate: end.toISOString(),
            passingPercentage: Number(examDetails.passingScore), 
            timeLimit: Number(examDetails.timeLimit),
            duration: Number(examDetails.duration),
            winner_numbers: Number(examDetails.winner_numbers)
          };
    
          const url = mode === "create" ? `${API_URL}/admin/contest/exams` : `${API_URL}/admin/contest/exams/${updateExamId}`;
          const method = mode === "create" ? "POST" : "PUT";
          const token = sessionStorage.getItem("token");

          const response = await fetch(url, {
            method,
            headers: { 
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`
            },
            body: JSON.stringify(examDataToSend),
          });
    
          if (!response.ok) throw new Error("Failed to save exam");
          alert(`Exam ${mode === "create" ? "created" : "updated"} successfully!`);
          if (mode === "update") {
              setMode("create");
              setStep(1);
          } else {
              setStep(1);
              // Reset
              dispatch({ type: "SET_EXAM", exam: {
                title: "", description: "", timeLimit: "30", startDate: "",
                duration: "1", passingScore: "", winner_numbers: "", questions: []
              }});
          }

        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-6xl mx-auto">
             <div className="flex bg-white p-1 rounded-2xl w-fit mb-8 shadow-sm border border-gray-100">
                  <button 
                    onClick={() => { setMode("create"); setStep(1); }}
                    className={`px-8 py-3 rounded-xl font-bold transition-all ${mode==="create" ? "bg-indigo-600 text-white shadow-lg shadow-indigo-200" : "text-gray-500 hover:text-indigo-600"}`}
                  >
                    ✨ Create Contest
                  </button>
                  <button 
                    onClick={() => { setMode("update"); setStep(1); }}
                    className={`px-8 py-3 rounded-xl font-bold transition-all ${mode==="update" ? "bg-indigo-600 text-white shadow-lg shadow-indigo-200" : "text-gray-500 hover:text-indigo-600"}`}
                  >
                    📝 Manage Contests
                  </button>
             </div>

             <section className="bg-white rounded-3xl p-8 shadow-xl border border-gray-100">
                <AnimatePresence mode="wait">
                    {mode === "create" && step === 1 && (
                        <motion.div key="step1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                             <div className="flex items-center gap-4 mb-8">
                                <div className="w-12 h-12 rounded-2xl bg-indigo-100 text-indigo-600 flex items-center justify-center font-black text-xl">1</div>
                                <div>
                                    <h3 className="text-2xl font-black text-gray-900 leading-none">Contest Configuration</h3>
                                    <p className="text-gray-500 text-sm mt-1">Specify layout and question entry method</p>
                                </div>
                             </div>

                             <div className="space-y-6 max-w-2xl">
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-2">Question Entry Mode</label>
                                    <div className="grid grid-cols-2 gap-4">
                                        <button 
                                            onClick={() => setQuestionEntryMode("manual")}
                                            className={`p-6 rounded-2xl border-2 text-left transition-all ${questionEntryMode === 'manual' ? 'border-indigo-600 bg-indigo-50/50' : 'border-gray-100 hover:border-indigo-200'}`}
                                        >
                                            <p className="text-2xl mb-2">✍️</p>
                                            <p className="font-bold text-gray-900">Manual Entry</p>
                                            <p className="text-xs text-gray-400">Add questions one-by-one with options</p>
                                        </button>
                                        <button 
                                            onClick={() => setQuestionEntryMode("json")}
                                            className={`p-6 rounded-2xl border-2 text-left transition-all ${questionEntryMode === 'json' ? 'border-indigo-600 bg-indigo-50/50' : 'border-gray-100 hover:border-indigo-200'}`}
                                        >
                                            <p className="text-2xl mb-2">📋</p>
                                            <p className="font-bold text-gray-900">Bulk JSON</p>
                                            <p className="text-xs text-gray-400">Paste raw JSON data for quick upload</p>
                                        </button>
                                    </div>
                                </div>

                                {questionEntryMode === "manual" ? (
                                    <div className="animate-in fade-in slide-in-from-top-2">
                                        <label className="block text-sm font-bold text-gray-700 mb-2">How many questions?</label>
                                        <div className="flex gap-4">
                                            <input 
                                                type="number" 
                                                value={numQuestions} 
                                                onChange={handleNumQuestionsChange} 
                                                className="flex-1 p-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-indigo-500 outline-none font-bold text-lg"
                                                placeholder="e.g. 50"
                                            />
                                            <button onClick={initializeQuestions} className="px-8 bg-indigo-600 text-white font-black rounded-2xl shadow-lg shadow-indigo-100 active:scale-95 transition">
                                                Continue ➔
                                            </button>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="animate-in fade-in slide-in-from-top-2">
                                        <label className="block text-sm font-bold text-gray-700 mb-2">Paste JSON Schema</label>
                                        <textarea 
                                            value={jsonInput} 
                                            onChange={(e) => setJsonInput(e.target.value)} 
                                            placeholder="[ { 'question': '...', 'options': [...], 'answer': '...' }, ... ]"
                                            className="w-full h-48 p-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-indigo-500 outline-none font-mono text-sm mb-4"
                                        />
                                        <button onClick={handleJsonParse} className="w-full p-4 bg-indigo-600 text-white font-black rounded-2xl shadow-lg shadow-indigo-100 active:scale-95 transition">
                                            Import JSON Content
                                        </button>
                                    </div>
                                )}
                             </div>
                        </motion.div>
                    )}

                    {(step === 2 || (mode === "update" && updateExamId)) && (
                        <motion.div key="step2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                             <div className="flex items-center justify-between mb-10">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-2xl bg-indigo-100 text-indigo-600 flex items-center justify-center font-black text-xl">2</div>
                                    <div>
                                        <h3 className="text-2xl font-black text-gray-900 leading-none">Contest Details & Content</h3>
                                        <p className="text-gray-500 text-sm mt-1">Review questions and finalize metadata</p>
                                    </div>
                                </div>
                                <button onClick={() => setStep(1)} className="text-indigo-600 font-bold hover:underline">← Go Back</button>
                             </div>

                             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
                                 <div>
                                    <label className="block text-[10px] uppercase tracking-widest font-black text-gray-400 mb-1">Title</label>
                                    <input name="title" value={examDetails.title} onChange={handleChange} className="w-full p-3 bg-gray-50 border-gray-100 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500" />
                                 </div>
                                 <div>
                                    <label className="block text-[10px] uppercase tracking-widest font-black text-gray-400 mb-1">Time Limit (min)</label>
                                    <input name="timeLimit" type="number" value={examDetails.timeLimit} onChange={handleChange} className="w-full p-3 bg-gray-50 border-gray-100 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500" />
                                 </div>
                                 <div>
                                    <label className="block text-[10px] uppercase tracking-widest font-black text-gray-400 mb-1">Passing %</label>
                                    <input name="passingScore" type="number" value={examDetails.passingScore} onChange={handleChange} className="w-full p-3 bg-gray-50 border-gray-100 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500" />
                                 </div>
                                 <div className="lg:col-span-1">
                                    <label className="block text-[10px] uppercase tracking-widest font-black text-gray-400 mb-1">Start Date</label>
                                    <input name="startDate" type="date" value={examDetails.startDate} onChange={handleChange} className="w-full p-3 bg-gray-50 border-gray-100 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500" />
                                 </div>
                                 <div>
                                    <label className="block text-[10px] uppercase tracking-widest font-black text-gray-400 mb-1">Duration (Days)</label>
                                    <input name="duration" type="number" value={examDetails.duration} onChange={handleChange} className="w-full p-3 bg-gray-50 border-gray-100 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500" />
                                 </div>
                                 <div>
                                    <label className="block text-[10px] uppercase tracking-widest font-black text-gray-400 mb-1">Winners Count</label>
                                    <input name="winner_numbers" type="number" value={examDetails.winner_numbers} onChange={handleChange} className="w-full p-3 bg-gray-50 border-gray-100 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500" />
                                 </div>
                             </div>

                             <div className="space-y-4 max-h-[500px] overflow-y-auto mb-10 pr-4 custom-scrollbar">
                                {examDetails.questions.map((q, i) => (
                                    <div key={i} className="p-6 bg-gray-50 rounded-2xl border border-gray-100 relative group">
                                         <span className="absolute -left-3 top-6 w-8 h-8 rounded-full bg-white border-2 border-indigo-600 flex items-center justify-center font-black text-xs text-indigo-600 shadow-sm">{i+1}</span>
                                         <input 
                                            placeholder="Type your question here..." 
                                            value={q.question} 
                                            onChange={(e) => handleQuestionChange(i, "question", e.target.value)} 
                                            className="w-full bg-transparent border-b border-gray-200 pb-2 mb-4 font-bold text-gray-900 outline-none focus:border-indigo-600"
                                         />
                                         <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            {q.options.map((opt, optI) => (
                                                <div key={optI} className="flex items-center gap-2">
                                                    <input 
                                                        type="radio" 
                                                        checked={Number(q.answer) === optI}
                                                        onChange={() => handleQuestionChange(i, "answer", optI)}
                                                        className="w-4 h-4 text-indigo-600"
                                                    />
                                                    <input 
                                                        placeholder={`Option ${optI+1}`} 
                                                        value={opt} 
                                                        onChange={(e) => handleOptionChange(i, optI, e.target.value)} 
                                                        className="flex-1 p-2 bg-white rounded-lg border border-gray-100 text-sm outline-none focus:ring-1 focus:ring-indigo-500"
                                                    />
                                                </div>
                                            ))}
                                         </div>
                                    </div>
                                ))}
                             </div>

                             <button 
                                onClick={handleSubmit} 
                                disabled={loading} 
                                className="w-full py-5 bg-indigo-600 text-white font-black text-xl rounded-2xl shadow-2xl shadow-indigo-200 active:scale-95 transition-all disabled:opacity-50"
                             >
                                {loading ? "🚀 Synchronizing Data..." : mode === "create" ? "✨ Launch Contest" : "📦 Update Content"}
                             </button>
                        </motion.div>
                    )}

                    {mode === "update" && !updateExamId && (
                        <motion.div key="manage" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                            <h3 className="text-xl font-bold mb-6 text-gray-900">Choose a contest to modify</h3>
                            {loading ? (
                                <div className="space-y-4">
                                    {[1, 2, 3].map(i => <div key={i} className="h-16 bg-gray-50 animate-pulse rounded-xl"></div>)}
                                </div>
                            ) : (
                                <div className="grid grid-cols-1 gap-4">
                                    {exams.map(exam => (
                                        <div key={exam._id} className="p-4 bg-gray-50 rounded-2xl border border-gray-100 flex items-center justify-between hover:bg-indigo-50/30 transition group">
                                            <div>
                                                <h4 className="font-bold text-gray-900">{exam.title}</h4>
                                                <p className="text-xs text-gray-500 flex gap-4">
                                                    <span>📅 {new Date(exam.startDate).toLocaleDateString()}</span>
                                                    <span>🙋 {exam.studentResponses?.length || 0} participants</span>
                                                </p>
                                            </div>
                                            <div className="flex gap-2">
                                                <button 
                                                    onClick={() => {
                                                        dispatch({type: "SET_EXAM", exam: {
                                                            ...exam, 
                                                            startDate: exam.startDate.split('T')[0], 
                                                            passingScore: exam.passingPercentage
                                                        }}); 
                                                        setUpdateExamId(exam._id);
                                                    }} 
                                                    className="bg-white text-indigo-600 font-bold px-4 py-2 rounded-xl border border-indigo-100 hover:shadow-md transition"
                                                >
                                                    Edit
                                                </button>
                                                <button 
                                                    className="bg-white text-red-600 font-bold px-4 py-2 rounded-xl border border-red-100 hover:shadow-md transition"
                                                    onClick={async () => {
                                                        if(!confirm('Are you sure you want to delete this contest?')) return;
                                                        setLoading(true);
                                                        try {
                                                            const token = sessionStorage.getItem("token");
                                                            await fetch(`${API_URL}/admin/contest/exams/${exam._id}`, {
                                                                method: 'DELETE',
                                                                headers: { Authorization: `Bearer ${token}` }
                                                            });
                                                            fetchExams();
                                                        } finally { setLoading(false); }
                                                    }}
                                                >
                                                    Delete
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                    {exams.length === 0 && <p className="text-center py-20 text-gray-400">No contests found.</p>}
                                </div>
                            )}
                        </motion.div>
                    )}
                </AnimatePresence>
             </section>

             {/* Winner Declaration Footer */}
             <div className="mt-12 bg-gray-900 rounded-3xl p-8 text-white flex flex-col md:flex-row items-center justify-between gap-8 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 rounded-full -mr-32 -mt-32"></div>
                    <div className="relative z-10">
                        <h3 className="text-2xl font-black mb-2">Process Expired Exams</h3>
                        <p className="text-gray-400 text-sm max-w-lg">Clicking this will automatically calculate winners for all recently ended contests, generate safe coupons, and dispatch notification emails to the toppers.</p>
                    </div>
                    <button 
                        onClick={async () => {
                            setLoading(true);
                            try {
                                const token = sessionStorage.getItem("token");
                                const res = await fetch(`${API_URL}/admin/contest/process-expired-exams`, {
                                    headers: { Authorization: `Bearer ${token}` }
                                });
                                const data = await res.json();
                                if(!res.ok) throw new Error(data.message || 'Error');
                                alert(`Success: Processed ${data.counts} exams. ${data.emails.length} emails sent.`);
                            } catch(e) {
                                alert(e.message);
                            } finally {
                                setLoading(false);
                            }
                        }}
                        disabled={loading}
                        className="relative z-10 bg-indigo-500 hover:bg-indigo-400 text-white font-black px-10 py-5 rounded-2xl shadow-2xl transition-all disabled:opacity-50 active:scale-95"
                    >
                        {loading ? "⚙️ Processing..." : "📢 Declare Winners & Notify"}
                    </button>
                </div>
        </div>
    );
};

export default AdminPanel;

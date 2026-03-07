import React, { useState, useReducer, useCallback, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  FiPlus, 
  FiUpload, 
  FiEye, 
  FiMail, 
  FiCheckCircle, 
  FiAlertCircle, 
  FiX, 
  FiCopy,
  FiTrash2,
  FiEdit
} from "react-icons/fi";

// Reducer for managing exam details state
const examReducer = (state, action) => {
  switch (action.type) {
    case "UPDATE_FIELD":
      return { ...state, [action.field]: action.value };
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
    case "ADD_QUESTION":
      return {
        ...state,
        questions: [
            ...state.questions,
            { question: "", options: ["", "", "", ""], answer: 0 }
        ]
      };
    case "REMOVE_QUESTION":
      return {
        ...state,
        questions: state.questions.filter((_, i) => i !== action.index)
      };
    default:
      return state;
  }
};

export default function AdminPanel() {
  const API_URL = import.meta.env.VITE_API_URL;
  
  const [view, setView] = useState("dashboard"); // 'dashboard', 'form', or 'details'
  const [mode, setMode] = useState("create"); // 'create' or 'edit'
  const [exams, setExams] = useState([]);
  const [selectedExam, setSelectedExam] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isSubmitLoading, setIsSubmitLoading] = useState(false);
  const [emailLoading, setEmailLoading] = useState(false);
  const [showJsonModal, setShowJsonModal] = useState(false);
  const [jsonInput, setJsonInput] = useState("");
  const [jsonError, setJsonError] = useState("");
  const [updateExamId, setUpdateExamId] = useState(null);

  const initialExamState = {
    title: "",
    description: "",
    timeLimit: "30",
    startDate: "",
    endDate: "",
    passingPercentage: "40",
    winner_numbers: "1",
    status: "active",
    questions: [
        { question: "", options: ["", "", "", ""], answer: 0 }
    ],
  };

  const [examDetails, dispatch] = useReducer(examReducer, initialExamState);

  useEffect(() => {
    fetchExams();
  }, []);

  const fetchExams = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${API_URL}/admin/contest/exams`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (!response.ok) throw new Error("Failed to fetch exams");
      const data = await response.json();
      setExams(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleProcessEmail = async (examId) => {
    setEmailLoading(true);
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${API_URL}/admin/contest/process-expired-exams`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (!response.ok) throw new Error("Failed to process emails");
      const data = await response.json();
      alert(`Processed. ${data.emails.length} emails sent.`);
    } catch (err) {
      alert("Failed to send emails.");
    } finally {
      setEmailLoading(false);
    }
  };

  const handleDelete = async (examId) => {
    if (!window.confirm("Are you sure you want to delete this contest? This action cannot be undone.")) return;
    
    try {
        const token = localStorage.getItem("token");
        const response = await fetch(`${API_URL}/admin/contest/exams/${examId}`, {
            method: 'DELETE',
            headers: { Authorization: `Bearer ${token}` }
        });
        if (!response.ok) throw new Error("Failed to delete contest");
        
        alert("Contest deleted successfully.");
        setExams(exams.filter(e => e._id !== examId));
        if (selectedExam?._id === examId) setView("dashboard");
    } catch (err) {
        alert(err.message);
    }
  };

  const handleTogglePause = async (exam) => {
    const newStatus = exam.status === 'paused' ? 'active' : 'paused';
    try {
        const token = localStorage.getItem("token");
        const response = await fetch(`${API_URL}/admin/contest/exams/${exam._id}`, {
            method: 'PUT',
            headers: { 
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}` 
            },
            body: JSON.stringify({ status: newStatus })
        });
        if (!response.ok) throw new Error("Failed to update status");
        
        // Update local state
        const updatedExams = exams.map(e => e._id === exam._id ? { ...e, status: newStatus } : e);
        setExams(updatedExams);
        if (selectedExam?._id === exam._id) setSelectedExam({ ...selectedExam, status: newStatus });
        
        alert(`Exam ${newStatus === 'paused' ? 'paused' : 'resumed'} successfully.`);
    } catch (err) {
        alert(err.message);
    }
  };

  const handleViewDetails = (exam) => {
    setSelectedExam(exam);
    setView("details");
  };

  // Helper to format a date as local datetime string for datetime-local input
  const toLocalDatetimeString = (dateStr) => {
    if (!dateStr) return "";
    const d = new Date(dateStr);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    const hours = String(d.getHours()).padStart(2, '0');
    const minutes = String(d.getMinutes()).padStart(2, '0');
    return `${year}-${month}-${day}T${hours}:${minutes}`;
  };

  const handleEdit = (exam) => {
    dispatch({ 
        type: "SET_EXAM", 
        exam: {
            ...exam,
            startDate: toLocalDatetimeString(exam.startDate),
            endDate: toLocalDatetimeString(exam.endDate),
        } 
    });
    setUpdateExamId(exam._id);
    setMode("edit");
    setView("form");
  };

  const handleCreateNew = () => {
    dispatch({ type: "SET_EXAM", exam: initialExamState });
    setMode("create");
    setView("form");
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    dispatch({ type: "UPDATE_FIELD", field: name, value });
  };

  const handleQuestionChange = (index, field, value) => {
    dispatch({ type: "UPDATE_QUESTION", index, field, value });
  };

  const handleOptionChange = (index, optIndex, value) => {
    const updatedOptions = [...examDetails.questions[index].options];
    updatedOptions[optIndex] = value;
    dispatch({ type: "UPDATE_QUESTION", index, field: "options", value: updatedOptions });
  };

  const handleJsonImport = () => {
    setJsonError("");
    try {
      const parsed = JSON.parse(jsonInput);
      // Support both single question object and array of questions
      const questionsArray = Array.isArray(parsed) ? parsed : [parsed];
      
      // Basic validation for each item
      questionsArray.forEach((q, idx) => {
        if (!q.question || !Array.isArray(q.options) || typeof q.answer !== 'number') {
          throw new Error(`Invalid format at item ${idx + 1}. Each question must have 'question', 'options' (array), and 'answer' (number).`);
        }
      });

      dispatch({ type: "SET_QUESTIONS", questions: questionsArray });
      setShowJsonModal(false);
      setJsonInput("");
    } catch (err) {
      setJsonError(err.message);
    }
  };

  const handleSubmit = async () => {
    setIsSubmitLoading(true);
    try {
      const token = localStorage.getItem("token");
      const url = mode === "create"
        ? `${API_URL}/admin/contest/exams`
        : `${API_URL}/admin/contest/exams/${updateExamId}`;
      const method = mode === "create" ? "POST" : "PUT";
      
      const payload = {
        ...examDetails,
        passingPercentage: Number(examDetails.passingPercentage),
        timeLimit: Number(examDetails.timeLimit),
        winner_numbers: Number(examDetails.winner_numbers),
        duration: Number(examDetails.timeLimit),
        startDate: new Date(examDetails.startDate).toISOString(),
        endDate: new Date(examDetails.endDate).toISOString(),
      };

      const response = await fetch(url, {
        method,
        headers: { 
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) throw new Error("Save failed");
      
      alert(`Contest ${mode === "create" ? "created" : "updated"} successfully!`);
      setView("dashboard");
      fetchExams();
    } catch (err) {
      alert(err.message);
    } finally {
      setIsSubmitLoading(false);
    }
  };

  const copyJsonPrompt = () => {
    const prompt = `Convert the following question into this JSON format:
{
  "question": "Your question?",
  "options": ["Option A", "Option B", "Option C", "Option D"],
  "answer": index_of_correct_option (0-based)
}`;
    navigator.clipboard.writeText(prompt);
  };

  if (view === "dashboard") {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-gray-800">Contest Dashboard</h2>
          <button 
            onClick={handleCreateNew}
            className="flex items-center gap-2 bg-[#22C55E] hover:bg-green-600 text-white px-4 py-2 rounded-lg font-bold transition-all shadow-sm"
          >
            <FiPlus /> Create New Quiz +
          </button>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead className="bg-[#F8FAFC]">
              <tr>
                <th className="p-4 text-xs font-bold text-gray-500 uppercase tracking-wider text-[11px]">TITLE</th>
                <th className="p-4 text-xs font-bold text-gray-500 uppercase tracking-wider text-[11px]">START DATE</th>
                <th className="p-4 text-xs font-bold text-gray-500 uppercase tracking-wider text-[11px]">END DATE</th>
                <th className="p-4 text-xs font-bold text-gray-500 uppercase tracking-wider text-[11px]">TIME LIMIT (MIN)</th>
                <th className="p-4 text-xs font-bold text-gray-500 uppercase tracking-wider text-[11px]">STATUS</th>
                <th className="p-4 text-xs font-bold text-gray-500 uppercase tracking-wider text-[11px]">ACTIONS</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {loading ? (
                <tr><td colSpan="6" className="p-8 text-center text-gray-400">Loading contests...</td></tr>
              ) : exams.length === 0 ? (
                <tr><td colSpan="6" className="p-8 text-center text-gray-400">No contests found.</td></tr>
              ) : exams.map((exam) => {
                const isPassed = new Date() > new Date(exam.endDate);
                return (
                  <tr key={exam._id} className="hover:bg-gray-50 transition-colors">
                    <td className="p-4 font-medium text-gray-700 text-sm">{exam.title}</td>
                    <td className="p-4 text-sm text-gray-600">
                      {new Date(exam.startDate).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}, {new Date(exam.startDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </td>
                    <td className="p-4 text-sm text-gray-600">
                      {new Date(exam.endDate).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}, {new Date(exam.endDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </td>
                    <td className="p-4 text-sm text-gray-600">{exam.timeLimit} min</td>
                    <td className="p-4 text-sm">
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider 
                        ${exam.status === 'paused' ? 'bg-amber-100 text-amber-600' : isPassed ? 'bg-gray-100 text-gray-500' : 'bg-green-100 text-green-600'}`}>
                        {exam.status === 'paused' ? 'Paused' : isPassed ? 'Expired' : 'Active'}
                      </span>
                    </td>
                    <td className="p-4">
                      <div className="flex gap-4">
                        <button 
                          onClick={() => handleViewDetails(exam)}
                          className="flex items-center gap-1.5 text-blue-600 hover:text-blue-800 font-bold text-sm transition-colors"
                        >
                          <FiEye size={16} /> View All
                        </button>
                        <button 
                          onClick={() => handleProcessEmail(exam._id)}
                          className="flex items-center gap-1.5 text-[#22C55E] hover:text-green-700 font-bold text-sm transition-colors"
                        >
                          <FiMail size={16} /> Email
                        </button>
                        <button 
                          onClick={() => handleDelete(exam._id)}
                          className="flex items-center gap-1.5 text-rose-500 hover:text-rose-700 font-bold text-sm transition-colors"
                        >
                          <FiTrash2 size={16} /> Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    );
  }

  if (view === "details" && selectedExam) {
    const isPassed = new Date() > new Date(selectedExam.endDate);
    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <div className="bg-white rounded-[32px] p-8 shadow-sm border border-gray-100 relative">
                <button 
                    onClick={() => setView('dashboard')}
                    className="absolute top-8 right-8 text-gray-400 hover:text-gray-600 transition"
                >
                    <FiX size={24} />
                </button>

                <div className="max-w-4xl">
                    <h2 className="text-3xl font-black text-[#1E293B] mb-2">{selectedExam.title}</h2>
                    <p className="text-gray-500 text-lg mb-6 leading-relaxed">
                        {selectedExam.description || "No description provided."}
                    </p>

                    <div className="flex items-center gap-2 mb-8">
                        <span className={`px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest 
                            ${selectedExam.status === 'paused' ? 'bg-amber-100 text-amber-600' : isPassed ? 'bg-gray-100 text-gray-500' : 'bg-green-100 text-green-600'}`}>
                            {selectedExam.status === 'paused' ? 'Paused' : isPassed ? 'Active' : 'Active'}
                        </span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-y-6 gap-x-12 mb-10">
                        <div className="flex items-center gap-2">
                            <span className="font-bold text-gray-900">Time Limit:</span>
                            <span className="text-gray-600">{selectedExam.timeLimit} mins</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="font-bold text-gray-900">Passing Percentage:</span>
                            <span className="text-gray-600">{selectedExam.passingPercentage || 0}%</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="font-bold text-gray-900">Start Date:</span>
                            <span className="text-gray-600">{new Date(selectedExam.startDate).toLocaleString()}</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="font-bold text-gray-900">End Date:</span>
                            <span className="text-gray-600">{new Date(selectedExam.endDate).toLocaleString()}</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="font-bold text-gray-900">Number of Coupons:</span>
                            <span className="text-gray-600">{selectedExam.winner_numbers || 0}</span>
                        </div>
                    </div>

                    <div className="flex flex-wrap gap-4">
                        <button 
                            onClick={() => handleEdit(selectedExam)}
                            className="flex items-center gap-2 px-8 py-3.5 bg-[#5E5CED] hover:bg-[#4E4CDD] text-white rounded-xl font-bold transition-all shadow-lg shadow-indigo-100"
                        >
                            <FiEdit /> Edit Exam
                        </button>
                        <button 
                            onClick={() => handleTogglePause(selectedExam)}
                            className={`flex items-center gap-2 px-8 py-3.5 ${selectedExam.status === 'paused' ? 'bg-green-500 hover:bg-green-600' : 'bg-[#EFB008] hover:bg-[#D9A007]'} text-white rounded-xl font-bold transition-all shadow-lg shadow-yellow-100`}
                        >
                            {selectedExam.status === 'paused' ? <><FiCheckCircle /> Resume Exam</> : <><FiAlertCircle /> Pause Exam</>}
                        </button>
                        <button 
                            onClick={() => {
                                // Direct path to tables
                                window.location.href = "/admin/contests?section=adminTables";
                            }}
                            className="flex items-center gap-2 px-8 py-3.5 bg-[#334155] hover:bg-[#1E293B] text-white rounded-xl font-bold transition-all shadow-lg shadow-slate-100"
                        >
                            <FiEye /> View Response Table
                        </button>
                        <button 
                            onClick={() => handleDelete(selectedExam._id)}
                            className="flex items-center gap-2 px-8 py-3.5 bg-rose-500 hover:bg-rose-600 text-white rounded-xl font-bold transition-all shadow-lg shadow-rose-100"
                        >
                            <FiTrash2 /> Delete Contest
                        </button>
                    </div>
                </div>
            </div>

            <div className="bg-white rounded-[32px] p-8 shadow-sm border border-gray-100">
                <h3 className="text-2xl font-black text-[#1E293B] mb-8 flex items-center gap-3">
                    📝 Questions
                </h3>
                <div className="space-y-6">
                    {selectedExam.questions.map((q, idx) => (
                        <div key={idx} className="bg-[#F8FAFC] p-8 rounded-2xl border border-gray-100">
                            <p className="font-bold text-lg text-[#1E293B] mb-6">Q{idx + 1}: {q.question}</p>
                            <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {q.options.map((opt, oIdx) => (
                                    <li key={oIdx} className="flex items-center gap-3">
                                        <div className={`w-2 h-2 rounded-full ${q.answer === oIdx ? 'bg-green-500' : 'bg-gray-300'}`} />
                                        <span className={`font-bold ${q.answer === oIdx ? 'text-green-600' : 'text-gray-600'}`}>{opt}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
  }

  // FORM VIEW
  return (
    <div className="bg-white rounded-[32px] p-8 shadow-sm border border-gray-100">
      <div className="flex justify-between items-center mb-10">
        <h2 className="text-3xl font-bold text-[#1E293B]">
          {mode === 'create' ? 'Create a New Exam / Quiz' : 'Update Exam / Quiz'}
        </h2>
        <button 
          onClick={() => setShowJsonModal(true)}
          className="bg-[#2563EB] hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-bold flex items-center gap-2 transition-all shadow-sm"
        >
          <FiUpload /> Upload from JSON
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8">
        <div>
          <label className="block text-sm font-bold text-gray-700 mb-2">Exam Title</label>
          <input 
            type="text" 
            name="title"
            value={examDetails.title}
            onChange={handleChange}
            placeholder="Enter Exam Title"
            className="w-full p-4 bg-[#F8FAFC] border border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 transition-colors"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">Time Limit (mins)</label>
            <input 
              type="number" 
              name="timeLimit"
              value={examDetails.timeLimit}
              onChange={handleChange}
              placeholder="30"
              className="w-full p-4 bg-[#F8FAFC] border border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 transition-colors"
            />
          </div>
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">Passing Percentage</label>
            <input 
              type="number" 
              name="passingPercentage"
              value={examDetails.passingPercentage}
              onChange={handleChange}
              placeholder="60"
              className="w-full p-4 bg-[#F8FAFC] border border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 transition-colors"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-bold text-gray-700 mb-2">Number of Coupons</label>
          <input 
            type="number" 
            name="winner_numbers"
            value={examDetails.winner_numbers}
            onChange={handleChange}
            placeholder="3"
            className="w-full p-4 bg-[#F8FAFC] border border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 transition-colors"
          />
        </div>

        <div>
          <label className="block text-sm font-bold text-gray-700 mb-2">Start Date & Time</label>
          <input 
            type="datetime-local" 
            name="startDate"
            value={examDetails.startDate}
            onChange={handleChange}
            className="w-full p-4 bg-[#F8FAFC] border border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 transition-colors"
          />
        </div>

        <div>
           <label className="block text-sm font-bold text-gray-700 mb-2">End Date & Time</label>
           <input 
            type="datetime-local" 
            name="endDate"
            value={examDetails.endDate}
            onChange={handleChange}
            className="w-full p-4 bg-[#F8FAFC] border border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 transition-colors"
          />
        </div>
      </div>

      <div className="mt-12">
        <h3 className="text-xl font-bold text-[#1E293B] mb-6">Questions (Manual Entry)</h3>
        
        <div className="space-y-6">
          {examDetails.questions.map((q, qIdx) => (
            <div key={qIdx} className="bg-[#F8FAFC] p-8 rounded-2xl border border-gray-100 flex flex-col gap-4">
                <div className="flex justify-between items-center">
                    <span className="text-sm font-bold text-blue-600">Question {qIdx + 1}</span>
                    {examDetails.questions.length > 1 && (
                        <button 
                            onClick={() => dispatch({ type: "REMOVE_QUESTION", index: qIdx })}
                            className="text-rose-500 hover:text-rose-700 transition"
                        >
                            <FiTrash2 size={18} />
                        </button>
                    )}
                </div>
                <input 
                    type="text" 
                    placeholder={`Question ${qIdx + 1}`}
                    value={q.question}
                    onChange={(e) => handleQuestionChange(qIdx, "question", e.target.value)}
                    className="w-full p-4 bg-white border border-gray-100 rounded-xl focus:outline-none focus:border-blue-500 transition-colors text-lg"
                />
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {q.options.map((opt, oIdx) => (
                        <div key={oIdx} className="flex items-center gap-3">
                            <input 
                                type="radio" 
                                name={`correct-${qIdx}`}
                                checked={q.answer === oIdx}
                                onChange={() => handleQuestionChange(qIdx, "answer", oIdx)}
                                className="w-5 h-5 accent-blue-600"
                            />
                            <input 
                                type="text"
                                value={opt}
                                onChange={(e) => handleOptionChange(qIdx, oIdx, e.target.value)}
                                placeholder={`Option ${oIdx + 1}`}
                                className="flex-1 p-3 bg-white border border-gray-100 rounded-lg focus:outline-none focus:border-blue-500"
                            />
                        </div>
                    ))}
                </div>
            </div>
          ))}
        </div>

        <div className="flex gap-4 mt-8">
            <button 
                onClick={() => dispatch({ type: "ADD_QUESTION" })}
                className="flex items-center gap-2 px-6 py-3 border-2 border-dashed border-blue-200 text-blue-600 rounded-xl font-bold hover:bg-blue-50 transition"
            >
                <FiPlus /> Add Question
            </button>
            <button 
                onClick={handleSubmit}
                disabled={isSubmitLoading}
                className="flex-1 bg-black text-white px-8 py-4 rounded-xl font-bold text-lg hover:bg-gray-800 transition shadow-lg flex items-center justify-center"
            >
                {isSubmitLoading ? 'Saving...' : mode === 'create' ? 'Publish Quiz 🏁' : 'Update Quiz 🏁'}
            </button>
            <button 
                onClick={() => setView('dashboard')}
                className="px-8 py-4 bg-gray-100 text-gray-600 rounded-xl font-bold text-lg hover:bg-gray-200 transition"
            >
                Cancel
            </button>
        </div>
      </div>

      {/* JSON MODAL */}
      <AnimatePresence>
        {showJsonModal && (
          <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
            <motion.div 
               initial={{ opacity: 0 }} 
               animate={{ opacity: 1 }} 
               exit={{ opacity: 0 }}
               onClick={() => setShowJsonModal(false)}
               className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            />
            <motion.div 
               initial={{ scale: 0.9, opacity: 0 }}
               animate={{ scale: 1, opacity: 1 }}
               exit={{ scale: 0.9, opacity: 0 }}
               className="relative bg-white w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col"
            >
                <div className="p-6 overflow-y-auto custom-scrollbar flex-1">
                    <div className="bg-[#FEFCE8] border border-yellow-100 rounded-xl p-6 mb-6">
                        <div className="flex justify-between items-start mb-4">
                            <h4 className="flex items-center gap-2 text-[#854D0E] font-bold">
                                💡 Prompt to Convert Normal Questions to JSON
                            </h4>
                            <button 
                                onClick={copyJsonPrompt}
                                className="flex items-center gap-1.5 bg-[#FACC15] text-[#854D0E] px-3 py-1 rounded-md text-sm font-bold hover:shadow-md transition"
                            >
                                <FiCopy /> Copy
                            </button>
                        </div>
                        <pre className="text-xs text-[#854D0E] font-mono whitespace-pre-wrap">
{`Convert the following questions into JSON format. You can paste a single object or a list (array) of objects.

Example (Single Question):
{
  "question": "What is the capital of France?",
  "options": ["Berlin", "Madrid", "Paris", "Lisbon"],
  "answer": 2
}

Example (Multiple Questions):
[
  {
    "question": "Q1 text?",
    "options": ["A", "B", "C", "D"],
    "answer": 0
  },
  {
    "question": "Q2 text?",
    "options": ["A", "B", "C", "D"],
    "answer": 1
  }
]`}
                        </pre>
                    </div>

                    <textarea 
                        value={jsonInput}
                        onChange={(e) => setJsonInput(e.target.value)}
                        placeholder="Paste your JSON here..."
                        className="w-full h-48 p-4 bg-[#F8FAFC] border border-gray-200 rounded-xl mb-4 font-mono text-sm focus:outline-none focus:border-blue-500"
                    />

                    {jsonError && <p className="text-rose-500 text-sm mb-4">❌ {jsonError}</p>}

                    <div className="flex flex-col gap-2">
                        <button 
                            onClick={handleJsonImport}
                            className="w-full bg-[#2563EB] text-white py-4 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-blue-700 transition"
                        >
                            <FiUpload /> Import from JSON
                        </button>
                        <button 
                            onClick={() => setShowJsonModal(false)}
                            className="w-full bg-[#EF4444] text-white py-4 rounded-xl font-bold hover:bg-rose-600 transition"
                        >
                            Cancel
                        </button>
                    </div>
                </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

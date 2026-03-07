import React, { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import LeaderboardSection from "./LeaderboardSection";
import ExamRoom from "./ExamRoom";
import TermsAndConditions from "./TermsAndConditions";
import { motion, AnimatePresence } from "framer-motion";
import { 
  FiZap, 
  FiClock, 
  FiCheckCircle, 
  FiAward, 
  FiFileText, 
  FiMenu, 
  FiX, 
  FiChevronRight,
  FiChevronDown,
  FiArrowLeft,
  FiCalendar,
  FiTarget,
  FiStar
} from "react-icons/fi";

export default function ContestHome() {
  const { user, loading: authLoading, logout } = useAuth();
  const [activeSection, setActiveSection] = useState("ongoing");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [selectedExamId, setSelectedExamId] = useState(null);
  
  const [allExams, setAllExams] = useState([]);
  const [currentExams, setCurrentExams] = useState([]);
  const [upcomingExams, setUpcomingExams] = useState([]);
  const [participatedExams, setParticipatedExams] = useState([]);
  const [loading, setLoading] = useState(true);

  const API_URL = import.meta.env.VITE_API_URL;

  useEffect(() => {
    fetchAllData();
  }, [user]);

  useEffect(() => {
    if (activeSection === "terms and conditions") {
      setActiveSection("terms");
    }
  }, [activeSection]);

  const fetchAllData = async () => {
    if (!user) return;
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${API_URL}/contest/exams`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      
      if (!res.ok) {
        console.error("Fetch failed:", data.message || "Unknown error");
        setAllExams([]);
        return;
      }

      if (!Array.isArray(data)) {
        console.error("Expected array but received:", data);
        setAllExams([]);
        return;
      }
      
      const now = new Date();
      setAllExams(data);
      
      // Filter ongoing exams and initialize timeLeft
      const ongoing = data.filter(e => {
        const start = new Date(e.startDate);
        const end = new Date(e.endDate);
        const isActive = e.status === 'active' || !e.status; // Default to active if status is missing
        return isActive && start <= now && end > now;
      }).map(e => ({
        ...e,
        timeLeftMs: new Date(e.endDate).getTime() - now.getTime()
      }));

      setCurrentExams(ongoing);
      setUpcomingExams(data.filter(e => new Date(e.startDate) > now));
      
      const participated = data.filter(e => 
          e.studentResponses?.some(r => r.userId === user?._id || r.email === user?.email)
      );
      setParticipatedExams(participated);

    } catch (err) {
      console.error("Fetch Data Error:", err);
    } finally {
      setLoading(false);
    }
  };

  // Real-time countdown timer for ongoing contests
  useEffect(() => {
    if (currentExams.length === 0) return;
    
    const timer = setInterval(() => {
      setCurrentExams(prevExams => 
        prevExams.map(exam => {
          const newTime = Math.max(0, exam.timeLeftMs - 1000);
          return { ...exam, timeLeftMs: newTime };
        }).filter(exam => exam.timeLeftMs > 0) // Remove if expired
      );
    }, 1000);

    return () => clearInterval(timer);
  }, [currentExams.length]);

  const formatTime = (ms) => {
    const totalSeconds = Math.floor(ms / 1000);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    
    if (hours > 24) {
      const days = Math.floor(hours / 24);
      return `${days}d ${hours % 24}h ${minutes}m`;
    }
    return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
  };

  const menuItems = [
    { id: "ongoing", label: "Ongoing Contest", icon: <FiZap />, count: currentExams.length },
    { id: "upcoming", label: "Upcoming Contest", icon: <FiClock />, count: upcomingExams.length },
    { id: "participated", label: "Participated Contest", icon: <FiCheckCircle />, count: participatedExams.length },
    { id: "leaderboard", label: "Leadership Board", icon: <FiAward />, count: null },
    { id: "terms", label: "Terms And Conditions", icon: <FiFileText />, count: null },
  ];

  const [expandedParticipated, setExpandedParticipated] = useState({});

  const toggleParticipated = (id) => {
    setExpandedParticipated(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    alert("Coupon code copied to clipboard!");
  };

  if (authLoading || loading) return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
       <div className="text-center">
          <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-500 font-bold animate-pulse uppercase tracking-widest text-xs">Loading Contest Arena...</p>
       </div>
    </div>
  );

  if (selectedExamId) {
    return (
      <div className="min-h-screen bg-white">
          <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between border-b border-gray-100 mb-8">
             <div className="flex items-center gap-3">
                <button onClick={() => setSelectedExamId(null)} className="p-2 hover:bg-gray-100 rounded-xl transition-colors">
                    <FiArrowLeft size={20} />
                </button>
                <h1 className="text-xl font-black text-gray-900 tracking-tight">Arena Room</h1>
             </div>
             <div className="flex items-center gap-2">
                <span className="w-2 h-2 bg-green-500 rounded-full animate-ping"></span>
                <p className="text-[10px] font-black uppercase text-gray-400">Secure Environment Active</p>
             </div>
          </div>
          <ExamRoom examId={selectedExamId} setSelectedExamId={setSelectedExamId} email={user?.email} />
      </div>
    );
  }


  return (
    <div className="min-h-screen bg-white text-slate-800 flex flex-col">
      {/* Simple Header */}
      <header className="bg-white border-b border-gray-100 z-40 w-full sticky top-0 shadow-sm">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-teal-600 rounded-xl flex items-center justify-center text-white shadow-lg">
                <FiAward size={20} />
            </div>
            <h1 className="text-xl font-black text-gray-900 tracking-tight">Contest Arena</h1>
          </div>
          <div className="flex items-center gap-4 lg:hidden">
             <button className="p-2 text-slate-600 hover:bg-teal-50 rounded-lg transition-colors cursor-pointer" onClick={() => setSidebarOpen(true)}>
                <FiMenu size={24} />
             </button>
          </div>
        </div>
      </header>

      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
            <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setSidebarOpen(false)}></div>
            <motion.aside 
                initial={{ x: "-100%" }}
                animate={{ x: 0 }}
                exit={{ x: "-100%" }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                className="fixed inset-y-0 left-0 w-80 bg-white shadow-2xl p-0 flex flex-col"
            >
                <div className="p-8 pb-4">
                    <div className="flex items-center justify-between mb-8">
                        <h2 className="text-[#1e293b] font-black text-xl">Menu</h2>
                        <button onClick={() => setSidebarOpen(false)} className="text-slate-400 p-2 hover:text-teal-600 transition-colors cursor-pointer">
                            <FiX size={24} />
                        </button>
                    </div>


                    <nav className="space-y-2">
                        {menuItems.map((item) => (
                        <button
                            key={item.id}
                            onClick={() => { setActiveSection(item.id); setSidebarOpen(false); }}
                            className={`
                            w-full text-left px-5 py-4 rounded-xl text-sm flex items-center gap-4 transition-all
                            ${activeSection === item.id
                                ? "bg-[#f8fafc] text-teal-600 font-bold"
                                : "text-[#1e293b] hover:bg-gray-50"}
                            `}
                        >
                            <span className={`text-xl ${activeSection === item.id ? 'text-teal-600' : 'text-[#64748b]'}`}>{item.icon}</span>
                            <span className="font-semibold">{item.label}</span>
                        </button>
                        ))}
                    </nav>
                </div>

                {/* User Info or Navigation Info could go here if needed, but removing Sign Out as requested */}
            </motion.aside>
        </div>
      )}

       <div className="flex flex-1 overflow-hidden" style={{ height: 'calc(100vh - 73px)' }}>
        {/* Admin-style Sidebar */}
        <aside className="hidden lg:flex lg:w-72 lg:flex-col border-r border-gray-100 bg-white relative">
          <div className="p-6 flex flex-col h-full overflow-y-auto">

            <nav className="space-y-2">
                {menuItems.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => setActiveSection(item.id)}
                    className={`
                      w-full text-left px-5 py-4 rounded-xl text-sm flex items-center gap-4 transition-all duration-200
                      ${activeSection === item.id
                        ? "bg-[#f8fafc] text-teal-600 font-bold"
                        : "text-[#1e293b] hover:bg-gray-50"}
                    `}
                  >
                    <span className={`text-xl ${activeSection === item.id ? 'text-teal-600' : 'text-[#64748b]'}`}>{item.icon}</span>
                    <span className="flex-1 font-semibold">{item.label}</span>
                    {item.count !== null && (
                      <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${activeSection === item.id ? 'bg-teal-100 text-teal-600' : 'bg-slate-100 text-slate-500'}`}>
                        {item.count}
                      </span>
                    )}
                  </button>
                ))}
            </nav>

            {/* Navigation Footer placeholder */}
          </div>
        </aside>

        {/* Professional Main Content */}
        <main className="flex-1 p-6 md:p-10 bg-[#F8FAFC] overflow-y-auto">
          <div className="max-w-5xl mx-auto">
             <div className="mb-10 pb-6 border-b border-gray-100 flex justify-between items-center">
                <div>
                    <h2 className="text-3xl font-bold text-teal-600 flex items-center gap-3">
                    {activeSection === 'ongoing' && <><span className="text-3xl">🔥</span> Ongoing Contest</>}
                    {activeSection === 'upcoming' && <><span className="text-3xl">⏳</span> Upcoming Contest</>}
                    {activeSection === 'participated' && <><span className="text-3xl">🏅</span> Participated Contests</>}
                    {activeSection === 'leaderboard' && <><span className="text-3xl">🏆</span> Leadership Board</>}
                    {activeSection === 'terms' && <><span className="text-3xl">📝</span> Terms And Conditions</>}
                    </h2>
                </div>
             </div>

             {activeSection === "ongoing" && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                   {currentExams.length === 0 ? (
                        <div className="col-span-full py-20 text-center bg-gray-50 rounded-2xl border border-gray-100">
                            <p className="text-slate-400 font-medium">No live contests available at this time.</p>
                        </div>
                   ) : currentExams.map(exam => {
                       const userResp = exam.studentResponses?.find(
                           (resp) => resp.userId === user?._id || resp.email === user?.email
                       );
                       const hasAttempted = !!userResp;
                      const isPaused = exam.status === 'paused';

                      return (
                        <div key={exam._id} className="group bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden transition-all duration-300 hover:shadow-md hover:-translate-y-1">
                           {/* Header with Background Color */}
                           <div className="bg-[#115E59] px-6 py-4 flex justify-between items-center relative overflow-hidden">
                              <div className="absolute top-0 right-0 w-20 h-20 bg-white/5 rounded-full -mr-10 -mt-10" />
                              <h3 className="text-lg font-black text-white truncate flex items-center gap-2 relative z-10">
                                  <span className="animate-bounce">🏆</span> {exam.title}
                              </h3>
                              <span className="bg-teal-400/20 text-teal-100 text-[10px] font-black px-2 py-1 rounded-md uppercase tracking-wider border border-teal-400/30 animate-pulse relative z-10">
                                  Live Now
                              </span>
                           </div>
                           
                           {/* Compact Body */}
                           <div className="p-6">
                              <div className="flex items-center justify-between mb-6 bg-gray-50 p-3 rounded-lg border border-gray-100">
                                  <div className="flex flex-col">
                                      <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none mb-1">Time Remaining</span>
                                      <span className="text-lg font-mono font-black text-[#115E59] tracking-tight">
                                          {formatTime(exam.timeLeftMs)}
                                      </span>
                                  </div>
                                  <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center text-teal-600 shadow-sm">
                                      <FiClock size={20} />
                                  </div>
                              </div>

                              <div className="space-y-3">
                                {isPaused ? (
                                    <button disabled className="w-full bg-amber-50 text-amber-600 py-3 rounded-lg font-black text-xs uppercase tracking-widest border border-amber-100 opacity-80">
                                        ⏸️ Contest Paused
                                    </button>
                                 ) : hasAttempted ? (
                                    <button disabled className="w-full bg-teal-50 text-teal-600 py-3 rounded-lg font-black text-xs uppercase tracking-widest border border-teal-100 flex items-center justify-center gap-2">
                                        <FiCheckCircle size={16} /> Attempted • Score: {userResp.score}/{userResp.totalQuestions || exam.questions?.length || 0}
                                    </button>
                                ) : (
                                    <button 
                                       onClick={() => setSelectedExamId(exam._id)}
                                       className="w-full bg-[#115E59] text-white py-3 rounded-lg font-black text-xs uppercase tracking-widest shadow-lg shadow-teal-900/20 hover:bg-[#0F766E] transition-all flex items-center justify-center gap-2 active:scale-[0.98]"
                                    >
                                       🚀 Enter Contest
                                    </button>
                                )}
                              </div>
                           </div>
                        </div>
                      );
                   })}
                </div>
             )}

             {activeSection === "upcoming" && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                   {upcomingExams.length === 0 ? (
                        <div className="py-20 text-center bg-gray-50 rounded-2xl border border-gray-100 w-full col-span-full">
                            <p className="text-slate-400 font-medium">No upcoming contests scheduled.</p>
                        </div>
                    ) : upcomingExams.map(exam => (
                      <div key={exam._id} className="group bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden transition-all duration-300 hover:shadow-md hover:-translate-y-1">
                         {/* Header with Dark Background */}
                         <div className="bg-gray-800 px-6 py-4 flex justify-between items-center">
                            <h3 className="text-lg font-bold text-white truncate flex items-center gap-2">
                                <span className="text-teal-400"><FiCalendar size={18} /></span> {exam.title}
                            </h3>
                            <span className="bg-white/10 text-gray-300 text-[10px] font-black px-2 py-1 rounded uppercase tracking-wider border border-white/5">
                                Soon
                            </span>
                         </div>
                         
                         {/* Compact Body */}
                         <div className="p-6 space-y-4">
                            <div className="flex items-center justify-between group/item">
                               <div className="flex items-center gap-3">
                                  <div className="w-8 h-8 rounded-lg bg-gray-50 flex items-center justify-center text-gray-400 group-hover/item:text-teal-600 transition-colors">
                                     <FiClock size={16} />
                                  </div>
                                  <span className="text-[11px] font-black text-gray-400 uppercase tracking-widest">Starts</span>
                               </div>
                               <span className="text-sm font-bold text-gray-700">{new Date(exam.startDate).toLocaleDateString(undefined, { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                            </div>
                            
                            <div className="flex items-center justify-between group/item">
                               <div className="flex items-center gap-3">
                                  <div className="w-8 h-8 rounded-lg bg-gray-50 flex items-center justify-center text-gray-400 group-hover/item:text-teal-600 transition-colors">
                                     <FiTarget size={16} />
                                  </div>
                                  <span className="text-[11px] font-black text-gray-400 uppercase tracking-widest">Pass Mark</span>
                               </div>
                               <span className="text-sm font-black text-teal-600">{exam.passingPercentage ?? 0}%</span>
                            </div>

                            <div className="pt-2">
                                <div className="w-full bg-gray-50 text-gray-400 py-2.5 rounded-lg font-black text-[10px] uppercase tracking-[0.2em] border border-gray-100 text-center">
                                    Start
                                </div>
                            </div>
                         </div>
                      </div>
                    ))}
                </div>
             )}

             {activeSection === "participated" && (
                <div className="space-y-6">
                   {participatedExams.length === 0 ? (
                      <div className="py-20 text-center bg-gray-50 rounded-2xl border border-gray-100">
                         <p className="text-slate-400 font-medium">No history found.</p>
                      </div>
                   ) : participatedExams.map(exam => {
                       const resp = exam.studentResponses.find(r => r.userId === user?._id || r.email?.toLowerCase() === user?.email?.toLowerCase());
                       const winnerData = exam.winners?.find(w => 
                           (w.userId && user?._id && w.userId.toString() === user?._id.toString()) || 
                           (w.email?.toLowerCase() === user?.email?.toLowerCase())
                       );
                      const isExpanded = expandedParticipated[exam._id];
                      
                       const sortedResponses = [...exam.studentResponses].sort((a, b) => b.score - a.score);
                       const currentRank = sortedResponses.findIndex(r => r.userId === user?._id || r.email === user?.email) + 1;
                       
                       // Robust Pass/Fail Calculation & Data Cleanup
                       const passPercent = exam.passingPercentage ?? 0;
                       const totalQs = exam.questions?.length || resp?.answers?.length || 0;
                       const isPassed = winnerData ? true : (totalQs > 0 && resp?.score > 0 && resp?.score >= (passPercent / 100 * totalQs));

                      return (
                        <div key={exam._id} className="group bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden transition-all duration-300 hover:shadow-md">
                           <button 
                             onClick={() => toggleParticipated(exam._id)}
                             className={`w-full px-6 py-4 flex justify-between items-center transition-all ${isExpanded ? 'bg-[#115E59] text-white' : 'hover:bg-teal-50/50'}`}
                            >
                                <div className="flex items-center gap-4 text-left">
                                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all ${isExpanded ? 'bg-white/20 text-white' : 'bg-teal-100/10 text-teal-600'}`}>
                                        <FiCheckCircle size={18} />
                                    </div>
                                     <h3 className="text-sm font-black tracking-tight leading-tight flex-1">{exam.title}</h3>
                                     <div className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider border ${
                                         isPassed 
                                         ? (isExpanded ? 'bg-teal-400 text-teal-900 border-teal-300' : 'bg-green-50 text-green-600 border-green-100')
                                         : (isExpanded ? 'bg-rose-400 text-rose-900 border-rose-300' : 'bg-rose-50 text-rose-600 border-rose-100')
                                     }`}>
                                         {isPassed ? 'Passed' : 'Failed'} • {resp.score}/{totalQs}
                                     </div>
                                </div>
                                <div className={`transition-all ${isExpanded ? 'rotate-180' : 'text-gray-400'}`}>
                                    <FiChevronDown size={18} />
                                </div>
                            </button>
                           
                           {isExpanded && (
                               <motion.div 
                                 initial={{ height: 0, opacity: 0 }}
                                 animate={{ height: "auto", opacity: 1 }}
                                 className="bg-white border-t border-gray-100"
                               >
                                <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-8">
                                   {/* Score & Result Stats */}
                                   <div className="grid grid-cols-2 gap-4">
                                      <div className="bg-teal-50/50 p-4 rounded-2xl border border-teal-100/50">
                                         <span className="text-[10px] font-black text-teal-600 uppercase tracking-widest block mb-1">Your Score</span>
                                         <div className="flex items-baseline gap-1">
                                            <span className="text-2xl font-black text-gray-900">{resp.score}</span>
                                            <span className="text-xs text-gray-400 font-bold">Points</span>
                                         </div>
                                      </div>
                                      <div className="bg-indigo-50/50 p-4 rounded-2xl border border-indigo-100/50">
                                         <span className="text-[10px] font-black text-indigo-600 uppercase tracking-widest block mb-1">Result Status</span>
                                         <div className="flex items-center gap-2">
                                            {isPassed ? (
                                                <span className="text-green-600 font-black flex items-center gap-1">
                                                    <FiCheckCircle size={14} /> PASSED
                                                </span>
                                            ) : (
                                                <span className="text-rose-600 font-black flex items-center gap-1">
                                                    <FiX size={14} /> FAILED
                                                </span>
                                            )}
                                         </div>
                                      </div>
                                      <div className="bg-gray-50/50 p-4 rounded-2xl border border-gray-100 col-span-2">
                                         <div className="flex justify-between items-center">
                                            <div>
                                                <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest block mb-1">Global Performance</span>
                                                <span className="text-lg font-black text-gray-900">Rank #{currentRank}</span>
                                            </div>
                                            <div className="text-right">
                                                 <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest block mb-1">Pass Mark</span>
                                                 <span className="text-sm font-bold text-teal-600">{exam.passingPercentage ?? 0}%</span>
                                            </div>
                                         </div>
                                      </div>
                                   </div>

                                   {/* Voucher & Rewards Section */}
                                   <div className="flex flex-col bg-teal-900 text-white p-6 rounded-2xl relative overflow-hidden shadow-lg">
                                      {/* Decorative Icon */}
                                      <div className="absolute -right-4 -bottom-4 opacity-10">
                                          <FiAward size={100} />
                                      </div>

                                      <div className="relative z-10">
                                         <div className="flex items-center justify-between mb-4">
                                            <span className="text-[10px] font-black text-teal-300 uppercase tracking-[0.2em]">Exclusive Reward</span>
                                            {winnerData ? (
                                                <span className="px-3 py-1 bg-teal-400 text-teal-900 text-[10px] font-black rounded-full uppercase">Winner</span>
                                            ) : (
                                                <span className="px-3 py-1 bg-white/10 text-teal-200 text-[10px] font-black rounded-full uppercase">
                                                    {exam.status === 'results_declared' ? 'Not Won' : 'Pending'}
                                                </span>
                                            )}
                                         </div>

                                         {winnerData ? (
                                             <div className="space-y-4">
                                                <p className="text-sm font-medium text-teal-50">Congratulations! You've earned a discount voucher.</p>
                                                <div className="flex items-center gap-2">
                                                    <div className="flex-1 bg-white/10 border border-white/20 backdrop-blur-sm rounded-xl px-4 py-3 text-lg font-mono font-black text-white tracking-widest">
                                                        {winnerData.code || winnerData.couponCode || winnerData.coupon || "N/A"}
                                                    </div>
                                                    <button 
                                                      onClick={(e) => { e.stopPropagation(); copyToClipboard(winnerData.code || winnerData.couponCode || winnerData.coupon); }}
                                                      className="bg-white text-teal-900 p-3.5 rounded-xl hover:bg-teal-50 transition-colors shadow-xl active:scale-95"
                                                      title="Copy Coupon"
                                                    >
                                                        <FiAward size={20} />
                                                    </button>
                                                </div>
                                                <p className="text-[10px] text-teal-300 italic opacity-80">* Applicable on SastaSundar.com orders above ₹500</p>
                                             </div>
                                         ) : (
                                             <div className="h-full flex flex-col justify-center py-4">
                                                <p className="text-sm font-medium text-teal-100/60 italic leading-relaxed">
                                                  {exam.status === 'results_declared' 
                                                    ? "This contest has ended. Unfortunately, you didn't qualify for a reward this time." 
                                                    : "The results for this contest are currently being processed. Check back soon for the winners announcement!"}
                                                </p>
                                             </div>
                                         )}
                                      </div>
                                   </div>

                                   {/* Dates */}
                                   <div className="md:col-span-2 flex items-center gap-6 pt-4 border-t border-gray-50">
                                      <div className="flex items-center gap-2 text-gray-400">
                                         <FiCalendar size={14} />
                                         <span className="text-[11px] font-bold uppercase tracking-wider">Held: {new Date(exam.startDate).toLocaleDateString()}</span>
                                      </div>
                                      <div className="w-1 h-1 bg-gray-200 rounded-full" />
                                      <div className="flex items-center gap-2 text-gray-400">
                                         <FiStar size={14} />
                                          <span className="text-[11px] font-bold uppercase tracking-wider">{totalQs} Questions</span>
                                      </div>
                                   </div>
                                </div>
                               </motion.div>
                           )}
                        </div>
                      );
                   })}
                </div>
             )}

             {activeSection === "leaderboard" && <LeaderboardSection allExams={allExams} />}
             {activeSection === "terms" && <TermsAndConditions />}
          </div>
        </main>
      </div>
    </div>
  );
}


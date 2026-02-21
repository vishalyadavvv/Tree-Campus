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
            <div className="w-10 h-10 bg-orange-600 rounded-xl flex items-center justify-center text-white shadow-lg">
                <FiAward size={20} />
            </div>
            <h1 className="text-xl font-black text-gray-900 tracking-tight">Contest Arena</h1>
          </div>
          <div className="flex items-center gap-4 lg:hidden">
             <button className="p-2 text-slate-600 hover:bg-orange-50 rounded-lg transition-colors cursor-pointer" onClick={() => setSidebarOpen(true)}>
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
                        <button onClick={() => setSidebarOpen(false)} className="text-slate-400 p-2 hover:text-orange-600 transition-colors cursor-pointer">
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
                                ? "bg-[#f8fafc] text-orange-600 font-bold"
                                : "text-[#1e293b] hover:bg-gray-50"}
                            `}
                        >
                            <span className={`text-xl ${activeSection === item.id ? 'text-orange-600' : 'text-[#64748b]'}`}>{item.icon}</span>
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
                        ? "bg-[#f8fafc] text-orange-600 font-bold"
                        : "text-[#1e293b] hover:bg-gray-50"}
                    `}
                  >
                    <span className={`text-xl ${activeSection === item.id ? 'text-orange-600' : 'text-[#64748b]'}`}>{item.icon}</span>
                    <span className="flex-1 font-semibold">{item.label}</span>
                    {item.count !== null && (
                      <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${activeSection === item.id ? 'bg-orange-100 text-orange-600' : 'bg-slate-100 text-slate-500'}`}>
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
                    <h2 className="text-3xl font-bold text-orange-600 flex items-center gap-3">
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
                      const hasAttempted = exam.studentResponses?.some(
                          (resp) => resp.userId === user?._id || resp.email === user?.email
                      );
                      const isPaused = exam.status === 'paused';

                      return (
                        <div key={exam._id} className="bg-white rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 p-8 flex flex-col transition-all hover:shadow-xl">
                           <h3 className="text-2xl font-bold text-indigo-700 mb-4 flex items-center gap-3">
                               <span className="text-2xl">🏆</span> {exam.title}
                           </h3>
                           
                           <div className="flex items-center gap-2 mb-8 text-slate-700 font-semibold text-lg">
                               <span className="text-xl">⏳</span>
                               <span>Ends in: {formatTime(exam.timeLeftMs)}</span>
                           </div>

                           {isPaused ? (
                               <button disabled className="w-full bg-amber-500 text-white py-4 rounded-xl font-bold text-lg shadow-md opacity-70">
                                   ⏸️ Contest Paused
                               </button>
                           ) : hasAttempted ? (
                               <button disabled className="w-full bg-slate-400 text-white py-4 rounded-xl font-bold text-lg shadow-md flex items-center justify-center gap-2">
                                   ✅ Already Attempted
                               </button>
                           ) : (
                               <button 
                                  onClick={() => setSelectedExamId(exam._id)}
                                  className="w-full bg-[#2ecc71] text-white py-4 rounded-xl font-bold text-lg shadow-[0_4px_14px_0_rgba(46,204,113,0.39)] hover:bg-[#27ae60] transition-all flex items-center justify-center gap-2"
                               >
                                  🚀 Enter Contest
                               </button>
                           )}
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
                      <div key={exam._id} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 flex flex-col hover:shadow-md transition-all">
                         <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                            <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center">
                                <FiClock size={20} />
                            </div>
                            {exam.title}
                         </h3>
                         <div className="space-y-4">
                            <div className="flex items-center gap-3 text-gray-600">
                               <FiCalendar className="text-blue-500" />
                               <span className="text-sm">Starts: {new Date(exam.startDate).toLocaleDateString(undefined, { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}</span>
                            </div>
                            <div className="flex items-center gap-3 text-gray-600">
                               <FiTarget className="text-blue-500" />
                               <span className="text-sm">Pass Mark: {exam.passingPercentage}%</span>
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
                      const resp = exam.studentResponses.find(r => r.userId === user?._id || r.email === user?.email);
                      const winnerData = exam.winners?.find(w => w.email === user?.email);
                      const isExpanded = expandedParticipated[exam._id];
                      
                      const sortedResponses = [...exam.studentResponses].sort((a, b) => b.score - a.score);
                      const currentRank = sortedResponses.findIndex(r => r.userId === user?._id || r.email === user?.email) + 1;

                      return (
                        <div key={exam._id} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                           <button 
                             onClick={() => toggleParticipated(exam._id)}
                             className={`w-full p-6 flex justify-between items-center transition-colors ${isExpanded ? 'bg-orange-600 text-white' : 'hover:bg-gray-50'}`}
                            >
                                <div className="flex items-center gap-4">
                                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${isExpanded ? 'bg-white/20 text-white' : 'bg-orange-50 text-orange-600'}`}>
                                        <FiCheckCircle size={20} />
                                    </div>
                                    <span className="text-lg font-bold">{exam.title}</span>
                                </div>
                                <span className="text-sm">{isExpanded ? <FiX size={20} /> : <FiChevronRight size={20} />}</span>
                            </button>
                           
                           {isExpanded && (
                               <div className="p-8 bg-white border-t border-gray-100 grid grid-cols-1 md:grid-cols-2 gap-6">
                                  <div className="space-y-4">
                                  <p className="flex items-center gap-3 text-slate-800 font-semibold">
                                     <span className="text-xl">📅</span>
                                     <strong>Start Date:</strong> {new Date(exam.startDate).toLocaleDateString()}
                                  </p>
                                  <p className="flex items-center gap-3 text-slate-800 font-semibold">
                                     <span className="text-xl">⏳</span>
                                     <strong>End Date:</strong> {new Date(exam.endDate).toLocaleDateString()}
                                  </p>
                                  <p className="flex items-center gap-3 text-slate-800 font-semibold">
                                     <span className="text-xl">🎯</span>
                                     <strong>Marks:</strong> {resp.score}
                                  </p>
                                  <p className="flex items-center gap-3 text-slate-800 font-semibold">
                                     <span className="text-xl">🏆</span>
                                     <strong>Rank:</strong> {currentRank}
                                  </p>
                                  <div className="flex items-center gap-3 text-slate-800 font-semibold">
                                     <span className="text-xl">🎟️</span>
                                     <strong>Voucher:</strong> 
                                     {winnerData ? (
                                         <div className="flex items-center gap-4 ml-2">
                                             <span className="text-green-600">✅ Yes</span>
                                             <button 
                                               onClick={(e) => { e.stopPropagation(); copyToClipboard(winnerData.couponCode || winnerData.coupon); }}
                                               className="bg-blue-600 text-white px-4 py-1.5 rounded-lg text-xs font-bold hover:bg-blue-700 transition-colors"
                                             >
                                                 Copy Coupon
                                             </button>
                                         </div>
                                     ) : (
                                        <span className="ml-2">{new Date() > new Date(exam.endDate) ? <span className="text-rose-600">❌ No</span> : <span className="text-amber-500">⏳ Awaiting</span>}</span>
                                     )}
                                  </div>
                                </div>
                             </div>
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


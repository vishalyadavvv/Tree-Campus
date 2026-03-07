import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";

export default function LeaderboardSection({ allExams }) {
  const [selectedExamId, setSelectedExamId] = useState("");
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(false);

  const API_URL = import.meta.env.VITE_API_URL;

  useEffect(() => {
    if (selectedExamId) {
      fetchLeaderboard();
    }
  }, [selectedExamId]);

  const fetchLeaderboard = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${API_URL}/contest/leaderboard/${selectedExamId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      setLeaderboard(data.winners || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const podium = leaderboard.slice(0, 3);
  const others = leaderboard.slice(3);

  return (
    <div className="space-y-8 pt-4 pb-20">
      <div className="bg-white rounded-2xl p-8 border border-gray-100 shadow-sm">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
            <div className="space-y-2">
                <h2 className="text-3xl font-black text-gray-900 tracking-tight">Global Rankings</h2>
                <p className="text-sm text-gray-400 font-bold uppercase tracking-widest">Compete with the best</p>
            </div>
            <div className="flex flex-col gap-2 min-w-[300px]">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Select Assessment</label>
                <div className="relative">
                    <select
                      value={selectedExamId}
                      onChange={(e) => setSelectedExamId(e.target.value)}
                      className="w-full bg-[#f8fafc] text-gray-900 rounded-xl px-5 py-3.5 focus:outline-none focus:ring-2 focus:ring-teal-500/20 border border-gray-200 font-bold text-sm appearance-none cursor-pointer"
                    >
                      <option value="">Choose an Assessment...</option>
                      {Array.isArray(allExams) && allExams.map((ex) => (
                        <option key={ex._id} value={ex._id}>
                          {ex.title}
                        </option>
                      ))}
                    </select>
                    <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
                        </svg>
                    </div>
                </div>
            </div>
          </div>

          {loading ? (
            <div className="py-24 text-center">
              <div className="w-12 h-12 border-4 border-teal-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-gray-400 font-black uppercase tracking-widest text-[10px]">Synchronizing Rankings...</p>
            </div>
          ) : leaderboard.length > 0 ? (
            <div className="overflow-hidden rounded-2xl border border-gray-100 shadow-sm">
              <div className="grid grid-cols-12 bg-[#115E59] px-8 py-5">
                 <div className="col-span-1 hidden md:block text-teal-200/50 font-black text-[10px] uppercase">#</div>
                 <div className="col-span-7 md:col-span-8 text-white font-black text-xs uppercase tracking-widest">Participant</div>
                 <div className="col-span-5 md:col-span-3 text-white font-black text-xs uppercase tracking-widest text-center">Score</div>
              </div>

              <div className="divide-y divide-gray-50 bg-white">
                {leaderboard.map((entry, index) => (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    key={index} 
                    className={`grid grid-cols-12 px-8 py-5 items-center transition-colors group hover:bg-teal-50/30`}
                  >
                     <div className="col-span-1 hidden md:block">
                        <span className={`text-sm font-black ${index < 3 ? 'text-teal-600' : 'text-gray-300'}`}>
                            {index + 1}
                        </span>
                     </div>
                     
                     <div className="col-span-7 md:col-span-8 flex items-center gap-4">
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-black text-sm border ${
                            index === 0 ? 'bg-amber-50 border-amber-200 text-amber-600 shadow-sm' : 
                            index === 1 ? 'bg-slate-100 border-slate-200 text-slate-500' :
                            index === 2 ? 'bg-orange-50 border-orange-200 text-orange-600' :
                            'bg-gray-50 border-gray-100 text-gray-400'
                        }`}>
                            {index === 0 ? "🥇" : index === 1 ? "🥈" : index === 2 ? "🥉" : index + 1}
                        </div>
                        <div className="flex flex-col">
                            <span className="font-black text-gray-900 tracking-tight">{entry.name}</span>
                            <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">
                                {allExams.find(e => e._id === selectedExamId)?.title}
                            </span>
                        </div>
                     </div>

                     <div className="col-span-5 md:col-span-3 text-center">
                        <div className="inline-flex flex-col items-center">
                            <span className="text-xl font-black text-gray-900">{entry.score}</span>
                            <div className="h-1 w-full bg-teal-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
                        </div>
                     </div>
                  </motion.div>
                ))}
              </div>
            </div>
          ) : selectedExamId ? (
            <div className="py-24 text-center border-2 border-dashed border-gray-100 rounded-2xl bg-gray-50/30">
              <div className="text-4xl mb-4 opacity-20">📊</div>
              <p className="text-gray-400 font-black uppercase tracking-widest text-xs">No entries found for this contest.</p>
            </div>
          ) : (
            <div className="py-24 text-center border-2 border-dashed border-gray-100 rounded-2xl bg-gray-50/50">
              <div className="text-4xl mb-4 opacity-10">🥇🥈🥉</div>
              <p className="text-gray-400 font-black uppercase tracking-widest text-[10px]">Select an assessment to reveal the rankings</p>
            </div>
          )}
      </div>
    </div>
  );
}

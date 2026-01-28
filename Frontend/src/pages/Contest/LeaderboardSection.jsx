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
      const token = sessionStorage.getItem("token");
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
    <div className="space-y-8 pt-4">
      <div className="space-y-4">
          <h2 className="text-3xl font-bold text-blue-600">Leaderboard</h2>
          <div className="flex flex-col gap-2">
            <p className="font-bold text-slate-700">Select Exam:</p>
            <select
              value={selectedExamId}
              onChange={(e) => setSelectedExamId(e.target.value)}
              className="w-full md:w-1/2 bg-[#1e293b] text-white rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium"
            >
              <option value="">Select Assessment</option>
              {allExams.map((ex) => (
                <option key={ex._id} value={ex._id}>
                  {ex.title}
                </option>
              ))}
            </select>
          </div>
      </div>

      {loading ? (
        <div className="py-24 text-center">
          <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-500 font-bold">Fetching Rankings...</p>
        </div>
      ) : leaderboard.length > 0 ? (
        <div className="bg-white border-2 border-blue-600 rounded-lg overflow-hidden shadow-lg">
          <div className="grid grid-cols-12 bg-blue-600 px-6 py-4">
             <div className="col-span-5 flex items-center gap-2 text-white font-bold text-lg">
                 <span>🏆</span> Contest Title
             </div>
             <div className="col-span-4 flex items-center gap-2 text-white font-bold text-lg">
                 <span>👤</span> Name
             </div>
             <div className="col-span-3 flex items-center gap-2 text-white font-bold text-lg justify-center">
                 <span>📊</span> Rank
             </div>
          </div>

          <div className="divide-y divide-gray-200">
            {leaderboard.map((entry, index) => (
              <div key={index} className={`grid grid-cols-12 px-6 py-4 items-center ${index % 2 === 1 ? 'bg-blue-50/50' : 'bg-white'}`}>
                 <div className="col-span-5 font-semibold text-slate-700">
                    {allExams.find(e => e._id === selectedExamId)?.title}
                 </div>
                 
                 <div className="col-span-4 font-semibold text-slate-700">
                    {entry.name}
                 </div>

                 <div className="col-span-3 text-center">
                    <span className="text-blue-600 font-bold text-lg">
                       #{index + 1}
                    </span>
                 </div>
              </div>
            ))}
          </div>
        </div>
      ) : selectedExamId ? (
        <div className="py-24 text-center border-2 border-dashed border-gray-200 rounded-2xl">
          <p className="text-slate-400 font-bold">No participants recorded yet.</p>
        </div>
      ) : (
        <div className="py-24 text-center border-2 border-dashed border-gray-200 rounded-2xl bg-gray-50/50">
          <p className="text-slate-400 font-bold italic">Please select an assessment to view the leaderboard.</p>
        </div>
      )}
    </div>
  );
}

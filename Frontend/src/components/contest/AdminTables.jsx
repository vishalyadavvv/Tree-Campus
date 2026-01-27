import React, { useState, useEffect } from 'react';
import * as XLSX from 'xlsx';
import { motion } from 'framer-motion';
import { FiDownload, FiUsers, FiAward, FiFileText, FiSearch } from 'react-icons/fi';

export default function AdminTables() {
  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000/api';
  
  const [allExams, setAllExams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('detailed'); // 'winners', 'detailed'

  useEffect(() => {
    fetchExams();
  }, []);

  const fetchExams = async () => {
    setLoading(true);
    try {
      const token = sessionStorage.getItem("token");
      const res = await fetch(`${API_URL}/admin/contest/exams`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (!res.ok) throw new Error('Failed to fetch exams');
      const data = await res.json();
      setAllExams(data);
    } catch (err) {
      console.error('Error fetching exams:', err);
    } finally {
      setLoading(false);
    }
  };

  // 1. Winners Report Data
  const winnersData = allExams
    .slice()
    .flatMap((exam) =>
      exam.winners && exam.winners.length
        ? exam.winners
            .sort((a, b) => a.rank - b.rank)
            .map((winner) => ({
              examTitle: exam.title,
              name: winner.name || 'Unknown',
              email: winner.email || 'Unknown',
              phone: winner.phone_number || 'Unknown',
              rank: `Rank ${winner.rank}`,
              score: winner.score || 0,
              coupon: winner.coupon || 'N/A'
            }))
        : []
    );

  // 2. Detailed Student Responses Data
  const detailedResponses = allExams.flatMap(exam => 
    (exam.studentResponses || []).map(resp => ({
        examTitle: exam.title,
        name: resp.name || 'Unknown',
        email: resp.email || 'Unknown',
        phone: resp.phone_number || 'Unknown',
        score: resp.score || 0,
        totalQuestions: exam.questions.length,
        submittedAt: new Date(resp.submittedAt).toLocaleString(),
        status: (resp.score / exam.questions.length) * 100 >= (exam.passingPercentage || 40) ? 'Passed' : 'Failed'
    }))
  ).sort((a,b) => new Date(b.submittedAt) - new Date(a.submittedAt));

  const downloadExcel = () => {
    const workbook = XLSX.utils.book_new();

    // Sheet 1: Detailed Responses
    const detailedWS = XLSX.utils.json_to_sheet(detailedResponses.map(r => ({
        'Contest': r.examTitle,
        'Name': r.name,
        'Email': r.email,
        'Phone': r.phone,
        'Score': `${r.score}/${r.totalQuestions}`,
        'Result': r.status,
        'Submitted At': r.submittedAt
    })));
    XLSX.utils.book_append_sheet(workbook, detailedWS, 'Detailed Responses');

    // Sheet 2: Winners
    const winnersWS = XLSX.utils.json_to_sheet(winnersData.map(w => ({
        'Contest': w.examTitle,
        'Name': w.name,
        'Email': w.email,
        'Phone': w.phone,
        'Rank': w.rank,
        'Score': w.score,
        'Coupon': w.coupon
    })));
    XLSX.utils.book_append_sheet(workbook, winnersWS, 'Winners Report');

    XLSX.writeFile(workbook, 'Contest_Reports.xlsx');
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-[#5E5CED]"></div>
        <p className="mt-4 text-gray-400 font-bold">Fetching reports...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Header & Main Controls */}
      <div className="bg-white rounded-[32px] p-8 shadow-sm border border-gray-100 flex flex-col md:flex-row justify-between items-center gap-6">
        <div className="flex gap-2 p-1 bg-[#F8FAFC] border border-gray-100 rounded-2xl">
          <button 
            onClick={() => setActiveTab('detailed')}
            className={`px-8 py-3 rounded-xl font-bold transition-all ${activeTab === 'detailed' ? 'bg-white text-[#5E5CED] shadow-sm' : 'text-gray-400 hover:text-gray-600'}`}
          >
            <FiUsers className="inline mr-2" /> Detailed Responses
          </button>
          <button 
            onClick={() => setActiveTab('winners')}
            className={`px-8 py-3 rounded-xl font-bold transition-all ${activeTab === 'winners' ? 'bg-white text-[#5E5CED] shadow-sm' : 'text-gray-400 hover:text-gray-600'}`}
          >
            <FiAward className="inline mr-2" /> Winners Circle
          </button>
        </div>

        <button 
            onClick={downloadExcel}
            className="w-full md:w-auto bg-black text-white px-8 py-4 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-gray-800 transition shadow-lg"
        >
            <FiDownload /> Export Full Report (.xlsx)
        </button>
      </div>

      {activeTab === 'detailed' ? (
        <div className="bg-white rounded-[32px] p-8 shadow-sm border border-gray-100">
            <h3 className="text-2xl font-black text-[#1E293B] mb-8 flex items-center gap-3">
                <FiFileText className="text-[#5E5CED]" /> Detailed Student Performance
            </h3>
            
            <div className="overflow-x-auto">
                <table className="w-full text-left border-separate border-spacing-y-2">
                    <thead>
                        <tr className="text-[#64748B] text-[11px] font-black uppercase tracking-widest px-4">
                            <th className="px-4 py-4">Contest</th>
                            <th className="px-4 py-4">Student</th>
                            <th className="px-4 py-4">Phone</th>
                            <th className="px-4 py-4">Score</th>
                            <th className="px-4 py-4">Result</th>
                            <th className="px-4 py-4">Submitted At</th>
                        </tr>
                    </thead>
                    <tbody>
                        {detailedResponses.length === 0 ? (
                            <tr><td colSpan="5" className="p-12 text-center text-gray-400">No responses found.</td></tr>
                        ) : detailedResponses.map((r, i) => (
                            <motion.tr 
                                key={i}
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: i * 0.05 }}
                                className="bg-[#F8FAFC] hover:bg-gray-100 transition-colors group"
                            >
                                <td className="px-4 py-4 rounded-l-2xl">
                                    <div className="font-bold text-[#1E293B] text-sm">{r.examTitle}</div>
                                </td>
                                <td className="px-4 py-4">
                                    <div className="font-bold text-[#475569] text-sm">{r.name}</div>
                                    <div className="text-[11px] text-gray-400">{r.email}</div>
                                </td>
                                <td className="px-4 py-4">
                                    <div className="font-bold text-[#475569] text-sm">{r.phone}</div>
                                </td>
                                <td className="px-4 py-4">
                                    <div className="font-black text-gray-700 text-sm">{r.score}/{r.totalQuestions}</div>
                                </td>
                                <td className="px-4 py-4 text-xs font-black uppercase tracking-widest">
                                    <span className={r.status === 'Passed' ? 'text-green-500' : 'text-rose-400'}>{r.status}</span>
                                </td>
                                <td className="px-4 py-4 text-xs text-gray-400 font-bold rounded-r-2xl">
                                    {r.submittedAt}
                                </td>
                            </motion.tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
      ) : (
        <div className="bg-white rounded-[32px] p-8 shadow-sm border border-gray-100">
            <h3 className="text-2xl font-black text-[#1E293B] mb-8 flex items-center gap-3">
                <FiAward className="text-[#EFB008]" /> Declared Winners Circle
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {winnersData.length === 0 ? (
                    <div className="col-span-full p-12 text-center text-gray-400 bg-[#F8FAFC] rounded-2xl border-2 border-dashed">
                        No winners declared yet. Process expired exams to see winners.
                    </div>
                ) : winnersData.map((w, i) => (
                    <motion.div 
                        key={i}
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="bg-[#F8FAFC] hover:bg-[#FFFFFF] hover:shadow-xl hover:scale-[1.02] transition-all p-6 rounded-3xl border border-gray-100 relative group overflow-hidden"
                    >
                        <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-20 transition-opacity">
                            <FiAward size={80} />
                        </div>
                        
                        <div className="flex justify-between items-start mb-4">
                            <span className="px-3 py-1 bg-amber-100 text-amber-600 rounded-lg font-black text-[10px] uppercase tracking-widest">
                                {w.rank}
                            </span>
                            <span className="text-xs font-bold text-gray-400">Score: {w.score}</span>
                        </div>
                        
                        <h4 className="text-lg font-black text-[#1E293B] mb-1">{w.name}</h4>
                        <p className="text-xs text-gray-500 mb-4">{w.examTitle}</p>
                        
                        <div className="space-y-2 border-t border-gray-200 pt-4">
                            <div className="flex justify-between text-[11px]">
                                <span className="text-gray-400 font-bold">COUPON CODE</span>
                                <span className="text-[#5E5CED] font-black">{w.coupon}</span>
                            </div>
                            <div className="flex justify-between text-[11px]">
                                <span className="text-gray-400 font-bold">CONTACT</span>
                                <span className="text-gray-600 font-bold">{w.phone}</span>
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>
        </div>
      )}
    </div>
  );
}

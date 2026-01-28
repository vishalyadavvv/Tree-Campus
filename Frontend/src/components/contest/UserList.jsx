import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import * as XLSX from 'xlsx';
import { FiSearch, FiDownload, FiCheck, FiX, FiChevronLeft, FiChevronRight } from 'react-icons/fi';

export default function UserList() {
  const API_URL = import.meta.env.VITE_API_URL;
  
  const [participants, setParticipants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetchParticipants();
  }, []);

  const fetchParticipants = async () => {
    setLoading(true);
    try {
      const token = sessionStorage.getItem("token");
      const res = await fetch(`${API_URL}/admin/contest/exams`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (!res.ok) throw new Error('Failed to fetch exams');
      const exams = await res.json();
      
      // Aggregate unique participants from all exams
      const userMap = new Map();
      
      exams.forEach(exam => {
        (exam.studentResponses || []).forEach(resp => {
            const key = resp.email || resp.userId;
            if (!userMap.has(key)) {
                userMap.set(key, {
                    name: resp.name,
                    email: resp.email,
                    phone: resp.phone_number,
                    examsCount: 1,
                    bestScore: resp.score,
                    maxPossible: exam.questions.length,
                    lastParticipation: resp.submittedAt
                });
            } else {
                const existing = userMap.get(key);
                existing.examsCount += 1;
                if (resp.score > existing.bestScore) {
                    existing.bestScore = resp.score;
                    existing.maxPossible = exam.questions.length;
                }
                if (new Date(resp.submittedAt) > new Date(existing.lastParticipation)) {
                    existing.lastParticipation = resp.submittedAt;
                }
            }
        });
      });

      setParticipants(Array.from(userMap.values()));
    } catch (err) {
      console.error('Error fetching participants:', err);
    } finally {
      setLoading(false);
    }
  };

  const filteredParticipants = participants.filter(p => 
    p.name?.toLowerCase().includes(search.toLowerCase()) || 
    p.email?.toLowerCase().includes(search.toLowerCase()) ||
    p.phone?.toString().includes(search)
  );

  const downloadExcel = () => {
    const exportData = filteredParticipants.map((p, index) => ({
      'S. No.': index + 1,
      'Name': p.name,
      'Email': p.email,
      'Phone': p.phone,
      'Exams Taken': p.examsCount,
      'Best Score': `${p.bestScore}/${p.maxPossible}`,
      'Last Participation': new Date(p.lastParticipation).toLocaleDateString()
    }));

    const worksheet = XLSX.utils.json_to_sheet(exportData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Contest Participants');
    XLSX.writeFile(workbook, 'Contest_Participants.xlsx');
  };

  return (
    <div className="bg-white rounded-[32px] p-8 shadow-sm border border-gray-100">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
        <div>
          <h2 className="text-3xl font-black text-[#1E293B]">Contest Participants</h2>
          <p className="text-gray-500 font-bold mt-1 text-sm">Showing users who have attempted at least one quiz</p>
        </div>
        
        <div className="flex w-full md:w-auto gap-4">
            <div className="relative flex-1 md:w-80">
                <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                <input 
                    type="text" 
                    placeholder="Search by name, email or phone..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-full pl-12 pr-4 py-3 bg-[#F8FAFC] border border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 transition-colors"
                />
            </div>
            <button 
                onClick={downloadExcel}
                className="bg-[#5E5CED] hover:bg-[#4E4CDD] text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2 transition-all shadow-md shadow-indigo-100 whitespace-nowrap"
            >
                <FiDownload /> Export List
            </button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-separate border-spacing-y-2">
            <thead>
                <tr className="text-[#64748B] text-[11px] font-black uppercase tracking-widest">
                    <th className="px-6 py-4">S. No.</th>
                    <th className="px-6 py-4">Participant Details</th>
                    <th className="px-6 py-4">Contact</th>
                    <th className="px-6 py-4 text-center">Exams Taken</th>
                    <th className="px-6 py-4">Best Performance</th>
                    <th className="px-6 py-4">Last Activity</th>
                </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
                {loading ? (
                    <tr><td colSpan="6" className="p-12 text-center text-gray-400 font-bold">Aggregating participant data...</td></tr>
                ) : filteredParticipants.length === 0 ? (
                    <tr><td colSpan="6" className="p-12 text-center text-gray-400">No participants found match your search.</td></tr>
                ) : filteredParticipants.map((p, idx) => (
                    <motion.tr 
                        key={idx}
                        initial={{ opacity: 0, y: 5 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-[#F8FAFC] hover:bg-gray-50 transition-colors group"
                    >
                        <td className="px-6 py-4 text-gray-500 font-medium text-sm rounded-l-2xl">
                            {idx + 1}
                        </td>
                        <td className="px-6 py-4">
                            <div className="font-bold text-[#1E293B] text-sm uppercase">{p.name}</div>
                            <div className="text-[11px] text-gray-400 font-bold italic">{p.email}</div>
                        </td>
                        <td className="px-6 py-4 text-[#475569] font-bold text-sm">
                            {p.phone}
                        </td>
                        <td className="px-6 py-4 text-center">
                            <span className="bg-indigo-50 text-indigo-600 px-3 py-1 rounded-full text-xs font-black">
                                {p.examsCount}
                            </span>
                        </td>
                        <td className="px-6 py-4 font-black text-green-600 text-sm">
                            {p.bestScore}/{p.maxPossible}
                        </td>
                        <td className="px-6 py-4 text-gray-400 text-xs font-bold rounded-r-2xl">
                            {new Date(p.lastParticipation).toLocaleDateString()}
                        </td>
                    </motion.tr>
                ))}
            </tbody>
        </table>
      </div>
    </div>
  );
}

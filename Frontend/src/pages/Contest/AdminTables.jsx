import React, { useState } from 'react';
import * as XLSX from 'xlsx';

export default function AdminTables({ allExams }) {
  const [selectedExamId, setSelectedExamId] = useState("");

  const downloadExcel = (data, fileName) => {
    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Report");
    XLSX.writeFile(wb, `${fileName}.xlsx`);
  };

  const selectedExam = allExams.find(e => e._id === selectedExamId);

  return (
    <div className="space-y-10">
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
        <label className="block text-sm font-bold text-gray-700 mb-2 uppercase tracking-wider">Select Contest to View Reports</label>
        <select 
          value={selectedExamId}
          onChange={(e) => setSelectedExamId(e.target.value)}
          className="w-full md:w-1/2 p-3 bg-gray-50 border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition"
        >
          <option value="">-- Choose a Contest --</option>
          {allExams.map(exam => (
            <option key={exam._id} value={exam._id}>{exam.title}</option>
          ))}
        </select>
      </div>

      {selectedExam && (
        <div className="grid grid-cols-1 gap-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
          {/* Winners Table */}
          <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100">
            <div className="p-6 bg-gradient-to-r from-indigo-600 to-blue-600 flex justify-between items-center text-white">
               <div>
                  <h3 className="text-xl font-bold">🏆 Winners Report</h3>
                  <p className="text-sm opacity-80">{selectedExam.title}</p>
               </div>
               <button 
                onClick={() => downloadExcel(selectedExam.winners || [], `Winners_${selectedExam.title}`)}
                className="bg-white/20 hover:bg-white/30 px-4 py-2 rounded-lg font-bold text-sm transition"
               >
                 📥 Export Excel
               </button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-gray-50 text-gray-500 text-xs font-black uppercase tracking-widest">
                  <tr>
                    <th className="px-6 py-4">Rank</th>
                    <th className="px-6 py-4">Name</th>
                    <th className="px-6 py-4">Email</th>
                    <th className="px-6 py-4">Score</th>
                    <th className="px-6 py-4">Coupon</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {selectedExam.winners?.sort((a,b) => a.rank - b.rank).map((winner, idx) => (
                    <tr key={idx} className="hover:bg-gray-50 transition">
                      <td className="px-6 py-4 font-black text-indigo-600">#{winner.rank}</td>
                      <td className="px-6 py-4 font-bold text-gray-900">{winner.name}</td>
                      <td className="px-6 py-4 text-gray-600">{winner.email}</td>
                      <td className="px-6 py-4 font-mono">{winner.score}</td>
                      <td className="px-6 py-4"><span className="bg-indigo-50 text-indigo-700 px-2 py-1 rounded font-mono text-sm">{winner.code}</span></td>
                    </tr>
                  ))}
                  {(!selectedExam.winners || selectedExam.winners.length === 0) && (
                    <tr><td colSpan="5" className="px-6 py-10 text-center text-gray-400">No winners declared yet.</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Participants Table */}
          <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100">
            <div className="p-6 bg-gray-900 flex justify-between items-center text-white">
               <div>
                  <h3 className="text-xl font-bold">👥 All Participants</h3>
                  <p className="text-sm opacity-80">{selectedExam.studentResponses?.length || 0} students attempted</p>
               </div>
               <button 
                onClick={() => downloadExcel(selectedExam.studentResponses || [], `Participants_${selectedExam.title}`)}
                className="bg-white/10 hover:bg-white/20 px-4 py-2 rounded-lg font-bold text-sm transition"
               >
                 📥 Export Excel
               </button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-gray-50 text-gray-500 text-xs font-black uppercase tracking-widest">
                  <tr>
                    <th className="px-6 py-4">Name/Email</th>
                    <th className="px-6 py-4">Score</th>
                    <th className="px-6 py-4">Status</th>
                    <th className="px-6 py-4">Time Spent</th>
                    <th className="px-6 py-4">Submitted At</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {selectedExam.studentResponses?.sort((a,b) => b.score - a.score).map((resp, idx) => (
                    <tr key={idx} className="hover:bg-gray-50 transition">
                      <td className="px-6 py-4">
                        <p className="font-bold text-gray-900">{resp.name || 'Anonymous'}</p>
                        <p className="text-xs text-gray-400">{resp.email}</p>
                      </td>
                      <td className="px-6 py-4 font-black">
                         {resp.score}/{selectedExam.questions.length}
                      </td>
                      <td className="px-6 py-4">
                         <span className={`px-2 py-1 rounded text-xs font-bold ${resp.score/selectedExam.questions.length*100 >= selectedExam.passingPercentage ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                            {resp.score/selectedExam.questions.length*100 >= selectedExam.passingPercentage ? 'PASSED' : 'FAILED'}
                         </span>
                      </td>
                      <td className="px-6 py-4 text-gray-500 text-sm">
                         {Math.floor(resp.timeSpent / 60)}m {resp.timeSpent % 60}s
                      </td>
                      <td className="px-6 py-4 text-gray-400 text-xs">
                         {new Date(resp.submittedAt).toLocaleString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {!selectedExamId && (
        <div className="py-20 text-center">
            <p className="text-gray-400 italic">Please select a contest to view detailed statistics.</p>
        </div>
      )}
    </div>
  );
}

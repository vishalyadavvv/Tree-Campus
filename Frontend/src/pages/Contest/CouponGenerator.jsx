import React, { useState, useEffect } from 'react';
import * as XLSX from 'xlsx';
import { motion } from "framer-motion";

export default function CouponGenerator() {
  const [count, setCount] = useState(1);
  const [coupons, setCoupons] = useState([]);
  const [message, setMessage] = useState('');
  const [copiedRows, setCopiedRows] = useState({});

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000/api';

  useEffect(() => {
    fetchCoupons();
  }, [API_URL]);

  const handleCountChange = (e) => {
    const n = Number(e.target.value);
    setCount(n > 0 ? n : 1);
  };

  async function handleGenerateCoupons(e) {
    e.preventDefault();
    setMessage('🚀 Dispatching generation request...');
    try {
      const token = sessionStorage.getItem("token");
      const res = await fetch(`${API_URL}/admin/contest/coupons`, {
        method: 'POST',
        headers: { 
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ count }),
      });
      const body = await res.json();
      if (res.ok) {
        setMessage('✅ Success! Coupons are ready.');
        await fetchCoupons();
      } else {
        setMessage(`❌ Error: ${body.message}`);
      }
    } catch {
      setMessage('⚠️ Network failure.');
    }
  }

  async function fetchCoupons() {
    try {
        const token = sessionStorage.getItem("token");
        const res = await fetch(`${API_URL}/admin/contest/coupons`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        const body = await res.json();
        setCoupons(Array.isArray(body.coupons) ? body.coupons : []);
    } catch (e) {
        console.error('Failed to load coupons', e);
    }
  }

  const groupByDate = (list) =>
    list.reduce((acc, c) => {
      const d = new Date(c.createdAt);
      const key = isNaN(d) ? 'Invalid date' : d.toLocaleDateString();
      acc[key] = acc[key] || [];
      acc[key].push(c.code);
      return acc;
    }, {});

  const couponTables = [
    { title: 'All Issued', data: groupByDate(coupons), color: 'indigo' },
    { title: 'Redeemed', data: groupByDate(coupons.filter(c => c.isUsed)), color: 'green' },
    { title: 'Available', data: groupByDate(coupons.filter(c => !c.isUsed)), color: 'rose' },
  ];

  const copyToClipboard = async (key, codes) => {
    const text = codes.join(', ');
    try {
      await navigator.clipboard.writeText(text);
      setCopiedRows(prev => ({ ...prev, [key]: true }));
      setTimeout(() => setCopiedRows(prev => ({ ...prev, [key]: false })), 2000);
    } catch {
      alert('Copy failed.');
    }
  };

  const downloadExcel = (key, codes) => {
    const ws = XLSX.utils.json_to_sheet(codes.map(c => ({ Coupon: c })));
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, key);
    XLSX.writeFile(wb, `Coupons_${key}.xlsx`);
  };

  return (
    <div className="max-w-6xl mx-auto space-y-12">
      <section className="bg-white rounded-3xl p-8 shadow-xl border border-gray-100 flex flex-col md:flex-row items-center justify-between gap-8 relative overflow-hidden">
        <div className="absolute -left-10 -top-10 w-40 h-40 bg-indigo-50 rounded-full"></div>
        <div className="relative z-10 w-full md:w-auto">
          <h2 className="text-3xl font-black text-gray-900 mb-2 tracking-tight">Bulk Coupon System</h2>
          <p className="text-gray-500 text-sm">Generate secure, unique rewards for your contest winners.</p>
        </div>

        <form onSubmit={handleGenerateCoupons} className="relative z-10 flex flex-col sm:flex-row items-stretch gap-4 w-full md:w-auto">
          <div className="relative">
            <input
              type="number"
              min="1"
              value={count}
              onChange={handleCountChange}
              className="w-full sm:w-28 p-4 bg-gray-50 border-2 border-transparent rounded-2xl focus:border-indigo-600 focus:bg-white outline-none font-black text-center text-xl transition-all"
            />
            <span className="absolute -top-3 left-4 bg-white px-2 text-[10px] font-black text-indigo-600 uppercase tracking-widest border border-indigo-100 rounded">Quantity</span>
          </div>
          <button
            type="submit"
            className="bg-indigo-600 hover:bg-indigo-700 text-white font-black px-8 py-4 rounded-2xl shadow-2xl shadow-indigo-100 active:scale-95 transition-all text-lg"
          >
            Spawn Coupons 🚀
          </button>
        </form>
      </section>

      {message && (
        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className={`p-4 rounded-2xl text-center font-bold text-sm ${message.startsWith('❌') ? 'bg-red-50 text-red-600' : 'bg-indigo-50 text-indigo-600'}`}>
          {message}
        </motion.div>
      )}

      <div className="grid grid-cols-1 gap-12">
        {couponTables.map(({ title, data, color }) => (
          <section key={title} className="bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100">
            <div className={`px-8 py-5 border-b border-gray-100 flex justify-between items-center bg-${color}-50/30`}>
              <h3 className={`text-xl font-black text-${color}-900 flex items-center gap-2`}>
                <span className={`w-3 h-3 rounded-full bg-${color}-500 shadow-sm animate-pulse`}></span>
                {title}
              </h3>
              <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">{Object.keys(data).length} Batches</p>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-50/50 text-[10px] font-black text-gray-400 uppercase tracking-widest">
                    <th className="px-8 py-4 text-left">Generated Date</th>
                    <th className="px-8 py-4 text-left">Quantity</th>
                    <th className="px-8 py-4 text-left">Security Codes (Preview)</th>
                    <th className="px-8 py-4 text-center">Toolkit</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {Object.entries(data).length === 0 ? (
                    <tr><td colSpan="4" className="py-20 text-center text-gray-300 italic font-medium">Clear system logs. No coupons found in this category.</td></tr>
                  ) : (
                    Object.entries(data).map(([date, codes], idx) => (
                      <tr key={date} className="hover:bg-gray-50/50 transition-colors group">
                        <td className="px-8 py-5">
                            <p className="font-bold text-gray-900">{date}</p>
                            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-tight">Timestamp: BST (GMT+1)</p>
                        </td>
                        <td className="px-8 py-5">
                            <span className={`inline-flex items-center justify-center w-10 h-10 rounded-xl bg-${color}-100 text-${color}-700 font-black`}>
                                {codes.length}
                            </span>
                        </td>
                        <td className="px-8 py-5 max-w-sm">
                          <div className="flex flex-wrap gap-2">
                            {codes.slice(0, 4).map((c, i) => (
                              <span key={i} className={`bg-white border border-${color}-100 text-${color}-800 px-3 py-1 rounded-lg text-[10px] font-black font-mono shadow-sm`}>
                                {c}
                              </span>
                            ))}
                            {codes.length > 4 && <span className="text-[10px] text-gray-300 font-bold self-center">+ {codes.length - 4} more</span>}
                          </div>
                        </td>
                        <td className="px-8 py-5">
                          <div className="flex gap-2 justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                            <button
                                onClick={() => copyToClipboard(date + title, codes)}
                                className={`px-4 py-2 rounded-xl text-xs font-black transition-all shadow-sm ${
                                copiedRows[date + title]
                                    ? 'bg-green-600 text-white'
                                    : `bg-white border-2 border-${color}-100 text-${color}-600 hover:border-${color}-600`
                                }`}
                            >
                                {copiedRows[date + title] ? 'Copied ✅' : 'Copy All'}
                            </button>
                            <button
                                onClick={() => downloadExcel(date + title, codes)}
                                className="px-4 py-2 rounded-xl bg-gray-900 text-white text-xs font-black hover:bg-black transition-all shadow-lg"
                            >
                                Export CSV
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}

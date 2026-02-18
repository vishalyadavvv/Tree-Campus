import React, { useState, useEffect } from 'react';
import * as XLSX from 'xlsx';

export default function CouponGenerator() {
  const API_URL = import.meta.env.VITE_API_URL;
  
  const [count, setCount] = useState(1);
  const [coupons, setCoupons] = useState([]);
  const [message, setMessage] = useState('');
  const [copiedRows, setCopiedRows] = useState({});

  useEffect(() => {
    fetchCoupons();
  }, []);

  const handleCountChange = (e) => {
    const n = Number(e.target.value);
    setCount(n > 0 ? n : 1);
  };

  async function handleGenerateCoupons(e) {
    e.preventDefault();
    setMessage('Generating…');
    try {
      const token = localStorage.getItem("token");
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
        setMessage(body.message || 'Done.');
        await fetchCoupons();
      } else {
        setMessage(`Error: ${body.error}`);
      }
    } catch {
      setMessage('Network error.');
    }
  }

  async function fetchCoupons() {
    setMessage('Loading…');
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${API_URL}/admin/contest/coupons`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const body = await res.json();
      setCoupons(Array.isArray(body.coupons) ? body.coupons : []);
      setMessage('');
    } catch {
      setMessage('Failed to load.');
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

  const tables = [
    { title: 'All Coupons', data: groupByDate(coupons), color: 'blue' },
    { title: 'Used Coupons', data: groupByDate(coupons.filter(c => c.used)), color: 'green' },
    { title: 'Unused Coupons', data: groupByDate(coupons.filter(c => !c.used)), color: 'red' },
  ];

  const copyToClipboard = async (key, codes) => {
    const text = codes.join(', ');
    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(text);
      } else {
        const ta = document.createElement('textarea');
        ta.value = text;
        document.body.appendChild(ta);
        ta.select();
        document.execCommand('copy');
        document.body.removeChild(ta);
      }
      setCopiedRows(prev => ({ ...prev, [key]: true }));
      setTimeout(() => setCopiedRows(prev => ({ ...prev, [key]: false })), 2000);
    } catch {
      setMessage('Copy failed.');
    }
  };

  const downloadExcel = (key, codes) => {
    const ws = XLSX.utils.json_to_sheet(codes.map(c => ({ Coupon: c })));
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, key);
    const buf = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
    const blob = new Blob([buf], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    if (window.navigator.msSaveOrOpenBlob) {
      window.navigator.msSaveOrOpenBlob(blob, `${key}.xlsx`);
    } else {
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${key}.xlsx`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4">
      <div className="max-w-5xl mx-auto space-y-10">
        <header className="text-center">
          <h1 className="text-5xl font-extrabold text-gray-800">Coupon Dashboard</h1>
          <p className="mt-2 text-gray-600">Generate, view, and export your coupon codes.</p>
        </header>

        <section className="bg-white shadow-lg rounded-lg p-6">
          <form onSubmit={handleGenerateCoupons} className="flex flex-col sm:flex-row items-end gap-6">
            <div className="flex flex-col">
              <label htmlFor="count" className="text-gray-700 font-medium mb-1">Number of Coupons</label>
              <input
                id="count"
                type="number"
                min="1"
                value={count}
                onChange={handleCountChange}
                className="w-24 border border-gray-300 rounded focus:ring-2 focus:ring-indigo-100 focus:border-indigo-300 px-3 py-2"
              />
            </div>
            <button
              type="submit"
              className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-6 py-2 rounded focus:outline-none focus:ring-2 focus:ring-indigo-200 transition"
            >
              Generate
            </button>
            {message && (
              <div className="mt-4 sm:mt-0 text-gray-600 italic">
                {message}
              </div>
            )}
          </form>
        </section>

        {tables.map(({ title, data, color }) => (
          <section key={title} className="bg-white shadow-lg rounded-lg overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className={`text-2xl font-semibold text-${color}-700`}>{title}</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full table-auto border-collapse">
                <thead className={`bg-${color}-600 text-white`}>
                  <tr>
                    <th className="sticky top-0 px-5 py-3 text-left text-sm font-medium uppercase">Date</th>
                    <th className="sticky top-0 px-5 py-3 text-left text-sm font-medium uppercase">Count</th>
                    <th className="sticky top-0 px-5 py-3 text-left text-sm font-medium uppercase">Codes</th>
                    <th className="sticky top-0 px-5 py-3 text-center text-sm font-medium uppercase">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {Object.entries(data).length === 0 ? (
                    <tr>
                      <td colSpan="4" className="py-6 text-center text-gray-400">No records to display.</td>
                    </tr>
                  ) : (
                    Object.entries(data).map(([date, codes], idx) => (
                      <tr
                        key={date}
                        className={idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'}
                      >
                        <td className="px-5 py-4 whitespace-nowrap font-medium text-gray-800">{date}</td>
                        <td className="px-5 py-4 whitespace-nowrap text-gray-700">{codes.length}</td>
                        <td className="px-5 py-4">
                          <div className="flex flex-wrap gap-2">
                            {codes.map((c, i) => (
                              <span
                                key={i}
                                className={`inline-block bg-${color}-100 text-${color}-800 px-3 py-1 rounded-full text-xs font-medium`}
                              >
                                {c}
                              </span>
                            ))}
                          </div>
                        </td>
                        <td className="px-5 py-4 text-center space-x-2">
                          <button
                            onClick={() => copyToClipboard(date + title, codes)}
                            className={`inline-flex items-center justify-center px-3 py-1 rounded text-sm text-white ${
                              copiedRows[date + title]
                                ? 'bg-green-600'
                                : `bg-${color}-500 hover:bg-${color}-600`
                            } focus:outline-none focus:ring-2 focus:ring-${color}-200 transition`}
                          >
                            {copiedRows[date + title] ? 'Copied' : 'Copy'}
                          </button>
                          <button
                            onClick={() => downloadExcel(date + title, codes)}
                            className="inline-flex items-center justify-center px-3 py-1 rounded bg-gray-800 hover:bg-gray-900 text-white text-sm focus:outline-none focus:ring-2 focus:ring-gray-300 transition"
                          >
                            Export
                          </button>
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

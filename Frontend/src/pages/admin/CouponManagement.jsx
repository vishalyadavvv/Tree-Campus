import React, { useState, useEffect, useRef } from 'react';
import DashboardLayout from '../../components/Layout/DashboardLayout';
import api from '../../services/api';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FiSearch, FiFilter, FiDownload, FiPlus, FiTrash2, FiCopy, 
  FiRefreshCw, FiCheckCircle, FiXCircle, FiClock, FiTag, FiMoreVertical
} from 'react-icons/fi';
import toast from 'react-hot-toast';
import * as XLSX from 'xlsx';

export default function CouponManagement() {
  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all'); // all, active, used
  const [search, setSearch] = useState('');
  const [generating, setGenerating] = useState(false);
  const [generateCount, setGenerateCount] = useState(1);
  const [showGenerateModal, setShowGenerateModal] = useState(false);
  const intervalRef = useRef(null);

  useEffect(() => {
    fetchCoupons();
    
    // Real-time polling
    intervalRef.current = setInterval(fetchCoupons, 30000);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  const fetchCoupons = async () => {
    try {
      const res = await api.get('/admin/contest/coupons');
      if (res.data.success) {
        setCoupons(res.data.coupons);
      }
    } catch (error) {
      console.error('Failed to fetch coupons:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleGenerate = async (e) => {
    e.preventDefault();
    setGenerating(true);
    try {
      const res = await api.post('/admin/contest/coupons', { count: generateCount });
      if (res.data.success) {
        toast.success(res.data.message || 'Coupons generated successfully');
        setShowGenerateModal(false);
        setGenerateCount(1);
        fetchCoupons();
      } else {
        toast.error(res.data.message || 'Failed to generate');
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Generation failed');
    } finally {
      setGenerating(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this coupon?')) return;
    try {
      const res = await api.delete(`/admin/contest/coupons/${id}`);
      if (res.data.success) {
        toast.success('Coupon deleted');
        setCoupons(prev => prev.filter(c => c._id !== id));
      }
    } catch (error) {
      toast.error('Failed to delete coupon');
    }
  };

  const handleToggleStatus = async (id) => {
    try {
      const res = await api.put(`/admin/contest/coupons/${id}/toggle`);
      if (res.data.success) {
        toast.success(`Coupon marked as ${res.data.coupon.used ? 'Used' : 'Active'}`);
        setCoupons(prev => prev.map(c => c._id === id ? res.data.coupon : c));
      }
    } catch (error) {
      toast.error('Failed to update status');
    }
  };

  const handleCopy = (code) => {
    navigator.clipboard.writeText(code);
    toast.success('Copied to clipboard');
  };

  const handleExport = () => {
    const dataToExport = filteredCoupons.map(c => ({
      Code: c.code,
      Status: c.used ? 'Redeemed' : 'Active',
      'Created At': new Date(c.createdAt).toLocaleString(),
      'Redeemed At': c.redeemedAt ? new Date(c.redeemedAt).toLocaleString() : '-',
    }));

    const ws = XLSX.utils.json_to_sheet(dataToExport);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Coupons");
    XLSX.writeFile(wb, `Coupons_${new Date().toISOString().split('T')[0]}.xlsx`);
  };

  // Filter Logic
  const filteredCoupons = coupons.filter(c => {
    const matchesSearch = c.code.toLowerCase().includes(search.toLowerCase());
    const matchesFilter = 
      filter === 'all' ? true :
      filter === 'used' ? c.used :
      !c.used; // active
    return matchesSearch && matchesFilter;
  });

  // Stats
  const total = coupons.length;
  const used = coupons.filter(c => c.used).length;
  const active = total - used;
  const usedPercent = total > 0 ? Math.round((used / total) * 100) : 0;

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
                <h1 className="text-2xl font-bold text-gray-900">Coupon Management</h1>
                <p className="text-gray-500 text-sm mt-1">Manage contest rewards and tracking</p>
            </div>
            <div className="flex gap-3">
                <button 
                    onClick={() => setShowGenerateModal(true)}
                    className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition shadow-sm font-medium"
                >
                    <FiPlus className="w-4 h-4" />
                    <span>Generate Coupons</span>
                </button>
                <button 
                    onClick={handleExport}
                    className="flex items-center space-x-2 bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50 transition shadow-sm font-medium"
                >
                    <FiDownload className="w-4 h-4" />
                    <span>Export CSV</span>
                </button>
            </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm flex items-center justify-between">
                <div>
                    <p className="text-sm font-medium text-gray-500 mb-1">Total Coupons</p>
                    <h3 className="text-3xl font-bold text-gray-900">{total}</h3>
                </div>
                <div className="p-3 bg-blue-50 text-blue-600 rounded-lg">
                    <FiTag className="w-6 h-6" />
                </div>
            </div>
            <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm flex items-center justify-between">
                <div>
                    <p className="text-sm font-medium text-gray-500 mb-1">Active / Available</p>
                    <h3 className="text-3xl font-bold text-green-600">{active}</h3>
                </div>
                <div className="p-3 bg-green-50 text-green-600 rounded-lg">
                    <FiCheckCircle className="w-6 h-6" />
                </div>
            </div>
            <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm flex items-center justify-between">
                <div>
                    <p className="text-sm font-medium text-gray-500 mb-1">Redeemed</p>
                    <h3 className="text-3xl font-bold text-purple-600">{used} <span className="text-sm font-normal text-gray-400">({usedPercent}%)</span></h3>
                </div>
                <div className="p-3 bg-purple-50 text-purple-600 rounded-lg">
                    <FiClock className="w-6 h-6" />
                </div>
            </div>
        </div>

        {/* Filters & Search */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="p-4 border-b border-gray-200 flex flex-col md:flex-row justify-between items-center gap-4 bg-gray-50">
                <div className="flex bg-gray-200 p-1 rounded-lg">
                    {['all', 'active', 'used'].map(f => (
                        <button
                            key={f}
                            onClick={() => setFilter(f)}
                            className={`px-4 py-1.5 text-sm font-medium rounded-md capitalize transition-all ${
                                filter === f ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'
                            }`}
                        >
                            {f}
                        </button>
                    ))}
                </div>
                <div className="relative w-full md:w-64">
                    <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input 
                        type="text" 
                        placeholder="Search code..." 
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                    />
                </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
                <table className="w-full text-left">
                    <thead className="bg-gray-50 text-xs font-semibold text-gray-500 uppercase tracking-wider border-b border-gray-200">
                        <tr>
                            <th className="px-6 py-4">Coupon Code</th>
                            <th className="px-6 py-4">Status</th>
                            <th className="px-6 py-4">Created At</th>
                            <th className="px-6 py-4">Redeemed At</th>
                            <th className="px-6 py-4 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {loading ? (
                             <tr><td colSpan="5" className="px-6 py-12 text-center text-gray-500">Loading coupons...</td></tr>
                        ) : filteredCoupons.length === 0 ? (
                            <tr><td colSpan="5" className="px-6 py-12 text-center text-gray-500">No coupons found matching your criteria.</td></tr>
                        ) : (
                            filteredCoupons.map((coupon) => (
                                <tr key={coupon._id} className="hover:bg-gray-50 transition-colors group">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center space-x-2">
                                            <span className="font-mono font-medium text-gray-900 bg-gray-100 px-2 py-1 rounded border border-gray-200">
                                                {coupon.code}
                                            </span>
                                            <button 
                                                onClick={() => handleCopy(coupon.code)}
                                                className="text-gray-400 hover:text-blue-600 opacity-0 group-hover:opacity-100 transition-opacity"
                                                title="Copy Code"
                                            >
                                                <FiCopy className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        {coupon.used ? (
                                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                                                <span className="w-1.5 h-1.5 mr-1.5 bg-red-500 rounded-full"></span>
                                                Redeemed
                                            </span>
                                        ) : (
                                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                                <span className="w-1.5 h-1.5 mr-1.5 bg-green-500 rounded-full"></span>
                                                Active
                                            </span>
                                        )}
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-600">
                                        {new Date(coupon.createdAt).toLocaleDateString()} <span className="text-gray-400 text-xs">{new Date(coupon.createdAt).toLocaleTimeString()}</span>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-600">
                                        {coupon.redeemedAt ? (
                                            <>
                                                {new Date(coupon.redeemedAt).toLocaleDateString()} <span className="text-gray-400 text-xs">{new Date(coupon.redeemedAt).toLocaleTimeString()}</span>
                                            </>
                                        ) : (
                                            <span className="text-gray-400">-</span>
                                        )}
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex items-center justify-end space-x-3">
                                            <button 
                                                onClick={() => handleToggleStatus(coupon._id)}
                                                className={`text-xs font-medium px-3 py-1 rounded transition-colors ${
                                                    coupon.used 
                                                    ? 'bg-green-50 text-green-600 hover:bg-green-100' 
                                                    : 'bg-red-50 text-red-600 hover:bg-red-100'
                                                }`}
                                            >
                                                Mark {coupon.used ? 'Active' : 'Used'}
                                            </button>
                                            <button 
                                                onClick={() => handleDelete(coupon._id)}
                                                className="text-gray-400 hover:text-red-600 transition-colors p-1"
                                                title="Delete Coupon"
                                            >
                                                <FiTrash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
            
            {/* Pagination Footer (Simple Stats for now) */}
            <div className="px-6 py-4 border-t border-gray-200 bg-gray-50 text-sm text-gray-500 flex justify-between items-center">
                <span>Showing {filteredCoupons.length} of {coupons.length} coupons</span>
            </div>
        </div>
      </div>

      {/* Generate Modal */}
      <AnimatePresence>
        {showGenerateModal && (
            <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                <motion.div 
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden"
                >
                    <div className="p-6 border-b border-gray-100 flex justify-between items-center">
                        <h3 className="text-xl font-bold text-gray-900">Generate Coupons</h3>
                        <button onClick={() => setShowGenerateModal(false)} className="text-gray-400 hover:text-gray-600 transition-colors">
                            <FiXCircle className="w-6 h-6" />
                        </button>
                    </div>
                    
                    <form onSubmit={handleGenerate} className="p-6 space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Quantity to Generate
                            </label>
                            <input 
                                type="number" 
                                min="1" 
                                max="1000"
                                value={generateCount}
                                onChange={(e) => setGenerateCount(parseInt(e.target.value) || 1)}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                            />
                            <p className="text-xs text-gray-500 mt-1">
                                Generates unique, random 8-character codes.
                            </p>
                        </div>
                        
                        <div className="pt-4 flex gap-3">
                            <button 
                                type="button"
                                onClick={() => setShowGenerateModal(false)}
                                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium transition-colors"
                            >
                                Cancel
                            </button>
                            <button 
                                type="submit"
                                disabled={generating}
                                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium transition-colors disabled:opacity-70 disabled:cursor-not-allowed flex justify-center items-center"
                            >
                                {generating ? <FiRefreshCw className="w-4 h-4 animate-spin" /> : 'Generate'}
                            </button>
                        </div>
                    </form>
                </motion.div>
            </div>
        )}
      </AnimatePresence>

    </DashboardLayout>
  );
}

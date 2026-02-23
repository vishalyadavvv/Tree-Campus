import React, { useState, useEffect, useRef } from 'react';
import DashboardLayout from '../../components/Layout/DashboardLayout';
import api from '../../services/api';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FiSearch, FiFilter, FiDownload, FiPlus, FiTrash2, FiCopy, 
  FiRefreshCw, FiCheckCircle, FiXCircle, FiClock, FiTag, FiMoreVertical,
  FiUpload
} from 'react-icons/fi';
import toast from 'react-hot-toast';
import * as XLSX from 'xlsx';

export default function CouponManagement() {
  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all'); // all, active, used
  const [search, setSearch] = useState('');
  const [showGenerateModal, setShowGenerateModal] = useState(false);
  const [showBulkModal, setShowBulkModal] = useState(false);
  const [uploadMode, setUploadMode] = useState('file'); // 'file' or 'paste'
  const [pastedText, setPastedText] = useState('');
  const [bulkData, setBulkData] = useState([]);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef(null);
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

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (evt) => {
        try {
            const bstr = evt.target.result;
            const wb = XLSX.read(bstr, { type: 'binary' });
            const wsname = wb.SheetNames[0];
            const ws = wb.Sheets[wsname];
            const data = XLSX.utils.sheet_to_json(ws);

            // Flexible Column Detection
            const findKey = (row, patterns) => {
                return Object.keys(row).find(key => 
                    patterns.some(p => key.toLowerCase().includes(p.toLowerCase()))
                );
            };

            const sanitized = data.map(row => {
                const codeKey = findKey(row, ['code', 'coupon', 'voucher']);

                return {
                    code: row[codeKey] || ''
                };
            }).filter(row => row.code);

            if (sanitized.length === 0) {
                toast.error('No valid coupons found. Ensure your file has a column named "Code" or "Coupon".');
                return;
            }

            setBulkData(sanitized);
        } catch (err) {
            toast.error('Failed to parse file: ' + err.message);
        }
    };
    reader.readAsBinaryString(file);
    e.target.value = '';
  };

  const handlePasteProcess = () => {
    if (!pastedText.trim()) return;
    
    // Split by lines and then by (comma, tab, or space)
    const lines = pastedText.split('\n');
    const processed = lines.map(line => {
        const code = line.trim();
        return {
            code: code
        };
    }).filter(row => row.code);

    if (processed.length === 0) {
        toast.error('No valid codes detected.');
        return;
    }

    setBulkData(processed);
  };

  const handleBulkUpload = async () => {
    if (bulkData.length === 0) return;
    setUploading(true);
    try {
        const res = await api.post('/admin/contest/coupons/bulk', { coupons: bulkData });
        if (res.data.success) {
            toast.success(res.data.message);
            setShowBulkModal(false);
            setBulkData([]);
            fetchCoupons();
        }
    } catch (err) {
        toast.error(err.response?.data?.message || 'Bulk upload failed');
    } finally {
        setUploading(false);
    }
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
                    onClick={() => setShowBulkModal(true)}
                    className="flex items-center space-x-2 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition shadow-sm font-medium"
                >
                    <FiUpload className="w-4 h-4" />
                    <span>Bulk Upload</span>
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
                                Generates unique codes in format: <code className="bg-gray-100 px-1 rounded text-blue-600 font-bold">TC-XXXXXXX</code>
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

      {/* Bulk Upload Modal */}
      <AnimatePresence>
        {showBulkModal && (
            <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                <motion.div 
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="bg-white rounded-2xl shadow-xl w-full max-w-lg overflow-hidden"
                >
                    <div className="p-6 border-b border-gray-100 flex justify-between items-center">
                        <h3 className="text-xl font-bold text-gray-900">Bulk Upload Coupons</h3>
                        <button onClick={() => { setShowBulkModal(false); setBulkData([]); setPastedText(''); }} className="text-gray-400 hover:text-gray-600 transition-colors">
                            <FiXCircle className="w-6 h-6" />
                        </button>
                    </div>
                    
                    <div className="p-6 space-y-6">
                        {bulkData.length === 0 ? (
                            <div className="space-y-4">
                                <div className="flex p-1 bg-gray-100 rounded-lg">
                                    <button 
                                        onClick={() => setUploadMode('file')}
                                        className={`flex-1 py-2 text-sm font-bold rounded-md transition-all ${uploadMode === 'file' ? 'bg-white shadow-sm text-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
                                    >
                                        📁 File Upload
                                    </button>
                                    <button 
                                        onClick={() => setUploadMode('paste')}
                                        className={`flex-1 py-2 text-sm font-bold rounded-md transition-all ${uploadMode === 'paste' ? 'bg-white shadow-sm text-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
                                    >
                                        📋 Direct Paste
                                    </button>
                                </div>

                                {uploadMode === 'file' ? (
                                    <div className="text-center py-10 border-2 border-dashed border-gray-200 rounded-xl bg-gray-50">
                                        <input 
                                            type="file" 
                                            ref={fileInputRef}
                                            onChange={handleFileSelect}
                                            className="hidden" 
                                            accept=".csv,.xlsx,.xls"
                                        />
                                        <FiUpload className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                                        <p className="text-gray-600 font-medium mb-1">Select your CSV or Excel file</p>
                                        <p className="text-xs text-gray-400 mb-6 px-10">Flexible headers! We look for columns like <code className="bg-gray-200 px-1 rounded">code</code> or <code className="bg-gray-200 px-1 rounded">coupon</code>.</p>
                                        <button 
                                            onClick={() => fileInputRef.current.click()}
                                            className="bg-blue-600 text-white px-8 py-2.5 rounded-lg hover:bg-blue-700 transition font-bold text-sm shadow-md"
                                        >
                                            Choose File
                                        </button>
                                    </div>
                                ) : (
                                    <div className="space-y-3">
                                        <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider">Paste Coupon Codes (One per line)</label>
                                        <textarea 
                                            className="w-full h-40 p-4 bg-gray-50 border border-gray-200 rounded-xl text-sm font-mono focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                                            placeholder={`TC-XYZ123\nTC-ABC789\nTC-999000`}
                                            value={pastedText}
                                            onChange={(e) => setPastedText(e.target.value)}
                                        />
                                        <button 
                                            onClick={handlePasteProcess}
                                            className="w-full py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition font-black shadow-lg shadow-blue-100"
                                        >
                                            Process Pasted Text
                                        </button>
                                        <p className="text-[10px] text-gray-400 text-center uppercase tracking-widest font-bold">Simply paste your codes, one per line</p>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <div className="space-y-4">
                                <div className="bg-blue-50 p-4 rounded-xl flex items-center justify-between">
                                    <div className="flex items-center space-x-3">
                                        <div className="p-2 bg-blue-100 text-blue-600 rounded-lg">
                                            <FiTag className="w-5 h-5" />
                                        </div>
                                        <div>
                                            <p className="text-sm font-bold text-blue-900">{bulkData.length} Coupons Found</p>
                                            <p className="text-xs text-blue-700">Ready to upload to database</p>
                                        </div>
                                    </div>
                                    <button 
                                        onClick={() => setBulkData([])}
                                        className="text-xs font-bold text-blue-600 hover:text-blue-800 uppercase tracking-wider"
                                    >
                                        Change File
                                    </button>
                                </div>

                                <div className="max-h-60 overflow-y-auto border border-gray-100 rounded-lg bg-gray-50">
                                    <table className="w-full text-left text-xs">
                                        <thead className="sticky top-0 bg-white border-b border-gray-100 text-gray-400 font-bold uppercase">
                                            <tr>
                                                <th className="px-3 py-2">Code</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-gray-100">
                                            {bulkData.slice(0, 50).map((row, idx) => (
                                                <tr key={idx}>
                                                    <td className="px-3 py-2 font-mono text-gray-700">{row.code}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                    {bulkData.length > 50 && (
                                        <div className="p-2 text-center text-gray-400 text-[10px]">
                                            And {bulkData.length - 50} more...
                                        </div>
                                    )}
                                </div>

                                <button 
                                    onClick={handleBulkUpload}
                                    disabled={uploading}
                                    className="w-full py-3 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition font-black shadow-lg shadow-indigo-100 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                                >
                                    {uploading ? <FiRefreshCw className="w-5 h-5 animate-spin" /> : <span>🚀 Start Upload</span>}
                                </button>
                            </div>
                        ) }
                    </div>
                </motion.div>
            </div>
        )}
      </AnimatePresence>

    </DashboardLayout>
  );
}

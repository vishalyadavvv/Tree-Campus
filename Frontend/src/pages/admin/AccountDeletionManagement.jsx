import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FiSearch, FiEye, FiCheck, FiX, FiRefreshCw, FiUserX } from 'react-icons/fi';
import DashboardLayout from '../../components/Layout/DashboardLayout';
import toast from 'react-hot-toast';

const API_BASE_URL = import.meta.env.VITE_API_URL;

const AccountDeletionManagement = () => {
  const [deletions, setDeletions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [selectedDeletion, setSelectedDeletion] = useState(null);
  const [confirmModal, setConfirmModal] = useState(null);
  const [lastRefresh, setLastRefresh] = useState(new Date());

  useEffect(() => {
    fetchDeletions();
    
    // Auto-refresh every 30 seconds
    const interval = setInterval(fetchDeletions, 30000);
    return () => clearInterval(interval);
  }, []);

  const fetchDeletions = async () => {
    try {
      setLoading(true);
      console.log('Fetching deletions from:', `${API_BASE_URL}/account-deletion-request/all`);
      const response = await axios.get(`${API_BASE_URL}/account-deletion-request/all`);
      console.log('Deletions response:', response);
      console.log('Deletions data:', response.data);
      
      // Handle different response formats
      const deletionsData = response.data.data || response.data.requests || response.data || [];
      console.log('Extracted deletions:', deletionsData);
      
      setDeletions(deletionsData);
      setLastRefresh(new Date());
    } catch (error) {
      console.error('Error fetching deletions:', error);
      console.error('Error response:', error.response);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (id, status) => {
    try {
      await axios.patch(`${API_BASE_URL}/account-deletion-request/${id}/status`, { status });
      await fetchDeletions();
      setConfirmModal(null);
      toast.success(`Status updated to ${status} successfully!`);
    } catch (error) {
      console.error('Error updating status:', error);
      toast.error('Failed to update status. Please try again.');
    }
  };

  const filterData = (data) => {
    let filtered = data;
    
    if (filter !== 'all') {
      filtered = filtered.filter(item => item.status === filter);
    }
    
    if (search) {
      filtered = filtered.filter(item =>
        item.email?.toLowerCase().includes(search.toLowerCase())
      );
    }
    
    return filtered;
  };

  const filtered = filterData(deletions);

  const stats = {
    total: deletions.length,
    pending_verification: deletions.filter(d => d.status === 'pending_verification').length,
    verified: deletions.filter(d => d.status === 'verified').length,
    processing: deletions.filter(d => d.status === 'processing').length,
    completed: deletions.filter(d => d.status === 'completed').length,
    cancelled: deletions.filter(d => d.status === 'cancelled').length
  };

  const ActionButtons = ({ deletion }) => (
    <div className="flex gap-2">
      {deletion.status === 'pending_verification' && (
        <>
          <button
            onClick={() => setConfirmModal({ id: deletion._id, status: 'verified' })}
            className="px-3 py-1 bg-green-500 hover:bg-green-600 text-white rounded-lg text-sm font-bold flex items-center gap-1"
          >
            <FiCheck size={14} /> Verify
          </button>
          <button
            onClick={() => setConfirmModal({ id: deletion._id, status: 'cancelled' })}
            className="px-3 py-1 bg-red-500 hover:bg-red-600 text-white rounded-lg text-sm font-bold flex items-center gap-1"
          >
            <FiX size={14} /> Cancel
          </button>
        </>
      )}
      {deletion.status !== 'pending_verification' && (
        <span className={`px-3 py-1 rounded-lg text-sm font-bold ${
          deletion.status === 'verified' || deletion.status === 'completed' 
            ? 'bg-green-100 text-green-700' 
            : deletion.status === 'cancelled'
            ? 'bg-red-100 text-red-700'
            : 'bg-blue-100 text-blue-700'
        }`}>
          {deletion.status.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
        </span>
      )}
    </div>
  );

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
              <FiUserX className="text-[#EF4444]" />
              Account Deletion Requests
            </h1>
            <p className="text-gray-600 mt-1">Manage user account deletion requests</p>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-500">
              Last updated: {lastRefresh.toLocaleTimeString()}
            </span>
            <button
              onClick={fetchDeletions}
              disabled={loading}
              className="px-4 py-2 bg-[#EF4444] hover:bg-[#DC2626] text-white rounded-lg font-bold flex items-center gap-2 disabled:opacity-50"
            >
              <FiRefreshCw className={loading ? 'animate-spin' : ''} />
              Refresh
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-[#EF4444]">
            <p className="text-sm text-gray-600 mb-1">Total</p>
            <p className="text-3xl font-bold text-[#EF4444]">{stats.total}</p>
          </div>
          <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-yellow-500">
            <p className="text-sm text-gray-600 mb-1">Pending Verification</p>
            <p className="text-3xl font-bold text-yellow-600">{stats.pending_verification}</p>
          </div>
          <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-green-500">
            <p className="text-sm text-gray-600 mb-1">Verified</p>
            <p className="text-3xl font-bold text-green-600">{stats.verified}</p>
          </div>
          <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-blue-500">
            <p className="text-sm text-gray-600 mb-1">Processing</p>
            <p className="text-3xl font-bold text-blue-600">{stats.processing}</p>
          </div>
          <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-purple-500">
            <p className="text-sm text-gray-600 mb-1">Completed</p>
            <p className="text-3xl font-bold text-purple-600">{stats.completed}</p>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search by email..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#EF4444] focus:border-[#EF4444]"
            />
          </div>
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#EF4444] focus:border-[#EF4444]"
          >
            <option value="all">All Status</option>
            <option value="pending_verification">Pending Verification</option>
            <option value="verified">Verified</option>
            <option value="processing">Processing</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>

        {/* Table */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-bold text-gray-700 uppercase">Email</th>
                  <th className="px-6 py-3 text-left text-xs font-bold text-gray-700 uppercase">Reason</th>
                  <th className="px-6 py-3 text-left text-xs font-bold text-gray-700 uppercase">Requested</th>
                  <th className="px-6 py-3 text-left text-xs font-bold text-gray-700 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filtered.map((deletion) => (
                  <tr key={deletion._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 font-bold text-gray-900">{deletion.email}</td>
                    <td className="px-6 py-4 text-gray-600">{deletion.reason?.substring(0, 50)}...</td>
                    <td className="px-6 py-4 text-gray-600">{new Date(deletion.createdAt).toLocaleDateString()}</td>
                    <td className="px-6 py-4">
                      <div className="flex gap-2">
                        <button
                          onClick={() => setSelectedDeletion(deletion)}
                          className="px-2 py-1 bg-blue-500 hover:bg-blue-600 text-white rounded text-sm flex items-center gap-1"
                        >
                          <FiEye size={14} /> View
                        </button>
                        <ActionButtons deletion={deletion} />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {filtered.length === 0 && (
            <div className="text-center py-12 text-gray-500">
              No account deletion requests found
            </div>
          )}
        </div>
      </div>

      {/* Confirmation Modal */}
      {confirmModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full">
            <h3 className="text-2xl font-bold mb-4">Confirm Action</h3>
            <p className="text-gray-600 mb-6">
              Are you sure you want to {confirmModal.status} this account deletion request?
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setConfirmModal(null)}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg font-bold hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={() => handleStatusUpdate(confirmModal.id, confirmModal.status)}
                className={`flex-1 px-4 py-2 rounded-lg font-bold text-white ${
                  confirmModal.status === 'approved' ? 'bg-green-500 hover:bg-green-600' : 'bg-red-500 hover:bg-red-600'
                }`}
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Detail Modal */}
      {selectedDeletion && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <h3 className="text-2xl font-bold mb-4">Account Deletion Request Details</h3>
            <div className="space-y-4">
              <div><span className="font-bold">Email:</span> {selectedDeletion.email}</div>
              <div>
                <span className="font-bold">Reason:</span>
                <p className="mt-2 text-gray-700">{selectedDeletion.reason}</p>
              </div>
              <div><span className="font-bold">Status:</span> {selectedDeletion.status}</div>
              <div><span className="font-bold">Requested:</span> {new Date(selectedDeletion.createdAt).toLocaleString()}</div>
            </div>
            
            {/* Action Buttons */}
            {selectedDeletion.status === 'pending_verification' && (
              <div className="flex gap-3 mt-6">
                <button
                  onClick={() => {
                    setSelectedDeletion(null);
                    setConfirmModal({ id: selectedDeletion._id, status: 'verified' });
                  }}
                  className="flex-1 px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg font-bold flex items-center justify-center gap-2"
                >
                  <FiCheck size={16} /> Verify
                </button>
                <button
                  onClick={() => {
                    setSelectedDeletion(null);
                    setConfirmModal({ id: selectedDeletion._id, status: 'cancelled' });
                  }}
                  className="flex-1 px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg font-bold flex items-center justify-center gap-2"
                >
                  <FiX size={16} /> Cancel
                </button>
              </div>
            )}
            
            <button
              onClick={() => setSelectedDeletion(null)}
              className="mt-4 w-full px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-lg font-bold"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
};

export default AccountDeletionManagement;

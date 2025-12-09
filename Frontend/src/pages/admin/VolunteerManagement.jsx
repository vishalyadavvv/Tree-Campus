import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FiSearch, FiEye, FiCheck, FiX, FiRefreshCw, FiUsers } from 'react-icons/fi';
import DashboardLayout from '../../components/Layout/DashboardLayout';
import toast from 'react-hot-toast';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://tree-campus.onrender.com/api';

const VolunteerManagement = () => {
  const [volunteers, setVolunteers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [selectedVolunteer, setSelectedVolunteer] = useState(null);
  const [confirmModal, setConfirmModal] = useState(null);
  const [lastRefresh, setLastRefresh] = useState(new Date());

  useEffect(() => {
    fetchVolunteers();
    
    // Auto-refresh every 30 seconds
    const interval = setInterval(fetchVolunteers, 30000);
    return () => clearInterval(interval);
  }, []);

  const fetchVolunteers = async () => {
    try {
      setLoading(true);
      console.log('Fetching volunteers from:', `${API_BASE_URL}/volunteer`);
      const response = await axios.get(`${API_BASE_URL}/volunteer`);
      console.log('Volunteers response:', response);
      console.log('Volunteers data:', response.data);
      
      // Handle different response formats
      const volunteersData = response.data.data || response.data.volunteers || response.data || [];
      console.log('Extracted volunteers:', volunteersData);
      
      setVolunteers(volunteersData);
      setLastRefresh(new Date());
    } catch (error) {
      console.error('Error fetching volunteers:', error);
      console.error('Error response:', error.response);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (id, status) => {
    try {
      await axios.patch(`${API_BASE_URL}/volunteer/${id}/status`, { status });
      await fetchVolunteers();
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
        item.name?.toLowerCase().includes(search.toLowerCase()) ||
        item.email?.toLowerCase().includes(search.toLowerCase())
      );
    }
    
    return filtered;
  };

  const filtered = filterData(volunteers);

  const stats = {
    total: volunteers.length,
    pending: volunteers.filter(v => v.status === 'pending').length,
    approved: volunteers.filter(v => v.status === 'approved').length,
    rejected: volunteers.filter(v => v.status === 'rejected').length
  };

  const ActionButtons = ({ volunteer }) => (
    <div className="flex gap-2">
      {volunteer.status === 'pending' && (
        <>
          <button
            onClick={() => setConfirmModal({ id: volunteer._id, status: 'approved' })}
            className="px-3 py-1 bg-green-500 hover:bg-green-600 text-white rounded-lg text-sm font-bold flex items-center gap-1"
          >
            <FiCheck size={14} /> Approve
          </button>
          <button
            onClick={() => setConfirmModal({ id: volunteer._id, status: 'rejected' })}
            className="px-3 py-1 bg-red-500 hover:bg-red-600 text-white rounded-lg text-sm font-bold flex items-center gap-1"
          >
            <FiX size={14} /> Reject
          </button>
        </>
      )}
      {volunteer.status !== 'pending' && (
        <span className={`px-3 py-1 rounded-lg text-sm font-bold ${
          volunteer.status === 'approved' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
        }`}>
          {volunteer.status.charAt(0).toUpperCase() + volunteer.status.slice(1)}
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
              <FiUsers className="text-[#10B981]" />
              Volunteer Applications
            </h1>
            <p className="text-gray-600 mt-1">Manage volunteer application submissions</p>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-500">
              Last updated: {lastRefresh.toLocaleTimeString()}
            </span>
            <button
              onClick={fetchVolunteers}
              disabled={loading}
              className="px-4 py-2 bg-[#10B981] hover:bg-[#059669] text-white rounded-lg font-bold flex items-center gap-2 disabled:opacity-50"
            >
              <FiRefreshCw className={loading ? 'animate-spin' : ''} />
              Refresh
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-[#10B981]">
            <p className="text-sm text-gray-600 mb-1">Total</p>
            <p className="text-3xl font-bold text-[#10B981]">{stats.total}</p>
          </div>
          <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-yellow-500">
            <p className="text-sm text-gray-600 mb-1">Pending</p>
            <p className="text-3xl font-bold text-yellow-600">{stats.pending}</p>
          </div>
          <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-green-500">
            <p className="text-sm text-gray-600 mb-1">Approved</p>
            <p className="text-3xl font-bold text-green-600">{stats.approved}</p>
          </div>
          <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-red-500">
            <p className="text-sm text-gray-600 mb-1">Rejected</p>
            <p className="text-3xl font-bold text-red-600">{stats.rejected}</p>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search by name or email..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#10B981] focus:border-[#10B981]"
            />
          </div>
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#10B981] focus:border-[#10B981]"
          >
            <option value="all">All Status</option>
            <option value="pending">Pending</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
          </select>
        </div>

        {/* Table */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-bold text-gray-700 uppercase">Name</th>
                  <th className="px-6 py-3 text-left text-xs font-bold text-gray-700 uppercase">Email</th>
                  <th className="px-6 py-3 text-left text-xs font-bold text-gray-700 uppercase">Phone</th>
                  <th className="px-6 py-3 text-left text-xs font-bold text-gray-700 uppercase">Applied</th>
                  <th className="px-6 py-3 text-left text-xs font-bold text-gray-700 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filtered.map((volunteer) => (
                  <tr key={volunteer._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 font-bold text-gray-900">{volunteer.name}</td>
                    <td className="px-6 py-4 text-gray-600">{volunteer.email}</td>
                    <td className="px-6 py-4 text-gray-600">{volunteer.phone}</td>
                    <td className="px-6 py-4 text-gray-600">{new Date(volunteer.createdAt).toLocaleDateString()}</td>
                    <td className="px-6 py-4">
                      <div className="flex gap-2">
                        <button
                          onClick={() => setSelectedVolunteer(volunteer)}
                          className="px-2 py-1 bg-blue-500 hover:bg-blue-600 text-white rounded text-sm flex items-center gap-1"
                        >
                          <FiEye size={14} /> View
                        </button>
                        <ActionButtons volunteer={volunteer} />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {filtered.length === 0 && (
            <div className="text-center py-12 text-gray-500">
              No volunteer applications found
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
              Are you sure you want to {confirmModal.status} this volunteer application?
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
      {selectedVolunteer && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <h3 className="text-2xl font-bold mb-4">Volunteer Application Details</h3>
            <div className="space-y-4">
              <div><span className="font-bold">Name:</span> {selectedVolunteer.name}</div>
              <div><span className="font-bold">Email:</span> {selectedVolunteer.email}</div>
              <div><span className="font-bold">Phone:</span> {selectedVolunteer.phone}</div>
              <div><span className="font-bold">Address:</span> {selectedVolunteer.address}</div>
              <div>
                <span className="font-bold">Motivation:</span>
                <p className="mt-2 text-gray-700">{selectedVolunteer.motivation}</p>
              </div>
              <div><span className="font-bold">Status:</span> {selectedVolunteer.status}</div>
              <div><span className="font-bold">Applied:</span> {new Date(selectedVolunteer.createdAt).toLocaleString()}</div>
            </div>
            <button
              onClick={() => setSelectedVolunteer(null)}
              className="mt-6 w-full px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-lg font-bold"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
};

export default VolunteerManagement;

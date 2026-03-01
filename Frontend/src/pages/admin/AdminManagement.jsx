import React, { useState, useEffect } from 'react';
import DashboardLayout from '../../components/Layout/DashboardLayout';
import Modal from '../../components/common/Modal';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';
import { FiPlus, FiTrash2, FiUser, FiMail, FiPhone, FiX, FiCheck, FiUsers, FiKey, FiShield } from 'react-icons/fi';
import toast from 'react-hot-toast';

const AdminManagement = () => {
    const { user: currentUser } = useAuth();
    const [admins, setAdmins] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        password: '',
        role: 'admin'
    });

    useEffect(() => {
        fetchAdmins();
    }, []);

    const fetchAdmins = async () => {
        try {
            console.log('Fetching admins...');
            setLoading(true);
            const response = await api.get('/users?role=admin');
            console.log('Fetch admins response:', response.data);
            if (response.data && response.data.success) {
                setAdmins(response.data.data.users || []);
            } else {
                console.error('Fetch admins unsuccessful:', response.data);
                toast.error(response.data?.message || 'Failed to fetch admin list');
            }
        } catch (error) {
            console.error('Error fetching admins:', error);
            toast.error('Failed to fetch admin list');
        } finally {
            console.log('Finished fetching admins, setting loading to false');
            setLoading(false);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await api.post('/users', formData);
            if (response.data.success) {
                toast.success('Admin created successfully');
                setShowModal(false);
                setFormData({ name: '', email: '', phone: '', password: '', role: 'admin' });
                fetchAdmins();
            }
        } catch (error) {
            console.error('Error creating admin:', error);
            toast.error(error.response?.data?.message || 'Failed to create admin');
        }
    };

    const handleDelete = async (id) => {
        if (currentUser && id === currentUser.id) {
            toast.error('You cannot delete your own administrator account while logged in.');
            return;
        }
        if (window.confirm('Are you sure you want to delete this admin?')) {
            try {
                console.log('Deleting admin with ID:', id);
                const response = await api.delete(`/users/${id}`);
                console.log('Delete response:', response.data);
                toast.success('Admin deleted successfully');
                await fetchAdmins();
            } catch (error) {
                console.error('Error deleting admin:', error);
                const errorMsg = error.response?.data?.message || 'Failed to delete admin';
                toast.error(errorMsg);
                // Ensure loading is false even if fetchAdmins wasn't called
                setLoading(false);
            }
        }
    };

    return (
        <DashboardLayout>
            <div className="space-y-6">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">Admin Management</h1>
                        <p className="text-gray-600">Create and manage administrator accounts</p>
                    </div>
                    <button
                        onClick={() => setShowModal(true)}
                        className="flex items-center justify-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 rounded-xl transition-all shadow-sm active:scale-95"
                    >
                        <FiPlus className="w-5 h-5" />
                        <span className="font-semibold">Add New Admin</span>
                    </button>
                </div>

                {loading ? (
                    <div className="flex justify-center items-center min-h-[400px]">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {admins.map((admin) => (
                            <div key={admin._id} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 hover:shadow-md transition-shadow relative overflow-hidden group">
                                <div className="absolute top-0 right-0 p-4">
                                    <button
                                        onClick={() => handleDelete(admin._id)}
                                        className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                        title="Delete Admin"
                                    >
                                        <FiTrash2 className="w-5 h-5" />
                                    </button>
                                </div>
                                <div className="flex items-center space-x-4 mb-6">
                                    <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center">
                                        <FiShield className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-gray-900">{admin.name}</h3>
                                        <div className="flex items-center space-x-1 text-xs text-blue-600 font-bold uppercase tracking-wider">
                                            <span>Staff Admin</span>
                                            <FiCheck className="w-3 h-3" />
                                        </div>
                                    </div>
                                </div>
                                <div className="space-y-3">
                                    <div className="flex items-center text-sm text-gray-600">
                                        <FiMail className="w-4 h-4 mr-3 text-gray-400" />
                                        <span className="truncate">{admin.email}</span>
                                    </div>
                                    <div className="flex items-center text-sm text-gray-600">
                                        <FiPhone className="w-4 h-4 mr-3 text-gray-400" />
                                        <span>{admin.phone || 'No phone'}</span>
                                    </div>
                                </div>
                                <div className="mt-6 pt-4 border-t border-gray-50 flex items-center justify-between">
                                    <div className="text-[10px] text-gray-400 uppercase font-bold tracking-widest">
                                        Added {new Date(admin.createdAt).toLocaleDateString()}
                                    </div>
                                    <div className="px-2 py-1 bg-green-50 text-green-600 text-[10px] font-bold rounded-md uppercase">
                                        Active
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            <Modal
                isOpen={showModal}
                onClose={() => setShowModal(false)}
                title="Register New Administrator"
            >
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-1">
                        <label className="text-sm font-bold text-gray-700">Full Name</label>
                        <div className="relative">
                            <FiUser className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                            <input
                                type="text"
                                name="name"
                                required
                                value={formData.name}
                                onChange={handleInputChange}
                                className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                                placeholder="Enter admin name"
                            />
                        </div>
                    </div>
                    <div className="space-y-1">
                        <label className="text-sm font-bold text-gray-700">Email Address</label>
                        <div className="relative">
                            <FiMail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                            <input
                                type="email"
                                name="email"
                                required
                                value={formData.email}
                                onChange={handleInputChange}
                                className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                                placeholder="admin@treecampus.in"
                            />
                        </div>
                    </div>
                    <div className="space-y-1">
                        <label className="text-sm font-bold text-gray-700">Phone Number</label>
                        <div className="relative">
                            <FiPhone className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                            <input
                                type="text"
                                name="phone"
                                value={formData.phone}
                                onChange={handleInputChange}
                                className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                                placeholder="10-digit phone number"
                            />
                        </div>
                    </div>
                    <div className="space-y-1">
                        <label className="text-sm font-bold text-gray-700">Set Initial Password</label>
                        <div className="relative">
                            <FiKey className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                            <input
                                type="password"
                                name="password"
                                required
                                value={formData.password}
                                onChange={handleInputChange}
                                className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                                placeholder="Min. 6 characters"
                            />
                        </div>
                    </div>
                    <div className="pt-4 flex space-x-3">
                        <button
                            type="button"
                            onClick={() => setShowModal(false)}
                            className="flex-1 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold rounded-xl transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="flex-1 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl transition-all shadow-md active:scale-95"
                        >
                            Create Admin Account
                        </button>
                    </div>
                </form>
            </Modal>
        </DashboardLayout>
    );
};

export default AdminManagement;

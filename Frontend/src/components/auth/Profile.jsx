import React, { useState, useContext, useEffect } from 'react';
import { AuthContext } from '../../context/AuthContext';
import { authService } from '../../services/authService';

const Profile = () => {
  const { user, updateUser } = useContext(AuthContext);
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    preferredLanguage: 'english'
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  // Sync form data with current user data
  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        email: user.email || '',
        phone: user.phone || '',
        preferredLanguage: user.preferredLanguage || 'english'
      });
    }
  }, [user]);

  const handleChange = (e) => {
    setFormData({ 
      ...formData, 
      [e.target.name]: e.target.value 
    });
  };

 const handleSubmit = async (e) => {
  e.preventDefault();
  setLoading(true);
  setMessage('');

  try {
    const response = await authService.updateProfile(formData);

    // Update context with new user data
    updateUser(response);

    // Update localStorage if language changed
    if (formData.preferredLanguage !== user.preferredLanguage) {
      localStorage.setItem('preferredLanguage', formData.preferredLanguage);
    }

    setEditing(false);
    setMessage('Profile updated successfully!');

    // REMOVE THIS When - it's causing the issue and is unnecessary:
    // setTimeout(() => {
    //   window.location.reload();
    // }, 1000);

  } catch (error) {
    setMessage(error.message || 'Failed to update profile');
  } finally {
    setLoading(false);
  }
};

  const handleCancel = () => {
    setFormData({
      name: user?.name || '',
      email: user?.email || '',
      phone: user?.phone || '',
      preferredLanguage: user?.preferredLanguage || 'english'
    });
    setEditing(false);
    setMessage('');
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-orange-500 to-orange-600 px-8 py-12" style={{ background: 'linear-gradient(135deg, #FD5A00 0%, #ff7a3d 100%)' }}>
            <div className="flex items-center space-x-6">
              <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center text-4xl font-bold text-orange-500" style={{ color: '#FD5A00' }}>
                {user?.name?.charAt(0).toUpperCase()}
              </div>
              <div className="text-white">
                <h1 className="text-3xl font-bold">{user?.name}</h1>
                <p className="text-orange-100">{user?.email}</p>
                <p className="text-orange-200 text-sm mt-1">
                  🎓 Member since {user?.createdAt ? new Date(user.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) : 'N/A'}
                </p>
                {user?.phone && (
                  <p className="text-orange-200 text-sm">
                    📱 {user.phone}
                  </p>
                )}
                {user?.isVerified && (
                  <p className="text-orange-200 text-sm mt-1">
                    ✅ Email Verified
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="p-8">
            {message && (
              <div className={`mb-6 p-4 rounded-lg ${
                message.includes('success') 
                  ? 'bg-orange-50 text-orange-700 border border-orange-200' 
                  : 'bg-red-50 text-red-700 border border-red-200'
              }`}>
                {message}
              </div>
            )}

            {!editing ? (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Full Name
                    </label>
                    <p className="text-lg text-gray-900 font-semibold">{user?.name}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Email Address
                    </label>
                    <p className="text-lg text-gray-900">{user?.email}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Phone Number
                    </label>
                    <p className="text-lg text-gray-900">{user?.phone || '—'}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Account Role
                    </label>
                    <p className="text-lg text-gray-900 capitalize">
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${user?.role === 'admin' ? 'bg-purple-100 text-purple-800' : 'bg-blue-100 text-blue-800'}`}>
                        {user?.role}
                      </span>
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Member Since
                    </label>
                    <p className="text-lg text-gray-900">
                      {user?.createdAt ? new Date(user.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }) : 'N/A'}
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Verification Status
                    </label>
                    <p className="text-lg">
                      {user?.isVerified ? (
                        <span className="text-green-600 font-semibold">✅ Verified</span>
                      ) : (
                        <span className="text-yellow-600 font-semibold">⏳ Pending</span>
                      )}
                    </p>
                  </div>
                </div>

                {user?.enrolledCourses && user.enrolledCourses.length > 0 && (
                  <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                    <h3 className="font-semibold text-gray-900 mb-2">📚 Enrolled Courses</h3>
                    <p className="text-lg font-bold" style={{ color: '#FD5A00' }}>{user.enrolledCourses.length} courses</p>
                  </div>
                )}

                {user?.completedLessons && user.completedLessons.length > 0 && (
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <h3 className="font-semibold text-gray-900 mb-2">✅ Completed Lessons</h3>
                    <p className="text-lg font-bold text-green-700">{user.completedLessons.length} lessons completed</p>
                  </div>
                )}
                
                <button
                  onClick={() => setEditing(true)}
                  className="w-full py-3 text-white rounded-lg hover:opacity-90 transition font-semibold"
                  style={{ backgroundColor: '#FD5A00' }}
                >
                  Edit Profile
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Name *
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:border-transparent transition"
                      style={{ '--tw-ring-color': '#FD5A00' }}
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email *
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:border-transparent transition"
                      style={{ '--tw-ring-color': '#FD5A00' }}
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Phone
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:border-transparent transition"
                      style={{ '--tw-ring-color': '#FD5A00' }}
                      placeholder="+1 234 567 8900"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Preferred Language
                    </label>
                    <select
                      name="preferredLanguage"
                      value={formData.preferredLanguage}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:border-transparent transition"
                      style={{ '--tw-ring-color': '#FD5A00' }}
                    >
                      <option value="english">English</option>
                      <option value="hindi">Hindi</option>
                    </select>
                  </div>
                </div>
                
                <div className="flex space-x-4">
                  <button
                    type="submit"
                    disabled={loading}
                    className="flex-1 py-3 text-white rounded-lg hover:opacity-90 transition font-semibold disabled:opacity-50"
                    style={{ backgroundColor: '#FD5A00' }}
                  >
                    {loading ? 'Saving...' : 'Save Changes'}
                  </button>
                  <button
                    type="button"
                    onClick={handleCancel}
                    className="flex-1 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition font-semibold"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;

import { useState, useEffect } from 'react';
import DashboardLayout from '../../components/Layout/DashboardLayout';
import api from '../../services/api';
import { FiPlus, FiTrash2, FiExternalLink, FiClock, FiCalendar, FiUser, FiVideo, FiX } from 'react-icons/fi';
import { format } from 'date-fns';
import toast from 'react-hot-toast';

const LiveClassManagement = () => {
  const [liveClasses, setLiveClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    platform: 'Zoom',
    link: '',
    scheduledAt: '',
    duration: 60,
    instructor: '',
    maxParticipants: 100
  });

  useEffect(() => {
    fetchLiveClasses();
  }, []);

  const fetchLiveClasses = async () => {
    try {
      const response = await api.get('/live-classes');
      setLiveClasses(response.data.data || []);
    } catch (error) {
      console.error('Error fetching live classes:', error);
      setLiveClasses([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/live-classes', formData);
      setShowModal(false);
      setFormData({ 
        title: '', 
        description: '', 
        platform: 'Zoom', 
        link: '', 
        scheduledAt: '', 
        duration: 60, 
        instructor: '',
        maxParticipants: 100 
      });
      fetchLiveClasses();
      toast.success('Live class scheduled successfully!');
    } catch (error) {
      console.error('Error creating live class:', error);
      toast.error('Failed to create live class');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this live class?')) {
      try {
        await api.delete(`/live-classes/${id}`);
        fetchLiveClasses();
        toast.success('Live class deleted successfully');
      } catch (error) {
        console.error('Error deleting live class:', error);
        toast.error('Failed to delete live class');
      }
    }
  };

  const getStatus = (scheduledAt) => {
    const now = new Date();
    const scheduled = new Date(scheduledAt);
    return scheduled > now ? 'scheduled' : 'completed';
  };

  const getPlatformColor = (platform) => {
    const colors = {
      'Zoom': 'bg-blue-100 text-blue-800',
      'Google Meet': 'bg-green-100 text-green-800',
      'YouTube': 'bg-red-100 text-red-800',
      'Microsoft Teams': 'bg-purple-100 text-purple-800'
    };
    return colors[platform] || 'bg-gray-100 text-gray-800';
  };

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (showModal) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [showModal]);

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex justify-center items-center min-h-96">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6 animate-fade-in">
  {showModal && (
  <div className="fixed inset-0 bg-black/40 backdrop-blur-md flex items-center justify-center p-4 z-50"></div>
  
)}



        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Live Class Management</h1>
            <p className="text-gray-600">Schedule and manage live sessions</p>
          </div>
          <button 
            className="mt-4 lg:mt-0 flex items-center space-x-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors w-full lg:w-auto justify-center"
            onClick={() => setShowModal(true)}
          >
            <FiPlus className="w-4 h-4" />
            <span>Schedule Live Class</span>
          </button>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4 text-center">
            <div className="text-2xl font-bold text-gray-900 mb-1">{liveClasses.length}</div>
            <div className="text-sm text-gray-600">Total Classes</div>
          </div>
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4 text-center">
            <div className="text-2xl font-bold text-gray-900 mb-1">
              {liveClasses.filter(lc => getStatus(lc.scheduledAt) === 'scheduled').length}
            </div>
            <div className="text-sm text-gray-600">Upcoming</div>
          </div>
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4 text-center">
            <div className="text-2xl font-bold text-gray-900 mb-1">
              {liveClasses.filter(lc => getStatus(lc.scheduledAt) === 'completed').length}
            </div>
            <div className="text-sm text-gray-600">Completed</div>
          </div>
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4 text-center">
            <div className="text-2xl font-bold text-gray-900 mb-1">
              {[...new Set(liveClasses.map(lc => lc.platform))].length}
            </div>
            <div className="text-sm text-gray-600">Platforms</div>
          </div>
        </div>

        {/* Live Classes Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {liveClasses.map((liveClass) => {
            const status = getStatus(liveClass.scheduledAt);
            const isUpcoming = status === 'scheduled';
            
            return (
              <div key={liveClass._id} className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden hover:shadow-lg transition-shadow">
                {/* Header with Status */}
                <div className="p-4 border-b border-gray-200">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="font-semibold text-gray-900 line-clamp-2 flex-1">{liveClass.title}</h3>
                    <span className={`ml-2 px-2 py-1 rounded-full text-xs font-medium ${
                      isUpcoming ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                    }`}>
                      {isUpcoming ? 'Upcoming' : 'Completed'}
                    </span>
                  </div>
                  <p className="text-gray-600 text-sm line-clamp-2">{liveClass.description}</p>
                </div>

                {/* Class Details */}
                <div className="p-4 space-y-3">
                  {/* Instructor */}
                  <div className="flex items-center space-x-2 text-sm text-gray-600">
                    <FiUser className="w-4 h-4 text-gray-400" />
                    <span>{liveClass.instructor}</span>
                  </div>

                  {/* Date & Time */}
                  <div className="flex items-center space-x-2 text-sm text-gray-600">
                    <FiCalendar className="w-4 h-4 text-gray-400" />
                    <span>{format(new Date(liveClass.scheduledAt), 'MMM dd, yyyy')}</span>
                  </div>

                  {/* Time & Duration */}
                  <div className="flex items-center space-x-2 text-sm text-gray-600">
                    <FiClock className="w-4 h-4 text-gray-400" />
                    <span>
                      {format(new Date(liveClass.scheduledAt), 'HH:mm')} • {liveClass.duration} mins
                    </span>
                  </div>

                  {/* Platform */}
                  <div className="flex items-center justify-between">
                    <span className={`px-2 py-1 rounded text-xs font-medium ${getPlatformColor(liveClass.platform)}`}>
                      {liveClass.platform}
                    </span>
                    {liveClass.maxParticipants && (
                      <span className="text-xs text-gray-500">
                        Max: {liveClass.maxParticipants}
                      </span>
                    )}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="p-4 border-t border-gray-200 bg-gray-50">
                  <div className="flex space-x-2">
                    <a 
                      href={liveClass.link} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="flex-1 bg-blue-600 text-white py-2 px-3 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center space-x-2 text-sm"
                    >
                      <FiExternalLink className="w-3 h-3" />
                      <span>{isUpcoming ? 'Join Class' : 'View Recording'}</span>
                    </a>
                    <button 
                      className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      onClick={() => handleDelete(liveClass._id)}
                    >
                      <FiTrash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {liveClasses.length === 0 && (
          <div className="text-center py-12 bg-white rounded-xl border border-gray-200">
            <FiVideo className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No live classes scheduled</h3>
            <p className="text-gray-600 mb-6">Schedule your first live class to get started</p>
            <button 
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
              onClick={() => setShowModal(true)}
            >
              Schedule First Class
            </button>
          </div>
        )}
      </div>

      {/* Schedule Live Class Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop with blur */}
          <div 
            className="absolute inset-0 bg-black/30 bg-opacity-50 backdrop-blur-sm transition-opacity"
            onClick={() => setShowModal(false)}
          />
          
          {/* Modal Content */}
          <div className="relative bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden transform transition-all">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-white">
              <h2 className="text-xl font-semibold text-gray-900">Schedule Live Class</h2>
              <button 
                className="text-gray-400 hover:text-gray-600 transition-colors p-1 rounded-lg hover:bg-gray-100"
                onClick={() => setShowModal(false)}
              >
                <FiX className="w-6 h-6" />
              </button>
            </div>

            {/* Modal Content */}
            <form onSubmit={handleSubmit} className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
              <div className="space-y-6">
                {/* Class Title */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Class Title *</label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    required
                    placeholder="e.g., Advanced JavaScript Workshop"
                  />
                </div>

                {/* Description */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Description *</label>
                  <textarea
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                    rows="3"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    required
                    placeholder="Describe what students will learn in this session..."
                  />
                </div>

                {/* Platform & Duration */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Platform *</label>
                    <select
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                      value={formData.platform}
                      onChange={(e) => setFormData({ ...formData, platform: e.target.value })}
                    >
                      <option>Zoom</option>
                      <option>Google Meet</option>
                      <option>YouTube</option>
                      <option>Microsoft Teams</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Duration (minutes) *</label>
                    <input
                      type="number"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                      value={formData.duration}
                      onChange={(e) => setFormData({ ...formData, duration: parseInt(e.target.value) })}
                      required
                      min="15"
                      max="480"
                    />
                  </div>
                </div>

                {/* Meeting Link */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Meeting Link *</label>
                  <input
                    type="url"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                    placeholder="https://zoom.us/j/..."
                    value={formData.link}
                    onChange={(e) => setFormData({ ...formData, link: e.target.value })}
                    required
                  />
                </div>

                {/* Instructor & Max Participants */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Instructor *</label>
                    <input
                      type="text"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                      value={formData.instructor}
                      onChange={(e) => setFormData({ ...formData, instructor: e.target.value })}
                      required
                      placeholder="Instructor name"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Max Participants</label>
                    <input
                      type="number"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                      value={formData.maxParticipants}
                      onChange={(e) => setFormData({ ...formData, maxParticipants: parseInt(e.target.value) })}
                      min="1"
                      max="1000"
                    />
                  </div>
                </div>

                {/* Scheduled Date & Time */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Scheduled Date & Time *</label>
                  <input
                    type="datetime-local"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                    value={formData.scheduledAt}
                    onChange={(e) => setFormData({ ...formData, scheduledAt: e.target.value })}
                    required
                  />
                </div>
              </div>

              {/* Modal Actions */}
              <div className="flex space-x-3 mt-6 pt-6 border-t border-gray-200">
                <button 
                  type="submit" 
                  className="flex-1 bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors font-medium shadow-sm"
                >
                  Schedule Class
                </button>
                <button 
                  type="button" 
                  className="flex-1 bg-gray-100 text-gray-700 py-3 px-4 rounded-lg hover:bg-gray-200 transition-colors font-medium"
                  onClick={() => setShowModal(false)}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
};

export default LiveClassManagement;
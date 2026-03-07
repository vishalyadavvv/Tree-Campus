  import { useState, useEffect } from 'react';
  import DashboardLayout from '../../components/Layout/DashboardLayout';
  import Modal from '../../components/common/Modal';
  import api from '../../services/api';
  import { FiPlus, FiTrash2, FiExternalLink, FiClock, FiCalendar, FiUser, FiVideo, FiX, FiEdit, FiCopy, FiCheckCircle } from 'react-icons/fi';
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
      maxParticipants: 100,
      password: '',
      autoGenerateZoom: false,
      isRecurring: false,
      recurrenceEndDate: ''
    });
    const [editingId, setEditingId] = useState(null);
    const [currentTime, setCurrentTime] = useState(new Date());

    useEffect(() => {
      fetchLiveClasses();
      // Tick every minute to refresh Live status
      const timer = setInterval(() => setCurrentTime(new Date()), 60000);
      return () => clearInterval(timer);
    }, []);

    const fetchLiveClasses = async () => {
      try {
        const response = await api.get('/live-classes');
        const classesData = response.data.data || [];
        
        // Group by seriesId
        const grouped = {};
        const singles = [];
        
        classesData.forEach(lc => {
          if (lc.seriesId) {
            if (!grouped[lc.seriesId]) grouped[lc.seriesId] = [];
            grouped[lc.seriesId].push(lc);
          } else {
            singles.push(lc);
          }
        });
        
        const processed = Object.keys(grouped).map(sid => {
          const sessions = grouped[sid].sort((a, b) => new Date(a.scheduledAt) - new Date(b.scheduledAt));
          // Use the next upcoming or the first one as representative
          const now = new Date();
          const representative = sessions.find(s => new Date(s.scheduledAt) > now) || sessions[0];
          return {
            ...representative,
            isSeries: true,
            sessionCount: sessions.length,
            allSessions: sessions
          };
        });

        setLiveClasses([...singles, ...processed].sort((a, b) => new Date(a.scheduledAt) - new Date(b.scheduledAt)));
      } catch (error) {
        console.error('Error fetching live classes:', error);
        setLiveClasses([]);
      } finally {
        setLoading(false);
      }
    };

    const handleCloseModal = () => {
      setShowModal(false);
      setEditingId(null);
      setFormData({ 
        title: '', 
        description: '', 
        platform: 'Zoom', 
        link: '', 
        scheduledAt: '', 
        duration: 60, 
        instructor: '',
        maxParticipants: 100, // Kept for state shape consistency but not used in UI/Backend
        password: '',
        autoGenerateZoom: false,
        isRecurring: false,
        recurrenceEndDate: ''
      });
    };

    const handleSubmit = async (e) => {
      e.preventDefault();
      try {
        // Create a copy of formData to transform dates to UTC
        const submitData = { ...formData };
        
        // Convert local datetime-local string to proper ISO string
        if (submitData.scheduledAt) {
          submitData.scheduledAt = new Date(submitData.scheduledAt).toISOString();
        }
        
        // Handle recurrence end date if provided
        if (submitData.isRecurring && submitData.recurrenceEndDate) {
          // Recurrence end date is a date only string (YYYY-MM-DD)
          // Ensure it's treated as the end of that day in local time
          const end = new Date(submitData.recurrenceEndDate);
          end.setHours(23, 59, 59, 999);
          submitData.recurrenceEndDate = end.toISOString();
        }

        if (editingId) {
          await api.put(`/live-classes/${editingId}`, submitData);
          toast.success('Live class updated successfully!');
        } else {
          await api.post('/live-classes', submitData);
          toast.success('Live class scheduled successfully!');
        }
        
        handleCloseModal();
        fetchLiveClasses();
      } catch (error) {
        console.error('Error saving live class:', error);
        toast.error(editingId ? 'Failed to update live class' : 'Failed to create live class');
      }
    };

    const handleEdit = (liveClass) => {
      setEditingId(liveClass._id);
      
      // Convert UTC date from backend to local string for datetime-local input
      const localDate = new Date(liveClass.scheduledAt);
      const offset = localDate.getTimezoneOffset() * 60000;
      const localISO = new Date(localDate.getTime() - offset).toISOString().slice(0, 16);

      setFormData({
        title: liveClass.title,
        description: liveClass.description,
        platform: liveClass.platform,
        link: liveClass.link,
        scheduledAt: localISO,
        duration: liveClass.duration,
        instructor: liveClass.instructor,
        maxParticipants: liveClass.maxParticipants || 100,
        password: liveClass.password || '',
        autoGenerateZoom: liveClass.source === 'automated',
        isRecurring: false,
        recurrenceEndDate: '' 
      });
      setShowModal(true);
    };

    const handleDelete = async (id, seriesId = null) => {
      const msg = seriesId 
        ? 'This is part of a series. Do you want to delete only this session or the entire series?'
        : 'Are you sure you want to delete this live class?';
      
      if (seriesId) {
        if (window.confirm('Delete the ENTIRE series? Click Cancel to delete only this occurrence.')) {
          // This would ideally be a single API call, but if not implemented, we can loop
          // Let's assume we'll implement a DELETE /api/live-classes/series/:seriesId
          try {
            await api.delete(`/live-classes/series/${seriesId}`);
            toast.success('Entire series deleted successfully');
            fetchLiveClasses();
          } catch (error) {
            console.error('Error deleting series:', error);
            toast.error('Failed to delete series');
          }
          return;
        }
      }

      if (window.confirm('Are you sure you want to delete this live class?')) {
        setLiveClasses(prev => prev.filter(lc => lc._id !== id));
        try {
          await api.delete(`/live-classes/${id}`);
          toast.success('Live class deleted successfully');
        } catch (error) {
          console.error('Error deleting live class:', error);
          toast.error('Failed to delete live class');
          fetchLiveClasses();
        }
      }
    };

    const handleCopyLink = (link) => {
      navigator.clipboard.writeText(link);
      toast.success('Join link copied to clipboard!');
    };

    const handleMarkCompleted = async (id) => {
      try {
        await api.put(`/live-classes/${id}`, { status: 'completed' });
        toast.success('Class marked as completed');
        fetchLiveClasses();
      } catch (error) {
        console.error('Error updating class status:', error);
        toast.error('Failed to update class status');
      }
    };

    const isLiveNow = (scheduledAt, duration) => {
      const start = new Date(scheduledAt);
      const end = new Date(start.getTime() + (duration || 60) * 60000);
      return currentTime >= start && currentTime <= end;
    };

    const getStatus = (liveClass) => {
      if (liveClass.status === 'completed' || liveClass.status === 'cancelled') {
        return liveClass.status;
      }
      if (isLiveNow(liveClass.scheduledAt, liveClass.duration)) {
        return 'live';
      }
      return new Date(liveClass.scheduledAt) > currentTime ? 'scheduled' : 'completed';
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
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4 text-center">
              <div className="text-2xl font-bold text-gray-900 mb-1">{liveClasses.length}</div>
              <div className="text-sm text-gray-600">Total Classes</div>
            </div>
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4 text-center">
              <div className="text-2xl font-bold text-gray-900 mb-1">
                {liveClasses.filter(lc => getStatus(lc) === 'scheduled').length}
              </div>
              <div className="text-sm text-gray-600">Upcoming</div>
            </div>
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4 text-center ring-2 ring-red-100">
              <div className="text-2xl font-bold text-red-600 mb-1 animate-pulse">
                {liveClasses.filter(lc => getStatus(lc) === 'live').length}
              </div>
              <div className="text-sm text-red-600 font-medium">Live Now</div>
            </div>
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4 text-center">
              <div className="text-2xl font-bold text-gray-900 mb-1">
                {liveClasses.filter(lc => getStatus(lc) === 'completed').length}
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
              const status = getStatus(liveClass);
              const isUpcoming = status === 'scheduled';
              const isLive = status === 'live';
              
              return (
                <div key={liveClass._id} className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden hover:shadow-lg transition-shadow">
                  {/* Header with Status */}
                  <div className="p-4 border-b border-gray-200">
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="font-semibold text-gray-900 line-clamp-2 flex-1">{liveClass.title}</h3>
                      <div className="flex flex-col items-end space-y-1">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                          status === 'live' ? 'bg-red-100 text-red-600 animate-pulse ring-1 ring-red-200' :
                          status === 'scheduled' ? 'bg-green-100 text-green-800' :
                          'bg-gray-100 text-gray-600'
                        }`}>
                          {status === 'live' ? '● Live' : status === 'scheduled' ? 'Upcoming' : 'Completed'}
                        </span>
                        {liveClass.status === 'cancelled' && (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-black text-white uppercase">Cancelled</span>
                        )}
                      </div>
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

                    {/* Password if exists */}
                    {liveClass.password && (
                      <div className="flex items-center space-x-2 text-sm text-gray-600">
                        <div className="w-4 h-4 text-gray-400 flex items-center justify-center font-bold text-[10px] border border-gray-400 rounded-sm">P</div>
                        <span>Password: <span className="font-mono font-semibold">{liveClass.password}</span></span>
                      </div>
                    )}

                    {/* Platform & Series Info */}
                    <div className="flex items-center justify-between">
                      <span className={`px-2 py-1 rounded text-xs font-medium ${getPlatformColor(liveClass.platform)}`}>
                        {liveClass.platform}
                      </span>
                      {liveClass.isSeries && (
                        <span className="px-2 py-1 bg-amber-100 text-amber-700 rounded text-[10px] font-bold border border-amber-200 uppercase">
                          {liveClass.sessionCount} Sessions
                        </span>
                      )}
                    </div>

                    {/* Host Passcode - Admin Only */}
                    {liveClass.source === 'automated' && (
                      <div className="flex items-center space-x-2 text-sm bg-amber-50 border border-amber-200 rounded-lg px-3 py-2">
                        <span className="text-amber-700 font-medium">🔑 Host Passcode:</span>
                        <span className="font-mono font-bold text-amber-900">815865</span>
                      </div>
                    )}
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
                        <span>{isLive ? 'Join Live Now' : isUpcoming ? 'Join Class' : 'View Recording'}</span>
                      </a>
                      <button 
                        className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        onClick={() => handleDelete(liveClass._id, liveClass.seriesId)}
                        title={liveClass.isSeries ? "Delete Series" : "Delete Class"}
                      >
                        <FiTrash2 className="w-4 h-4" />
                      </button>
                      <button 
                        className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        onClick={() => handleEdit(liveClass)}
                      >
                        <FiEdit className="w-4 h-4" />
                      </button>
                      <button 
                        className="p-2 text-gray-600 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                        onClick={() => handleCopyLink(liveClass.link)}
                        title="Copy Join Link"
                      >
                        <FiCopy className="w-4 h-4" />
                      </button>
                      {status !== 'completed' && (
                        <button 
                          className="p-2 text-gray-600 hover:text-teal-600 hover:bg-teal-50 rounded-lg transition-colors"
                          onClick={() => handleMarkCompleted(liveClass._id)}
                          title="Mark as Completed"
                        >
                          <FiCheckCircle className="w-4 h-4" />
                        </button>
                      )}
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

        {/* Modal */}
        <Modal
          isOpen={showModal}
          onClose={handleCloseModal}
          title={editingId ? 'Edit Live Class' : 'Schedule Live Class'}
          maxWidth="max-w-2xl"
        >
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Class Title */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Class Title *</label>
              <input
                type="text"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                required
                placeholder="e.g., English Speaking Class"
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

            {/* Auto-generate Zoom Toggle */}
            {formData.platform === 'Zoom' && (
              <div className="flex items-center space-x-3 p-4 bg-blue-50 rounded-lg border border-blue-100">
                <input
                  type="checkbox"
                  id="autoGenerateZoom"
                  className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  checked={formData.autoGenerateZoom}
                  onChange={(e) => setFormData({ ...formData, autoGenerateZoom: e.target.checked })}
                />
                <label htmlFor="autoGenerateZoom" className="flex-1 text-sm font-medium text-blue-900 cursor-pointer">
                  Automatically generate Zoom Meeting using API
                  <p className="text-xs text-blue-700 font-normal">This will create a secure meeting and set the link automatically.</p>
                </label>
              </div>
            )}

            {/* Meeting Link */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Meeting Link {formData.autoGenerateZoom ? '(Will be auto-generated)' : '*'}
              </label>
              <input
                type="url"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors disabled:bg-gray-50 disabled:text-gray-400"
                placeholder={formData.autoGenerateZoom ? "Link will appear after saving" : "https://zoom.us/j/..."}
                value={formData.link}
                onChange={(e) => setFormData({ ...formData, link: e.target.value })}
                required={!formData.autoGenerateZoom}
                disabled={formData.autoGenerateZoom}
              />
            </div>

            {/* Meeting Password (Optional/Auto) */}
            {!formData.autoGenerateZoom && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Meeting Password (Optional)</label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                  placeholder="Enter password if required"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                />
              </div>
            )}

            {/* Instructor */}
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

            {/* Recurrence Options */}
            {!editingId && (
              <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                <div className="flex items-center space-x-3 mb-4">
                  <input
                    type="checkbox"
                    id="isRecurring"
                    className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    checked={formData.isRecurring}
                    onChange={(e) => setFormData({ ...formData, isRecurring: e.target.checked })}
                  />
                  <label htmlFor="isRecurring" className="font-medium text-gray-700 cursor-pointer">
                    Repeat Details?
                  </label>
                </div>

                {formData.isRecurring && (
                  <div className="pl-8">
                      <label className="block text-sm font-medium text-gray-700 mb-2">Repeat Until (End Date) *</label>
                    <input
                      type="date"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors bg-white"
                      value={formData.recurrenceEndDate}
                      onChange={(e) => setFormData({ ...formData, recurrenceEndDate: e.target.value })}
                      required={formData.isRecurring}
                      min={formData.scheduledAt ? formData.scheduledAt.split('T')[0] : new Date().toISOString().split('T')[0]}
                    />
                    <p className="text-xs text-gray-500 mt-2">
                      A separate class entry will be created for each day at the same time until this date.
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* Modal Actions */}
            <div className="flex space-x-3 mt-6 pt-6 border-t border-gray-200">
              <button 
                type="submit" 
                className="flex-1 bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors font-medium shadow-sm"
              >
                {editingId ? 'Update Class' : 'Schedule Class'}
              </button>
              <button 
                type="button" 
                className="flex-1 bg-gray-100 text-gray-700 py-3 px-4 rounded-lg hover:bg-gray-200 transition-colors font-medium"
                onClick={handleCloseModal}
              >
                Cancel
              </button>
            </div>
          </form>
        </Modal>
      </DashboardLayout>
    );
  };

  export default LiveClassManagement;

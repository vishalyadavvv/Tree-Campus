  import { useState, useEffect } from 'react';
  import { useNavigate } from 'react-router-dom';
  import DashboardLayout from '../../components/Layout/DashboardLayout';
  import Modal from '../../components/common/Modal';
  import api from '../../services/api';
  import { FiPlus, FiEdit2, FiTrash2, FiUpload, FiUsers, FiClock, FiBarChart2, FiEye, FiEyeOff } from 'react-icons/fi';
  import toast from 'react-hot-toast';

  const CoursesManagement = () => {
    const navigate = useNavigate();
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [filterStatus, setFilterStatus] = useState('all'); // 'all', 'published', 'draft'
    const [uploading, setUploading] = useState(false);
    const [thumbnailPreview, setThumbnailPreview] = useState('');
    const [formData, setFormData] = useState({
      title: '',
      description: '',
      instructor: '',
      category: 'Spoken English',
      level: 'All Levels',
      thumbnail: '',
      duration: '',
      price: '',
      lang: 'En',
      isPublished: true
    });

    useEffect(() => {
      fetchCourses();
    }, []);

    const fetchCourses = async () => {
      try {
        const response = await api.get('/courses?adminView=true');
        console.log('Fetched courses:', response.data);
        // ✅ FIXED: Changed from response.data.data.courses to response.data.data
        setCourses(response.data.data || []);
      } catch (error) {
        console.error('Error fetching courses:', error);
        setCourses([]);
      } finally {
        setLoading(false);
      }
    };

    const handleThumbnailUpload = async (e) => {
      const file = e.target.files[0];
      if (!file) return;

      // Show preview immediately
      const reader = new FileReader();
      reader.onloadend = () => {
        setThumbnailPreview(reader.result);
      };
      reader.readAsDataURL(file);

      // Upload file to backend
      setUploading(true);
      try {
        const uploadFormData = new FormData();
        uploadFormData.append('file', file);

        const response = await api.post('/upload/file', uploadFormData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        });

        const thumbnailUrl = response.data.data.url;
        
        setFormData(prev => ({
          ...prev,
          thumbnail: thumbnailUrl
        }));
        
        console.log('✅ Thumbnail uploaded successfully:', thumbnailUrl);
        
      } catch (error) {
        console.error('❌ Upload failed:', error);
        toast.error('Upload failed. Please try entering an image URL instead.');
        setFormData(prev => ({
          ...prev,
          thumbnail: ''
        }));
      } finally {
        setUploading(false);
      }
    };

    const handleSubmit = async (e) => {
      e.preventDefault();
      
      // Validate thumbnail
      if (!formData.thumbnail) {
        toast.error('Please upload a thumbnail or enter an image URL');
        return;
      }
      
      console.log('Submitting course with data:', formData);
      
      try {
        const response = await api.post('/courses', formData);
        console.log('Course created:', response.data);
        
        // Close modal and reset form
        setShowModal(false);
        setFormData({ 
          title: '', 
          description: '', 
          instructor: '', 
          category: 'Spoken English', 
          level: 'All Levels', 
          thumbnail: '', 
          duration: '',
          price: '',
          lang: 'En',
          isPublished: true
        });
        setThumbnailPreview('');
        
        // Refresh courses list
        await fetchCourses();
        
        toast.success('Course created successfully!');
      } catch (error) {
        console.error('Error creating course:', error);
        toast.error('Failed to create course: ' + (error.response?.data?.message || error.message));
      }
    };

    const handleDelete = async (id) => {
      if (window.confirm('Are you sure you want to delete this course?')) {
        // Optimistic: remove from UI immediately
        setCourses(prev => prev.filter(c => c._id !== id));
        try {
          await api.delete(`/courses/${id}`);
          toast.success('Course deleted successfully');
        } catch (error) {
          console.error('Error deleting course:', error);
          toast.error('Failed to delete course');
          // Revert: re-fetch on error
          fetchCourses();
        }
      }
    };

    const handleCloseModal = () => {
      setShowModal(false);
      setThumbnailPreview('');
      setFormData({ 
        title: '', 
        description: '', 
        instructor: '', 
        category: 'Spoken English', 
        level: 'All Levels', 
        thumbnail: '', 
        duration: '',
        price: '',
        lang: 'En',
        isPublished: true
      });
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
              <h1 className="text-2xl font-bold text-gray-900 mb-2">Course Management</h1>
              <p className="text-gray-600">Create and manage your courses</p>
            </div>
            <button 
              className="mt-4 lg:mt-0 flex items-center space-x-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors w-full lg:w-auto justify-center"
              onClick={() => setShowModal(true)}
            >
              <FiPlus className="w-4 h-4" />
              <span>Add New Course</span>
            </button>
          </div>

          {/* Stats Overview - OPTIMIZED */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4 text-center">
              <div className="text-2xl font-bold text-gray-900 mb-1">{courses.length}</div>
              <div className="text-sm text-gray-600">Total Courses</div>
            </div>
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4 text-center">
              <div className="text-2xl font-bold text-gray-900 mb-1">
                {courses.reduce((sum, course) => sum + (course.enrollmentCount || 0), 0)}
              </div>
              <div className="text-sm text-gray-600">Total Students</div>
            </div>
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4 text-center">
              <div className="text-2xl font-bold text-gray-900 mb-1">
                {[...new Set(courses.map(course => course.category))].length}
              </div>
              <div className="text-sm text-gray-600">Categories</div>
            </div>
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4 text-center">
              <div className="text-2xl font-bold text-gray-900 mb-1">
                {courses.filter(course => !course.isPublished).length}
              </div>
              <div className="text-sm text-gray-600">Draft Courses</div>
            </div>
            {/* <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4 text-center">
              <div className="text-2xl font-bold text-gray-900 mb-1">
                {courses.filter(course => course.level === 'Beginner').length}
              </div>
              <div className="text-sm text-gray-600">Beginner Courses</div>
            </div> */}
          </div>

          {/* Filters */}
          <div className="flex space-x-2 bg-white p-2 rounded-lg border border-gray-200 w-fit">
            <button 
              onClick={() => setFilterStatus('all')}
              className={`px-4 py-2 rounded-md transition-colors ${filterStatus === 'all' ? 'bg-blue-600 text-white' : 'hover:bg-gray-100 text-gray-600'}`}
            >
              All Courses ({courses.length})
            </button>
            <button 
              onClick={() => setFilterStatus('published')}
              className={`px-4 py-2 rounded-md transition-colors ${filterStatus === 'published' ? 'bg-green-600 text-white' : 'hover:bg-gray-100 text-gray-600'}`}
            >
              Published ({courses.filter(c => c.isPublished).length})
            </button>
            <button 
              onClick={() => setFilterStatus('draft')}
              className={`px-4 py-2 rounded-md transition-colors ${filterStatus === 'draft' ? 'bg-orange-600 text-white' : 'hover:bg-gray-100 text-gray-600'}`}
            >
              Drafts ({courses.filter(c => !c.isPublished).length})
            </button>
          </div>

          {/* Courses Grid - OPTIMIZED */}
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
            {courses
              .filter(course => {
                if (filterStatus === 'published') return course.isPublished;
                if (filterStatus === 'draft') return !course.isPublished;
                return true;
              })
              .map((course) => (
              <div key={course._id} className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden hover:shadow-lg transition-shadow">
                {/* Course Image */}
                <div className="relative">
                  <img
                    src={course.thumbnail || ''}
                    alt={course.title}
                    className="w-full h-48 object-cover"
                    onError={(e) => {
                      console.log('❌ Image failed to load:', course.thumbnail);
                      e.target.src = '';
                    }}
                    onLoad={() => {
                      console.log('✅ Image loaded:', course.thumbnail);
                    }}
                  />
                  <div className="absolute top-3 right-3">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      course.level === 'All Levels' ? 'bg-green-100 text-green-800' :
                      course.level === 'Beginner' ? 'bg-green-100 text-green-800' :
                  
                      course.level === 'Intermediate' ? 'bg-yellow-100 text-yellow-800' :
                      course.level === 'Advance' ? 'bg-green-100 text-green-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {course.level}
                    </span>
                  </div>
                </div>

                {/* Course Content */}
                <div className="p-4">
                  <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">{course.title}</h3>
                  <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                    {course.description}
                  </p>
                  
                  {/* Course Meta */}
                  <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                    <div className="flex items-center space-x-4">
                      <span className="flex items-center space-x-1">
                        <FiUsers className="w-3 h-3" />
                        <span>{course.enrollmentCount || 0}</span>
                      </span>
                      <span className="flex items-center space-x-1">
                        <FiClock className="w-3 h-3" />
                        <span>{course.duration || 'N/A'}</span>
                      </span>
                    </div>
                    <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs font-medium">
                      {course.category}
                    </span>
                    <span className={`px-2 py-1 rounded text-xs font-bold ${course.isPublished ? 'bg-green-100 text-green-800' : 'bg-orange-100 text-orange-800 border border-orange-200'}`}>
                      {course.isPublished ? 'PUBLISHED' : 'DRAFT'}
                    </span>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex space-x-2">
                    <button 
                      className="flex-1 bg-blue-600 text-white py-2 px-3 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center space-x-2 text-sm"
                      onClick={() => navigate(`/admin/courses/${course._id}/builder`)}
                    >
                      <FiEdit2 className="w-3 h-3" />
                      <span>Manage</span>
                    </button>
                    <button 
                      className={`p-2 rounded-lg transition-colors ${course.isPublished ? 'text-gray-600 hover:text-orange-600 hover:bg-orange-50' : 'text-gray-600 hover:text-green-600 hover:bg-green-50'}`}
                      onClick={async () => {
                        try {
                          await api.put(`/courses/${course._id}`, { isPublished: !course.isPublished });
                          toast.success(`Course ${course.isPublished ? 'unpublished' : 'published'}!`);
                          fetchCourses();
                        } catch (error) {
                          toast.error('Failed to update status');
                        }
                      }}
                      title={course.isPublished ? 'Move to Draft' : 'Publish Now'}
                    >
                      {course.isPublished ? <FiEyeOff className="w-4 h-4" /> : <FiEye className="w-4 h-4" />}
                    </button>
                    <button 
                      className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      onClick={() => handleDelete(course._id)}
                    >
                      <FiTrash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {courses.length === 0 && (
            <div className="text-center py-12 bg-white rounded-xl border border-gray-200">
              <FiPlus className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No courses yet</h3>
              <p className="text-gray-600 mb-6">Create your first course to get started</p>
              <button 
                className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
                onClick={() => setShowModal(true)}
              >
                Create First Course
              </button>
            </div>
          )}
        </div>

        {/* Create Course Modal */}
        <Modal
          isOpen={showModal}
          onClose={handleCloseModal}
          title="Create New Course"
          maxWidth="max-w-4xl"
        >
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Course Title */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Course Title *</label>
              <input
                type="text"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                required
                placeholder="e.g., Spoken English"
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Description *</label>
              <textarea
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                required
                rows="3"
                placeholder="Brief description of the course..."
              />
            </div>

            {/* Instructor & Duration */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Instructor *</label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  value={formData.instructor}
                  onChange={(e) => setFormData({ ...formData, instructor: e.target.value })}
                  required
                  placeholder="Instructor name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Duration *</label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Time/Date"
                  value={formData.duration}
                  onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                  required
                />
              </div>
            </div>

            {/* Category & Level */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Category *</label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  required
                  placeholder="e.g., Spoken English"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Level</label>
                <select
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  value={formData.level}
                  onChange={(e) => setFormData({ ...formData, level: e.target.value })}
                >
                  <option>All Levels</option>
                  <option>Beginner</option>
                  <option>Intermediate</option>
                  <option>Advanced</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Language</label>
                <select
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  value={formData.lang}
                  onChange={(e) => setFormData({ ...formData, lang: e.target.value })}
                >
                  <option value="En">English</option>
                  <option value="Hn">Hindi</option>
                  <option value="Bn">Bengali</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                <div className="flex items-center space-x-4 mt-2">
                  <label className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="radio"
                      name="isPublished"
                      checked={formData.isPublished === true}
                      onChange={() => setFormData({ ...formData, isPublished: true })}
                      className="w-4 h-4 text-blue-600"
                    />
                    <span className="text-sm text-gray-700">Publish</span>
                  </label>
                  <label className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="radio"
                      name="isPublished"
                      checked={formData.isPublished === false}
                      onChange={() => setFormData({ ...formData, isPublished: false })}
                      className="w-4 h-4 text-blue-600"
                    />
                    <span className="text-sm text-gray-700">Draft</span>
                  </label>
                </div>
              </div>
            </div>

            

            {/* Thumbnail Upload */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Course Thumbnail *</label>
              
              {/* URL Input First */}
              <div className="mb-3">
                <label className="block text-xs text-gray-600 mb-1">Option 1: Enter Image URL</label>
                <input
                  type="url"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="https://images.unsplash.com/photo-..."
                  value={formData.thumbnail}
                  onChange={(e) => {
                    const url = e.target.value;
                    setFormData({ ...formData, thumbnail: url });
                    setThumbnailPreview(url);
                  }}
                />
              </div>

              {/* Divider */}
              <div className="relative mb-3">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white text-gray-500">OR</span>
                </div>
              </div>

              {/* File Upload */}
              <div>
                <label className="block text-xs text-gray-600 mb-1">Option 2: Upload Image File</label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-400 transition-colors cursor-pointer bg-gray-50">
                  <input
                    type="file"
                    id="thumbnail-upload"
                    accept="image/*"
                    onChange={handleThumbnailUpload}
                    className="hidden"
                  />
                  <label htmlFor="thumbnail-upload" className="cursor-pointer block">
                    {thumbnailPreview ? (
                      <div>
                        <img 
                          src={thumbnailPreview} 
                          alt="Preview" 
                          className="max-w-full max-h-48 rounded-lg mx-auto mb-2 object-cover"
                          onError={(e) => {
                            console.log('Preview image error');
                            e.target.src = 'https://via.placeholder.com/400x200?text=Image+Error';
                          }}
                        />
                        <p className="text-sm text-gray-500">Click to change image</p>
                      </div>
                    ) : (
                      <div>
                        <FiUpload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                        <p className="text-sm text-gray-600">Click to upload thumbnail</p>
                        <p className="text-xs text-gray-500 mt-1">PNG, JPG, WEBP up to 5MB</p>
                      </div>
                    )}
                  </label>
                  {uploading && (
                    <div className="mt-2">
                      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600 mx-auto"></div>
                      <p className="text-sm text-gray-500 mt-1">Uploading...</p>
                    </div>
                  )}
                </div>
              </div>
              
              <p className="text-xs text-gray-500 mt-2">
                💡 Tip: Use free images from Unsplash or Pexels, or upload your own
              </p>
            </div>

            {/* Modal Actions */}
            <div className="flex space-x-3 mt-6 pt-4 border-t border-gray-100">
              <button 
                type="submit" 
                className="flex-1 bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors font-medium"
                disabled={uploading}
              >
                {uploading ? 'Uploading...' : 'Create Course'}
              </button>
              <button 
                type="button" 
                className="flex-1 bg-gray-100 text-gray-700 py-3 px-4 rounded-lg hover:bg-gray-200 transition-colors"
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

  export default CoursesManagement;
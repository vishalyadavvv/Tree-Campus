import { useState, useEffect } from 'react';
import DashboardLayout from '../../components/Layout/DashboardLayout';
import api from '../../services/api';
import { FiPlus, FiTrash2, FiUpload, FiX, FiEdit2, FiEye, FiCalendar, FiTag, FiUser } from 'react-icons/fi';
import toast from 'react-hot-toast';

const BlogManagement = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [thumbnailPreview, setThumbnailPreview] = useState('');
  const [editingBlog, setEditingBlog] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    author: '',
    category: 'Education',
    tags: '',
    thumbnail: '',
    previousBlogLink: '',
    nextBlogLink: '',
    status: 'draft'
  });

  useEffect(() => {
    fetchBlogs();
  }, []);

  const fetchBlogs = async () => {
    try {
      const response = await api.get('/blogs?status=all');
      setBlogs(response.data.data || []);
    } catch (error) {
      console.error('Error fetching blogs:', error);
      setBlogs([]);
    } finally {
      setLoading(false);
    }
  };

  const handleThumbnailUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      setThumbnailPreview(reader.result);
    };
    reader.readAsDataURL(file);

    setUploading(true);
    try {
      const uploadFormData = new FormData();
      uploadFormData.append('file', file);

      const response = await api.post('/upload/file', uploadFormData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      setFormData(prev => ({
        ...prev,
        thumbnail: response.data.data.url
      }));
    } catch (error) {
      console.error('Error uploading thumbnail:', error);
      toast.error('Failed to upload thumbnail');
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const blogData = {
        ...formData,
        tags: formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag)
      };
      
      if (editingBlog) {
        await api.put(`/blogs/${editingBlog._id}`, blogData);
        toast.success('Blog updated successfully!');
      } else {
        await api.post('/blogs', blogData);
        toast.success('Blog created successfully!');
      }
      
      setShowModal(false);
      setEditingBlog(null);
      setFormData({ 
        title: '', 
        content: '', 
        author: '', 
        category: 'Education', 
        tags: '', 
        thumbnail: '', 
        previousBlogLink: '',
        nextBlogLink: '',
        status: 'draft' 
      });
      setThumbnailPreview('');
      fetchBlogs();
    } catch (error) {
      console.error('Error saving blog:', error);
      toast.error(`Failed to save blog: ${error.response?.data?.message || error.message}`);
    }
  };

  const handleEdit = (blog) => {
    setEditingBlog(blog);
    setFormData({
      title: blog.title,
      content: blog.content,
      author: blog.author,
      category: blog.category,
      tags: blog.tags?.join(', ') || '',
      thumbnail: blog.thumbnail,
      previousBlogLink: blog.previousBlogLink || '',
      nextBlogLink: blog.nextBlogLink || '',
      status: blog.status
    });
    setThumbnailPreview(blog.thumbnail);
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this blog?')) {
      try {
        await api.delete(`/blogs/${id}`);
        toast.success('Blog deleted successfully!');
        fetchBlogs();
      } catch (error) {
        console.error('Error deleting blog:', error);
        toast.error('Failed to delete blog');
      }
    }
  };

  const toggleStatus = async (blog) => {
    try {
      await api.put(`/blogs/${blog._id}`, {
        ...blog,
        status: blog.status === 'published' ? 'draft' : 'published'
      });
      fetchBlogs();
    } catch (error) {
      console.error('Error updating blog:', error);
      toast.error('Failed to update blog status');
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingBlog(null);
    setThumbnailPreview('');
    setFormData({ 
      title: '', 
      content: '', 
      author: '', 
      category: 'Education', 
      tags: '', 
      thumbnail: '', 
      previousBlogLink: '',
      nextBlogLink: '',
      status: 'draft' 
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
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Blog Management</h1>
            <p className="text-gray-600">Create and manage blog posts</p>
          </div>
          <button 
            className="mt-4 lg:mt-0 flex items-center space-x-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors w-full lg:w-auto justify-center"
            onClick={() => setShowModal(true)}
          >
            <FiPlus className="w-4 h-4" />
            <span>Create Blog Post</span>
          </button>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4 text-center">
            <div className="text-2xl font-bold text-gray-900 mb-1">{blogs.length}</div>
            <div className="text-sm text-gray-600">Total Posts</div>
          </div>
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4 text-center">
            <div className="text-2xl font-bold text-gray-900 mb-1">
              {blogs.filter(blog => blog.status === 'published').length}
            </div>
            <div className="text-sm text-gray-600">Published</div>
          </div>
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4 text-center">
            <div className="text-2xl font-bold text-gray-900 mb-1">
              {blogs.filter(blog => blog.status === 'draft').length}
            </div>
            <div className="text-sm text-gray-600">Drafts</div>
          </div>
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4 text-center">
            <div className="text-2xl font-bold text-gray-900 mb-1">
              {blogs.reduce((sum, blog) => sum + (blog.views || 0), 0)}
            </div>
            <div className="text-sm text-gray-600">Total Views</div>
          </div>
        </div>

        {/* Blogs Table */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
          {/* Desktop Table */}
          <div className="hidden lg:block overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Blog Post</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Author</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Created</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Views</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {blogs.map((blog) => (
                  <tr key={blog._id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center space-x-3">
                        <img
                          src={blog.thumbnail || '/api/placeholder/60/60'}
                          alt={blog.title}
                          className="w-12 h-12 object-cover rounded-lg"
                        />
                        <div className="max-w-xs">
                          <div className="font-medium text-gray-900 line-clamp-2">{blog.title}</div>
                          <div className="text-sm text-gray-500 line-clamp-1">
                            {blog.tags?.slice(0, 2).join(', ')}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center space-x-2 text-sm text-gray-900">
                        <FiUser className="w-4 h-4 text-gray-400" />
                        <span>{blog.author}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        {blog.category}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <div className="flex items-center space-x-1">
                        <FiCalendar className="w-4 h-4" />
                        <span>{new Date(blog.createdAt).toLocaleDateString()}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <button
                        className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium cursor-pointer transition-colors ${
                          blog.status === 'published' 
                            ? 'bg-green-100 text-green-800 hover:bg-green-200' 
                            : 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200'
                        }`}
                        onClick={() => toggleStatus(blog)}
                      >
                        {blog.status}
                      </button>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center space-x-1 text-sm text-gray-900">
                        <FiEye className="w-4 h-4 text-gray-400" />
                        <span>{blog.views || 0}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex items-center space-x-2">
                        <button 
                          className="text-blue-600 hover:text-blue-900 transition-colors p-2 hover:bg-blue-50 rounded-lg"
                          onClick={() => handleEdit(blog)}
                        >
                          <FiEdit2 className="w-4 h-4" />
                        </button>
                        <button 
                          className="text-red-600 hover:text-red-900 transition-colors p-2 hover:bg-red-50 rounded-lg"
                          onClick={() => handleDelete(blog._id)}
                        >
                          <FiTrash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile Cards */}
          <div className="lg:hidden space-y-4 p-4">
            {blogs.map((blog) => (
              <div key={blog._id} className="bg-white border border-gray-200 rounded-lg p-4 space-y-3">
                <div className="flex items-start space-x-3">
                  <img
                    src={blog.thumbnail || '/api/placeholder/60/60'}
                    alt={blog.title}
                    className="w-16 h-16 object-cover rounded-lg flex-shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-gray-900 line-clamp-2 mb-1">{blog.title}</h3>
                    <div className="flex items-center space-x-2 text-sm text-gray-500 mb-2">
                      <span className="flex items-center space-x-1">
                        <FiUser className="w-3 h-3" />
                        <span>{blog.author}</span>
                      </span>
                      <span>•</span>
                      <span className="flex items-center space-x-1">
                        <FiCalendar className="w-3 h-3" />
                        <span>{new Date(blog.createdAt).toLocaleDateString()}</span>
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-1 mb-2">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        blog.status === 'published' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {blog.status}
                      </span>
                      <span className="px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        {blog.category}
                      </span>
                      <span className="flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                        <FiEye className="w-3 h-3" />
                        <span>{blog.views || 0}</span>
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                  <div className="text-sm text-gray-500">
                    {blog.tags?.slice(0, 2).join(', ')}
                  </div>
                  <div className="flex items-center space-x-2">
                    <button 
                      className="text-blue-600 hover:text-blue-900 transition-colors p-2 hover:bg-blue-50 rounded-lg"
                      onClick={() => handleEdit(blog)}
                    >
                      <FiEdit2 className="w-4 h-4" />
                    </button>
                    <button 
                      className="text-red-600 hover:text-red-900 transition-colors p-2 hover:bg-red-50 rounded-lg"
                      onClick={() => handleDelete(blog._id)}
                    >
                      <FiTrash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {blogs.length === 0 && (
          <div className="text-center py-12 bg-white rounded-xl border border-gray-200">
            <FiPlus className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No blog posts yet</h3>
            <p className="text-gray-600 mb-6">Create your first blog post to get started</p>
            <button 
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
              onClick={() => setShowModal(true)}
            >
              Create First Post
            </button>
          </div>
        )}
      </div>

      {/* Create/Edit Blog Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-lg w-full max-w-4xl max-h-[90vh] overflow-hidden" onClick={(e) => e.stopPropagation()}>
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900">
                {editingBlog ? 'Edit Blog Post' : 'Create Blog Post'}
              </h2>
              <button className="text-gray-400 hover:text-gray-600 transition-colors" onClick={handleCloseModal}>
                <FiX className="w-6 h-6" />
              </button>
            </div>

            {/* Modal Content */}
            <form onSubmit={handleSubmit} className="p-6 overflow-auto max-h-[calc(90vh-120px)]">
              <div className="space-y-6">
                {/* Blog Title */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Blog Title *</label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    required
                    placeholder="Enter blog title..."
                  />
                </div>

                {/* Content */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Content *</label>
                  <textarea
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    rows="8"
                    value={formData.content}
                    onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                    required
                    placeholder="Write your blog content here..."
                  />
                </div>

                {/* Author & Category */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Author *</label>
                    <input
                      type="text"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      value={formData.author}
                      onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                      required
                      placeholder="Author name"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Category *</label>
                    <select
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    >
                      <option>Education</option>
                      <option>Technology</option>
                      <option>Programming</option>
                      <option>Design</option>
                      <option>Business</option>
                      <option>Other</option>
                    </select>
                  </div>
                </div>

                {/* Tags */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <div className="flex items-center space-x-2">
                      <FiTag className="w-4 h-4" />
                      <span>Tags (comma-separated)</span>
                    </div>
                  </label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Web Development, Learning, Tips"
                    value={formData.tags}
                    onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                  />
                </div>

                {/* Previous and Next Blog Links */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Previous Blog Link (Optional)</label>
                    <input
                      type="url"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="https://example.com/previous-blog"
                      value={formData.previousBlogLink}
                      onChange={(e) => setFormData({ ...formData, previousBlogLink: e.target.value })}
                    />
                    <p className="text-xs text-gray-500 mt-1">Link to the previous blog post</p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Next Blog Link (Optional)</label>
                    <input
                      type="url"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="https://example.com/next-blog"
                      value={formData.nextBlogLink}
                      onChange={(e) => setFormData({ ...formData, nextBlogLink: e.target.value })}
                    />
                    <p className="text-xs text-gray-500 mt-1">Link to the next blog post</p>
                  </div>
                </div>

                {/* Thumbnail Upload */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Blog Thumbnail</label>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-400 transition-colors cursor-pointer bg-gray-50">
                    <input
                      type="file"
                      id="blog-thumbnail-upload"
                      accept="image/*"
                      onChange={handleThumbnailUpload}
                      className="hidden"
                    />
                    <label htmlFor="blog-thumbnail-upload" className="cursor-pointer block">
                      {thumbnailPreview ? (
                        <div>
                          <img 
                            src={thumbnailPreview} 
                            alt="Preview" 
                            className="max-w-full max-h-48 rounded-lg mx-auto mb-2"
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
                  
                  <p className="text-xs text-gray-500 mt-2">Or enter URL manually:</p>
                  <input
                    type="url"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent mt-1"
                    placeholder="https://example.com/image.jpg"
                    value={formData.thumbnail}
                    onChange={(e) => setFormData({ ...formData, thumbnail: e.target.value })}
                  />
                </div>

                {/* Status */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                  <select
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                  >
                    <option value="draft">Draft</option>
                    <option value="published">Published</option>
                  </select>
                </div>
              </div>

              {/* Modal Actions */}
              <div className="flex space-x-3 mt-6">
                <button 
                  type="submit" 
                  className="flex-1 bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors font-medium"
                >
                  {editingBlog ? 'Update Blog Post' : 'Create Blog Post'}
                </button>
                <button 
                  type="button" 
                  className="flex-1 bg-gray-200 text-gray-700 py-3 px-4 rounded-lg hover:bg-gray-300 transition-colors"
                  onClick={handleCloseModal}
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

export default BlogManagement;
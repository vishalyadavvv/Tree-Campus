import { useState, useEffect } from 'react';
import DashboardLayout from '../../components/Layout/DashboardLayout';
import api from '../../services/api';
import { FiPlus, FiTrash2, FiTag, FiSearch, FiAlertCircle, FiSave } from 'react-icons/fi';
import toast from 'react-hot-toast';

const CategoryManager = ({ onUpdate }) => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newCategory, setNewCategory] = useState({ name: '', description: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const response = await api.get('/categories');
      setCategories(response.data.data);
      if (onUpdate) onUpdate();
    } catch (error) {
      console.error('Error fetching categories:', error);
      toast.error('Failed to load categories');
    } finally {
      setLoading(false);
    }
  };

  const handleAddCategory = async (e) => {
    e.preventDefault();
    if (!newCategory.name.trim()) return;

    try {
      setIsSubmitting(true);
      const response = await api.post('/categories', newCategory);
      if (response.data.success) {
        toast.success('Category added successfully');
        setNewCategory({ name: '', description: '' });
        fetchCategories();
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to add category');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteCategory = async (id, name) => {
    if (!window.confirm(`Are you sure you want to delete "${name}"? This will only work if no courses are using it.`)) {
      return;
    }

    setCategories(prev => prev.filter(c => c._id !== id));
    try {
      const response = await api.delete(`/categories/${id}`);
      if (response.data.success) {
        toast.success('Category deleted successfully');
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to delete category');
      fetchCategories();
    }
  };

  const filteredCategories = categories.filter(category =>
    category.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Add Category Form */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
            <div className="flex items-center gap-2 mb-6">
              <div className="p-2 bg-orange-100 text-[#FD5A00] rounded-lg">
                <FiPlus className="w-5 h-5" />
              </div>
              <h2 className="text-lg font-bold text-gray-900">Add New Category</h2>
            </div>

            <form onSubmit={handleAddCategory} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Category Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Grammar, Vocabulary"
                  className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 transition-all"
                  value={newCategory.name}
                  onChange={(e) => setNewCategory({ ...newCategory, name: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Description (Optional)</label>
                <textarea
                  rows="3"
                  placeholder="What courses belong here?"
                  className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 transition-all resize-none"
                  value={newCategory.description}
                  onChange={(e) => setNewCategory({ ...newCategory, description: e.target.value })}
                />
              </div>
              <button
                type="submit"
                disabled={isSubmitting || !newCategory.name.trim()}
                className="w-full py-3 bg-[#FD5A00] text-white font-bold rounded-xl hover:bg-[#e55100] transition-all flex items-center justify-center gap-2 disabled:opacity-50 shadow-lg shadow-orange-100"
              >
                {isSubmitting ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    <FiSave className="w-5 h-5" />
                    <span>Save Category</span>
                  </>
                )}
              </button>
            </form>
          </div>
        </div>

        {/* Categories List */}
        <div className="lg:col-span-2 space-y-4">
          <div className="relative">
            <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search categories..."
              className="w-full pl-11 pr-4 py-3 bg-white border border-gray-200 rounded-2xl shadow-sm focus:ring-2 focus:ring-orange-500 transition-all"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {loading ? (
            <div className="flex flex-col items-center justify-center py-10">
              <div className="w-10 h-10 border-4 border-orange-200 border-t-[#FD5A00] rounded-full animate-spin mb-4" />
              <p className="text-gray-500 text-sm">Loading...</p>
            </div>
          ) : filteredCategories.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredCategories.map((category) => (
                <div key={category._id} className="group bg-white p-5 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all relative overflow-hidden">
                  <div className="absolute top-0 right-0 p-3 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => handleDeleteCategory(category._id, category.name)}
                      className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                      title="Delete Category"
                    >
                      <FiTrash2 className="w-4 h-4" />
                    </button>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <div className="p-3 bg-orange-50 text-[#FD5A00] rounded-xl">
                      <FiTag className="w-5 h-5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-bold text-gray-900 truncate pr-8">{category.name}</h3>
                      <p className="text-sm text-gray-500 line-clamp-2 mt-1">
                        {category.description || 'No description provided.'}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-2xl border-2 border-dashed border-gray-100 py-10 flex flex-col items-center text-center px-6">
              <FiAlertCircle className="w-10 h-10 text-gray-200 mb-4" />
              <h3 className="text-sm font-bold text-gray-900 mb-1">No categories found</h3>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const CategoryManagement = () => {
  return (
    <DashboardLayout>
      <div className="space-y-6 animate-fade-in">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 mb-1">Category Management</h1>
            <p className="text-gray-600">Add and manage course categories dynamically</p>
          </div>
        </div>
        <CategoryManager />
      </div>
    </DashboardLayout>
  );
};

export { CategoryManager };
export default CategoryManagement;

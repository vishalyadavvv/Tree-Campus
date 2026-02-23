import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import { FiClock, FiEye, FiBookOpen, FiSearch, FiFilter, FiTrendingUp, FiBookmark } from 'react-icons/fi';
import { format } from 'date-fns';

const BlogList = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState('latest');
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    fetchBlogs();
  }, []);

  const fetchBlogs = async () => {
    try {
      setLoading(true);
      const response = await api.get('/blogs');
      const blogsData = response.data.data;
      setBlogs(blogsData);
      
      // Extract unique categories
      const uniqueCategories = ['all', ...new Set(blogsData.map(blog => blog.category).filter(Boolean))];
      setCategories(uniqueCategories);
    } catch (error) {
      console.error('Error fetching blogs:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredAndSortedBlogs = blogs
    .filter(blog => {
      const matchesSearch = blog.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           blog.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           blog.tags?.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
      
      const matchesCategory = selectedCategory === 'all' || blog.category === selectedCategory;
      
      return matchesSearch && matchesCategory;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'latest':
          return new Date(b.createdAt) - new Date(a.createdAt);
        case 'views':
          return b.views - a.views;
        case 'likes':
          return b.likesCount - a.likesCount;
        default:
          return 0;
      }
    });

  const calculateReadingTime = (text) => {
    const wordsPerMinute = 200;
    const words = text?.split(/\s+/).length || 0;
    return Math.ceil(words / wordsPerMinute);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="relative">
            <div className="w-24 h-24 border-4 border-orange-200 rounded-full"></div>
            <div className="w-24 h-24 border-4 border-t-orange-500 border-r-orange-500 border-b-orange-500 border-l-transparent rounded-full absolute top-0 left-0 animate-spin"></div>
          </div>
          <p className="mt-6 text-lg text-gray-600 font-medium animate-pulse">Loading amazing content...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
     
<div
  className="relative overflow-hidden py-20 md:py-32 bg-cover bg-center bg-no-repeat"
  style={{
    backgroundImage:
      'linear-gradient(rgba(0,0,0,0.65), rgba(0,0,0,0.65)), url("https://images.unsplash.com/photo-1517077304055-6e89abbf09b0?ixlib=rb-4.0.3&auto=format&fit=crop&w=2069&q=80")'
  }}
>
  {/* Content */}
  <div className="relative container mx-auto px-4 text-center">
    <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2 mb-6 animate-fadeIn">
      <FiBookOpen className="w-5 h-5 text-white" />
      <span className="text-white font-medium">Blog & Articles</span>
    </div>

    <h1 className="text-4xl md:text-6xl font-bold text-white mb-4 leading-tight animate-slideDown">
      Insights & Tutorials
    </h1>

    <p className="text-xl text-white/90 max-w-2xl mx-auto mb-8 animate-fadeIn">
      Learn from expert insights, tutorials, and thought leadership in technology and design
    </p>

    {/* Search */}
    <div className="max-w-2xl mx-auto animate-slideUp">
      <div className="relative">
        <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
        <input
          type="text"
          placeholder="Search articles by title, content, or tags..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-12 pr-4 py-4 rounded-2xl bg-white/90 backdrop-blur-sm border border-white/20 shadow-xl focus:ring-2 focus:ring-white/50 placeholder-gray-500"
        />
      </div>
    </div>
  </div>
</div>


      {/* Filters Section */}
      <div className="container mx-auto px-4 py-8">
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8 animate-slideUp">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 text-gray-600">
                <FiFilter className="w-5 h-5" />
                <span className="font-semibold">Filters</span>
              </div>
              
              {/* Category Filter */}
              <div className="flex flex-wrap items-center justify-center md:justify-start gap-2">
                {categories.map(category => (
                  <button
                    key={category}
                    onClick={() => setSelectedCategory(category)}
                    className={`px-3 py-1.5 md:px-4 md:py-2 rounded-full text-xs md:text-sm font-medium transition-all duration-300 transform hover:scale-105 ${
                      selectedCategory === category
                        ? 'bg-gradient-to-r from-orange-500 to-red-500 text-white shadow-lg'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {category === 'all' ? 'All' : category}
                  </button>
                ))}
              </div>
            </div>
            
            {/* Sort Options */}
            <div className="flex items-center gap-4">
              <span className="text-gray-600 font-semibold">Sort by:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="bg-gray-100 border border-gray-200 rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              >
                <option value="latest">Latest</option>
                <option value="views">Most Viewed</option>
                <option value="likes">Most Liked</option>
              </select>
            </div>
          </div>
          
          {/* Results Info */}
          <div className="mt-6 pt-6 border-t border-gray-100">
            <div className="flex items-center justify-between">
              <p className="text-gray-600">
                Showing <span className="font-bold text-gray-900">{filteredAndSortedBlogs.length}</span> 
                {filteredAndSortedBlogs.length === 1 ? ' article' : ' articles'}
                {searchTerm && ` for "${searchTerm}"`}
              </p>
              {filteredAndSortedBlogs.length > 0 && (
                <div className="flex items-center gap-2 text-orange-600">
                  <FiTrendingUp className="w-5 h-5" />
                  <span className="font-semibold">
                    {sortBy === 'views' ? 'Trending Now' : 
                     sortBy === 'likes' ? 'Most Loved' : 'Latest Updates'}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Blog Grid - OPTIMIZED FOR MOBILE */}
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 mb-12">
          {filteredAndSortedBlogs.map((blog, index) => (
            <Link
              key={blog._id}
              to={`/blogs/${blog._id}`}
              className="group bg-white rounded-3xl shadow-xl hover:shadow-2xl overflow-hidden transition-all duration-500 transform hover:-translate-y-2 animate-fadeIn"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              {/* Image Container */}
              <div className="relative overflow-hidden h-56">
                <img
                  src={blog.thumbnail}
                  alt={blog.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                
                {/* Category Badge */}
                <div className="absolute top-4 left-4">
                  <span className="bg-gradient-to-r from-orange-500 to-red-500 text-white px-3 py-1 rounded-full text-xs font-bold">
                    {blog.category}
                  </span>
                </div>
                
                {/* Reading Time */}
                <div className="absolute top-4 right-4 bg-black/50 backdrop-blur-sm text-white px-3 py-1 rounded-full text-xs font-medium">
                  <div className="flex items-center gap-1">
                    <FiClock className="w-3 h-3" />
                    <span>{calculateReadingTime(blog.content)} min read</span>
                  </div>
                </div>
              </div>

              {/* Content */}
              <div className="p-3 md:p-6">
                {/* Tags */}
                <div className="flex flex-wrap gap-2 mb-4">
                  {blog.tags?.slice(0, 3).map((tag, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-gradient-to-r from-orange-100 to-red-100 text-orange-700 rounded-full text-xs font-medium hover:from-orange-200 hover:to-red-200 transition-colors"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>

                {/* Title */}
                <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-orange-600 transition-colors line-clamp-2">
                  {blog.title}
                </h3>
                
                {/* Excerpt */}
                <p className="text-gray-600 mb-4 line-clamp-3">
                  {blog.content.substring(0, 150)}...
                </p>

                {/* Meta Info */}
                <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-r from-orange-400 to-red-400 rounded-full flex items-center justify-center text-white font-bold text-sm">
                      {blog.author?.charAt(0) || 'A'}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">{blog.author || 'Anonymous'}</p>
                      <p className="text-xs text-gray-500">
                        {blog.publishedAt ? format(new Date(blog.publishedAt), 'MMM dd, yyyy') : 'Draft'}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-1 text-gray-500 group/views">
                      <FiEye className="w-4 h-4 group-hover/views:text-orange-500 transition-colors" />
                      <span className="text-sm font-medium">{blog.views}</span>
                    </div>
                    <div className="flex items-center gap-1 text-gray-500 group/likes">
                      <FiBookmark className="w-4 h-4 group-hover/likes:text-red-500 transition-colors" />
                      <span className="text-sm font-medium">{blog.likesCount || 0}</span>
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Empty State */}
        {filteredAndSortedBlogs.length === 0 && (
          <div className="text-center py-16 animate-fadeIn">
            <div className="w-32 h-32 bg-gradient-to-r from-orange-100 to-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <FiSearch className="w-16 h-16 text-orange-400" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-3">No articles found</h3>
            <p className="text-gray-600 max-w-md mx-auto mb-8">
              {searchTerm 
                ? `No results found for "${searchTerm}". Try different keywords or browse all articles.`
                : 'No blog posts are available at the moment. Check back soon!'}
            </p>
            {searchTerm && (
              <button
                onClick={() => {
                  setSearchTerm('');
                  setSelectedCategory('all');
                }}
                className="bg-gradient-to-r from-orange-500 to-red-500 text-white font-bold py-3 px-8 rounded-full hover:shadow-lg hover:shadow-orange-200 transition-all duration-300 transform hover:-translate-y-1"
              >
                Clear Filters
              </button>
            )}
          </div>
        )}

        {/* Back to Courses */}
        <div className="text-center mb-8">
          <Link
            to="/courses"
            className="inline-flex items-center gap-2 text-orange-600 hover:text-orange-700 font-semibold group transition-all duration-300"
          >
            <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center group-hover:bg-orange-200 transition-colors">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </div>
            <span>Back to Courses</span>
          </Link>
        </div>
      </div>

      {/* Add custom animations to global CSS or styled-components */}
      <style jsx global>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        @keyframes slideDown {
          from { opacity: 0; transform: translateY(-20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        .animate-fadeIn {
          animation: fadeIn 0.6s ease-out forwards;
        }
        
        .animate-slideDown {
          animation: slideDown 0.6s ease-out forwards;
        }
        
        .animate-slideUp {
          animation: slideUp 0.6s ease-out forwards;
        }
        
        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
        
        .line-clamp-3 {
          display: -webkit-box;
          -webkit-line-clamp: 3;
          -webkit-box-orrient: vertical;
          overflow: hidden;
        }
      `}</style>
    </div>
  );
};

export default BlogList;
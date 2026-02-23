import { useState, useEffect, useRef } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import api from '../services/api';
import { 
  FiClock, FiUser, FiEye, FiArrowLeft, FiArrowRight, 
  FiShare2, FiBookmark, FiTag, FiCalendar, FiChevronLeft, 
  FiChevronRight, FiFacebook, FiTwitter, FiLinkedin, FiCopy,
  FiHeart, FiMessageCircle, FiBookOpen, FiInstagram, FiX
} from 'react-icons/fi';
import { format } from 'date-fns';
import toast from 'react-hot-toast';

const BlogPost = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [showShare, setShowShare] = useState(false);
  const [likes, setLikes] = useState(0);
  const [hasLiked, setHasLiked] = useState(false);
  const [readingTime, setReadingTime] = useState(0);
  const [scrollProgress, setScrollProgress] = useState(0);
  const contentRef = useRef(null);
  const shareMenuRef = useRef(null);

  // Close share menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (shareMenuRef.current && !shareMenuRef.current.contains(event.target)) {
        const shareButton = event.target.closest('.share-button');
        if (!shareButton) {
          setShowShare(false);
        }
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Calculate reading time
  const calculateReadingTime = (text) => {
    const wordsPerMinute = 200;
    const words = text?.split(/\s+/).length || 0;
    return Math.ceil(words / wordsPerMinute);
  };

  useEffect(() => {
    fetchBlog();
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [id]);

  useEffect(() => {
    if (blog?.content) {
      setReadingTime(calculateReadingTime(blog.content));
    }
  }, [blog]);

  // Initialize likes and bookmarks from localStorage on component mount
  useEffect(() => {
    const savedLikes = JSON.parse(localStorage.getItem('blogLikes') || '{}');
    const savedBookmarks = JSON.parse(localStorage.getItem('blogBookmarks') || '{}');
    
    if (id) {
      if (savedLikes[id]) {
        setHasLiked(true);
      }
      if (savedBookmarks[id]) {
        setIsBookmarked(true);
      }
    }
  }, [id]);

  const fetchBlog = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/blogs/${id}`);
      const blogData = response.data.data;
      setBlog(blogData);
      
      // Update counts and status from API data
      setLikes(blogData.likesCount || 0);
      
      // Check if current user has liked/bookmarked (this logic will be refined when we have auth context)
      // For now, we still check localStorage as a secondary fallback for guest/local preference
      const savedLikes = JSON.parse(localStorage.getItem('blogLikes') || '{}');
      const savedBookmarks = JSON.parse(localStorage.getItem('blogBookmarks') || '{}');
      
      // If the backend says we liked it, or local says we liked it
      setHasLiked(!!(blogData.likedBy?.includes(localStorage.getItem('userId')) || savedLikes[id]));
      setIsBookmarked(!!(savedBookmarks[id])); 
      
    } catch (error) {
      console.error('Error fetching blog:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleScroll = () => {
    const windowHeight = window.innerHeight;
    const documentHeight = document.documentElement.scrollHeight - windowHeight;
    const scrolled = window.scrollY;
    const progress = (scrolled / documentHeight) * 100;
    setScrollProgress(progress);
  };

  const handleBookmark = async () => {
    if (!blog) return;
    
    try {
      const response = await api.post(`/blogs/${id}/save`);
      const isNowSaved = response.data.data.isSaved;
      
      // Sync with localStorage
      const savedBookmarks = JSON.parse(localStorage.getItem('blogBookmarks') || '{}');
      const updatedBookmarks = {
        ...savedBookmarks,
        [id]: isNowSaved
      };
      
      localStorage.setItem('blogBookmarks', JSON.stringify(updatedBookmarks));
      setIsBookmarked(isNowSaved);
      
      if (isNowSaved) {
        toast.success('Successfully saved to your profile!');
      } else {
        toast.success('Removed from saved blogs');
      }
    } catch (error) {
      console.error('Error updating bookmark:', error);
      toast.error('Login to save this article');
    }
  };

  const handleLike = async () => {
    if (!blog) return;
    
    try {
      const response = await api.post(`/blogs/${id}/like`);
      const { likesCount, hasLiked: newHasLiked } = response.data.data;
      
      // Update local storage for guest-like tracking
      const savedLikes = JSON.parse(localStorage.getItem('blogLikes') || '{}');
      const updatedLikes = {
        ...savedLikes,
        [id]: newHasLiked
      };
      localStorage.setItem('blogLikes', JSON.stringify(updatedLikes));
      
      // Update state from authoritative source (backend)
      setHasLiked(newHasLiked);
      setLikes(likesCount);
      
      if (newHasLiked) {
        toast.success('Glad you liked it!');
      }
    } catch (error) {
      console.error('Error updating like:', error);
      toast.error('Please login to like this post');
    }
  };

  const handleShare = (platform) => {
    const url = window.location.href;
    const title = blog?.title || 'Check out this blog post';
    const hashtags = blog?.tags?.join(',') || '';
    
    const shareUrls = {
      twitter: `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}&hashtags=${encodeURIComponent(hashtags)}`,
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
      linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`,
      instagram: `https://www.instagram.com/`,
    };

    if (platform === 'copy') {
      navigator.clipboard.writeText(url);
      toast.success('Link copied to clipboard!');
      setShowShare(false);
      return;
    }

    if (platform === 'instagram') {
      const message = `Check out this blog post: ${title}\n${url}`;
      navigator.clipboard.writeText(message);
      toast.success('Content copied to clipboard! You can now paste it in your Instagram post or story.');
      setShowShare(false);
      return;
    }

    window.open(shareUrls[platform], '_blank', 'noopener,noreferrer');
    setShowShare(false);
  };

  // Function to format content with first word in black
  const formatContentWithFirstWordBlack = (content) => {
    if (!content) return '';
    
    if (content.includes('<')) {
      // For HTML content
      const tempDiv = document.createElement('div');
      tempDiv.innerHTML = content;
      const paragraphs = tempDiv.querySelectorAll('p');
      
      paragraphs.forEach(p => {
        const text = p.textContent || '';
        const words = text.split(' ');
        if (words.length > 0) {
          words[0] = `<span class="first-word">${words[0]}</span>`;
          p.innerHTML = words.join(' ');
        }
      });
      
      return tempDiv.innerHTML;
    } else {
      // For plain text content
      const paragraphs = content.split('\n\n');
      return paragraphs.map(paragraph => {
        const words = paragraph.split(' ');
        if (words.length > 0) {
          words[0] = `<span class="first-word">${words[0]}</span>`;
          return `<p>${words.join(' ')}</p>`;
        }
        return `<p>${paragraph}</p>`;
      }).join('');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="relative">
            <div className="w-20 h-20 border-4 border-orange-200 rounded-full"></div>
            <div className="w-20 h-20 border-4 border-t-orange-500 border-r-orange-500 border-b-orange-500 border-l-transparent rounded-full absolute top-0 left-0 animate-spin"></div>
          </div>
          <p className="mt-4 text-gray-600 font-medium animate-pulse">Loading amazing content...</p>
        </div>
      </div>
    );
  }

  if (!blog) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-3xl shadow-2xl p-8 text-center transform hover:scale-[1.02] transition-transform duration-300">
          <div className="w-24 h-24 bg-gradient-to-r from-orange-100 to-orange-200 rounded-full flex items-center justify-center mx-auto mb-6">
            <FiBookOpen className="w-12 h-12 text-orange-500" />
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-3">Post Not Found</h2>
          <p className="text-gray-600 mb-6">The article you're looking for seems to have wandered off. Let's find you something else to read!</p>
          <button
            onClick={() => navigate('/blogs')}
            className="bg-gradient-to-r from-orange-500 to-red-500 text-white font-bold py-3 px-8 rounded-full hover:shadow-lg hover:shadow-orange-200 transition-all duration-300 transform hover:-translate-y-1"
          >
            Explore More Blogs
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      {/* Floating Progress Bar */}
      <div className="fixed top-0 left-0 right-0 h-1 bg-gray-200 z-50">
        <div 
          className="h-full bg-gradient-to-r from-orange-500 to-red-500 transition-all duration-300 ease-out"
          style={{ width: `${scrollProgress}%` }}
        ></div>
      </div>

      {/* Custom CSS for animations and layout enhancements */}
      <style>{`
        /* Add any custom CSS here if needed */
        /* For example, for the first-word styling */
        .first-word {
          color: black;
          font-weight: bold;
        }
        /* Define keyframes for fadeIn animation */
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out forwards;
        }
      `}</style>

      {/* Floating Action Buttons */}
      <div className="fixed right-6 bottom-6 z-40 flex flex-col gap-3">
        <button
          onClick={handleLike}
          className={`p-3 rounded-full shadow-lg transition-all duration-300 transform hover:scale-110 ${
            hasLiked 
              ? 'bg-gradient-to-r from-pink-500 to-red-500 text-white animate-pulse' 
              : 'bg-white text-gray-700 hover:bg-gray-50'
          }`}
        >
          <FiHeart className={`w-6 h-6 ${hasLiked ? 'fill-current' : ''}`} />
        </button>
        
        <button
          onClick={() => setShowShare(!showShare)}
          className="p-3 rounded-full bg-white shadow-lg text-gray-700 hover:bg-gray-50 transition-all duration-300 transform hover:scale-110 share-button"
        >
          <FiShare2 className="w-6 h-6" />
        </button>
        
        <button
          onClick={handleBookmark}
          className={`p-3 rounded-full shadow-lg transition-all duration-300 transform hover:scale-110 ${
            isBookmarked 
              ? 'bg-gradient-to-r from-orange-500 to-red-500 text-white' 
              : 'bg-white text-gray-700 hover:bg-gray-50'
          }`}
        >
          <FiBookmark className={`w-6 h-6 ${isBookmarked ? 'fill-current' : ''}`} />
        </button>
      </div>

      {/* Share Menu */}
      {showShare && (
        <div ref={shareMenuRef} className="fixed right-6 bottom-24 z-40 animate-fadeIn">
          <div className="bg-white rounded-2xl shadow-2xl p-4 mb-3">
            <div className="flex justify-between items-center mb-3 pb-2 border-b border-gray-100">
              <h3 className="font-bold text-gray-900">Share this post</h3>
              <button
                onClick={() => setShowShare(false)}
                className="p-1 rounded-full hover:bg-gray-100 transition-colors"
              >
                <FiX className="w-4 h-4 text-gray-500" />
              </button>
            </div>
            <div className="grid grid-cols-4 gap-2">
              <button
                onClick={() => handleShare('twitter')}
                className="flex flex-col items-center p-3 rounded-xl hover:bg-blue-50 transition-colors group"
              >
                <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center mb-2 group-hover:bg-blue-200 transition-colors">
                  <FiTwitter className="w-5 h-5 text-blue-500" />
                </div>
                <span className="text-xs font-medium text-gray-700">Twitter</span>
              </button>
              
              <button
                onClick={() => handleShare('facebook')}
                className="flex flex-col items-center p-3 rounded-xl hover:bg-blue-50 transition-colors group"
              >
                <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center mb-2 group-hover:bg-blue-200 transition-colors">
                  <FiFacebook className="w-5 h-5 text-blue-600" />
                </div>
                <span className="text-xs font-medium text-gray-700">Facebook</span>
              </button>
              
              <button
                onClick={() => handleShare('linkedin')}
                className="flex flex-col items-center p-3 rounded-xl hover:bg-blue-50 transition-colors group"
              >
                <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center mb-2 group-hover:bg-blue-200 transition-colors">
                  <FiLinkedin className="w-5 h-5 text-blue-800" />
                </div>
                <span className="text-xs font-medium text-gray-700">LinkedIn</span>
              </button>
              
              <button
                onClick={() => handleShare('instagram')}
                className="flex flex-col items-center p-3 rounded-xl hover:bg-pink-50 transition-colors group"
              >
                <div className="w-10 h-10 rounded-full bg-gradient-to-r from-pink-500 to-purple-600 flex items-center justify-center mb-2 group-hover:from-pink-600 group-hover:to-purple-700 transition-colors">
                  <FiInstagram className="w-5 h-5 text-white" />
                </div>
                <span className="text-xs font-medium text-gray-700">Instagram</span>
              </button>
              
              <button
                onClick={() => handleShare('copy')}
                className="flex flex-col items-center p-3 rounded-xl hover:bg-gray-100 transition-colors group col-span-4 mt-2"
              >
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center group-hover:bg-gray-200 transition-colors">
                    <FiCopy className="w-4 h-4 text-gray-600" />
                  </div>
                  <span className="text-sm font-medium text-gray-700">Copy Link</span>
                </div>
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="relative">
        {/* Hero Section with Gradient Overlay */}
        <div className="relative h-[60vh] min-h-[500px] overflow-hidden">
          <img
            src={blog.thumbnail}
            alt={blog.title}
            className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-700"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/70 to-transparent"></div>
          
          {/* Back Button */}
          <div className="absolute top-6 left-6">
            <button
              onClick={() => navigate(-1)}
              className="bg-white/10 backdrop-blur-sm border border-white/20 text-black px-4 py-2 rounded-full hover:bg-white/20 transition-all duration-300 flex items-center gap-2"
            >
              <FiArrowLeft /> Back
            </button>
          </div>

          {/* Hero Content */}
          <div className="absolute bottom-0 left-0 right-0 p-8">
            <div className="max-w-4xl mx-auto">
              <div className="flex flex-wrap gap-2 mb-4">
                <span className="bg-gradient-to-r from-orange-500 to-red-500 text-white px-4 py-1 rounded-full text-sm font-bold">
                  {blog.category}
                </span>
                {blog.tags?.slice(0, 3).map((tag, index) => (
                  <span
                    key={index}
                    className="bg-white/20 backdrop-blur-sm text-white px-3 py-1 rounded-full text-sm"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
              
              <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight drop-shadow-lg">
                {blog.title}
              </h1>
              
              <div className="flex flex-wrap items-center gap-6 text-white/90">
                <div className="flex items-center gap-2">
                  <div className="w-10 h-10 bg-gradient-to-r from-orange-400 to-red-400 rounded-full flex items-center justify-center font-bold">
                    {blog.author?.charAt(0)}
                  </div>
                  <span className="font-medium">{blog.author}</span>
                </div>
                
                <div className="flex items-center gap-2">
                  <FiCalendar className="w-5 h-5" />
                  <span>{format(new Date(blog.createdAt), 'MMMM dd, yyyy')}</span>
                </div>
                
                <div className="flex items-center gap-2">
                  <FiEye className="w-5 h-5" />
                  <span>{blog.views} views</span>
                </div>
                
                <div className="flex items-center gap-2">
                  <FiClock className="w-5 h-5" />
                  <span>{readingTime} min read</span>
                </div>
              </div>
            </div>
          </div>
          
          {/* Scroll Indicator */}
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 animate-bounce">
            <div className="w-8 h-12 border-2 border-white/50 rounded-full flex justify-center">
              <div className="w-1 h-3 bg-white/70 rounded-full mt-2 animate-pulse"></div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-4xl mx-auto px-4 py-12 -mt-20 relative z-10">
          <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">
            {/* Stats Bar */}
            <div className="border-b border-gray-100">
              <div className="p-6 flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center gap-6">
                  <button
                    onClick={handleLike}
                    className={`flex items-center gap-2 px-4 py-2 rounded-full transition-all duration-300 ${
                      hasLiked
                        ? 'bg-gradient-to-r from-pink-50 to-red-50 text-red-600 border border-red-200'
                        : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    <FiHeart className={`w-5 h-5 ${hasLiked ? 'fill-current' : ''}`} />
                    <span className="font-bold">{likes}</span>
                  </button>
                  
                  <button
                    onClick={handleBookmark}
                    className={`flex items-center gap-2 px-4 py-2 rounded-full transition-all duration-300 ${
                      isBookmarked
                        ? 'bg-gradient-to-r from-orange-50 to-red-50 text-orange-600 border border-orange-200'
                        : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    <FiBookmark className={`w-5 h-5 ${isBookmarked ? 'fill-current' : ''}`} />
                    <span className="font-bold">{isBookmarked ? 'Saved' : 'Save'}</span>
                  </button>
                </div>
                
                <div className="flex items-center gap-3">
                  <span className="text-sm text-gray-500">Share:</span>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleShare('twitter')}
                      className="p-2 rounded-full bg-gray-50 hover:bg-gray-100 transition-colors share-button"
                    >
                      <FiTwitter className="w-4 h-4 text-blue-400" />
                    </button>
                    <button
                      onClick={() => handleShare('facebook')}
                      className="p-2 rounded-full bg-gray-50 hover:bg-gray-100 transition-colors share-button"
                    >
                      <FiFacebook className="w-4 h-4 text-blue-600" />
                    </button>
                    <button
                      onClick={() => handleShare('linkedin')}
                      className="p-2 rounded-full bg-gray-50 hover:bg-gray-100 transition-colors share-button"
                    >
                      <FiLinkedin className="w-4 h-4 text-blue-800" />
                    </button>
                    <button
                      onClick={() => handleShare('instagram')}
                      className="p-2 rounded-full bg-gray-50 hover:bg-gray-100 transition-colors share-button"
                    >
                      <FiInstagram className="w-4 h-4 text-pink-600" />
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Article Content */}
            <div ref={contentRef} className="p-8 md:p-12">
              <div className="prose prose-lg max-w-none">
                <style>{`
                  .first-word {
                    color: black !important;
                    font-weight: 700;
                  }
                `}</style>
                
                {blog.content && (
                  <div 
                    dangerouslySetInnerHTML={{ 
                      __html: formatContentWithFirstWordBlack(blog.content) 
                    }} 
                  />
                )}
              </div>

              {/* Highlight Box */}
              <div className="my-12 p-8 bg-gradient-to-r from-orange-50 to-red-50 rounded-2xl border-l-4 border-orange-500 transform hover:scale-[1.02] transition-transform duration-300">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-red-500 rounded-full flex items-center justify-center flex-shrink-0">
                    <FiBookOpen className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">Key Takeaway</h3>
                    <p className="text-gray-700">
                      {blog.summary || 'The most important insights from this article that you should remember and apply.'}
                    </p>
                  </div>
                </div>
              </div>

              {/* Tags */}
              {blog.tags && blog.tags.length > 0 && (
                <div className="mt-12 pt-8 border-t border-gray-100">
                  <h3 className="text-xl font-bold text-gray-900 mb-4">Topics Covered</h3>
                  <div className="flex flex-wrap gap-2">
                    {blog.tags.map((tag, index) => (
                      <span
                        key={index}
                        className="px-4 py-2 bg-gradient-to-r from-orange-100 to-red-100 text-orange-700 rounded-full hover:from-orange-200 hover:to-red-200 transition-all duration-300 cursor-pointer transform hover:-translate-y-1"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Author Section (Removed Follow and View Profile buttons) */}
          <div className="mt-8 bg-white rounded-3xl shadow-2xl overflow-hidden">
            <div className="p-8 md:p-12">
              <div className="flex flex-col md:flex-row items-start gap-8">
                <div className="flex-shrink-0">
                  <div className="w-24 h-24 bg-gradient-to-r from-orange-500 to-red-500 rounded-full flex items-center justify-center text-white font-bold text-3xl shadow-lg">
                    {blog.author?.charAt(0)}
                  </div>
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-4 mb-4">
                    <h2 className="text-2xl font-bold text-gray-900">About {blog.author}</h2>
                    <span className="px-3 py-1 bg-gradient-to-r from-orange-500 to-red-500 text-white text-sm font-bold rounded-full">
                      Author
                    </span>
                  </div>
                  <p className="text-gray-700 text-lg leading-relaxed mb-6">
                    {blog.authorBio || 'A passionate writer dedicated to sharing valuable insights and experiences with the community.'}
                  </p>
                  {/* Removed Follow and View Profile buttons */}
                </div>
              </div>
            </div>
          </div>

          {/* Navigation */}
          {(blog.previousBlogLink || blog.nextBlogLink) && (
            <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
              {blog.previousBlogLink && (
                <Link
                  to={blog.previousBlogLink}
                  className="group p-8 bg-white rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2"
                >
                  <div className="flex items-center gap-4">
                    <div className="flex-shrink-0">
                      <div className="w-16 h-16 bg-gradient-to-r from-orange-100 to-red-100 rounded-2xl flex items-center justify-center group-hover:from-orange-200 group-hover:to-red-200 transition-all duration-300">
                        <FiArrowLeft className="w-8 h-8 text-orange-500 group-hover:scale-110 transition-transform" />
                      </div>
                    </div>
                    <div>
                      <span className="text-sm text-gray-500 font-medium mb-1 block">Previous Post</span>
                      <h3 className="text-lg font-bold text-gray-900 group-hover:text-orange-600 transition-colors">
                        {blog.previousBlogTitle || 'Previous Article'}
                      </h3>
                    </div>
                  </div>
                </Link>
              )}
              
              {blog.nextBlogLink && (
                <Link
                  to={blog.nextBlogLink}
                  className="group p-8 bg-white rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 text-right"
                >
                  <div className="flex items-center gap-4 justify-end">
                    <div>
                      <span className="text-sm text-gray-500 font-medium mb-1 block">Next Post</span>
                      <h3 className="text-lg font-bold text-gray-900 group-hover:text-orange-600 transition-colors">
                        {blog.nextBlogTitle || 'Next Article'}
                      </h3>
                    </div>
                    <div className="flex-shrink-0">
                      <div className="w-16 h-16 bg-gradient-to-r from-orange-100 to-red-100 rounded-2xl flex items-center justify-center group-hover:from-orange-200 group-hover:to-red-200 transition-all duration-300">
                        <FiArrowRight className="w-8 h-8 text-orange-500 group-hover:scale-110 transition-transform" />
                      </div>
                    </div>
                  </div>
                </Link>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BlogPost;
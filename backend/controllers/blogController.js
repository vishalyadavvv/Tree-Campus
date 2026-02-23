import Blog from '../models/Blog.js';

// @desc    Get all blogs
// @route   GET /api/blogs
// @access  Public
export const getBlogs = async (req, res, next) => {
  try {
    const { status } = req.query;
    const query = status === 'all' ? {} : { status: status || 'published' };
    const blogs = await Blog.find(query).sort('-createdAt');

    res.status(200).json({
      success: true,
      count: blogs.length,
      data: blogs
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single blog
// @route   GET /api/blogs/:id
// @access  Public
export const getBlog = async (req, res, next) => {
  try {
    const blog = await Blog.findById(req.params.id);

    if (!blog) {
      return res.status(404).json({
        success: false,
        message: 'Blog not found'
      });
    }

    blog.views += 1;
    await blog.save();

    res.status(200).json({
      success: true,
      data: blog
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create blog
// @route   POST /api/blogs
// @access  Private/Admin
export const createBlog = async (req, res, next) => {
  try {
    console.log('📝 Creating blog with data:', req.body);
    
    const blog = await Blog.create(req.body);
    
    console.log('✅ Blog created:', blog._id);

    res.status(201).json({
      success: true,
      data: blog
    });
  } catch (error) {
    console.error('❌ Create blog error:', error);
    next(error);
  }
};

// @desc    Update blog
// @route   PUT /api/blogs/:id
// @access  Private/Admin
export const updateBlog = async (req, res, next) => {
  try {
    const blog = await Blog.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!blog) {
      return res.status(404).json({
        success: false,
        message: 'Blog not found'
      });
    }

    res.status(200).json({
      success: true,
      data: blog
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete blog
// @route   DELETE /api/blogs/:id
// @access  Private/Admin
export const deleteBlog = async (req, res, next) => {
  try {
    const blog = await Blog.findById(req.params.id);

    if (!blog) {
      return res.status(404).json({
        success: false,
        message: 'Blog not found'
      });
    }

    await blog.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Blog deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Toggle Like blog
// @route   POST /api/blogs/:id/like
// @access  Private
export const toggleLike = async (req, res, next) => {
  try {
    const blog = await Blog.findById(req.params.id);

    if (!blog) {
      return res.status(404).json({
        success: false,
        message: 'Blog not found'
      });
    }

    const index = blog.likedBy.indexOf(req.user._id);

    if (index === -1) {
      // Like
      blog.likedBy.push(req.user._id);
      blog.likesCount += 1;
    } else {
      // Unlike
      blog.likedBy.splice(index, 1);
      blog.likesCount -= 1;
    }

    await blog.save();

    res.status(200).json({
      success: true,
      data: {
        likesCount: blog.likesCount,
        hasLiked: blog.likedBy.includes(req.user._id)
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Toggle Save/Bookmark blog
// @route   POST /api/blogs/:id/save
// @access  Private
export const toggleSave = async (req, res, next) => {
  try {
    const blogId = req.params.id;
    // We need the full user document to update and save
    const user = await req.user.constructor.findById(req.user._id);

    if (!user) {
       return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    const index = user.savedBlogs.indexOf(blogId);

    if (index === -1) {
      // Save
      user.savedBlogs.push(blogId);
    } else {
      // Unsave
      user.savedBlogs.splice(index, 1);
    }

    await user.save();

    res.status(200).json({
      success: true,
      data: {
        isSaved: user.savedBlogs.includes(blogId)
      }
    });
  } catch (error) {
    next(error);
  }
};
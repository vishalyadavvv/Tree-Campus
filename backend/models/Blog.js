import mongoose from 'mongoose';

const blogSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please provide a blog title'],
    trim: true
  },
  content: {
    type: String,
    required: [true, 'Please provide blog content']
  },
  author: {
    type: String,
    required: [true, 'Please provide author name']
  },
  thumbnail: {
    type: String,
    default: 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=800'
  },
  tags: [{
    type: String
  }],
  category: {
    type: String,
    default: 'General'
  },
  status: {
    type: String,
    enum: ['draft', 'published'],
    default: 'draft'
  },
  views: {
    type: Number,
    default: 0
  },
  previousBlogLink: {
    type: String,
    default: ''
  },
  nextBlogLink: {
    type: String,
    default: ''
  },
  publishedAt: {
    type: Date
  },
  likesCount: {
    type: Number,
    default: 0
  },
  likedBy: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }]
}, {
  timestamps: true
});

// Set publishedAt when status changes to published
blogSchema.pre('save', function(next) {
  if (this.isModified('status') && this.status === 'published' && !this.publishedAt) {
    this.publishedAt = new Date();
  }
  
});

const Blog = mongoose.model('Blog', blogSchema);

export default Blog;
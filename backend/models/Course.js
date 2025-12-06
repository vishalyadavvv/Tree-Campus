import mongoose from 'mongoose';

const courseSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please provide a course title'],
    trim: true
  },
  description: {
    type: String,
    required: [true, 'Please provide a course description']
  },
  thumbnail: {
    type: String,
    default: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800'
  },
  instructor: {
    type: String,
    required: [true, 'Please provide instructor name']
  },
 category: {
  type: String,
  enum: [
    'Spoken English',  // Add this simpler option
    'Spoken English Part-1', 
    'Spoken English Part-2', 
    'Spoken English Part-3',
    'Other'
  ],
},
level: {
  type: String,
  enum: ['All levels', 'Beginner', 'Intermediate', 'Advanced'],  // Change to lowercase 'levels'
  default: 'All levels'  
},
  level: {
    type: String,
    enum: ['All Levels','Beginner', 'Intermediate', 'Advanced'],
    default: 'All Levels'
  },
  // price: {
  //   type: Number,
  //   default: 0
  // },
  duration: {
    type: String,
    default: '0 hours'
  },
  enrollmentCount: {
    type: Number,
    default: 0
  },
  rating: {
    type: Number,
    default: 0,
    min: 0,
    max: 5
  },
  totalLessons: {
    type: Number,
    default: 0
  },
  certificateTemplate: {
    type: String,
    default: '' // URL to custom certificate template uploaded by admin
  },
  totalSections: {
    type: Number,
    default: 0
  },
  totalQuizzes: {
    type: Number,
    default: 0
  },
  isPublished: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

const Course = mongoose.model('Course', courseSchema);

export default Course;

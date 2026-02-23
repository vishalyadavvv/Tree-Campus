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
   default:''
  },
  thumbnailPublicId: {  
  type: String,
  default: ''
},
  instructor: {
    type: String,
    required: [true, 'Please provide instructor name']
  },
  category: {
    type: String,
    required: [true, 'Please provide a category']
  },
  level: {
    type: String,
    enum: ['All Levels', 'Beginner', 'Intermediate', 'Advanced'],
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
  },
  lang: {
    type: String,
    enum: ['Hn', 'Bn', 'En'],
    default: 'En'
  },
  seriesKey: {
    type: String,
    index: true,
    default: ''
  },
  certificateTitle: {
    type: String,
    default: ''
  },
  seriesOrder: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

const Course = mongoose.model('Course', courseSchema);

export default Course;

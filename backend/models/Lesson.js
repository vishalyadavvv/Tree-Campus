import mongoose from 'mongoose';

const lessonSchema = new mongoose.Schema({
  sectionId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Section',
    required: true
  },
  courseId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Course',
    required: true
  },
  title: {
    type: String,
    required: [true, 'Please provide a lesson title'],
    trim: true
  },
  videoUrl: {
    type: String,
    required: [true, 'Please provide a video URL']
  },
  duration: {
    type: String,
    default: '0:00'
  },
  order: {
    type: Number,
    required: true,
    default: 0
  },
  resources: [{
    title: String,
    url: String
  }],
  isFree: {
    type: Boolean,
    default: false
  },
  textContent: {
    type: String,
    default: ''
  },
  pdfUrl: {
    type: String,
    default: ''
  },
  pdfFileName: {
    type: String,
    default: ''
  },
  content: {
    type: String,
    default: ''
  }
}, {
  timestamps: true
});

// Indexes for high-concurrency curriculum lookups
lessonSchema.index({ courseId: 1 });
lessonSchema.index({ sectionId: 1 });

const Lesson = mongoose.model('Lesson', lessonSchema);

export default Lesson;

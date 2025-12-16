import mongoose from 'mongoose';

const sectionSchema = new mongoose.Schema({
  courseId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Course',
    required: true
  },
  title: {
    type: String,
    required: [true, 'Please provide a section title'],
    trim: true
  },
  description: {
    type: String,
    default: ''
  },
  note: {
    type: String,
    default: ''
  },
  notes: [{
    heading: {
      type: String,
      required: true
    },
    content: {
      type: String,
      required: true
    }
  }],
  order: {
    type: Number,
    required: true,
    default: 0
  }
}, {
  timestamps: true
});

const Section = mongoose.model('Section', sectionSchema);

export default Section;

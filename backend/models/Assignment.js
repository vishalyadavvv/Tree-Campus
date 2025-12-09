import mongoose from 'mongoose';

const assignmentSchema = new mongoose.Schema(
  {
    courseId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Course',
      required: true
    },
    title: {
      type: String,
      required: [true, 'Assignment title is required'],
      trim: true
    },
    description: {
      type: String,
      default: ''
    },
    passingScore: {
      type: Number,
      default: 60,
      min: 0,
      max: 100
    },
    totalQuestions: {
      type: Number,
      required: true
    },
    questions: [
      {
        questionText: {
          type: String,
          required: true
        },
        type: {
          type: String,
          enum: ['multiple-choice', 'short-answer'],
          default: 'multiple-choice'
        },
        options: [String],
        correctAnswer: {
          type: String,
          required: true
        },
        points: {
          type: Number,
          default: 1
        }
      }
    ],
    timeLimit: {
      type: Number,
      default: 60, // minutes
      required: true
    },
    totalPoints: {
      type: Number,
      required: true
    },
    createdAt: {
      type: Date,
      default: Date.now
    },
    updatedAt: {
      type: Date,
      default: Date.now
    }
  },
  { timestamps: true }
);

export default mongoose.model('Assignment', assignmentSchema);

import mongoose from 'mongoose';

const assignmentSubmissionSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    courseId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Course',
      required: true
    },
    assignmentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Assignment',
      required: true
    },
    answers: [
      {
        questionId: {
          type: mongoose.Schema.Types.ObjectId,
          required: true
        },
        userAnswer: {
          type: String,
          required: true
        },
        isCorrect: {
          type: Boolean,
          default: false
        },
        pointsEarned: {
          type: Number,
          default: 0
        }
      }
    ],
    totalScore: {
      type: Number,
      required: true
    },
    percentageScore: {
      type: Number,
      required: true
    },
    status: {
      type: String,
      enum: ['pending', 'submitted', 'graded'],
      default: 'submitted'
    },
    passed: {
      type: Boolean,
      default: false
    },
    certificateId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Certificate',
      default: null
    },
    submittedAt: {
      type: Date,
      default: Date.now
    },
    gradedAt: {
      type: Date,
      default: null
    }
  },
  { timestamps: true }
);

export default mongoose.model('AssignmentSubmission', assignmentSubmissionSchema);

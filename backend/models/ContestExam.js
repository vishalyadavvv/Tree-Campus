import mongoose from 'mongoose';

// Sub-schemas
const QuestionSchema = new mongoose.Schema({
  question: { type: String, required: true },
  options: [{ type: String, required: true }],
  answer: { type: Number, required: true },
});

const StudentResponseSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // Added reference to Tree Campus User
  name: { type: String, required: true },
  phone_number: { type: Number, required: true }, // Kept for consistency, can be pre-filled
  email: { type: String, required: true },
  answers: [{ type: String }],
  score: { type: Number, required: true },
  submittedAt: { type: Date, default: Date.now }
});

const WinnerSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // Added reference
  code: { type: String, required: true },
  email: { type: String, required: true },
  rank: { type: Number, required: true },
  name: { type: String, required: true },
  phone_number: { type: Number, required: true },
});

// Main Exam Schema
const ContestExamSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: false, default: '' },
    timeLimit: { type: Number, required: true }, // in minutes
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    duration: { type: Number, required: true }, // seems redundant with timeLimit? Contst-main had both.
    passingPercentage: { type: Number, required: true },
    status: {
        type: String,
        enum: ["active", "paused", "ended", "results_declared"],
        default: "active"
      },
    winner_numbers: { type: Number, required: true },
    questions:       [ QuestionSchema ],
    studentResponses:[ StudentResponseSchema ],
    winners:         [ WinnerSchema ],
  },
  { collection: "contest_exams", timestamps: true }
);

const ContestExam = mongoose.model('ContestExam', ContestExamSchema);

export default ContestExam;

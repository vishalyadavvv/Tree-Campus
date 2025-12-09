import Assignment from '../models/Assignment.js';
import AssignmentSubmission from '../models/AssignmentSubmission.js';
import Certificate from '../models/Certificate.js';
import User from '../models/User.js';
import Progress from '../models/Progress.js';
import Course from '../models/Course.js';
import { sendAssignmentResultsEmail } from '../utils/sendEmail.js';

// @desc    Create assignment (admin only)
// @route   POST /api/assignments/course/:courseId
// @access  Private/Admin
export const createAssignment = async (req, res, next) => {
  try {
    const { courseId } = req.params;
    const { title, description, questions, passingScore, timeLimit } = req.body;

    // Validate course exists
    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ success: false, message: 'Course not found' });
    }

    // Calculate total points
    const totalPoints = questions.reduce((sum, q) => sum + (q.points || 1), 0);

    const assignment = await Assignment.create({
      courseId,
      title,
      description,
      questions,
      passingScore: passingScore || 60,
      timeLimit: timeLimit || 60,
      totalPoints,
      totalQuestions: questions.length
    });

    res.status(201).json({
      success: true,
      message: 'Assignment created successfully',
      data: assignment
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get course assignments
// @route   GET /api/assignments/course/:courseId
// @access  Public
export const getCourseAssignments = async (req, res, next) => {
  try {
    const { courseId } = req.params;

    const assignments = await Assignment.find({ courseId })
      .select('-questions.correctAnswer') // Don't show answers to students
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data: assignments
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single assignment
// @route   GET /api/assignments/:assignmentId
// @access  Private
export const getAssignment = async (req, res, next) => {
  try {
    const { assignmentId } = req.params;

    const assignment = await Assignment.findById(assignmentId);
    if (!assignment) {
      return res.status(404).json({ success: false, message: 'Assignment not found' });
    }

    res.status(200).json({
      success: true,
      data: assignment
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Check assignment eligibility
// @route   GET /api/assignments/:assignmentId/check-eligibility
// @access  Private
export const checkAssignmentEligibility = async (req, res, next) => {
  try {
    const { assignmentId } = req.params;
    const userId = req.user._id;

    const assignment = await Assignment.findById(assignmentId);
    if (!assignment) {
      return res.status(404).json({ success: false, message: 'Assignment not found' });
    }

    // Check student progress in course
    const progress = await Progress.findOne({
      user: userId,
      course: assignment.courseId
    });

    const courseProgress = progress?.overallProgress || 0;

    if (courseProgress < 90) {
      return res.status(200).json({
        success: true,
        canTake: false,
        reason: `Complete 90% of course first (Currently ${courseProgress}%)`,
        progress: courseProgress
      });
    }

    // Check if already submitted
    const submission = await AssignmentSubmission.findOne({
      userId,
      assignmentId
    });

    res.status(200).json({
      success: true,
      canTake: true,
      alreadySubmitted: !!submission,
      score: submission?.percentageScore || null,
      passed: submission?.passed || null,
      certificateId: submission?.certificateId || null
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Submit assignment
// @route   POST /api/assignments/:assignmentId/submit
// @access  Private
export const submitAssignment = async (req, res, next) => {
  try {
    const { assignmentId } = req.params;
    const { answers } = req.body;
    const userId = req.user._id;

    const assignment = await Assignment.findById(assignmentId);
    if (!assignment) {
      return res.status(404).json({ success: false, message: 'Assignment not found' });
    }

    // Calculate score
    let totalPoints = 0;
    let earnedPoints = 0;
    const submittedAnswers = [];

    answers.forEach(answer => {
      const question = assignment.questions.find(q => q._id.toString() === answer.questionId);
      if (!question) return;

      totalPoints += question.points || 1;

      const isCorrect = question.correctAnswer === answer.userAnswer;
      const pointsEarned = isCorrect ? (question.points || 1) : 0;

      if (isCorrect) earnedPoints += pointsEarned;

      submittedAnswers.push({
        questionId: answer.questionId,
        userAnswer: answer.userAnswer,
        isCorrect,
        pointsEarned
      });
    });

    const percentageScore = totalPoints > 0 ? Math.round((earnedPoints / totalPoints) * 100) : 0;
    const passed = percentageScore >= assignment.passingScore;

    // Create submission
    const submission = await AssignmentSubmission.create({
      userId,
      courseId: assignment.courseId,
      assignmentId,
      answers: submittedAnswers,
      totalScore: earnedPoints,
      percentageScore,
      passed,
      status: 'submitted',
      submittedAt: new Date()
    });

    // If passed, generate certificate
    let certificate = null;
    if (passed) {
      const course = await Course.findById(assignment.courseId);
      const user = await User.findById(userId);

      certificate = await Certificate.create({
        userId,
        courseId: assignment.courseId,
        type: 'assignment',
        score: percentageScore,
        courseTitle: course.title,
        userName: user.name,
        certificateUrl: `/certificates/${submission._id}`
      });

      // Link certificate to submission
      await AssignmentSubmission.findByIdAndUpdate(submission._id, {
        certificateId: certificate._id
      });

      // Add certificate to user
      await User.findByIdAndUpdate(userId, {
        $push: { certificates: certificate._id }
      });

      // Send email notification in background
      sendAssignmentResultsEmail(user.email, user.name, {
        courseTitle: course.title,
        score: percentageScore,
        passed: true,
        certificateId: certificate._id
      }).catch(err => {
        console.error('❌ Failed to send assignment results email:', err.message);
      });
    } else {
      // Send email notification for failed assignment
      const course = await Course.findById(assignment.courseId);
      const user = await User.findById(userId);

      sendAssignmentResultsEmail(user.email, user.name, {
        courseTitle: course.title,
        score: percentageScore,
        passed: false,
        passingScore: assignment.passingScore
      }).catch(err => {
        console.error('❌ Failed to send assignment results email:', err.message);
      });
    }

    res.status(200).json({
      success: true,
      message: passed ? 'Assignment passed! Certificate generated.' : 'Assignment submitted. Score below passing.',
      data: {
        submission: {
          score: percentageScore,
          passed,
          totalScore: earnedPoints,
          totalPoints
        },
        certificate: certificate ? { _id: certificate._id } : null
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get assignment submission
// @route   GET /api/assignments/:assignmentId/submission
// @access  Private
export const getSubmission = async (req, res, next) => {
  try {
    const { assignmentId } = req.params;
    const userId = req.user._id;

    const submission = await AssignmentSubmission.findOne({
      userId,
      assignmentId
    }).populate('certificateId');

    if (!submission) {
      return res.status(404).json({ success: false, message: 'No submission found' });
    }

    res.status(200).json({
      success: true,
      data: submission
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update assignment (admin only)
// @route   PUT /api/assignments/:assignmentId
// @access  Private/Admin
export const updateAssignment = async (req, res, next) => {
  try {
    const { assignmentId } = req.params;
    const { title, description, questions, passingScore, timeLimit } = req.body;

    let assignment = await Assignment.findById(assignmentId);
    if (!assignment) {
      return res.status(404).json({ success: false, message: 'Assignment not found' });
    }

    // Calculate total points if questions updated
    if (questions) {
      const totalPoints = questions.reduce((sum, q) => sum + (q.points || 1), 0);
      assignment.totalPoints = totalPoints;
      assignment.totalQuestions = questions.length;
      assignment.questions = questions;
    }

    assignment.title = title || assignment.title;
    assignment.description = description || assignment.description;
    assignment.passingScore = passingScore !== undefined ? passingScore : assignment.passingScore;
    assignment.timeLimit = timeLimit || assignment.timeLimit;

    await assignment.save();

    res.status(200).json({
      success: true,
      message: 'Assignment updated successfully',
      data: assignment
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete assignment (admin only)
// @route   DELETE /api/assignments/:assignmentId
// @access  Private/Admin
export const deleteAssignment = async (req, res, next) => {
  try {
    const { assignmentId } = req.params;

    const assignment = await Assignment.findByIdAndDelete(assignmentId);
    if (!assignment) {
      return res.status(404).json({ success: false, message: 'Assignment not found' });
    }

    // Also delete all submissions for this assignment
    await AssignmentSubmission.deleteMany({ assignmentId });

    res.status(200).json({
      success: true,
      message: 'Assignment deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};

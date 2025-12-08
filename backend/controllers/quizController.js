import Quiz from '../models/Quiz.js';
import Section from '../models/Section.js';
import Course from '../models/Course.js';
import User from '../models/User.js';

// @desc    Create quiz for a section
// @route   POST /api/courses/sections/:id/quiz
// @access  Private/Admin
export const createQuiz = async (req, res) => {
  try {
    const section = await Section.findById(req.params.id);
    
    if (!section) {
      return res.status(404).json({
        success: false,
        message: 'Section not found'
      });
    }

    // Check if quiz already exists for this section
    const existingQuiz = await Quiz.findOne({ sectionId: req.params.id });
    if (existingQuiz) {
      return res.status(400).json({
        success: false,
        message: 'Quiz already exists for this section'
      });
    }

    const quiz = await Quiz.create({
      ...req.body,
      sectionId: req.params.id,
      courseId: section.courseId
    });

    // Update course total quizzes count
    const totalQuizzes = await Quiz.countDocuments({ courseId: section.courseId });
    await Course.findByIdAndUpdate(section.courseId, { totalQuizzes });

    res.status(201).json({
      success: true,
      data: quiz
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get quiz by ID
// @route   GET /api/courses/quiz/:id
// @access  Private
export const getQuiz = async (req, res) => {
  try {
    const quiz = await Quiz.findById(req.params.id);

    if (!quiz) {
      return res.status(404).json({
        success: false,
        message: 'Quiz not found'
      });
    }

    // Check if user is enrolled in the course
    const user = await User.findById(req.user._id);
    const isEnrolled = user.enrolledCourses.some(
      enrollment => enrollment.courseId.toString() === quiz.courseId.toString()
    );

    if (!isEnrolled && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'You must be enrolled in this course to access the quiz'
      });
    }

    res.status(200).json({
      success: true,
      data: quiz
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get quiz for a section
// @route   GET /api/courses/sections/:id/quiz
// @access  Public
export const getSectionQuiz = async (req, res) => {
  try {
    const quiz = await Quiz.findOne({ sectionId: req.params.id });

    if (!quiz) {
      return res.status(404).json({
        success: false,
        message: 'No quiz found for this section'
      });
    }

    res.status(200).json({
      success: true,
      data: quiz
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Update quiz
// @route   PUT /api/courses/quiz/:id
// @access  Private/Admin
export const updateQuiz = async (req, res) => {
  try {
    const quiz = await Quiz.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true
      }
    );

    if (!quiz) {
      return res.status(404).json({
        success: false,
        message: 'Quiz not found'
      });
    }

    res.status(200).json({
      success: true,
      data: quiz
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Delete quiz
// @route   DELETE /api/courses/quiz/:id
// @access  Private/Admin
export const deleteQuiz = async (req, res) => {
  try {
    const quiz = await Quiz.findById(req.params.id);

    if (!quiz) {
      return res.status(404).json({
        success: false,
        message: 'Quiz not found'
      });
    }

    const courseId = quiz.courseId;
    await quiz.deleteOne();

    // Update course total quizzes count
    const totalQuizzes = await Quiz.countDocuments({ courseId });
    await Course.findByIdAndUpdate(courseId, { totalQuizzes });

    res.status(200).json({
      success: true,
      message: 'Quiz deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Submit quiz answers
// @route   POST /api/courses/quiz/:id/submit
// @access  Private
export const submitQuiz = async (req, res) => {
  try {
    const quiz = await Quiz.findById(req.params.id);

    if (!quiz) {
      return res.status(404).json({
        success: false,
        message: 'Quiz not found'
      });
    }

    // Check if user is enrolled
    const user = await User.findById(req.user._id);
    const isEnrolled = user.enrolledCourses.some(
      enrollment => enrollment.courseId.toString() === quiz.courseId.toString()
    );

    if (!isEnrolled) {
      return res.status(403).json({
        success: false,
        message: 'You must be enrolled in this course to submit the quiz'
      });
    }

    const { answers } = req.body; // Array of answer indices

    if (!answers || !Array.isArray(answers)) {
      return res.status(400).json({
        success: false,
        message: 'Please provide answers array'
      });
    }

    // Calculate score
    let correctAnswers = 0;
    const results = quiz.questions.map((question, index) => {
      const userAnswer = answers[index];
      const isCorrect = userAnswer === question.correctAnswer;
      
      if (isCorrect) {
        correctAnswers++;
      }

      return {
        questionIndex: index,
        userAnswer,
        correctAnswer: question.correctAnswer,
        isCorrect,
        explanation: question.explanation
      };
    });

    const score = (correctAnswers / quiz.questions.length) * 100;
    const passed = score >= quiz.passingScore;

    res.status(200).json({
      success: true,
      data: {
        score: Math.round(score),
        passed,
        correctAnswers,
        totalQuestions: quiz.questions.length,
        passingScore: quiz.passingScore,
        results
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get all quizzes for a section
// @route   GET /api/courses/sections/:id/quizzes
// @access  Private
export const getSectionQuizzes = async (req, res) => {
  try {
    const quizzes = await Quiz.find({ sectionId: req.params.id });

    res.status(200).json({
      success: true,
      data: quizzes || []
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};



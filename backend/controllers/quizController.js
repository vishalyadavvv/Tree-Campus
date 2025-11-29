const Quiz = require('../models/Quiz');
const Lesson = require('../models/Lesson');
const Progress = require('../models/Progress');

/**
 * @desc    Create quiz for lesson
 * @route   POST /api/quizzes
 * @access  Private (Instructor/Admin)
 */
const createQuiz = async (req, res, next) => {
  try {
    const { lessonId, title, questions, passingScore, timeLimit } = req.body;

    const lesson = await Lesson.findById(lessonId).populate('course');

    if (!lesson) {
      return res.status(404).json({
        success: false,
        message: 'Lesson not found',
      });
    }

    // Check ownership
    if (lesson.course.instructor.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to create quiz for this lesson',
      });
    }

    const quiz = await Quiz.create({
      lesson: lessonId,
      title,
      questions,
      passingScore,
      timeLimit,
    });

    // Update lesson with quiz reference
    lesson.quiz = quiz._id;
    await lesson.save();

    res.status(201).json({
      success: true,
      message: 'Quiz created successfully',
      data: quiz,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get quiz by lesson ID
 * @route   GET /api/quizzes/lesson/:lessonId
 * @access  Private
 */
const getQuizByLesson = async (req, res, next) => {
  try {
    const quiz = await Quiz.findOne({ lesson: req.params.lessonId });

    if (!quiz) {
      return res.status(404).json({
        success: false,
        message: 'Quiz not found for this lesson',
      });
    }

    res.status(200).json({
      success: true,
      data: quiz,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Update quiz
 * @route   PUT /api/quizzes/:id
 * @access  Private (Instructor/Admin)
 */
const updateQuiz = async (req, res, next) => {
  try {
    const quiz = await Quiz.findById(req.params.id).populate({
      path: 'lesson',
      populate: { path: 'course' },
    });

    if (!quiz) {
      return res.status(404).json({
        success: false,
        message: 'Quiz not found',
      });
    }

    // Check ownership
    if (quiz.lesson.course.instructor.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this quiz',
      });
    }

    const updatedQuiz = await Quiz.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    res.status(200).json({
      success: true,
      message: 'Quiz updated successfully',
      data: updatedQuiz,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Submit quiz answers
 * @route   POST /api/quizzes/:id/submit
 * @access  Private (Student)
 */
const submitQuiz = async (req, res, next) => {
  try {
    const { answers } = req.body; // Array of answer indices

    const quiz = await Quiz.findById(req.params.id).populate('lesson');

    if (!quiz) {
      return res.status(404).json({
        success: false,
        message: 'Quiz not found',
      });
    }

    // Calculate score
    let correctAnswers = 0;
    quiz.questions.forEach((question, index) => {
      if (answers[index] === question.correctAnswer) {
        correctAnswers++;
      }
    });

    const score = Math.round((correctAnswers / quiz.questions.length) * 100);
    const passed = score >= quiz.passingScore;

    // Update progress
    const progress = await Progress.findOne({
      user: req.user._id,
      course: quiz.lesson.course,
    });

    if (progress) {
      // Check if quiz already attempted
      const existingQuizIndex = progress.quizScores.findIndex(
        q => q.quiz.toString() === quiz._id.toString()
      );

      if (existingQuizIndex !== -1) {
        // Update existing score if new score is better
        if (score > progress.quizScores[existingQuizIndex].score) {
          progress.quizScores[existingQuizIndex].score = score;
          progress.quizScores[existingQuizIndex].passed = passed;
          progress.quizScores[existingQuizIndex].attemptedAt = Date.now();
        }
      } else {
        // Add new quiz score
        progress.quizScores.push({
          lesson: quiz.lesson._id,
          quiz: quiz._id,
          score,
          passed,
        });
      }

      await progress.save();
    }

    res.status(200).json({
      success: true,
      message: passed ? 'Quiz passed!' : 'Quiz completed',
      data: {
        score,
        passed,
        correctAnswers,
        totalQuestions: quiz.questions.length,
        passingScore: quiz.passingScore,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Delete quiz
 * @route   DELETE /api/quizzes/:id
 * @access  Private (Instructor/Admin)
 */
const deleteQuiz = async (req, res, next) => {
  try {
    const quiz = await Quiz.findById(req.params.id).populate({
      path: 'lesson',
      populate: { path: 'course' },
    });

    if (!quiz) {
      return res.status(404).json({
        success: false,
        message: 'Quiz not found',
      });
    }

    // Check ownership
    if (quiz.lesson.course.instructor.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this quiz',
      });
    }

    // Remove quiz reference from lesson
    await Lesson.findByIdAndUpdate(quiz.lesson._id, {
      $unset: { quiz: 1 },
    });

    await quiz.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Quiz deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createQuiz,
  getQuizByLesson,
  updateQuiz,
  submitQuiz,
  deleteQuiz,
};

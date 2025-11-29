const ChatHistory = require('../models/ChatHistory');
const Course = require('../models/Course');
const Lesson = require('../models/Lesson');
const { askAI, askAIWithContext } = require('../utils/openai');

/**
 * @desc    Ask AI assistant a question
 * @route   POST /api/ai/ask
 * @access  Private
 */
const askQuestion = async (req, res, next) => {
  try {
    const { question, courseId, lessonId, conversationId } = req.body;

    if (!question) {
      return res.status(400).json({
        success: false,
        message: 'Question is required',
      });
    }

    // Get conversation history if provided
    let conversationHistory = [];
    let chatHistory;

    if (conversationId) {
      chatHistory = await ChatHistory.findById(conversationId);
      if (chatHistory && chatHistory.user.toString() === req.user._id.toString()) {
        conversationHistory = chatHistory.messages.map(msg => ({
          role: msg.role,
          content: msg.content,
        }));
      }
    }

    // Get context if course/lesson provided
    let courseContext = '';
    let lessonContext = '';

    if (courseId) {
      const course = await Course.findById(courseId);
      if (course) {
        courseContext = `${course.title} - ${course.description}`;
      }
    }

    if (lessonId) {
      const lesson = await Lesson.findById(lessonId);
      if (lesson) {
        lessonContext = `${lesson.title} - ${lesson.description}`;
      }
    }

    // Get AI response
    let aiResponse;
    if (courseContext || lessonContext) {
      aiResponse = await askAIWithContext(question, courseContext, lessonContext);
    } else {
      aiResponse = await askAI(question, conversationHistory);
    }

    // Save to chat history
    if (!chatHistory) {
      chatHistory = await ChatHistory.create({
        user: req.user._id,
        course: courseId || null,
        lesson: lessonId || null,
        messages: [],
      });
    }

    chatHistory.messages.push(
      { role: 'user', content: question },
      { role: 'assistant', content: aiResponse }
    );

    await chatHistory.save();

    res.status(200).json({
      success: true,
      data: {
        question,
        answer: aiResponse,
        conversationId: chatHistory._id,
      },
    });
  } catch (error) {
    if (error.message.includes('OpenAI')) {
      return res.status(503).json({
        success: false,
        message: 'AI service temporarily unavailable. Please try again later.',
      });
    }
    next(error);
  }
};

/**
 * @desc    Get chat history
 * @route   GET /api/ai/history
 * @access  Private
 */
const getChatHistory = async (req, res, next) => {
  try {
    const { page = 1, limit = 10 } = req.query;

    const chatHistories = await ChatHistory.find({ user: req.user._id })
      .populate('course', 'title')
      .populate('lesson', 'title')
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    const total = await ChatHistory.countDocuments({ user: req.user._id });

    res.status(200).json({
      success: true,
      data: {
        conversations: chatHistories,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total,
          pages: Math.ceil(total / limit),
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get specific conversation
 * @route   GET /api/ai/conversation/:id
 * @access  Private
 */
const getConversation = async (req, res, next) => {
  try {
    const conversation = await ChatHistory.findById(req.params.id)
      .populate('course', 'title')
      .populate('lesson', 'title');

    if (!conversation) {
      return res.status(404).json({
        success: false,
        message: 'Conversation not found',
      });
    }

    // Check ownership
    if (conversation.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to view this conversation',
      });
    }

    res.status(200).json({
      success: true,
      data: conversation,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Delete conversation
 * @route   DELETE /api/ai/conversation/:id
 * @access  Private
 */
const deleteConversation = async (req, res, next) => {
  try {
    const conversation = await ChatHistory.findById(req.params.id);

    if (!conversation) {
      return res.status(404).json({
        success: false,
        message: 'Conversation not found',
      });
    }

    // Check ownership
    if (conversation.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this conversation',
      });
    }

    await conversation.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Conversation deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  askQuestion,
  getChatHistory,
  getConversation,
  deleteConversation,
};

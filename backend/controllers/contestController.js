import ContestExam from '../models/ContestExam.js';
import ContestCoupon from '../models/ContestCoupon.js';
import User from '../models/User.js';
import { sendEmail } from '../utils/sendEmail.js';

// @desc    Get all exams (for student dashboard)
// @route   GET /api/contest/exams
// @access  Private (Student)
export const getAllExams = async (req, res) => {
  try {
    const exams = await ContestExam.find().sort({ startDate: -1 });
    res.json(exams);
  } catch (error) {
    console.error('Error fetching exams:', error);
    res.status(500).json({ message: 'Failed to fetch exams' });
  }
};

// @desc    Get single exam by ID
// @route   GET /api/contest/exams/:id
// @access  Private
export const getExamById = async (req, res) => {
  try {
    const exam = await ContestExam.findById(req.params.id);
    if (!exam) {
      return res.status(404).json({ message: 'Exam not found' });
    }
    res.json(exam);
  } catch (error) {
    console.error('Error fetching exam:', error);
    res.status(500).json({ message: 'Failed to fetch exam' });
  }
};

// @desc    Submit exam
// @route   POST /api/contest/exams/:id/submit
// @access  Private
export const submitExam = async (req, res) => {
  const { id } = req.params;
  const { answers } = req.body; // Expecting { answers: [...] }
  const userId = req.user._id;

  try {
    if (!answers) {
      return res.status(400).json({ message: 'Answers are required' });
    }

    const exam = await ContestExam.findById(id);
    if (!exam) {
      return res.status(404).json({ message: 'Exam not found' });
    }

    // Check if already submitted
    const hasSubmitted = exam.studentResponses.some(
      (response) => response.userId && response.userId.toString() === userId.toString()
    );

    if (hasSubmitted) {
      return res.status(400).json({ message: 'You have already submitted this exam' });
    }

    // Fetch user details for the record
    const user = await User.findById(userId);
    if (!user) {
        return res.status(404).json({ message: 'User not found' });
    }

    if (!Array.isArray(answers) || answers.length !== exam.questions.length) {
       // In case of incomplete answers, we can either reject or fill missing with ""
       // The original code rejected it.
       return res.status(400).json({ message: 'Invalid answer data' });
    }

    // Calculate score
    let score = 0;
    exam.questions.forEach((question, index) => {
      // Question answer is the INDEX of the correct option
      const correctOptionIndex = question.answer; 
      
      // Support both array and object format for answers
      const userAnswerIndex = Array.isArray(answers) ? answers[index] : answers[index];
      
      if (userAnswerIndex !== null && userAnswerIndex !== undefined && Number(userAnswerIndex) === Number(correctOptionIndex)) {
        score += 1;
      }
    });

    // Create response object
    const newResponse = {
      userId: userId,
      name: user.name,
      email: user.email,
      phone_number: user.phone || 0, // Fallback
      answers,
      score,
      submittedAt: new Date()
    };

    exam.studentResponses.push(newResponse);
    await exam.save();

    // Calculate if passed
    const passingPercentage = exam.passingPercentage || 40;
    const scorePercentage = (score / exam.questions.length) * 100;
    const passed = scorePercentage >= passingPercentage && score > 0;

    res.json({ 
        success: true,
        score, 
        totalQuestions: exam.questions.length,
        passed,
        passingPercentage,
        response: newResponse
    });

  } catch (error) {
    console.error('Error submitting exam:', error);
    res.status(500).json({ message: 'Server error during submission', error: error.message });
  }
};

// @desc    Get leaderboard for an exam
// @route   GET /api/contest/leaderboard/:id
// @access  Private
export const getLeaderboard = async (req, res) => {
  try {
    const exam = await ContestExam.findById(req.params.id);
    if (!exam) {
      return res.status(404).json({ message: 'Exam not found' });
    }
    
    // Sort winners if they exist. Winners are populated by processExpiredExams
    const winners = exam.winners || [];
    res.json({ winners });
  } catch (error) {
    console.error('Error fetching leaderboard:', error);
    res.status(500).json({ message: 'Failed to fetch leaderboard' });
  }
};

// Helper to generate unique coupon code
const generateUniqueCode = async () => {
  let code;
  let exists = true;
  while (exists) {
    code = Math.random().toString(36).substring(2, 10).toUpperCase();
    const existing = await ContestCoupon.findOne({ code });
    if (!existing) exists = false;
  }
  return code;
};

// @desc    Claim reward after game completion
// @route   POST /api/contest/game-reward
// @access  Private
export const claimGameReward = async (req, res) => {
  try {
    const userId = req.user._id;
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Generate unique code
    const couponCode = await generateUniqueCode();

    // Save to database
    await ContestCoupon.create({
      code: couponCode,
      used: false
    });

    // Send email to user
    try {
      await sendEmail(
        user.email,
        user.name,
        "Congratulations! You've won a Tree Campus Reward",
        "coupon",
        { coupon: couponCode }
      );
    } catch (emailError) {
      console.error('Failed to send reward email:', emailError);
      // We don't fail the whole request if email fails, as long as coupon is generated
    }

    res.status(201).json({
      success: true,
      message: 'Reward claimed successfully! Check your email for details.',
      coupon: couponCode
    });

  } catch (error) {
    console.error('Error claiming game reward:', error);
    res.status(500).json({ message: 'Failed to claim reward', error: error.message });
  }
};

// @desc    Validate a coupon (Public API for partners)
// @route   GET /api/contest/public/validate/:couponCode
// @access  Public (Requires Partner Key)
export const getCouponStatus = async (req, res) => {
  try {
    const { couponCode } = req.params;
    const partnerKey = req.headers['x-partner-key'];

    // Secure Partner Key check
    if (partnerKey !== (process.env.PARTNER_API_KEY || 'TreeCampus_Partner_2025_Secure')) {
      return res.status(401).json({ success: false, message: 'Invalid Partner API Key' });
    }

    const coupon = await ContestCoupon.findOne({ code: couponCode.toUpperCase() });

    if (!coupon) {
      return res.status(404).json({ success: false, message: 'Invalid coupon code' });
    }

    res.json({
      success: true,
      valid: !coupon.used,
      status: coupon.used ? 'used' : 'active',
      createdAt: coupon.createdAt
    });

  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error during validation' });
  }
};

// @desc    Redeem a coupon (Public API for partners)
// @route   POST /api/contest/public/redeem/:couponCode
// @access  Public (Requires Partner Key)
export const redeemCoupon = async (req, res) => {
  try {
    const { couponCode } = req.params;
    const partnerKey = req.headers['x-partner-key'];

    if (partnerKey !== (process.env.PARTNER_API_KEY || 'TreeCampus_Partner_2025_Secure')) {
      return res.status(401).json({ success: false, message: 'Invalid Partner API Key' });
    }

    const coupon = await ContestCoupon.findOne({ code: couponCode.toUpperCase() });

    if (!coupon) {
      return res.status(404).json({ success: false, message: 'Invalid coupon code' });
    }

    if (coupon.used) {
      return res.status(400).json({ success: false, message: 'Coupon already redeemed' });
    }

    coupon.used = true;
    await coupon.save();

    res.json({
      success: true,
      message: 'Coupon redeemed successfully'
    });

  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error during redemption' });
  }
};

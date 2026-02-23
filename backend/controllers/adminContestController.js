import ContestExam from '../models/ContestExam.js';
import ContestCoupon from '../models/ContestCoupon.js';
import { v4 as uuidv4 } from 'uuid';

// @desc    Create a new exam
// @route   POST /api/admin/contest/exams
// @access  Private (Admin)
export const createExam = async (req, res) => {
  try {
    const exam = new ContestExam(req.body);
    const savedExam = await exam.save();
    res.status(201).json(savedExam);
  } catch (error) {
    res.status(400).json({ message: 'Failed to create exam', error: error.message });
  }
};

// @desc    Update an exam
// @route   PUT /api/admin/contest/exams/:id
// @access  Private (Admin)
export const updateExam = async (req, res) => {
  try {
    const updatedExam = await ContestExam.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updatedExam) {
      return res.status(404).json({ message: 'Exam not found' });
    }
    res.json(updatedExam);
  } catch (error) {
    res.status(400).json({ message: 'Failed to update exam', error: error.message });
  }
};

// @desc    Delete an exam
// @route   DELETE /api/admin/contest/exams/:id
// @access  Private (Admin)
export const deleteExam = async (req, res) => {
  try {
    const deletedExam = await ContestExam.findByIdAndDelete(req.params.id);
    if (!deletedExam) {
      return res.status(404).json({ message: 'Exam not found' });
    }
    res.json({ message: 'Exam deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete exam', error: error.message });
  }
};

// @desc    Get all exams (Admin view)
// @route   GET /api/admin/contest/exams
// @access  Private (Admin)
export const getAdminExams = async (req, res) => {
    try {
        const exams = await ContestExam.find().sort({ createdAt: -1 });
        res.json(exams);
    } catch (error) {
        res.status(500).json({ message: 'Failed to fetch exams' });
    }
};


// @desc    Declare winners
// @route   POST /api/admin/contest/exams/:id/declare-winners
// @access  Private (Admin)
export const declareWinners = async (req, res) => {
    // Basic placeholder for logic - needs complex logic from original if used
    res.status(501).json({ message: 'Not implemented yet' });
};

// Start Coupon Logic
const generateUniqueCode = async () => {
    let code;
    let exists = true;
    while (exists) {
        // Format: TC-XXXXXXX
        code = `TC-${uuidv4().replace(/-/g, '').substring(0, 7).toUpperCase()}`;
        const existing = await ContestCoupon.findOne({ code });
        if (!existing) exists = false;
    }
    return code;
};

export const generateCoupons = async (req, res) => {
    try {
        const { count } = req.body;
        const numCoupons = parseInt(count) || 1;
        const coupons = [];

        for (let i = 0; i < numCoupons; i++) {
            const code = await generateUniqueCode();
             coupons.push({ code });
        }

        await ContestCoupon.insertMany(coupons);
        res.status(201).json({ success: true, message: `${numCoupons} coupons generated successfully. Format: TC-XXXXXXX` });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export const bulkUploadCoupons = async (req, res) => {
    try {
        const { coupons } = req.body; // Array of { code }
        if (!coupons || !Array.isArray(coupons)) {
            return res.status(400).json({ success: false, message: 'Invalid coupons data' });
        }

        const stats = {
            added: 0,
            skipped: 0
        };

        for (const item of coupons) {
            const { code } = item;
            if (!code) {
                stats.skipped++;
                continue;
            }

            // Check if code already exists
            const existing = await ContestCoupon.findOne({ code });
            if (existing) {
                stats.skipped++;
                continue;
            }

            // Create coupon
            await ContestCoupon.create({ code });
            stats.added++;
        }

        res.status(200).json({ 
            success: true, 
            message: `Bulk upload complete. Added: ${stats.added}, Skipped/Duplicates: ${stats.skipped}`,
            stats
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

import { sendEmail } from '../utils/sendEmail.js';

export const processExpiredExams = async (req, res) => {
    try {
        const today = new Date();
        // Find exams that have ended but status is still active (or we just check date)
        // Adjust query as per requirement. Here we look for active exams past end date.
        const expiredExams = await ContestExam.find({
            endDate: { $lt: today },
            status: { $ne: 'results_declared' } // Avoid reprocessing
        });

        let emailsSent = [];
        let examsProcessed = 0;

        for (const exam of expiredExams) {
            // Logic to determine winners
            // 1. Sort responses by score (desc)
            // 2. Take top N (winner_numbers)
            // 3. For each winner: generate coupon, send email, save to exam.winners

            if (!exam.studentResponses || exam.studentResponses.length === 0) {
                exam.status = 'results_declared';
                await exam.save();
                continue;
            }

            // Sort responses: highest score first. Tie-breaking? (Assumed first submitted? or random? Simple sort for now)
            const sortedResponses = [...exam.studentResponses].sort((a, b) => b.score - a.score);
            const numWinners = exam.winner_numbers || 1;
            const winnersToProcess = sortedResponses.slice(0, numWinners);

            const winnersData = [];

            for (let i = 0; i < winnersToProcess.length; i++) {
                const winner = winnersToProcess[i];
                const rank = i + 1;

                // Generate Coupon
                const couponCode = await generateUniqueCode();
                await ContestCoupon.create({ code: couponCode }); // Save distinct coupon

                // Send Email
                await sendEmail(winner.email, winner.name, "Congratulations! You Won a Coupon", "coupon", { coupon: couponCode });
                emailsSent.push(winner.email);

                // Add to Winners
                winnersData.push({
                    userId: winner.userId,
                    code: couponCode,
                    email: winner.email,
                    rank: rank,
                    name: winner.name,
                    phone_number: winner.phone_number,
                    score: winner.score
                });
            }

            exam.winners = winnersData;
            exam.status = 'results_declared';
            await exam.save();
            examsProcessed++;
        }

        res.status(200).json({ 
            success: true, 
            message: `Processed ${examsProcessed} exams`, 
            emails: emailsSent, 
            counts: examsProcessed 
        });

    } catch (error) {
        console.error("Error processing expired exams:", error);
        res.status(500).json({ success: false, message: error.message });
    }
};

export const getCoupons = async (req, res) => {
    try {
        const coupons = await ContestCoupon.find().sort({ createdAt: -1 });
        res.json({ success: true, coupons });
    } catch (error) {
         res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Toggle coupon status (used/unused)
// @route   PUT /api/admin/contest/coupons/:id/toggle
// @access  Private (Admin)
export const toggleCouponStatus = async (req, res) => {
    try {
        const coupon = await ContestCoupon.findById(req.params.id);
        if (!coupon) {
            return res.status(404).json({ success: false, message: 'Coupon not found' });
        }

        coupon.used = !coupon.used;
        if (coupon.used) {
            coupon.redeemedAt = new Date();
        } else {
            coupon.redeemedAt = undefined;
        }
        
        await coupon.save();
        res.json({ success: true, coupon });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Delete a coupon
// @route   DELETE /api/admin/contest/coupons/:id
// @access  Private (Admin)
export const deleteCoupon = async (req, res) => {
    try {
        const coupon = await ContestCoupon.findByIdAndDelete(req.params.id);
        if (!coupon) {
            return res.status(404).json({ success: false, message: 'Coupon not found' });
        }
        res.json({ success: true, message: 'Coupon deleted successfully' });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

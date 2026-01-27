import mongoose from 'mongoose';

const contestCouponSchema = new mongoose.Schema({
    code: { type: String, unique: true, required: true },
    used: { type: Boolean, default: false },
    createdAt: { type: Date, default: Date.now }
});

const ContestCoupon = mongoose.model('ContestCoupon', contestCouponSchema);

export default ContestCoupon;

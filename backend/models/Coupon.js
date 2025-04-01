import mongoose from 'mongoose';

const couponSchema = new mongoose.Schema({
  code: { 
    type: String, 
    required: true, 
    unique: true,
    trim: true,
    uppercase: true // Store as uppercase
  },
  isActive: { type: Boolean, default: true },
  claimedBy: { type: String, default: null }, // IP or user ID
  claimedAt: { type: Date, default: null }
});

export default mongoose.model('Coupon', couponSchema);
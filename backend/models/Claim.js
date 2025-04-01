// models/claim.js
import mongoose from 'mongoose';

const claimSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
    index: true
  },
  couponCode: {
    type: String,
    required: true,
    index: true
  },
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending',
    index: true
  },
  timestamp: {
    type: Date,
    default: Date.now,
    index: true
  },
  ipAddress: {
    type: String
  },
  deviceInfo: {
    type: String
  },
  email: {
    type: String
  },
  notes: {
    type: String
  }
});

// Add indexes for common queries
claimSchema.index({ timestamp: -1 });
claimSchema.index({ couponCode: 1, userId: 1 }, { unique: true });

const Claim = mongoose.model('Claim', claimSchema);

export default Claim;
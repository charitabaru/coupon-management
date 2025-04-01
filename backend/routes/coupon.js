import express from 'express';
import Coupon from '../models/Coupon.js'

const router = express.Router();

// Round-robin coupon claim
router.post('/claim', async (req, res) => {
  const { ip } = req.body;
  
  try {
    const availableCoupon = await Coupon.findOne({ 
      isActive: true, 
      claimedBy: null 
    }).sort({ _id: 1 });

    if (!availableCoupon) {
      return res.status(404).json({ error: 'No coupons left' });
    }

    availableCoupon.claimedBy = ip;
    availableCoupon.claimedAt = new Date();
    await availableCoupon.save();

    res.json({ 
      code: availableCoupon.code,
      expiry: "24h" 
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;

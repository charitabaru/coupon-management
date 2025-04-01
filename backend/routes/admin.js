import express from 'express';
import jwt from 'jsonwebtoken';
import Coupon from '../models/coupon.js';
import Claim from '../models/Claim.js';

const router = express.Router();

// Admin login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (email === process.env.ADMIN_EMAIL && password === process.env.ADMIN_PASSWORD) {
      const token = jwt.sign({ role: 'admin' }, process.env.JWT_SECRET, { expiresIn: '1h' });
      res.json({ token });
    } else {
      res.status(401).json({ error: 'Invalid credentials' });
    }
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Middleware to verify admin token
const verifyAdmin = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  
  if (!token) {
    return res.status(401).json({ error: 'Authorization token required' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (decoded.role !== 'admin') {
      throw new Error('Invalid admin privileges');
    }
    next();
  } catch (err) {
    res.status(403).json({ error: 'Invalid or expired token' });
  }
};

// Apply admin verification to all routes below
router.use(verifyAdmin);

// Get all coupons
router.get('/coupons', async (req, res) => {
  try {
    const coupons = await Coupon.find().sort({ createdAt: -1 });
    res.json(coupons);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Add new coupon
router.post('/coupons', async (req, res) => {
  try {
    // Extra validation for request body
    if (!req.body || typeof req.body !== 'object') {
      return res.status(400).json({ error: "Request body must be JSON" });
    }

    const { code } = req.body;
    
    if (!code || typeof code !== 'string') {
      return res.status(400).json({ 
        error: "Valid 'code' string is required in request body" 
      });
    }

    const formattedCode = code.trim().toUpperCase();
    const newCoupon = new Coupon({ 
      code: formattedCode,
      isActive: true 
    });

    await newCoupon.save();

    res.status(201).json({
      message: "Coupon added successfully",
      coupon: {
        id: newCoupon._id,
        code: newCoupon.code,
        isActive: newCoupon.isActive,
        createdAt: newCoupon.createdAt
      }
    });
  } catch (err) {
    if (err.code === 11000) {
      res.status(409).json({ error: "Coupon code already exists" });
    } else {
      console.error('Coupon creation error:', err);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
});


// Logout route
router.post('/logout', (req, res) => {
  // In a real app, you'd invalidate the JWT token
  res.json({ message: "Logged out successfully" });
});

//claim history
router.get('/claims', async (req, res) => {
  try {
    const { page = 1, limit = 50 } = req.query;
    const skip = (page - 1) * limit;
    
    const claims = await Claim.find()
      .sort({ timestamp: -1 })
      .skip(skip)
      .limit(parseInt(limit))
      .lean();

    res.json(claims);
  } catch (err) {
    // error handling
    res.status(500).json({ error: err.message });
  }
});

// Claims stats
router.get('/claims/stats', async (req, res) => {
  try {
    const totalClaims = await Claim.countDocuments();
    const todayClaims = await Claim.countDocuments({
      timestamp: { $gte: new Date().setHours(0, 0, 0, 0) }
    });
    res.json({ totalClaims, todayClaims });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Settings routes
router.put('/settings', async (req, res) => {
  try {
    // Save settings to DB or config file
    res.json({ message: "Settings updated" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/settings', (req, res) => {
  // Return current settings
  res.json({ cooldownHours: 24, useCookieTracking: true });
});

export default router;
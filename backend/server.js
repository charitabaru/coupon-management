import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import couponRoutes from './routes/coupon.js';
import adminRoutes from './routes/admin.js';

dotenv.config();
const app = express();

app.get('/api/health', (req, res) => {
  res.send('Backend is healthy');
});

// Middleware
const corsOptions = {
  origin: process.env.FRONTEND || 'http://localhost:8080', // Your frontend URL
  credentials: true,
  optionsSuccessStatus: 200
};
app.use(cors(corsOptions));
app.use(express.json());

// Database
connectDB();

// Routes
app.use('/api', couponRoutes);
app.use('/api/admin', adminRoutes);

// Start server
const PORT = process.env.PORT || 3000;

const server = app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
  
  export { app, server }; // Explicit named exports
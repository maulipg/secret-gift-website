import express from 'express';
import dotenv from 'dotenv';
import corsMiddleware from './middleware/cors.js';
import errorHandler from './middleware/errorHandler.js';
import paymentRoutes from './routes/payment.js';

// Load environment variables
dotenv.config();

const app = express();

// Middleware
app.use(corsMiddleware);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Root endpoint - Server info
app.get('/', (req, res) => {
  res.json({
    status: 'success',
    message: '🚀 Secret Gift Backend Server is running!',
    version: '1.0.0',
    endpoints: {
      createOrder: 'POST /api/create-order',
      verifyPayment: 'POST /api/verify-payment',
      health: 'GET /api/health'
    },
    timestamp: new Date().toISOString()
  });
});

// API Routes
app.use('/api', paymentRoutes);

// 404 Handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found',
    path: req.path
  });
});

// Error Handler
app.use(errorHandler);

// Start Server
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📍 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🔑 Razorpay configured: ${!!(process.env.VITE_RAZORPAY_KEY_ID && process.env.RAZORPAY_KEY_SECRET)}`);
});

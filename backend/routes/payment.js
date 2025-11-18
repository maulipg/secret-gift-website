import express from 'express';
import razorpay from '../config/razorpay.js';
import crypto from 'crypto';

const router = express.Router();

// Create Order
router.post('/create-order', async (req, res) => {
  try {
    const { amount, currency = 'INR' } = req.body;

    const options = {
      amount: amount * 100, // Amount in paise
      currency,
      receipt: `receipt_${Date.now()}`,
      notes: {
        campaign: 'Secret Gift 31st December',
      },
    };

    const order = await razorpay.orders.create(options);
    res.json({
      success: true,
      order,
      key_id: process.env.VITE_RAZORPAY_KEY_ID,
    });
  } catch (error) {
    console.error('Order creation error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create order',
      error: error.message,
    });
  }
});

// Verify Payment
router.post('/verify-payment', async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

    const sign = razorpay_order_id + '|' + razorpay_payment_id;
    const expectedSign = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(sign.toString())
      .digest('hex');

    if (razorpay_signature === expectedSign) {
      res.json({
        success: true,
        message: 'Payment verified successfully',
      });
    } else {
      res.status(400).json({
        success: false,
        message: 'Invalid signature',
      });
    }
  } catch (error) {
    console.error('Payment verification error:', error);
    res.status(500).json({
      success: false,
      message: 'Payment verification failed',
      error: error.message,
    });
  }
});

// Health check endpoint
router.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    message: 'Payment service is operational',
    razorpay: {
      configured: !!(process.env.VITE_RAZORPAY_KEY_ID && process.env.RAZORPAY_KEY_SECRET),
      keyId: process.env.VITE_RAZORPAY_KEY_ID ? 'Set ✓' : 'Missing ✗',
      keySecret: process.env.RAZORPAY_KEY_SECRET ? 'Set ✓' : 'Missing ✗'
    },
    timestamp: new Date().toISOString()
  });
});

export default router;

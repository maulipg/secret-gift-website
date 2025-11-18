# Backend Server

Secret Gift India - Backend API for payment processing

## Structure

```
backend/
├── server.js              # Main server entry point
├── config/
│   └── razorpay.js       # Razorpay configuration
├── routes/
│   └── payment.js        # Payment routes (create-order, verify-payment)
├── middleware/
│   ├── cors.js           # CORS configuration
│   └── errorHandler.js   # Global error handler
```

## Environment Variables

```env
VITE_RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_secret
PORT=3001
NODE_ENV=production
```

## Run Locally

```bash
# From project root
npm run server

# Or from backend folder
cd backend
node server.js
```

## Deployment

Update `package.json` start command:
```json
"start": "node backend/server.js"
```

For Render.com:
- Build Command: `npm install`
- Start Command: `node backend/server.js`

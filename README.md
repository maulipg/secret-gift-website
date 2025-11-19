# 🎁 Secret Gift India

Send anonymous gifts to brighten someone's day this New Year's Eve!

## 🚀 Live Website
**https://secretgiftindia.shop**

## 📦 Project Structure

```
secret gift/
├── src/                    # React frontend source
│   ├── App.jsx            # Main application component
│   ├── main.jsx           # React entry point
│   └── index.css          # Global styles
├── backend/                # Express.js backend
│   ├── server.js          # Server entry point
│   ├── config/            # Configuration modules
│   │   └── razorpay.js    # Razorpay payment setup
│   ├── routes/            # API routes
│   │   └── payment.js     # Payment endpoints
│   └── middleware/        # Express middleware
│       ├── cors.js        # CORS configuration
│       └── errorHandler.js # Error handling
├── public/                 # Static assets
│   └── logo.svg           # Secret Gift logo
└── .env                   # Environment variables (not in repo)
```

## 🛠️ Tech Stack

- **Frontend**: React 19 + Vite + Tailwind CSS
- **Backend**: Express.js + Node.js
- **Payment**: Razorpay Integration
- **Deployment**: 
  - Frontend: secretgiftindia.shop
  - Backend: Render (webpage-et86.onrender.com)

## 🔧 Local Development

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Setup environment variables** (create `.env` file):
   ```
   VITE_RAZORPAY_KEY_ID=your_razorpay_key
   RAZORPAY_KEY_SECRET=your_razorpay_secret
   VITE_API_URL=http://localhost:3001
   ```

3. **Run frontend** (port 5173):
   ```bash
   npm run dev
   ```

4. **Run backend** (port 3001):
   ```bash
   cd backend
   node server.js
   ```

## 📝 API Endpoints

- `POST /api/create-order` - Create Razorpay order
- `POST /api/verify-payment` - Verify payment signature
- `GET /api/health` - Health check

## 🌟 Features

- Anonymous gift sending
- Secure Razorpay payment integration
- Responsive design
- Real-time order tracking
- Customer testimonials

## 📧 Contact

- Email: secretgiftindia@gmail.com
- Instagram: @secretgiftindia
- YouTube: Secret Gift India

---

Made with ❤️ for spreading joy this New Year's Eve

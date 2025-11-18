# Secret Gift India - Secure Payment Integration

## 🔐 Security Setup Complete

Your Razorpay live keys are now securely configured:
- ✅ Keys stored in `.env` file (not committed to Git)
- ✅ `.env` added to `.gitignore`
- ✅ Backend server created for secure order creation
- ✅ Payment verification implemented

## 🚀 How to Run

### Development (Local)

1. **Install dependencies:**
   ```powershell
   npm install
   ```

2. **Run both frontend and backend:**
   ```powershell
   npm run dev:full
   ```
   
   Or run them separately:
   ```powershell
   # Terminal 1 - Frontend
   npm run dev
   
   # Terminal 2 - Backend
   npm run server
   ```

3. **Access the app:**
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:3001

### Production Deployment

#### Netlify (Frontend)
1. Go to Netlify Dashboard → Your Site → Site Settings → Environment Variables
2. Add these variables:
   ```
   VITE_RAZORPAY_KEY_ID = rzp_live_RhAYcnEBLNOR0V
   VITE_API_URL = <your-backend-url>
   ```
3. Deploy: `npm run build`

#### Backend Deployment Options

**Option 1: Render.com (Recommended - Free)**
1. Create account on render.com
2. Create new Web Service
3. Connect your GitHub repo
4. Set these environment variables:
   ```
   VITE_RAZORPAY_KEY_ID = rzp_live_RhAYcnEBLNOR0V
   RAZORPAY_KEY_SECRET = xbHQRhnfPFQ2O9TQaE1250QT
   ```
4. Build Command: `npm install`
5. Start Command: `node server.js`

**Option 2: Railway.app**
1. Create account on railway.app
2. New Project → Deploy from GitHub
3. Add environment variables (same as above)

**Option 3: Heroku**
1. Create Heroku app
2. Add Procfile: `web: node server.js`
3. Set config vars with your keys

## 📁 Project Structure

```
secret gift/
├── .env                    # Your secret keys (NOT in Git)
├── .env.example           # Template for environment variables
├── server.js              # Backend API for Razorpay
├── src/
│   └── App.jsx            # Frontend with secure payment integration
└── netlify.toml           # Netlify deployment config
```

## 🔑 Environment Variables

### `.env` file (Local Development)
```
VITE_RAZORPAY_KEY_ID=rzp_live_RhAYcnEBLNOR0V
RAZORPAY_KEY_SECRET=xbHQRhnfPFQ2O9TQaE1250QT
```

### Netlify Dashboard (Frontend)
```
VITE_RAZORPAY_KEY_ID=rzp_live_RhAYcnEBLNOR0V
VITE_API_URL=https://your-backend.herokuapp.com
```

### Backend Hosting (Render/Railway/Heroku)
```
VITE_RAZORPAY_KEY_ID=rzp_live_RhAYcnEBLNOR0V
RAZORPAY_KEY_SECRET=xbHQRhnfPFQ2O9TQaE1250QT
PORT=3001
```

## ✅ Security Checklist

- [x] Secret key never exposed in frontend code
- [x] Keys stored in `.env` file
- [x] `.env` file added to `.gitignore`
- [x] Order creation handled by backend
- [x] Payment verification on backend
- [x] CORS configured for security
- [ ] Deploy backend to secure hosting
- [ ] Add environment variables to Netlify
- [ ] Update VITE_API_URL with production backend URL

## 🎯 Next Steps

1. **Install new dependencies:**
   ```powershell
   npm install
   ```

2. **Test locally:**
   ```powershell
   npm run dev:full
   ```

3. **Deploy backend** to Render.com or Railway.app

4. **Update Netlify** with environment variables

5. **Test payment** with live keys

## ⚠️ Important Notes

- **NEVER commit `.env` file** to Git
- **NEVER share your secret key** publicly
- **Always verify payments** on the backend
- The secret key should **ONLY** be used in the backend server
- Only the public key (key_id) should be used in the frontend

## 💳 Payment Flow

1. User clicks "Book Now"
2. Frontend calls `/api/create-order` on your backend
3. Backend creates Razorpay order using secret key
4. Backend returns order_id and public key_id to frontend
5. Frontend opens Razorpay checkout with order_id
6. User completes payment
7. Frontend sends payment details to `/api/verify-payment`
8. Backend verifies payment signature
9. Success! Show confirmation to user

## 🆘 Support

If you encounter any issues:
1. Check that all environment variables are set correctly
2. Ensure backend server is running
3. Check browser console for errors
4. Verify Razorpay dashboard for test payments

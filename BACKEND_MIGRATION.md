# Backend Structure - Migration Guide

## ✅ What Changed

The backend code has been reorganized into a proper folder structure for better maintainability.

### Old Structure:
```
secret gift/
├── server.js (everything in one file)
├── package.json
└── ...
```

### New Structure:
```
secret gift/
├── backend/
│   ├── server.js              # Main server entry point
│   ├── config/
│   │   └── razorpay.js       # Razorpay configuration
│   ├── routes/
│   │   └── payment.js        # Payment routes
│   ├── middleware/
│   │   ├── cors.js           # CORS configuration
│   │   └── errorHandler.js   # Error handling
│   └── README.md             # Backend documentation
├── src/                       # Frontend code
├── package.json
└── ...
```

## 🚀 Updated Commands

### Local Development
```bash
# Run backend only
npm run server

# Run frontend + backend
npm run dev:full

# Run frontend only
npm run dev
```

## 📦 Deployment Changes

### Render.com
The `render.yaml` has been updated automatically. When you push to GitHub, Render will use:
- **Start Command:** `node backend/server.js`

### Manual Deployment
If deploying manually, update these settings in Render dashboard:
1. Go to your service settings
2. Update **Start Command** to: `node backend/server.js`
3. Save and redeploy

## 🔧 Benefits of New Structure

1. **Organized Code:** Routes, config, and middleware are separated
2. **Scalability:** Easy to add new routes or middleware
3. **Maintainability:** Clear separation of concerns
4. **Professional:** Industry-standard folder structure
5. **Team-Ready:** Easy for multiple developers to work on

## 📝 Files Explanation

- `backend/server.js` - Express app setup and initialization
- `backend/config/razorpay.js` - Razorpay client configuration
- `backend/routes/payment.js` - All payment-related endpoints
- `backend/middleware/cors.js` - CORS policy configuration
- `backend/middleware/errorHandler.js` - Global error handling

## ⚠️ Important Notes

- The old `server.js` in the root is now **replaced** by `backend/server.js`
- All environment variables remain the same
- API endpoints remain unchanged
- Frontend code doesn't need any changes

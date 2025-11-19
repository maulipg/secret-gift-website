# 🚨 Backend 500 Error - Environment Variables Missing

## Problem
Your backend is deployed but returning 500 Internal Server Error because Razorpay keys are not configured.

## ✅ Solution - Add Environment Variables to Render

### Step 1: Go to Render Dashboard
1. Visit: https://dashboard.render.com
2. Click on your service: **webpage-et86**
3. Click **"Environment"** tab on the left sidebar

### Step 2: Add These Environment Variables

Click **"Add Environment Variable"** and add these **THREE** variables:

```
Key: VITE_RAZORPAY_KEY_ID
Value: rzp_live_RhAYcnEBLNOR0V

Key: RAZORPAY_KEY_SECRET
Value: xbHQRhnfPFQ2O9TQaE1250QT

Key: NODE_ENV
Value: production
```

### Step 3: Save and Redeploy
1. Click **"Save Changes"**
2. Render will automatically redeploy (wait 2-3 minutes)
3. Check logs: Click **"Logs"** tab to see if server starts successfully

### Step 4: Verify Backend is Working

After redeployment, test these URLs in your browser:

1. **Health Check:**
   - https://webpage-et86.onrender.com/api/health
   - Should show: `"status": "healthy"` and keys configured

2. **Root Endpoint:**
   - https://webpage-et86.onrender.com/
   - Should show: Server info and available endpoints

## 🔍 Expected Logs

After adding environment variables, you should see in Render logs:
```
🚀 Server running on port 10000
📍 Environment: production
🔑 Razorpay configured: true
```

## ⚠️ Current Issue

The error occurs because:
1. `process.env.VITE_RAZORPAY_KEY_ID` is `undefined`
2. `process.env.RAZORPAY_KEY_SECRET` is `undefined`
3. Razorpay initialization fails
4. Order creation fails with 500 error

## 📋 Quick Checklist

- [ ] Added `VITE_RAZORPAY_KEY_ID` to Render
- [ ] Added `RAZORPAY_KEY_SECRET` to Render
- [ ] Added `NODE_ENV=production` to Render
- [ ] Clicked "Save Changes"
- [ ] Waited for redeployment (2-3 minutes)
- [ ] Tested `/api/health` endpoint
- [ ] Confirmed keys are configured in health check response

## 🎯 After Fixing

Once environment variables are set, your payment flow will work:
1. Frontend calls: `https://webpage-et86.onrender.com/api/create-order`
2. Backend creates Razorpay order
3. Frontend opens Razorpay checkout
4. User completes payment
5. Frontend verifies payment via backend

---

**The OPTIONS 204 response is normal** - that's the CORS preflight check working correctly.
**The POST 500 error** will be fixed once you add the environment variables.

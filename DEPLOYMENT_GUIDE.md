# 🚀 Deployment Guide - Secret Gift India

## Overview
Your project has 2 parts that need deployment:
1. **Frontend** (React + Vite) → Deploy to **Netlify**
2. **Backend** (Node.js + Express) → Deploy to **Render.com** (Free)

---

## 📦 STEP 1: Deploy Backend to Render.com (FREE)

### 1.1 Create Account
- Go to https://render.com
- Sign up with GitHub account

### 1.2 Create New Web Service
1. Click **"New +"** → **"Web Service"**
2. Connect your GitHub repository: `secretgiftindia-prog/webpage`
3. Configure:
   - **Name:** `secret-gift-backend`
   - **Region:** Singapore (closest to India)
   - **Branch:** `main`
   - **Root Directory:** Leave BLANK
   - **Runtime:** `Node`
   - **Build Command:** `npm install`
   - **Start Command:** `node server.js`
   - **Instance Type:** `Free`

### 1.3 Add Environment Variables
In Render dashboard, add these:
```
VITE_RAZORPAY_KEY_ID = your_razorpay_live_key_id
RAZORPAY_KEY_SECRET = your_razorpay_live_secret_key
```

**⚠️ IMPORTANT:** Replace with your actual keys from Razorpay dashboard

### 1.4 Deploy
- Click **"Create Web Service"**
- Wait 2-3 minutes for deployment
- Your backend URL is: **https://webpage-et86.onrender.com** ✅

---

## 🌐 STEP 2: Deploy Frontend to Netlify

### IMPORTANT: Netlify Build Settings

**Before deploying, configure these settings in Netlify:**

1. Go to **Site Settings** → **Build & Deploy** → **Build Settings**
2. Set:
   - **Base directory:** `secret gift`
   - **Build command:** `npm run build`
   - **Publish directory:** `secret gift/dist`
   - **Node version:** `18`

### 2.1 Update Environment Variables Locally
1. Edit `.env` file:
```env
VITE_RAZORPAY_KEY_ID=your_razorpay_live_key_id
VITE_API_URL=https://secret-gift-backend.onrender.com
```

### 2.2 Build Production Version
```powershell
cd 'secret gift'
npm run build
```

### 2.3 Deploy to Netlify
**Option A: Netlify CLI (Recommended)**
```powershell
# Install Netlify CLI
npm install -g netlify-cli

# Login
netlify login

# Deploy
netlify deploy --prod --dir=dist
```

**Option B: Netlify Dashboard**
1. Go to https://netlify.com
2. Drag & drop the `dist` folder
3. Add environment variables in Site Settings

### 2.4 Add Environment Variables in Netlify
1. Go to: **Site Settings** → **Environment Variables**
2. Add:
```
VITE_RAZORPAY_KEY_ID = your_razorpay_live_key_id
VITE_API_URL = https://secret-gift-backend.onrender.com
```

### 2.5 Rebuild
- Trigger a new build in Netlify dashboard
- Your site will be live at: `https://your-site-name.netlify.app`

---

## ✅ STEP 3: Verify Deployment

### 3.1 Test Backend
Open in browser:
```
https://secret-gift-backend.onrender.com/api/create-order
```
You should see an error (normal - it needs POST data)

### 3.2 Test Frontend
1. Open your Netlify URL
2. Click "Book Now - ₹249 🎁"
3. Try making a test payment

### 3.3 Check Browser Console
- Right-click → Inspect → Console
- Should see no errors about API connection

---

## 🔧 Alternative Backend Hosting (If Render doesn't work)

### Railway.app
```powershell
# Install Railway CLI
npm install -g @railway/cli

# Login
railway login

# Initialize
cd 'secret gift'
railway init

# Add variables
railway variables set VITE_RAZORPAY_KEY_ID=your_razorpay_live_key_id
railway variables set RAZORPAY_KEY_SECRET=your_razorpay_live_secret_key

# Deploy
railway up
```

---

## 🐛 Troubleshooting

### Issue: Netlify "Unrecognized Git contributor" error
**Error:** "Your plan allows only one contributor on private repos"

**Solutions (Choose one):**

1. **Make Repository Public (Recommended for open source):**
   ```powershell
   # Go to GitHub → Your Repo → Settings → General
   # Scroll to "Danger Zone" → "Change repository visibility"
   # Click "Change visibility" → Select "Public"
   ```

2. **Link Git Account in Netlify:**
   - Go to Netlify Dashboard → Team Settings
   - Click "Git contributors" → "Link account"
   - Authorize your GitHub account

3. **Upgrade to Netlify Pro:**
   - Allows unlimited contributors on private repos
   - Go to Netlify → Billing → Upgrade

### Issue: "Failed to fetch" error
- **Solution:** Check that backend URL is correct in `.env`
- Verify backend is running: Visit backend URL in browser

### Issue: CORS error
- **Solution:** Backend already has CORS enabled
- If still fails, update `server.js`:
```javascript
app.use(cors({
  origin: 'https://your-netlify-site.netlify.app'
}));
```

### Issue: Payment not working
- Check Razorpay keys are correct
- Verify environment variables in both Render and Netlify
- Check browser console for errors

### Issue: Backend sleeping (Render free tier)
- Free tier sleeps after 15 mins of inactivity
- First request may take 30-60 seconds to wake up
- Solution: Upgrade to paid tier OR use Railway.app

---

## 📝 Quick Command Reference

### Build Production
```powershell
cd 'secret gift'
npm run build
```

### Deploy to Netlify
```powershell
netlify deploy --prod --dir=dist
```

### Test Locally
```powershell
npm run dev:full
```

---

## 🔐 Security Checklist

- [x] Secret keys in environment variables
- [x] `.env` file in `.gitignore`
- [x] No keys in source code
- [x] CORS enabled on backend
- [x] Payment verification on backend
- [ ] Backend deployed
- [ ] Environment variables set in Render
- [ ] Environment variables set in Netlify
- [ ] Production build tested

---

## 🎯 Final URLs

After deployment, update these:
- **Frontend:** https://your-site.netlify.app
- **Backend:** https://secret-gift-backend.onrender.com
- **GitHub Repo:** https://github.com/secretgiftindia-prog/webpage

---

## 💡 Pro Tips

1. **Custom Domain:** Buy domain from GoDaddy/Namecheap and connect to Netlify
2. **Analytics:** Add Google Analytics to track visitors
3. **Monitoring:** Use Render dashboard to monitor backend uptime
4. **Backup:** Always keep local copy of `.env` file safely

---

## 📞 Need Help?

If deployment fails:
1. Check Render logs for backend errors
2. Check Netlify deploy logs for frontend errors
3. Verify all environment variables are set correctly
4. Make sure both deployments use the same Razorpay keys

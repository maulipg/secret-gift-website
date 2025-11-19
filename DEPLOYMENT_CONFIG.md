# Deployment Configuration

## ✅ Current Setup

This project uses **Netlify** for frontend deployment and **Render** for backend.

### Frontend (Netlify)
- **Branch:** `main`
- **Build Command:** `npm run build`
- **Publish Directory:** `dist`
- **Auto-deploys:** Yes (on every push to main)

### Backend (Render)
- **Branch:** `main`
- **Start Command:** `node backend/server.js`
- **Auto-deploys:** Yes (on every push to main)

## 🚫 GitHub Pages Disabled

GitHub Pages deployment has been removed to avoid conflicts with Netlify. 
The `gh-pages` branch is no longer needed and can be safely deleted.

## 📝 Netlify Configuration

Make sure these settings are configured in Netlify Dashboard:

### Build Settings
- **Base directory:** `secret gift`
- **Build command:** `npm run build`
- **Publish directory:** `secret gift/dist`

### Environment Variables
```
VITE_RAZORPAY_KEY_ID = your_razorpay_live_key_id
VITE_API_URL = https://webpage-et86.onrender.com
```

### Deploy Settings
- **Branch to deploy:** `main`
- **Production branch:** `main`
- **Deploy log visibility:** Public

## 🔄 To Deploy

Simply push to main branch:
```bash
git push origin main
```

Both Netlify (frontend) and Render (backend) will auto-deploy.

## 🗑️ Delete gh-pages Branch (Optional)

If you want to clean up the old gh-pages branch:

```bash
# Delete local branch (if exists)
git branch -D gh-pages

# Delete remote branch
git push origin --delete gh-pages
```

## ⚠️ Important Notes

- Only `main` branch is used for deployment
- No need for GitHub Actions workflows
- Netlify handles frontend builds automatically
- Render handles backend automatically

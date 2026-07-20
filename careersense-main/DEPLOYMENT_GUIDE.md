# CareerSense Deployment Guide

This guide will walk you through hosting CareerSense online using **Render** (backend) and **Vercel** (frontend).

---

## 📋 Prerequisites

1. **GitHub Account** - Create one at [github.com](https://github.com)
2. **Render Account** - Sign up at [render.com](https://render.com) (free tier available)
3. **Vercel Account** - Sign up at [vercel.com](https://vercel.com) (free tier available)
4. **Git installed** on your computer

---

## 🚀 Part 1: Deploy Backend to Render

### Step 1: Prepare the Backend

First, push your code to GitHub:

```bash
cd "c:\Users\USER\Downloads\careersense-main\careersense-main"
git init
git add .
git commit -m "Initial commit for deployment"
```

Create a new repository on GitHub and push:
```bash
git remote add origin https://github.com/YOUR_USERNAME/careersense.git
git branch -M main
git push -u origin main
```

### Step 2: Create Render Web Service

1. Go to [render.com](https://render.com) and sign in
2. Click **"New +"** → **"Web Service"**
3. Connect your GitHub repository
4. Configure the service:

   **Settings:**
   - **Name:** `careersense-backend`
   - **Region:** Choose closest to your users
   - **Root Directory:** `Prediction`
   - **Environment:** `Python 3`
   - **Build Command:** `pip install -r requirements.txt && python manage.py collectstatic --noinput && python manage.py migrate`
   - **Start Command:** `gunicorn backend.wsgi:application`

5. **Add Environment Variables** (click "Advanced" → "Add Environment Variable"):
   ```
   GROQ_API_KEY=your_groq_api_key_here
   SECRET_KEY=your-secret-django-key-change-this-in-production
   DEBUG=False
   PYTHON_VERSION=3.11.0
   ```

6. Click **"Create Web Service"**

7. Wait for deployment (5-10 minutes). Once done, you'll get a URL like:
   ```
   https://careersense-backend.onrender.com
   ```

### Step 3: Test Backend

Visit `https://careersense-backend.onrender.com/api/chat/` in your browser. You should see a Django REST Framework page.

---

## 🌐 Part 2: Deploy Frontend to Vercel

### Step 1: Update Frontend Environment

Update `Frontend/.env` with your Render backend URL:

```env
VITE_API_URL=https://careersense-backend.onrender.com
```

Commit this change:
```bash
git add Frontend/.env
git commit -m "Update API URL for production"
git push
```

### Step 2: Deploy to Vercel

1. Go to [vercel.com](https://vercel.com) and sign in
2. Click **"Add New..."** → **"Project"**
3. Import your GitHub repository
4. Configure the project:

   **Settings:**
   - **Framework Preset:** `Vite`
   - **Root Directory:** `Frontend`
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`
   - **Install Command:** `npm install`

5. **Add Environment Variable:**
   - Click "Environment Variables"
   - Add:
     ```
     VITE_API_URL=https://careersense-backend.onrender.com
     ```

6. Click **"Deploy"**

7. Wait for deployment (2-3 minutes). You'll get a URL like:
   ```
   https://careersense.vercel.app
   ```

---

## ✅ Part 3: Final Configuration

### Update Django CORS Settings (Optional but Recommended)

For better security, update `Prediction/backend/settings.py`:

```python
# Replace:
CORS_ALLOW_ALL_ORIGINS = True

# With:
CORS_ALLOWED_ORIGINS = [
    "https://careersense.vercel.app",  # Your Vercel URL
    "http://localhost:5173",  # Keep for local development
]
```

Commit and push:
```bash
git add Prediction/backend/settings.py
git commit -m "Update CORS for production"
git push
```

Render will automatically redeploy.

---

## 🎉 You're Live!

Your app is now hosted:
- **Frontend:** https://careersense.vercel.app
- **Backend:** https://careersense-backend.onrender.com

---

## 🔧 Troubleshooting

### Backend Issues

**Problem:** Backend returns 500 errors
- Check Render logs: Dashboard → Your Service → Logs
- Verify all environment variables are set correctly
- Ensure `DEBUG=False` in production

**Problem:** "Application failed to start"
- Check if `gunicorn` is in `requirements.txt` (it is!)
- Verify build command ran successfully

### Frontend Issues

**Problem:** Frontend can't reach backend
- Check browser console for CORS errors
- Verify `VITE_API_URL` is set correctly in Vercel
- Ensure backend is running (visit the URL directly)

**Problem:** Build fails
- Check Vercel build logs
- Verify `package.json` has correct build script

### Free Tier Limitations

**Render Free Tier:**
- Backend spins down after 15 minutes of inactivity
- First request after spin-down takes 30-50 seconds (cold start)
- 750 hours/month free

**Vercel Free Tier:**
- 100GB bandwidth/month
- Unlimited deployments
- Always online (no cold starts)

---

## 💡 Alternative Hosting Options

### Backend Alternatives:
- **Railway** - [railway.app](https://railway.app) - $5/month, no cold starts
- **Heroku** - [heroku.com](https://heroku.com) - Similar to Render
- **PythonAnywhere** - [pythonanywhere.com](https://pythonanywhere.com) - Free tier for Django

### Frontend Alternatives:
- **Netlify** - [netlify.com](https://netlify.com) - Similar to Vercel
- **GitHub Pages** - Free with GitHub, but requires SPA routing setup
- **Cloudflare Pages** - [pages.cloudflare.com](https://pages.cloudflare.com) - Fast CDN

---

## 📝 Notes

- **Custom Domain:** Both Render and Vercel support custom domains (e.g., `careersense.com`)
- **Database:** Currently using SQLite. For production scale, consider PostgreSQL (Render offers free PostgreSQL)
- **Monitoring:** Check Render logs regularly for errors
- **Updates:** Push to GitHub → Automatic redeployment on both platforms

---

## 🆘 Need Help?

- Render Docs: https://render.com/docs
- Vercel Docs: https://vercel.com/docs
- Django Deployment: https://docs.djangoproject.com/en/stable/howto/deployment/

Good luck with your deployment! 🚀

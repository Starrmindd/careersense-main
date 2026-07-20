# 🚀 Deploy CareerSense for FREE - Copy & Paste Guide

Follow these steps **exactly** - just copy and paste the commands!

---

## ✅ Prerequisites (Do Once)

1. **GitHub Account**: Sign up at [github.com](https://github.com) if you don't have one
2. **Render Account**: Sign up at [render.com](https://render.com) with GitHub
3. **Vercel Account**: Sign up at [vercel.com](https://vercel.com) with GitHub

---

## 📦 STEP 1: Push to GitHub (5 minutes)

### 1.1 Initialize Git and Commit

Open Command Prompt in your project folder and run:

```bash
cd "c:\Users\USER\Downloads\careersense-main\careersense-main"
git init
git add .
git commit -m "Initial deployment commit"
```

### 1.2 Create GitHub Repository

1. Go to https://github.com/new
2. Repository name: `careersense`
3. Keep it **Public** (required for free hosting)
4. **DO NOT** check "Add a README"
5. Click **"Create repository"**

### 1.3 Push to GitHub

Copy your GitHub username and paste in this command:

```bash
git remote add origin https://github.com/YOUR_GITHUB_USERNAME/careersense.git
git branch -M main
git push -u origin main
```

**Example**: If your username is `john123`, use:
```bash
git remote add origin https://github.com/john123/careersense.git
```

---

## 🖥️ STEP 2: Deploy Backend to Render (5 minutes)

### 2.1 Create Web Service

1. Go to https://render.com/dashboard
2. Click **"New +"** → **"Web Service"**
3. Click **"Connect account"** if needed → Authorize GitHub
4. Find and click your `careersense` repository
5. Click **"Connect"**

### 2.2 Configure Settings

Fill in these **EXACT** settings:

| Field | Value |
|-------|-------|
| **Name** | `careersense-backend` |
| **Region** | Choose closest to you |
| **Root Directory** | `Prediction` |
| **Environment** | `Python 3` |
| **Build Command** | `pip install -r requirements.txt && python manage.py collectstatic --noinput && python manage.py migrate` |
| **Start Command** | `gunicorn backend.wsgi:application` |

### 2.3 Add Environment Variables

Scroll down to **"Environment Variables"** section, click **"Add Environment Variable"**, and add these **4 variables**:

| Key | Value |
|-----|-------|
| `GROQ_API_KEY` | `your_groq_api_key_from_console.groq.com` |
| `SECRET_KEY` | `render-prod-key-change-to-random-later-12345` |
| `DEBUG` | `False` |
| `PYTHON_VERSION` | `3.11.0` |

### 2.4 Deploy!

1. Scroll to the bottom
2. Click **"Create Web Service"**
3. Wait 5-10 minutes for deployment
4. Once it says "Live", copy your backend URL

**Your backend URL will look like:**
```
https://careersense-backend.onrender.com
```

**COPY THIS URL - YOU'LL NEED IT FOR STEP 3!**

---

## 🌐 STEP 3: Deploy Frontend to Vercel (3 minutes)

### 3.1 Update Frontend Environment Variable

**IMPORTANT**: Replace `YOUR_BACKEND_URL` with the URL from Step 2.4

Open `Frontend\.env` and change it to:
```
VITE_API_URL=https://careersense-backend.onrender.com
```
(Use YOUR actual Render URL, not this example!)

### 3.2 Push the Change to GitHub

```bash
cd "c:\Users\USER\Downloads\careersense-main\careersense-main"
git add Frontend/.env
git commit -m "Update API URL for production"
git push
```

### 3.3 Deploy to Vercel

1. Go to https://vercel.com/new
2. Click **"Import Git Repository"**
3. Find and select your `careersense` repository
4. Click **"Import"**

### 3.4 Configure Vercel Settings

| Field | Value |
|-------|-------|
| **Framework Preset** | `Vite` |
| **Root Directory** | Click "Edit" → Type `Frontend` |
| **Build Command** | `npm run build` (auto-filled) |
| **Output Directory** | `dist` (auto-filled) |
| **Install Command** | `npm install` (auto-filled) |

### 3.5 Add Environment Variable

1. Scroll down to **"Environment Variables"**
2. Add:
   - **Key**: `VITE_API_URL`
   - **Value**: `https://careersense-backend.onrender.com` (YOUR Render URL!)
3. Click **"Deploy"**

### 3.6 Wait for Deployment

Wait 2-3 minutes. Once done, Vercel shows your live URL:

```
https://careersense.vercel.app
```

---

## 🎉 YOU'RE LIVE!

Your CareerSense app is now online at:
- **Frontend**: https://careersense.vercel.app (or your Vercel URL)
- **Backend**: https://careersense-backend.onrender.com (or your Render URL)

---

## ⚠️ Important Notes

### Free Tier Limitations

**Render Free Tier:**
- Backend **sleeps after 15 minutes** of inactivity
- First request after sleep takes **30-50 seconds** (cold start)
- After that, it's fast!
- You get **750 hours/month free**

**Vercel Free Tier:**
- Frontend is **always online** - no delays!
- 100GB bandwidth/month
- Unlimited deployments

### How to Wake Up the Backend

If backend is asleep, just visit your app and wait 30-50 seconds on the first page load. After that, it stays awake for 15 minutes.

---

## 🔧 Troubleshooting

### Backend Shows 500 Error
1. Go to Render dashboard
2. Click your service → "Logs" tab
3. Look for errors
4. Check that `GROQ_API_KEY` is correct

### Frontend Can't Connect to Backend
1. Check browser console (F12)
2. Verify `VITE_API_URL` in Vercel dashboard → Settings → Environment Variables
3. Make sure backend URL is correct (no trailing slash!)
4. Check backend is actually running (visit the URL directly)

### Build Failed
**Render:**
- Check "Logs" tab for Python errors
- Verify `requirements.txt` is correct
- Try Python version 3.11.0

**Vercel:**
- Check build logs
- Verify `package.json` has correct scripts
- Make sure Root Directory is set to `Frontend`

---

## 🔄 How to Update Your App

Whenever you make changes:

```bash
cd "c:\Users\USER\Downloads\careersense-main\careersense-main"
git add .
git commit -m "Your change description"
git push
```

**Both Render and Vercel auto-deploy** when you push to GitHub! 🚀

---

## 💡 Pro Tips

1. **Custom Domain**: Both Render and Vercel support free custom domains
2. **Upgrade Later**: If backend cold starts annoy you, upgrade Render to $7/month for always-on
3. **Monitor**: Check Render logs regularly for errors
4. **CORS**: Already configured to allow all origins - no changes needed

---

## 🆘 Need Help?

- **Render Docs**: https://render.com/docs
- **Vercel Docs**: https://vercel.com/docs
- **Django on Render**: https://render.com/docs/deploy-django

---

**You're all set! Enjoy your live app! 🎊**

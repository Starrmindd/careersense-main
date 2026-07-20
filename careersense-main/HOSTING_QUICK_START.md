# 🚀 Quick Start: Host CareerSense in 10 Minutes

## What You'll Need
- GitHub account (to connect your repository)
- Groq API key (you already have this)
- 10 minutes

---

## Step 1: Generate a Secret Key (2 minutes)

Open terminal in the `Prediction` folder and run:
```bash
python generate_secret_key.py
```

**Copy the output** - you'll need it in Step 2.

---

## Step 2: Deploy Backend to Railway (4 minutes)

### 1. Go to [railway.app](https://railway.app/) and sign up with GitHub

### 2. Click "New Project" → "Deploy from GitHub repo"
   - Select your CareerSense repository
   - Railway will auto-detect it as a Django app

### 3. Set Root Directory
   - Click on your service
   - Go to Settings → Root Directory
   - Enter: `Prediction`

### 4. Add Environment Variables
   - Go to Variables tab
   - Add these variables:

   ```
   GROQ_API_KEY = (your Groq API key from .env file)
   SECRET_KEY = (the key you generated in Step 1)
   DEBUG = False
   PYTHON_VERSION = 3.12
   ```

### 5. Deploy
   - Click "Deploy"
   - Wait 2-3 minutes for the build
   - **Copy your Railway URL** (e.g., `https://careersense-production.up.railway.app`)

---

## Step 3: Deploy Frontend to Vercel (4 minutes)

### 1. Go to [vercel.com](https://vercel.com/) and sign up with GitHub

### 2. Click "Add New..." → "Project"
   - Import your CareerSense repository

### 3. Configure Build Settings
   - Framework Preset: **Vite**
   - Root Directory: **Frontend**
   - Build Command: `npm run build` (auto-filled)
   - Output Directory: `dist` (auto-filled)

### 4. Add Environment Variable
   - Click "Environment Variables"
   - Add:
   ```
   VITE_API_URL = (your Railway URL from Step 2)
   ```

### 5. Deploy
   - Click "Deploy"
   - Wait 2-3 minutes
   - **Your app is live!** 🎉

---

## Step 4: Update CORS (1 minute)

After both deployments are done:

1. Open `Prediction/backend/settings.py`
2. Replace this line:
   ```python
   CORS_ALLOW_ALL_ORIGINS = True
   ```
   
   With:
   ```python
   CORS_ALLOWED_ORIGINS = [
       "https://your-vercel-app.vercel.app",  # Replace with your Vercel URL
       "http://localhost:5173",  # Keep for local dev
   ]
   ```

3. Commit and push to GitHub
4. Railway will auto-redeploy

---

## ✅ Test Your Deployment

1. Open your Vercel URL
2. Click "AI Advisor"
3. Start chatting
4. Complete the questionnaire
5. Check if predictions work

---

## 💰 Costs

**Everything is FREE:**
- Railway: $5 credit/month (enough for ~500 hours)
- Vercel: Free forever (100GB bandwidth/month)
- Groq API: Free 14,400 requests/day

---

## 🐛 Troubleshooting

### Backend Error on Railway
- Check **Logs** tab in Railway
- Verify all environment variables are set correctly
- Make sure `GROQ_API_KEY` has no extra spaces

### Frontend Can't Connect to Backend
- Check browser console (F12) for errors
- Verify `VITE_API_URL` in Vercel dashboard matches Railway URL
- Make sure Railway URL doesn't have trailing slash

### Chat Says "Sorry, I encountered an error"
- Check Railway logs for backend errors
- Verify Groq API key is valid
- Check if you've hit Groq rate limits (14,400 requests/day)

---

## 🎓 Share Your Project

Your CareerSense app is now live! Share the Vercel URL with:
- Your project supervisor
- Fellow students at FUOYE
- On your resume/portfolio
- LinkedIn, Twitter, etc.

---

## 📚 Next Steps (Optional)

1. **Custom Domain**: Add your own domain in Vercel settings
2. **Analytics**: Enable Vercel Analytics to track usage
3. **Monitoring**: Set up Railway alerts for backend issues
4. **Database**: Add PostgreSQL on Railway for persistent storage
5. **CI/CD**: Auto-deploy on every GitHub push (already enabled!)

---

## Need Help?

Common issues and solutions:

| Issue | Solution |
|-------|----------|
| "ModuleNotFoundError" on Railway | Check that all dependencies are in `requirements.txt` |
| "NetworkError" on frontend | Verify CORS settings and VITE_API_URL |
| ML predictions not working | Check that `dtmodel.pkl` is in your GitHub repo |
| Railway app sleeping | Free tier sleeps after 1hr inactivity (upgrade to prevent) |

---

**Good luck with your final year project! 🎓🚀**

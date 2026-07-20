# CareerSense Deployment Guide

## Overview
This guide will help you deploy your CareerSense application to production:
- **Frontend (React + Vite)** → Vercel (free)
- **Backend (Django REST API)** → Railway or Render (free tier)

---

## Part 1: Deploy Backend to Railway

### Step 1: Create Railway Account
1. Go to [Railway.app](https://railway.app/)
2. Sign up with GitHub (free - $5 credit/month)

### Step 2: Prepare Your Backend

Create a `Procfile` in the `Prediction` folder:
```
web: gunicorn backend.wsgi --bind 0.0.0.0:$PORT
```

Create a `railway.json` in the `Prediction` folder:
```json
{
  "$schema": "https://railway.app/railway.schema.json",
  "build": {
    "builder": "NIXPACKS"
  },
  "deploy": {
    "startCommand": "python manage.py migrate && gunicorn backend.wsgi --bind 0.0.0.0:$PORT",
    "restartPolicyType": "ON_FAILURE",
    "restartPolicyMaxRetries": 10
  }
}
```

### Step 3: Deploy on Railway
1. Click **"New Project"** → **"Deploy from GitHub repo"**
2. Select your repository
3. Railway will auto-detect Django
4. Set **Root Directory** to `Prediction`
5. Add environment variables:
   - `GROQ_API_KEY` = your Groq API key
   - `SECRET_KEY` = generate a new one (see below)
   - `DEBUG` = `False`
   - `ALLOWED_HOSTS` = `your-app.railway.app`
   - `PYTHON_VERSION` = `3.12`

**Generate a secure SECRET_KEY:**
```python
from django.core.management.utils import get_random_secret_key
print(get_random_secret_key())
```

6. Click **"Deploy"** - Railway will build and deploy
7. Copy your Railway URL (e.g., `https://careersense-production.up.railway.app`)

---

## Part 2: Deploy Frontend to Vercel

### Step 1: Create Vercel Account
1. Go to [Vercel.com](https://vercel.com/)
2. Sign up with GitHub (free)

### Step 2: Update Frontend Config

Update `Frontend/.env`:
```
VITE_API_URL=https://your-railway-app.up.railway.app
```

### Step 3: Deploy on Vercel
1. Click **"Add New Project"** → **"Import Git Repository"**
2. Select your repository
3. Set configuration:
   - **Framework Preset**: Vite
   - **Root Directory**: `Frontend`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
4. Add environment variable:
   - `VITE_API_URL` = your Railway backend URL
5. Click **"Deploy"**
6. Your app will be live at `https://your-app.vercel.app`

---

## Part 3: Update CORS Settings

After deployment, update your backend CORS settings in `Prediction/backend/settings.py`:

```python
# Replace CORS_ALLOW_ALL_ORIGINS with specific domains
CORS_ALLOWED_ORIGINS = [
    "https://your-app.vercel.app",
    "http://localhost:5173",  # Keep for local dev
]
```

Redeploy your backend on Railway after this change.

---

## Alternative: Deploy Backend to Render

If you prefer Render over Railway:

1. Go to [Render.com](https://render.com/)
2. Sign up with GitHub (free tier available)
3. Click **"New+"** → **"Web Service"**
4. Connect your repository
5. Configure:
   - **Name**: careersense-api
   - **Root Directory**: `Prediction`
   - **Runtime**: Python 3
   - **Build Command**: `pip install -r requirements.txt`
   - **Start Command**: `gunicorn backend.wsgi:application`
6. Add environment variables (same as Railway)
7. Click **"Create Web Service"**

---

## Testing Production

### Test Backend
Visit: `https://your-railway-app.up.railway.app/api/predict/`

You should see Django REST Framework browsable API.

### Test Frontend
1. Open your Vercel URL
2. Start a chat conversation
3. Complete the questionnaire
4. Verify predictions work

---

## Costs
- **Vercel**: Free (100GB bandwidth/month)
- **Railway**: Free $5 credit/month (~500 hours)
- **Render**: Free tier (sleeps after 15min inactivity)
- **Groq API**: Free 14,400 requests/day

---

## Troubleshooting

### Backend not starting
- Check Railway/Render logs for errors
- Verify all environment variables are set
- Ensure `gunicorn` is in requirements.txt ✓

### Frontend can't connect to backend
- Check CORS settings in backend
- Verify `VITE_API_URL` in Vercel environment variables
- Check network tab in browser DevTools for errors

### ML predictions not working
- Verify `ml_models/dtmodel.pkl` exists in your repository
- Check Railway logs for scikit-learn version errors
- Ensure all dependencies in requirements.txt are installed

### "Sorry, I encountered an error" in chat
- Check Railway logs for backend errors
- Verify `GROQ_API_KEY` is set correctly
- Check Groq API rate limits

---

## Next Steps
1. Set up a custom domain (optional)
2. Add monitoring with Railway/Vercel analytics
3. Set up CI/CD for automatic deployments
4. Add database (PostgreSQL) if you need to store chat history on backend

---

## Need Help?
- Railway Docs: https://docs.railway.app/
- Vercel Docs: https://vercel.com/docs
- Render Docs: https://render.com/docs

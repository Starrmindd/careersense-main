# 🚀 Quick Deploy Guide (5 Minutes)

Follow these steps to get CareerSense online quickly.

## Option 1: Render + Vercel (Recommended - Free)

### Backend (2 minutes)
1. Go to [render.com](https://render.com) → Sign up
2. Click "New +" → "Web Service"
3. Connect GitHub repo
4. Settings:
   - Root Directory: `Prediction`
   - Build Command: `pip install -r requirements.txt && python manage.py collectstatic --noinput`
   - Start Command: `gunicorn backend.wsgi:application`
5. Add Environment Variables:
   ```
   GROQ_API_KEY=gsk_your_key_here
   SECRET_KEY=django-secret-key-change-this
   DEBUG=False
   ```
6. Deploy! Copy your URL: `https://your-app.onrender.com`

### Frontend (2 minutes)
1. Update `Frontend/.env`:
   ```
   VITE_API_URL=https://your-app.onrender.com
   ```
2. Push to GitHub
3. Go to [vercel.com](https://vercel.com) → Sign up
4. Click "Add New Project"
5. Import GitHub repo
6. Settings:
   - Root Directory: `Frontend`
   - Framework: Vite
7. Add Environment Variable:
   ```
   VITE_API_URL=https://your-app.onrender.com
   ```
8. Deploy! Your app is live at `https://your-app.vercel.app`

---

## Option 2: Railway (Easier, $5/month)

### All-in-One Deploy
1. Go to [railway.app](https://railway.app)
2. Click "New Project" → "Deploy from GitHub"
3. Select your repo
4. Railway auto-detects Django + React
5. Add environment variables
6. Done! Both frontend and backend deployed

---

## ⚠️ Important Notes

- **Cold Starts**: Render free tier spins down after 15 min (first request takes 30-50s)
- **GROQ_API_KEY**: Get from [console.groq.com](https://console.groq.com)
- **Git Requirement**: Push your code to GitHub first
- **CORS**: Backend already configured for all origins

---

## 🆘 Troubleshooting

**Backend 500 Error?**
- Check Render logs for errors
- Verify `GROQ_API_KEY` is set correctly

**Frontend can't connect?**
- Check `VITE_API_URL` in Vercel environment variables
- Verify backend URL is correct (no trailing slash)

**Build Failed?**
- Check Python version is 3.11 or lower
- Verify all dependencies in requirements.txt

---

For detailed instructions, see [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md)

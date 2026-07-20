# 🚀 Deploy CareerSense for FREE on Render (One Place!)

Deploy both frontend and backend on Render - 100% free, one platform, one dashboard.

---

## 💰 What You Get (FREE)

✅ Backend (Django) hosted on Render  
✅ Frontend (React) hosted on Render  
✅ Both in one dashboard  
✅ Auto-deploy on git push  
✅ No credit card required  

⚠️ **Only limitation**: Both services sleep after 15 min inactivity (30-50 sec wake up time)

---

## 📋 Prerequisites

1. **GitHub Account** - [github.com](https://github.com)
2. **Render Account** - [render.com](https://render.com) (sign up with GitHub)

---

## 🚀 Step-by-Step Deployment

### STEP 1: Push to GitHub (2 minutes)

#### 1.1 Run Git Setup

Open Command Prompt and run:

```bash
cd "c:\Users\USER\Downloads\careersense-main\careersense-main"
git init
git add .
git commit -m "Initial deployment commit"
```

#### 1.2 Create GitHub Repository

1. Go to https://github.com/new
2. Repository name: `careersense`
3. Keep it **Public**
4. **DO NOT** check "Add a README"
5. Click **"Create repository"**

#### 1.3 Push to GitHub

Replace `YOUR_GITHUB_USERNAME` with your actual username:

```bash
git remote add origin https://github.com/YOUR_GITHUB_USERNAME/careersense.git
git branch -M main
git push -u origin main
```

---

### STEP 2: Deploy Backend on Render (5 minutes)

#### 2.1 Create Web Service

1. Go to https://render.com/dashboard
2. Click **"New +"** → **"Web Service"**
3. Click **"Connect account"** → Authorize GitHub
4. Find your `careersense` repository → Click **"Connect"**

#### 2.2 Configure Backend Service

| Setting | Value |
|---------|-------|
| **Name** | `careersense-backend` |
| **Region** | Choose closest to you |
| **Root Directory** | `Prediction` |
| **Environment** | `Python 3` |
| **Build Command** | `pip install -r requirements.txt && python manage.py collectstatic --noinput && python manage.py migrate` |
| **Start Command** | `gunicorn backend.wsgi:application` |
| **Instance Type** | `Free` |

#### 2.3 Add Environment Variables

Click **"Advanced"** → **"Add Environment Variable"** and add these:

| Key | Value |
|-----|-------|
| `GROQ_API_KEY` | `your_groq_api_key_from_console.groq.com` |
| `SECRET_KEY` | `render-prod-secret-key-change-this-123456789` |
| `DEBUG` | `False` |
| `PYTHON_VERSION` | `3.11.0` |

#### 2.4 Deploy Backend

1. Click **"Create Web Service"**
2. Wait 5-10 minutes for deployment
3. Once "Live", copy your backend URL

**Your backend URL will look like:**
```
https://careersense-backend.onrender.com
```

**✅ COPY THIS URL - YOU NEED IT FOR STEP 3!**

---

### STEP 3: Update Frontend Configuration (1 minute)

#### 3.1 Update API URL

Edit `Frontend/.env` and replace with YOUR backend URL:

```env
VITE_API_URL=https://careersense-backend.onrender.com
```

(Use YOUR actual Render backend URL!)

#### 3.2 Push Changes to GitHub

```bash
cd "c:\Users\USER\Downloads\careersense-main\careersense-main"
git add Frontend/.env
git commit -m "Update API URL for production"
git push
```

---

### STEP 4: Deploy Frontend on Render (5 minutes)

#### 4.1 Create Static Site

1. Go back to https://render.com/dashboard
2. Click **"New +"** → **"Static Site"**
3. Select your `careersense` repository again
4. Click **"Connect"**

#### 4.2 Configure Frontend Service

| Setting | Value |
|---------|-------|
| **Name** | `careersense-frontend` |
| **Root Directory** | `Frontend` |
| **Build Command** | `npm install && npm run build` |
| **Publish Directory** | `dist` |

#### 4.3 Add Environment Variable

Click **"Advanced"** → **"Add Environment Variable"**:

| Key | Value |
|-----|-------|
| `VITE_API_URL` | `https://careersense-backend.onrender.com` |

(Use YOUR actual backend URL!)

#### 4.4 Deploy Frontend

1. Click **"Create Static Site"**
2. Wait 2-3 minutes for deployment
3. Once "Live", you'll get your frontend URL

**Your frontend URL will look like:**
```
https://careersense-frontend.onrender.com
```

---

## 🎉 YOU'RE LIVE!

Both frontend and backend are now hosted on Render:

- **Frontend**: https://careersense-frontend.onrender.com
- **Backend**: https://careersense-backend.onrender.com
- **Dashboard**: https://render.com/dashboard (manage both in one place!)

---

## ⚠️ Important: Free Tier Limitations

### How Free Tier Works

**Static Sites (Frontend):**
- ✅ **Always online** - no sleep!
- ✅ Instant loading
- ✅ 100GB bandwidth/month
- ✅ Global CDN

**Web Services (Backend):**
- ⚠️ **Sleeps after 15 minutes** of inactivity
- ⚠️ First request after sleep: **30-50 seconds** to wake up
- ✅ After wake up: fast for next 15 minutes
- ✅ 750 hours/month free

### User Experience

1. User visits your app → Frontend loads **instantly** ✅
2. User starts chat → Backend wakes up (30-50 sec) ⚠️
3. After first message → Everything is **fast** ✅
4. Backend stays awake for 15 min of use

**Pro tip**: Add a loading message like "Waking up the AI advisor..." during cold starts!

---

## 🔄 How to Update Your App

Whenever you make changes:

```bash
cd "c:\Users\USER\Downloads\careersense-main\careersense-main"
git add .
git commit -m "Your change description"
git push
```

**Render automatically redeploys both services!** 🚀

---

## 🔧 Troubleshooting

### Backend Returns 500 Error
1. Go to Render Dashboard
2. Click `careersense-backend` → **"Logs"** tab
3. Look for Python errors
4. Check environment variables are correct

### Frontend Shows "Can't Connect"
1. Open browser console (F12)
2. Check if `VITE_API_URL` is correct
3. Visit backend URL directly to wake it up
4. Wait 30-50 seconds for cold start

### Backend Won't Wake Up
- Check Render status page: https://status.render.com
- Verify your free tier hours aren't exhausted (750 hours/month)
- Try redeploying: Dashboard → Service → "Manual Deploy"

### Build Failed
**Backend:**
- Check Logs tab for specific error
- Verify Python version is 3.11.0
- Check `requirements.txt` is correct

**Frontend:**
- Check build logs
- Verify `package.json` scripts are correct
- Make sure Root Directory is `Frontend`

---

## 💡 Upgrade Options (Optional)

If cold starts become annoying:

### Option 1: Keep Backend Awake (Free!)
Use a service like **UptimeRobot** or **cron-job.org** to ping your backend every 10 minutes:
- Ping URL: `https://careersense-backend.onrender.com`
- Interval: Every 10 minutes
- This keeps backend always warm (but uses more of your 750 free hours)

### Option 2: Upgrade Backend ($7/month)
- No cold starts
- Always online
- Better performance
- Upgrade in Render dashboard

### Option 3: Switch to Railway ($5/month)
- Both apps always-on
- One bill for everything
- See `RAILWAY_DEPLOY.md`

---

## 🎓 Perfect for Your Project!

This setup is **ideal for**:
- ✅ Final year projects
- ✅ Portfolio showcasing
- ✅ Demos to lecturers
- ✅ Adding to your CV
- ✅ Low-traffic applications

The 30-50 second cold start is **totally acceptable** for a student project!

---

## 📝 Custom Domain (Optional)

Both services support custom domains:

1. Buy domain (Namecheap, GoDaddy, etc.)
2. In Render → Service → Settings → Custom Domains
3. Add your domain
4. Update DNS records as shown
5. SSL certificate auto-generated

---

## 🆘 Need Help?

- **Render Docs**: https://render.com/docs
- **Django on Render**: https://render.com/docs/deploy-django
- **Static Sites**: https://render.com/docs/static-sites

---

**You're all set! Both apps in one place, 100% free! 🎊**

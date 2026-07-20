# 🚂 Railway Deployment - One Place, Both Apps

Deploy your entire CareerSense project (frontend + backend) to Railway in one place.

## 💰 Pricing
- **$5/month** for both apps
- No cold starts (always online)
- Much simpler than managing two platforms

---

## 🚀 Step-by-Step Deployment

### Step 1: Push to GitHub

```bash
cd "c:\Users\USER\Downloads\careersense-main\careersense-main"
git init
git add .
git commit -m "Ready for Railway deployment"
```

Create a GitHub repo and push:
```bash
git remote add origin https://github.com/YOUR_USERNAME/careersense.git
git branch -M main
git push -u origin main
```

### Step 2: Deploy to Railway

1. Go to [railway.app](https://railway.app)
2. Click **"Login"** → Sign in with GitHub
3. Click **"New Project"**
4. Select **"Deploy from GitHub repo"**
5. Choose your `careersense` repository
6. Railway will detect both Django and React projects

### Step 3: Configure Backend Service

Railway creates two services automatically. For the **Backend**:

1. Click on the backend service
2. Go to **"Settings"** → **"Root Directory"**
   - Set to: `Prediction`
3. Go to **"Variables"** tab
   - Add these environment variables:
   ```
   GROQ_API_KEY=your_groq_api_key_here
   SECRET_KEY=railway-prod-secret-key-change-this-to-random-string
   DEBUG=False
   PYTHON_VERSION=3.11.0
   ```
4. Go to **"Settings"** → **"Deploy"**
   - Build Command: `pip install -r requirements.txt && python manage.py collectstatic --noinput && python manage.py migrate`
   - Start Command: `gunicorn backend.wsgi:application`
5. Click **"Deploy"**

After deployment, Railway gives you a URL like:
```
https://careersense-backend-production.up.railway.app
```

### Step 4: Configure Frontend Service

For the **Frontend**:

1. Click on the frontend service
2. Go to **"Settings"** → **"Root Directory"**
   - Set to: `Frontend`
3. Go to **"Variables"** tab
   - Add:
   ```
   VITE_API_URL=https://careersense-backend-production.up.railway.app
   ```
   (Use the backend URL from Step 3)
4. Go to **"Settings"** → **"Deploy"**
   - Build Command: `npm install && npm run build`
   - Start Command: `npm run preview`
5. Click **"Deploy"**

After deployment, you get a frontend URL like:
```
https://careersense-frontend-production.up.railway.app
```

---

## ✅ You're Done!

Your app is now fully hosted on Railway:
- **Frontend**: https://careersense-frontend-production.up.railway.app
- **Backend**: https://careersense-backend-production.up.railway.app

Both services are in one project, one dashboard, one bill ($5/month).

---

## 🔧 Important: Update CORS (Optional)

For better security, update `Prediction/backend/settings.py`:

```python
# Replace:
CORS_ALLOW_ALL_ORIGINS = True

# With:
CORS_ALLOWED_ORIGINS = [
    "https://careersense-frontend-production.up.railway.app",
    "http://localhost:5173",
]
```

Push to GitHub → Railway auto-redeploys.

---

## 🎯 Advantages of Railway

✅ Both apps in one place  
✅ No cold starts (always online)  
✅ Auto-deploy on git push  
✅ Built-in database support (if needed later)  
✅ Easy to scale  
✅ Better performance than Render free tier

---

## 🆘 Troubleshooting

**Backend not starting?**
- Check Railway logs (click service → "Deployments" tab)
- Verify `GROQ_API_KEY` is set correctly
- Ensure Python version is 3.11

**Frontend can't connect to backend?**
- Verify `VITE_API_URL` matches your backend Railway URL
- Check backend service is running (green status)

**Build failed?**
- Check build logs for specific errors
- Verify `requirements.txt` and `package.json` are correct

---

## 💡 Free Alternative: Render

If you want to stick with free hosting (with cold starts), use:
- **Backend**: Render.com (free, but sleeps after 15 min)
- **Frontend**: Vercel.com (free, always online)

See `DEPLOYMENT_GUIDE.md` for Render + Vercel setup.

---

## 📝 Custom Domain (Optional)

Railway supports custom domains:
1. Buy domain (e.g., from Namecheap, GoDaddy)
2. In Railway → Settings → Domains → Add custom domain
3. Update DNS records as shown
4. SSL certificate auto-generated

---

Need help? Railway docs: https://docs.railway.app

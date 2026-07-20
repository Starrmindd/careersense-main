# 🚀 Deploy Frontend - Final Step!

Your backend is live at: **https://careersense-main.onrender.com**

Now deploy the frontend in 3 minutes!

---

## 📋 Step-by-Step Instructions

### 1. Go to Render Dashboard

Visit: https://render.com/dashboard

### 2. Create Static Site

Click **"New +"** → **"Static Site"**

### 3. Connect Repository

- Select your `careersense-main` repository
- Click **"Connect"**

### 4. Configure Settings

Fill in these **EXACT** values:

| Setting | Value |
|---------|-------|
| **Name** | `careersense-frontend` |
| **Root Directory** | `careersense-main/Frontend` |
| **Build Command** | `npm install && npm run build` |
| **Publish Directory** | `dist` |

### 5. Add Environment Variable

Scroll to **"Environment Variables"** section:

- Click **"Add Environment Variable"**
- **Key**: `VITE_API_URL`
- **Value**: `https://careersense-main.onrender.com`

### 6. Deploy!

- Click **"Create Static Site"**
- Wait 2-3 minutes for build to complete
- You'll get a URL like: `https://careersense-frontend.onrender.com`

---

## ✅ You're Done!

Your complete CareerSense app will be live at:

- **Frontend**: https://careersense-frontend.onrender.com (or your URL)
- **Backend**: https://careersense-main.onrender.com

---

## 🧪 Test Your App

1. Visit your frontend URL
2. Click "AI Advisor"
3. Sign up or sign in
4. Start chatting with the AI!

**Note**: First request may take 30-50 seconds if backend was sleeping.

---

## 🎉 Congratulations!

You've successfully deployed CareerSense to the internet!

- ✅ Backend deployed on Render
- ✅ Frontend deployed on Render
- ✅ Both apps connected
- ✅ 100% FREE hosting

---

## 📝 What to Share

Add these to your CV/Portfolio:

- **Live Demo**: [Your frontend URL]
- **GitHub**: https://github.com/Starrmindd/careersense-main
- **Tech Stack**: React, Django, Machine Learning, Groq AI
- **Description**: AI-powered career guidance platform for IT students

---

## 🔧 If Something Goes Wrong

### Frontend Build Fails

Check Render logs for:
- Node.js version issues → Render uses latest by default
- Missing dependencies → Check `package.json`
- Environment variable not set → Verify `VITE_API_URL`

### Frontend Can't Connect to Backend

1. Check browser console (F12) for errors
2. Verify `VITE_API_URL` is set in Render environment variables
3. Make sure backend URL is correct (no trailing slash)
4. Test backend directly: https://careersense-main.onrender.com

### Backend Returns Errors

1. Go to Render dashboard → Backend service → **Logs**
2. Look for Python errors
3. Check environment variables are set correctly
4. Verify `GROQ_API_KEY` is valid

---

## 🆘 Need Help?

- **Render Docs**: https://render.com/docs/static-sites
- **Check Logs**: Render Dashboard → Service → Logs tab
- **Test Backend**: Visit https://careersense-main.onrender.com (should show `{"status": "ok"}`)

---

**Good luck with your final year project! 🎓**

@echo off
echo ================================================
echo CareerSense Frontend Deployment Setup
echo ================================================
echo.

cd /d "%~dp0"

echo Please enter your Render BACKEND URL
echo (Example: https://careersense-backend.onrender.com)
echo.
set /p BACKEND_URL="Backend URL: "

echo.
echo Updating Frontend/.env with your backend URL...
echo VITE_API_URL=%BACKEND_URL%> careersense-main\Frontend\.env

echo.
echo Committing changes...
git add careersense-main/Frontend/.env
git commit -m "Update frontend API URL for production"

echo.
echo Pushing to GitHub...
git push origin main

echo.
echo ================================================
echo DONE! Frontend configuration updated and pushed!
echo ================================================
echo.
echo NEXT STEPS:
echo 1. Go to https://render.com/dashboard
echo 2. Click "New +" then "Static Site"
echo 3. Select your careersense-main repository
echo 4. Configure:
echo    - Name: careersense-frontend
echo    - Root Directory: careersense-main/Frontend
echo    - Build Command: npm install ^&^& npm run build
echo    - Publish Directory: dist
echo 5. Add Environment Variable:
echo    - Key: VITE_API_URL
echo    - Value: %BACKEND_URL%
echo 6. Click "Create Static Site"
echo.
echo Your app will be live in 2-3 minutes!
echo.

pause

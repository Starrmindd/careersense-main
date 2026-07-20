@echo off
echo ================================================
echo CareerSense Deployment Setup
echo ================================================
echo.

cd /d "%~dp0"

echo Step 1: Initializing Git repository...
git init
if errorlevel 1 (
    echo ERROR: Git is not installed or not in PATH
    echo Please install Git from: https://git-scm.com/download/win
    pause
    exit /b 1
)

echo.
echo Step 2: Adding all files...
git add .

echo.
echo Step 3: Creating initial commit...
git commit -m "Initial deployment commit"

echo.
echo ================================================
echo NEXT STEPS:
echo ================================================
echo.
echo 1. Create a GitHub repository:
echo    - Go to: https://github.com/new
echo    - Name: careersense
echo    - Make it PUBLIC
echo    - Click "Create repository"
echo.
echo 2. Copy your GitHub username
echo.
set /p GITHUB_USERNAME="Enter your GitHub username: "

echo.
echo 3. Run these commands to push:
echo.
echo git remote add origin https://github.com/%GITHUB_USERNAME%/careersense.git
echo git branch -M main
echo git push -u origin main
echo.
echo Copy the commands above and run them!
echo.

pause

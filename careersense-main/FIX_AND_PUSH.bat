@echo off
echo ================================================
echo Fixing API Key Exposure and Pushing to GitHub
echo ================================================
echo.

cd /d "%~dp0"

echo Step 1: Adding fixed files...
git add RENDER_COMMANDS.txt RENDER_ONLY_DEPLOY.md COMMANDS_TO_RUN.txt DEPLOY_NOW.md RAILWAY_DEPLOY.md

echo.
echo Step 2: Committing changes...
git commit -m "Remove exposed API keys from documentation"

echo.
echo Step 3: Pushing to GitHub...
git push origin main

echo.
echo ================================================
echo Done! Your code should now be on GitHub.
echo ================================================
echo.
echo Next: Continue with RENDER_ONLY_DEPLOY.md Step 2
echo.

pause

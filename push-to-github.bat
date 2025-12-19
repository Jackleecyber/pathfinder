@echo off
echo ========================================
echo Pushing Pathfinder to GitHub
echo ========================================
echo.

cd /d "C:\Users\Jack Lee\Desktop\Delta"

echo Checking Git installation...
git --version
if errorlevel 1 (
    echo.
    echo ERROR: Git is not found!
    echo Please restart PowerShell or check Git installation.
    echo.
    pause
    exit /b 1
)

echo.
echo Initializing Git repository...
git init

echo.
echo Adding all files...
git add .

echo.
echo Creating commit...
git commit -m "Initial commit: Mentorship platform website for Malaysian students"

echo.
echo Setting main branch...
git branch -M main

echo.
echo Connecting to GitHub...
git remote add origin https://github.com/Jackleecyber/pathfinder.git
if errorlevel 1 (
    echo Remote already exists, updating...
    git remote set-url origin https://github.com/Jackleecyber/pathfinder.git
)

echo.
echo Pushing to GitHub...
echo (You may be prompted for GitHub credentials)
git push -u origin main

echo.
echo ========================================
echo Done! Check https://github.com/Jackleecyber/pathfinder
echo ========================================
pause


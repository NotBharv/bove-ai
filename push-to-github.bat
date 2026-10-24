@echo off
REM ==============================================================================
REM Bove AI Studio - 1-Click Push to GitHub Script for Windows
REM ==============================================================================
title Bove AI - Push to GitHub

echo ==========================================================
echo Bove AI Studio - Push directly to your GitHub Repository
echo ==========================================================
echo.

git --version >nul 2>&1
if errorlevel 1 (
    echo Error: Git is not installed or not in PATH. Please install Git from https://git-scm.com
    pause
    exit /b 1
)

if not exist ".git" (
    echo Initializing local git repository...
    git init
    git branch -M main
)

set GITHUB_USER=bbharey
set /p USER_INPUT="Enter your GitHub username [default: bbharey]: "
if not "%USER_INPUT%"=="" set GITHUB_USER=%USER_INPUT%

echo.
echo Target GitHub Repo: https://github.com/%GITHUB_USER%/bove-ai.git
echo.

echo Staging files...
git add .

echo Committing files...
git commit -m "feat: complete Bove AI Nepali studio source code and configurations"

git branch -M main
git remote remove origin >nul 2>&1
git remote add origin https://github.com/%GITHUB_USER%/bove-ai.git

echo.
echo Pushing code to GitHub...
echo If prompted, sign in via browser or enter your GitHub credentials.
echo.
git push -u origin main

if errorlevel 1 (
    echo.
    echo Warning: Make sure you created the repo at https://github.com/new named "bove-ai"
    echo Then run: git push -u origin main
) else (
    echo.
    echo SUCCESS! Your code is now live on GitHub!
    echo Visit: https://github.com/%GITHUB_USER%/bove-ai
)

pause

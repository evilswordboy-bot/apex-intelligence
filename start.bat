@echo off
title APEX Sports Intelligence Platform Launcher
echo =====================================================================
echo    APEX - High-Performance AI Sports Telemetry Platform
echo =====================================================================
echo.
echo [1/2] Starting FastAPI Backend on http://127.0.0.1:8000 ...
start "APEX Backend (FastAPI)" cmd /k "cd /d %~dp0backend && python -m uvicorn app.main:app --port 8000 --host 127.0.0.1"

echo [2/2] Starting Next.js Production Frontend on http://localhost:3000 ...
start "APEX Frontend (Next.js)" cmd /k "cd /d %~dp0 && npm start -- -p 3000"

echo.
echo =====================================================================
echo  APEX Platform is now launching!
echo.
echo  Access URLs:
echo  - Landing Page:         http://localhost:3000/
echo  - Cricket Lab:          http://localhost:3000/dashboard?tab=cricket
echo  - Sports Intelligence:  http://localhost:3000/analytics
echo  - Analytics Tab:        http://localhost:3000/dashboard?tab=analytics
echo  - AI Sports Agent:      http://localhost:3000/agent
echo  - Live Match Centre:    http://localhost:3000/live
echo  - Predictions Engine:   http://localhost:3000/predictions
echo  - User Profile:         http://localhost:3000/profile
echo  - Feedback & Health:    http://localhost:3000/feedback
echo  - Backend API Docs:     http://localhost:8000/docs
echo =====================================================================
echo.
timeout /t 3 >nul
start http://localhost:3000/

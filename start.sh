#!/usr/bin/env bash
# APEX Sports Intelligence Platform Launcher

echo "====================================================================="
echo "   APEX - High-Performance AI Sports Telemetry Platform"
echo "====================================================================="

echo "[1/2] Starting FastAPI Backend on http://127.0.0.1:8000 ..."
(cd backend && python3 -m uvicorn app.main:app --port 8000 --host 127.0.0.1) &
BACKEND_PID=$!

echo "[2/2] Starting Next.js Frontend on http://localhost:3000 ..."
npm start -- -p 3000 &
FRONTEND_PID=$!

echo "Access URLs:"
echo "- Landing Page:         http://localhost:3000/"
echo "- Cricket Lab:          http://localhost:3000/dashboard?tab=cricket"
echo "- Sports Intelligence:  http://localhost:3000/analytics"
echo "- Analytics Tab:        http://localhost:3000/dashboard?tab=analytics"
echo "- AI Sports Agent:      http://localhost:3000/agent"
echo "- Live Match Centre:    http://localhost:3000/live"
echo "- Predictions Engine:   http://localhost:3000/predictions"
echo "- Backend Health:       http://localhost:8000/health"

trap "kill $BACKEND_PID $FRONTEND_PID" EXIT
wait

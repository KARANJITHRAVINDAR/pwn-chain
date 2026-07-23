#!/bin/bash

echo "=========================================="
echo "Starting Pwnchain Platform Services..."
echo "=========================================="

echo "[1/2] Starting FastAPI Backend on port 8000..."

cd platform/backend || exit

# Activate virtual environment
source .venv/bin/activate

# Start backend in background
uvicorn main:app --reload --port 8000 &

BACKEND_PID=$!

cd ../frontend || exit

echo "[2/2] Starting React Frontend on port 5173..."

# Start frontend in background
npm run dev &

FRONTEND_PID=$!

echo
echo "All services have been launched!"
echo "Frontend URL: http://localhost:5173"
echo "Backend API:  http://localhost:8000/docs"
echo
echo "Backend PID : $BACKEND_PID"
echo "Frontend PID: $FRONTEND_PID"
echo
echo "Press Ctrl+C to stop both services."

wait
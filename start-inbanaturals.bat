@echo off
echo ==========================================
echo Starting InbaNaturals Services...
echo ==========================================

echo [1/2] Starting FastAPI Backend on port 8000...
start cmd /k "title InbaNaturals Backend && cd InbaNaturals\backend && call .\venv\Scripts\activate.bat && uvicorn app.main:app --reload --port 8000"

echo [2/2] Starting React Frontend on port 5173...
start cmd /k "title InbaNaturals Frontend && cd InbaNaturals\frontend && npm run dev"

echo.
echo All services have been launched in separate windows!
echo - Frontend URL: http://localhost:5173
echo - Backend API:  http://localhost:8000/docs
echo.
pause

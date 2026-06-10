@echo off
setlocal

echo Starting zhidoc backend server...

cd /d "%~dp0"

REM Get API_PORT from .env file, default to 8000 if not found
for /f "tokens=1,2 delims==" %%a in ('type .env ^| findstr "API_PORT"') do (
    set PORT=%%b
)
if "%PORT%"=="" set PORT=8000

echo Checking if port %PORT% is in use...

REM Check if port is in use
netstat -ano | findstr :%PORT% >nul
if %errorlevel% equ 0 (
    echo Port %PORT% is in use, killing the process...
    for /f "tokens=5" %%a in ('netstat -ano ^| findstr :%PORT%') do (
        set PID=%%a
        goto :found_pid
    )
    :found_pid
    taskkill /F /PID %PID% >nul 2>&1
    if %errorlevel% equ 0 (
        echo Process %PID% killed successfully.
    ) else (
        echo Failed to kill process %PID%, continuing...
    )
) else (
    echo Port %PORT% is available.
)

if not exist ".venv\Scripts\python.exe" (
    echo Creating backend virtual environment...
    python -m venv .venv
    if errorlevel 1 (
        echo Failed to create virtual environment. Please install Python and ensure it is available in PATH.
        pause
        exit /b 1
    )
)

set "PYTHON=.venv\Scripts\python.exe"

echo Installing backend dependencies...
"%PYTHON%" -m pip install --upgrade pip
if errorlevel 1 (
    echo Failed to upgrade pip.
    pause
    exit /b 1
)

"%PYTHON%" -m pip install -r requirements.txt
if errorlevel 1 (
    echo Failed to install backend dependencies.
    pause
    exit /b 1
)

echo Backend virtual environment is ready.
echo Starting API server at http://127.0.0.1:%PORT%

"%PYTHON%" -m uvicorn app.main:app --host 0.0.0.0 --port %PORT% --reload

pause
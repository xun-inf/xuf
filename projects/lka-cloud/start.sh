#!/bin/bash
set -e

echo "Starting lka cloud server..."

cd "$(dirname "$0")"

# Get API_PORT from .env file, default to 8000 if not found
PORT=$(grep "API_PORT" .env | cut -d'=' -f2 | tr -d '\r')
if [ -z "$PORT" ]; then
    PORT=8000
fi

echo "Checking if port $PORT is in use..."

# Check if port is in use and kill the process
if lsof -Pi :$PORT -sTCP:LISTEN -t >/dev/null 2>&1; then
    echo "Port $PORT is in use, killing the process..."
    PID=$(lsof -Pi :$PORT -sTCP:LISTEN -t)
    if [ ! -z "$PID" ]; then
        kill -9 $PID 2>/dev/null
        if [ $? -eq 0 ]; then
            echo "Process $PID killed successfully."
        else
            echo "Failed to kill process $PID, continuing..."
        fi
    fi
else
    echo "Port $PORT is available."
fi

if [ -x ".venv/bin/python" ]; then
    PYTHON=".venv/bin/python"
elif [ -x ".venv/Scripts/python.exe" ]; then
    PYTHON=".venv/Scripts/python.exe"
else
    echo "Creating backend virtual environment..."
    python -m venv .venv
    if [ -x ".venv/bin/python" ]; then
        PYTHON=".venv/bin/python"
    elif [ -x ".venv/Scripts/python.exe" ]; then
        PYTHON=".venv/Scripts/python.exe"
    else
        echo "Failed to create virtual environment. Please install Python and ensure it is available in PATH."
        exit 1
    fi
fi

echo "Installing backend dependencies..."
"$PYTHON" -m pip install -r requirements.txt

echo "Backend virtual environment is ready."
echo "Starting API server at http://127.0.0.1:$PORT"

"$PYTHON" -m uvicorn app.main:app --host 0.0.0.0 --port $PORT --reload
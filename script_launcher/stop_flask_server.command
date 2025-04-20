#!/bin/bash

# Get the PID of the Flask app server from the PID file, if available
PID=$(cat /tmp/web_app_server.pid)

# Kill the specific Flask process using its PID (if available)
if [ -n "$PID" ]; then
  kill $PID
  echo "Flask server with PID $PID has been terminated."
  rm /tmp/web_app_server.pid
else
  echo "No PID file found. Searching for Python Flask processes."
fi

# Kill all Python processes that might be related to Flask
pkill -f "python3 app.py"

# Optionally, you can also kill any lingering processes by searching for 'flask' or 'python3'
# pkill -f "flask"

exit 0

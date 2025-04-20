#!/bin/bash

# Set the folder where your index.html and JSON/images live
PROJECT_DIR="/Users/gliumacbookpro2018/My Drive/600 Learn (Competence development)/510 Coding portfolio/Städa/städa_web"

# Change to that directory
cd "$PROJECT_DIR" || exit

# Start the Flask app (assumes app.py runs the server on port 5000)
python3 app.py &

# Save PID to stop it later if needed
echo $! > /tmp/web_app_server.pid

# Wait a bit for server to start
sleep 2

# Open in default browser
open "http://127.0.0.1:5000"

# Exit script (will close Terminal if it's set to close on exit)
exit 0
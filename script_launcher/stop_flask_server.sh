#!/bin/bash

# Try to find and kill all Python processes related to Flask
echo "Searching for Python processes related to Flask..."
pkill -f "python"

# Optionally, you can also specifically target Flask using "flask"
# pkill -f "flask"

echo "Attempted to stop any running Python Flask server processes."

exit 0

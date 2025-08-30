#!/bin/bash
# Kill any existing node processes
pkill -f node

# Wait a moment for processes to terminate
sleep 2

# Start the server
node server.js
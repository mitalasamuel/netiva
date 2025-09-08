# Backend Automatic Startup Setup

This document explains how to set up automatic backend startup for the School Management App.

## Quick Start

### Option 1: Start Everything at Once (Recommended)
```bash
npm run start:app
```
This will automatically start the backend server and then the frontend.

### Option 2: Start Backend and Frontend Separately
```bash
# Start backend only
npm run backend:start

# Start frontend only (in another terminal)
npm start
```

## Backend Management Commands

| Command | Description |
|---------|-------------|
| `npm run backend:start` | Start the backend server |
| `npm run backend:stop` | Stop the backend server |
| `npm run backend:restart` | Restart the backend server |
| `npm run backend:logs` | View backend logs |
| `npm run backend:status` | Check backend status |
| `npm run backend:dev` | Start backend in development mode with auto-restart |

## Setup for Automatic System Startup

To make the backend start automatically when your computer boots up:

```bash
npm run setup:pm2
```

This will configure PM2 to automatically start the backend server when your system starts.

## Troubleshooting

### Backend Not Starting
1. Check if PM2 is installed: `pm2 --version`
2. Install PM2 globally: `npm install -g pm2`
3. Check backend logs: `npm run backend:logs`

### Port Already in Use
If port 3001 is already in use:
1. Stop the backend: `npm run backend:stop`
2. Kill any processes using port 3001: `lsof -ti:3001 | xargs kill -9`
3. Start the backend again: `npm run backend:start`

### Backend Not Responding
1. Check backend status: `npm run backend:status`
2. Check backend logs: `npm run backend:logs`
3. Restart the backend: `npm run backend:restart`

## Configuration

The backend configuration is managed through:
- **PM2 Config**: `backend/ecosystem.config.js`
- **Server Config**: `backend/server.js`
- **Environment Variables**: `backend/.env` (if exists)

## Logs

Backend logs are stored in:
- `backend/logs/err.log` - Error logs
- `backend/logs/out.log` - Output logs
- `backend/logs/combined.log` - Combined logs

View logs in real-time:
```bash
npm run backend:logs
```

## Development vs Production

- **Development**: Backend runs on port 3001 with auto-restart
- **Production**: Backend runs on port 3001 with PM2 process management

The frontend automatically connects to `http://localhost:3001` for API calls.

# 🚀 Automatic Backend Startup Setup

Your School Management App backend will now start automatically without any manual intervention!

## ✅ **What's Configured:**

### 1. **System Boot Auto-Start**
- Backend starts automatically when your computer boots up
- Configured with PM2 and macOS LaunchAgent
- No manual intervention required

### 2. **Project Auto-Start**
- Backend starts automatically when you open the project in VS Code
- Runs the auto-start script on folder open
- Checks if backend is already running before starting

### 3. **VS Code Integration**
- Automatic task execution on project open
- Easy-to-use tasks for backend management
- Integrated terminal commands

## 🎯 **How It Works:**

### **Automatic Startup Methods:**

1. **System Boot** (Permanent)
   - Backend starts when your Mac boots up
   - Runs in background with PM2 process manager
   - Automatically restarts if it crashes

2. **VS Code Project Open** (Development)
   - Backend starts when you open the project folder
   - Only starts if not already running
   - Perfect for development workflow

3. **Manual Commands** (When Needed)
   ```bash
   npm run auto-start    # Start backend if not running
   npm run start:app     # Start both backend and frontend
   ```

## 🛠️ **Available Commands:**

| Command | Description | When to Use |
|---------|-------------|-------------|
| `npm run auto-start` | Start backend automatically | When opening project |
| `npm run start:app` | Start both backend and frontend | Full app startup |
| `npm run backend:start` | Start backend only | Manual backend start |
| `npm run backend:stop` | Stop backend | When you want to stop |
| `npm run backend:restart` | Restart backend | When backend has issues |
| `npm run backend:logs` | View backend logs | For debugging |
| `npm run backend:status` | Check backend status | To verify it's running |

## 🔧 **VS Code Tasks:**

Access these through VS Code Command Palette (`Cmd+Shift+P`):
- **"Tasks: Run Task"** → **"Auto Start Backend"**
- **"Tasks: Run Task"** → **"Start Full App"**
- **"Tasks: Run Task"** → **"Start Backend Only"**
- **"Tasks: Run Task"** → **"Stop Backend"**
- **"Tasks: Run Task"** → **"View Backend Logs"**

## 📋 **Verification Steps:**

### **Check if Backend is Running:**
```bash
npm run backend:status
```
Should show: `school-management-server | online`

### **Test Backend Response:**
```bash
curl http://localhost:3001/api/login -X POST -H "Content-Type: application/json" -d '{"userId":"test","role":"Student"}'
```
Should return: `{"message":"Invalid student ID"}`

### **Check System Boot Status:**
```bash
pm2 list
```
Should show the backend process as `online`

## 🚨 **Troubleshooting:**

### **Backend Not Starting Automatically:**
1. Check PM2 status: `pm2 list`
2. Check logs: `npm run backend:logs`
3. Restart PM2: `pm2 restart school-management-server`

### **System Boot Not Working:**
1. Re-run setup: `npm run setup:pm2`
2. Check LaunchAgent: `ls ~/Library/LaunchAgents/`
3. Manual start: `pm2 resurrect`

### **Port Already in Use:**
1. Stop backend: `npm run backend:stop`
2. Kill port: `lsof -ti:3001 | xargs kill -9`
3. Restart: `npm run auto-start`

## 📁 **File Structure:**

```
SchoolManagementApp/
├── scripts/
│   ├── auto-start.sh          # Auto-start script
│   ├── start-app.sh           # Full app startup
│   └── setup-pm2-startup.sh   # PM2 setup script
├── .vscode/
│   ├── tasks.json             # VS Code tasks
│   └── settings.json          # VS Code settings
├── backend/
│   └── ecosystem.config.js    # PM2 configuration
└── package.json               # NPM scripts
```

## 🎉 **You're All Set!**

Your backend server will now:
- ✅ Start automatically when your computer boots up
- ✅ Start automatically when you open the project
- ✅ Restart automatically if it crashes
- ✅ Run in the background without manual intervention
- ✅ Be accessible at `http://localhost:3001`

**No more manual terminal commands needed!** 🚀

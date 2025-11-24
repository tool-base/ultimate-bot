# 🖥️ Local Development Guide - Step by Step

**For:** Windows, macOS, and Ubuntu/Linux  
**Last Updated:** November 24, 2025

---

## 📋 Table of Contents

1. [System Setup](#system-setup)
2. [Project Setup](#project-setup)
3. [Configuration](#configuration)
4. [Running Locally](#running-locally)
5. [Development Workflow](#development-workflow)
6. [Debugging](#debugging)
7. [Common Issues](#common-issues)

---

## 🔧 System Setup

### Option 1: Windows 10/11

#### Step 1: Install Node.js

1. Download from [nodejs.org](https://nodejs.org/) (LTS version)
2. Run the installer
3. Follow the setup wizard (use defaults)
4. Verify installation:
   ```cmd
   node --version
   npm --version
   ```

#### Step 2: Install Git

1. Download from [git-scm.com](https://git-scm.com/)
2. Run installer, use defaults
3. Verify:
   ```cmd
   git --version
   ```

#### Step 3: Install a Code Editor

- **VS Code** (Recommended) - Download from [code.visualstudio.com](https://code.visualstudio.com/)
- Install these extensions:
  - ES7+ React/Redux/React-Native snippets
  - Prettier
  - ESLint
  - Thunder Client (for API testing)

#### Step 4: Install PostgreSQL (Optional - for production)

1. Download from [postgresql.org](https://www.postgresql.org/download/windows/)
2. Run installer, note the password
3. Verify:
   ```cmd
   psql --version
   ```

---

### Option 2: macOS

#### Step 1: Install Homebrew

```bash
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
```

#### Step 2: Install Node.js & npm

```bash
brew install node@20

# Verify
node --version    # v20.x.x
npm --version     # 10.x.x
```

#### Step 3: Install Git

```bash
brew install git

# Verify
git --version
```

#### Step 4: Install PostgreSQL (Optional)

```bash
brew install postgresql

# Start service
brew services start postgresql
```

#### Step 5: Install VS Code

```bash
brew install --cask visual-studio-code
```

---

### Option 3: Ubuntu/Debian Linux

#### Step 1: Update System

```bash
sudo apt update
sudo apt upgrade -y
```

#### Step 2: Install Node.js & npm

```bash
# Download and run setup script
curl -sL https://deb.nodesource.com/setup_20.x | sudo -E bash -

# Install
sudo apt install -y nodejs

# Verify
node --version    # v20.x.x
npm --version     # 10.x.x
```

#### Step 3: Install Git

```bash
sudo apt install -y git

# Verify
git --version
```

#### Step 4: Install PostgreSQL (Optional)

```bash
sudo apt install -y postgresql postgresql-contrib

# Start service
sudo systemctl start postgresql
sudo systemctl enable postgresql
```

#### Step 5: Install VS Code

```bash
sudo apt install -y code

# Or download from code.visualstudio.com
```

---

## 📂 Project Setup

### Step 1: Clone Repository

```bash
# Choose a directory for your projects
cd ~/projects  # or your preferred location

# Clone the repository
git clone https://github.com/yourusername/ultimate-bot.git

# Enter directory
cd ultimate-bot

# Verify structure
ls -la
```

### Step 2: Install Root Dependencies

```bash
# Install packages listed in package.json
npm install

# This installs:
# - React & React Router (frontend)
# - Express (backend)
# - Vite (build tool)
# - TailwindCSS (styling)
# - Axios (HTTP client)
# - WebSocket (ws)
# - And many more...

# Verify installation
npm ls --depth=0
```

### Step 3: Install Bot Dependencies

```bash
# Go to bot directory
cd whatsapp-bot

# Install bot packages
npm install

# This installs:
# - Baileys (WhatsApp library)
# - Node-cron (scheduling)
# - Moment-timezone (time handling)
# - Supabase (optional DB)
# - And utilities...

# Return to root
cd ..
```

### Step 4: Create Data Directory

```bash
# This will be created automatically, but verify
ls -la data/

# You should see:
# merchants.json (will be created when you run the script)
# products.json (will be created when you run the script)
# etc.
```

---

## ⚙️ Configuration

### Step 1: Create Environment File

In the project root, create `.env.local`:

```bash
# macOS/Linux
touch .env.local

# Windows
type nul > .env.local
```

### Step 2: Add Configuration

Open `.env.local` and add:

```env
# Frontend Configuration
VITE_API_BASE_URL=http://localhost:5174

# Backend Configuration
PORT=5174
NODE_ENV=development
API_BASE_URL=http://localhost:5174

# WhatsApp Bot Configuration
BAILEYS_LOG_LEVEL=info
BOT_PREFIX=!

# WebSocket Configuration
WS_PORT=5174
WS_HOST=localhost

# Database Configuration (for production later)
# DB_HOST=localhost
# DB_PORT=5432
# DB_NAME=ultimate_bot
# DB_USER=postgres
# DB_PASSWORD=your_password
```

### Step 3: Verify Configuration

```bash
# Check file exists
cat .env.local

# You should see all the variables you added
```

---

## 🚀 Running Locally

### Architecture: 3 Services

Your application has 3 independent services that communicate via HTTP/WebSocket:

```
Frontend (React)      ←→ API (Express)      ←→ Database (JSON/PostgreSQL)
Port 5173                Port 5174               /data folder

WhatsApp Bot          ←→ API (Express)
Port 3001                Port 5174
```

### Method 1: Run in Separate Terminals (Recommended)

This is the best way to develop because you can see logs from each service separately.

#### Terminal 1: Start Express API Server

```bash
# In project root (/workspaces/ultimate-bot)
npm run api

# You should see:
# ✅ Dashboard API Server running on http://localhost:5174
# ✅ WebSocket server ready at ws://localhost:5174/ws
# 💾 Data stored in: /workspaces/ultimate-bot/data
```

**What it does:**
- Starts Express server on port 5174
- Initializes WebSocket for real-time events
- Sets up data storage (JSON in dev mode)
- Ready to accept API requests

#### Terminal 2: Create Test Data (One Time Only)

```bash
# In project root
bash create_test_data.sh

# You should see:
# 🤖 Ultimate Bot - Test Data Setup Script
# ✅ API is running!
# ✅ Pizza Palace created
# ✅ Fresh Bakery created
# ✅ Cool Beverages created
# ✅ SUCCESS! Test data created
```

**What it does:**
- Creates 3 test merchants
- Adds 5-6 products to each merchant
- Stores data in `data/merchants.json` and `data/products.json`

#### Terminal 3: Start Frontend Dev Server

```bash
# In project root
npm run dev

# You should see:
# ➜  Local:   http://localhost:5173/
# ➜  press h to show help
```

**What it does:**
- Starts Vite dev server on port 5173
- Enables hot module replacement (HMR)
- Auto-refreshes when you save files
- Ready for frontend development

#### Terminal 4: Start WhatsApp Bot

```bash
# In project root
cd whatsapp-bot

# Start bot
npm run dev

# You should see:
# 🤖 Enterprise WhatsApp Bot v2.0
# ✅ Bot initialized successfully
# 📱 Scan this QR code with WhatsApp:
# ╔════════════════════════╗
# ║  [QR CODE APPEARS]     ║
# ╚════════════════════════╝
# Waiting for connection...
```

**What to do:**
1. Open WhatsApp on your phone
2. Go to Settings → Linked Devices → Link a Device
3. Point your phone camera at the QR code
4. Wait for "Connection established ✅"

### Verifying All Services Are Running

```bash
# In a new terminal, test each service:

# Test API
curl http://localhost:5174/api/health
# Should return: {"status":"ok"}

# Test WebSocket (optional)
curl -i -N \
  -H "Connection: Upgrade" \
  -H "Upgrade: websocket" \
  -H "Sec-WebSocket-Key: $(date | md5sum | cut -c1-24)" \
  -H "Sec-WebSocket-Version: 13" \
  http://localhost:5174/ws

# Test Frontend
curl http://localhost:5173/
# Should return HTML of React app
```

---

## 💻 Development Workflow

### File Structure You'll Work With

```
ultimate-bot/
├── src/
│   ├── server/
│   │   ├── index.js          ← Modify to add API endpoints
│   │   └── websocket.js      ← Modify for real-time features
│   ├── components/           ← Create React components here
│   ├── pages/               ← Create React pages here
│   └── App.tsx              ← Modify main app
│
├── whatsapp-bot/src/
│   ├── handlers/            ← Modify command handlers
│   ├── registry/            ← Update command definitions
│   ├── services/            ← Modify message service
│   └── api/                 ← Update API integration
│
└── data/                    ← JSON data (auto-created)
    ├── merchants.json
    ├── products.json
    └── ...
```

### Making Your First Change

#### Example 1: Add a New API Endpoint

1. **Edit** `src/server/index.js`
2. **Add** your endpoint:
   ```javascript
   app.get('/api/myfeature', (req, res) => {
     res.json({ message: 'Hello from my feature' });
   });
   ```
3. **Save** the file
4. **Restart** API server (Ctrl+C, then run again)
5. **Test** with curl:
   ```bash
   curl http://localhost:5174/api/myfeature
   ```

#### Example 2: Add a New React Component

1. **Create** `src/components/MyComponent.tsx`
2. **Add** your component:
   ```tsx
   export function MyComponent() {
     return <div>Hello from my component</div>;
   }
   ```
3. **Import** in `src/App.tsx`:
   ```tsx
   import { MyComponent } from './components/MyComponent';
   ```
4. **Use** in your app
5. **Save** - Frontend auto-refreshes (HMR)

#### Example 3: Add a New Bot Command

1. **Register** in `whatsapp-bot/src/registry/commandRegistry.js`:
   ```javascript
   mycommand: {
     name: 'My Command',
     aliases: ['mc'],
     description: 'My new command',
     usage: '!mycommand',
     category: 'utility'
   }
   ```
2. **Add handler** in `whatsapp-bot/src/handlers/customerHandler.js`:
   ```javascript
   async handleMyCommand(args, phoneNumber, from) {
     await this.messageService.sendTextMessage(from, 'Hello from my command!');
     return { success: true };
   }
   ```
3. **Route** in `whatsapp-bot/src/index.js`:
   ```javascript
   case 'mycommand':
   case 'mc':
     return await this.customerHandler.handleMyCommand(args, from);
   ```
4. **Save** and restart bot
5. **Test** in WhatsApp: type `!mycommand`

### Hot Reload & Auto-Refresh

- **Frontend (React)**: Changes auto-reload - just save!
- **Backend (Express)**: Need to restart - Ctrl+C and run again
- **Bot**: Need to restart - Ctrl+C and run again

---

## 🐛 Debugging

### Browser DevTools (Frontend)

1. Open `http://localhost:5173` in your browser
2. Press `F12` to open DevTools
3. Use Console tab to see logs
4. Use Network tab to see API calls
5. Use Application tab to inspect React state

### Terminal Logs (Backend)

All your terminal windows show logs:

- **Terminal 1 (API)**: Express requests and WebSocket connections
- **Terminal 3 (Frontend)**: Vite build messages
- **Terminal 4 (Bot)**: Bot activities and message logs

### API Testing

Use a REST client to test your APIs:

**Option 1: cURL (command line)**
```bash
curl -X POST http://localhost:5174/api/merchants \
  -H "Content-Type: application/json" \
  -d '{"phone_number":"263712345601","store_name":"Store","category":"Food"}'
```

**Option 2: Thunder Client (VS Code extension)**
1. Install Thunder Client in VS Code
2. Create new request
3. Set method and URL
4. Send and see response

**Option 3: Postman**
1. Download from postman.com
2. Create requests
3. Save collections
4. Export for sharing

### Adding Console Logs

```javascript
// In Express (src/server/index.js)
app.get('/api/test', (req, res) => {
  console.log('✅ Test endpoint called');
  console.log('Request:', req.query);
  res.json({ message: 'test' });
});

// In React (src/components/MyComponent.tsx)
export function MyComponent() {
  useEffect(() => {
    console.log('✅ Component mounted');
  }, []);
  return <div>Hello</div>;
}

// In Bot (whatsapp-bot/src/handlers/customerHandler.js)
async handleMyCommand(args, phoneNumber, from) {
  console.log('✅ My command triggered');
  console.log('Args:', args);
  // ... rest of code
}
```

### Debugging API Errors

```bash
# Check if API is running
curl http://localhost:5174/api/health

# Check for port conflicts
# Windows
netstat -ano | findstr :5174

# macOS/Linux
lsof -i :5174

# Check API logs in Terminal 1 for error messages
```

---

## 🆘 Common Issues

### Issue 1: "Port Already in Use"

**Error:**
```
Error: listen EADDRINUSE :::5174
```

**Solution:**
```bash
# Find process using the port
# Windows
netstat -ano | findstr :5174

# macOS/Linux
lsof -i :5174

# Kill the process
# Windows (replace PID)
taskkill /PID 12345 /F

# macOS/Linux
kill -9 <PID>

# Or use different port
PORT=5175 npm run api
```

### Issue 2: "Cannot Find Module"

**Error:**
```
Error: Cannot find module 'express'
```

**Solution:**
```bash
# Reinstall dependencies
rm -rf node_modules package-lock.json

# Reinstall
npm install

# For bot
cd whatsapp-bot
npm install
cd ..
```

### Issue 3: "API Not Responding"

**Error:**
```
curl: (7) Failed to connect to localhost port 5174
```

**Solution:**
```bash
# Check if API is running in Terminal 1
# Restart if needed

# Or test if port is open
curl -v http://localhost:5174/api/health

# Check firewall
# macOS: Check System Preferences → Security & Privacy
# Windows: Check Windows Defender Firewall
# Linux: Check iptables or UFW
```

### Issue 4: "Bot QR Code Not Appearing"

**Solution:**
```bash
# Make sure Terminal is maximized/visible
# Try restarting:
# 1. Stop bot (Ctrl+C in Terminal 4)
# 2. Wait 3 seconds
# 3. Restart: npm run bot:dev
# 4. Look for QR code

# If still not working:
# - Check Baileys is installed: cd whatsapp-bot && npm ls @whiskeysockets/baileys
# - Check Node version: node --version (should be 18+)
```

### Issue 5: "[object Object] Error in Bot Logs"

**Solution:**
```bash
# This means no merchants exist
# Run the test data script
bash create_test_data.sh

# Or manually create a merchant
curl -X POST http://localhost:5174/api/merchants \
  -H "Content-Type: application/json" \
  -d '{"phone_number":"263712345601","store_name":"Store","category":"Food"}'
```

### Issue 6: "CORS Error: Origin Not Allowed"

**Error:**
```
Access to XMLHttpRequest at 'http://...' has been blocked by CORS policy
```

**Solution:**
```javascript
// Already configured in src/server/index.js
// Should look like:
const cors = require('cors');
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type']
}));
```

### Issue 7: "WhatsApp QR Code Expired"

**Solution:**
```bash
# QR codes expire after ~2 minutes
# Just restart the bot:
# 1. Ctrl+C in Terminal 4
# 2. npm run bot:dev
# 3. Scan the new QR code immediately
```

---

## 📊 Development Workflow Summary

```
┌─────────────────┐
│ 1. Edit Code    │
└────────┬────────┘
         │
┌────────▼────────────────────────────┐
│ 2. Auto-Save (or Ctrl+S)           │
└────────┬────────────────────────────┘
         │
    ┌────┴────┐
    │          │
┌───▼──┐  ┌───▼──┐
│React │  │Other │
│ HMR  │  │Restart
│Auto  │  │(Ctrl+C)
│Reload│  │Then run
└───┬──┘  │again
    │     └───┬──┘
    │        │
┌───▼────────▼──────┐
│ 3. Test Changes   │
│ - Browser (React) │
│ - API (curl)      │
│ - Bot (WhatsApp)  │
└─────────────────┘
```

---

## 🎯 Quick Reference

### Common Commands

```bash
# From project root:

# Start API
npm run api

# Start Frontend
npm run dev

# Start Bot
cd whatsapp-bot && npm run dev

# Create test data
bash create_test_data.sh

# Install dependencies
npm install

# Check npm packages
npm ls --depth=0

# Clear npm cache
npm cache clean --force
```

### File Locations

```
Configuration:      .env.local
API:               src/server/index.js
Frontend:          src/App.tsx, src/components/
Bot:               whatsapp-bot/src/index.js
Commands:          whatsapp-bot/src/registry/commandRegistry.js
Data:              data/ (merchants.json, products.json, etc.)
```

### Service Health

```bash
# Test API
curl http://localhost:5174/api/health

# Test Frontend
curl http://localhost:5173/

# Test WebSocket
# Check Terminal 1 logs for connection messages
```

---

## 🚀 Next Steps

1. ✅ Complete this setup
2. ✅ Verify all services running
3. ✅ Test `!menu` command in WhatsApp
4. ✅ Make small code changes to practice
5. ✅ Read SETUP_GUIDE.md for deployment
6. ✅ Deploy to production when ready

---

**Happy coding! 🎉**

For more help, see:
- SETUP_GUIDE.md - Complete guide
- README_DETAILED.md - Feature overview
- START_HERE.txt - Quick start

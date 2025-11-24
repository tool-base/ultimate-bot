# 🤖 Ultimate Bot - Complete Setup Guide

**Last Updated:** November 24, 2025  
**Version:** 2.0  
**Status:** Production Ready

---

## 📋 Table of Contents

1. [Project Overview](#project-overview)
2. [System Requirements](#system-requirements)
3. [Local Setup Guide](#local-setup-guide)
4. [Docker Setup (Optional)](#docker-setup-optional)
5. [Configuration](#configuration)
6. [Running the Services](#running-the-services)
7. [Testing](#testing)
8. [Troubleshooting](#troubleshooting)
9. [Production Deployment](#production-deployment)

---

## 🎯 Project Overview

### What is Ultimate Bot?

Ultimate Bot is an **enterprise-grade WhatsApp marketplace platform** that combines:

- **WhatsApp Bot** (Node.js/Baileys) - Command-driven messaging interface with 100+ commands
- **Express REST API** - Backend service with 19 endpoints for data management
- **React Dashboard** (Vite) - Web-based admin/merchant/customer interface
- **WebSocket Server** - Real-time event broadcasting and notifications
- **Data Persistence** - JSON storage (dev) or PostgreSQL (production)

### Key Features

✅ **100+ Bot Commands** across 8 categories  
✅ **7 Prefix Support** (!#.$/~^) - Users choose their preferred prefix  
✅ **Multi-tier Architecture** - Separated bot, API, and dashboard  
✅ **Real-time Events** - WebSocket for live order updates  
✅ **Error Handling** - Fallback mechanisms and retry logic  
✅ **Production Ready** - Fully tested and documented  

---

## 💻 System Requirements

### Minimum Requirements

| Component | Version | Requirement |
|-----------|---------|-------------|
| Node.js | 18+ | Required for all services |
| npm | 9+ | Package manager |
| Git | Latest | Version control |
| RAM | 2GB | Minimum for all services |
| Storage | 500MB | For dependencies and data |

### Recommended Specifications

| Component | Version |
|-----------|---------|
| Node.js | 20 LTS |
| npm | 10+ |
| OS | macOS 12+, Ubuntu 20.04+, Windows 10+ |
| RAM | 4GB+ |
| Storage | 1GB+ |

### External Services

- **WhatsApp Account** - Required for bot connection
- **Internet Connection** - Stable for WhatsApp API
- **PostgreSQL** (optional) - For production database

---

## 🚀 Local Setup Guide

### Step 1: Prerequisites Installation

#### On macOS

```bash
# Install Homebrew if not already installed
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"

# Install Node.js and npm
brew install node@20

# Verify installation
node --version    # v20.x.x
npm --version     # 10.x.x
```

#### On Ubuntu/Debian

```bash
# Update package manager
sudo apt update
sudo apt upgrade -y

# Install Node.js from NodeSource
curl -sL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs

# Verify installation
node --version    # v20.x.x
npm --version     # 10.x.x
```

#### On Windows

1. Download from [nodejs.org](https://nodejs.org/) (LTS version)
2. Run the installer and follow the setup wizard
3. Open Command Prompt and verify:
   ```cmd
   node --version
   npm --version
   ```

### Step 2: Clone the Repository

```bash
# Clone the repository
git clone https://github.com/yourusername/ultimate-bot.git

# Navigate to the project directory
cd ultimate-bot

# Verify directory structure
ls -la
```

### Step 3: Install Dependencies

#### Root Dependencies

```bash
# Install root dependencies (React, Vite, Express, etc.)
npm install

# This installs:
# - React, React Router, TailwindCSS (frontend)
# - Express, CORS, body-parser (backend)
# - Axios, moment-timezone (utilities)
# - WebSocket (ws) library
```

#### Bot Dependencies

```bash
# Navigate to bot directory
cd whatsapp-bot

# Install bot-specific dependencies
npm install

# This installs:
# - Baileys (WhatsApp library)
# - Node-cron (scheduling)
# - Supabase client (optional database)
# - Other utilities

# Go back to root
cd ..
```

### Step 4: Verify Installation

```bash
# Check all dependencies are installed
npm ls --depth=0        # Root packages
cd whatsapp-bot && npm ls --depth=0 && cd ..

# Verify key binaries exist
which node
which npm
npx --version
```

---

## 📁 Project Structure

```
ultimate-bot/
├── src/                              # React frontend + Express backend
│   ├── server/
│   │   ├── index.js                 # Express API server (19 endpoints)
│   │   └── websocket.js             # WebSocket implementation
│   ├── components/                  # React UI components
│   ├── pages/                       # React pages
│   ├── contexts/                    # React Context API
│   ├── services/                    # API client services
│   └── App.tsx                      # Main React component
│
├── whatsapp-bot/                    # Baileys WhatsApp bot
│   ├── src/
│   │   ├── index.js                 # Bot entry point
│   │   ├── handlers/
│   │   │   ├── customerHandler.js   # Customer commands
│   │   │   ├── merchantHandler.js   # Merchant commands
│   │   │   ├── adminHandler.js      # Admin commands
│   │   │   └── groupManagementHandler.js
│   │   ├── registry/
│   │   │   └── commandRegistry.js   # 100+ command definitions
│   │   ├── services/
│   │   │   └── messageService.js    # Message sending
│   │   ├── api/
│   │   │   └── backendAPI.js        # API client with retry logic
│   │   └── utils/
│   │       └── prefixManager.js     # Multi-prefix support
│   └── package.json
│
├── data/                            # JSON data storage (dev)
│   ├── merchants.json
│   ├── products.json
│   ├── orders.json
│   ├── users.json
│   ├── carts.json
│   └── favorites.json
│
├── docker/                          # Docker configuration
│   └── init.sql                     # PostgreSQL schema
│
├── public/                          # Static assets
├── package.json                     # Root dependencies
├── vite.config.ts                   # Vite configuration
├── tsconfig.json                    # TypeScript config
├── tailwind.config.js               # Tailwind CSS config
└── README.md                        # Project README
```

---

## ⚙️ Configuration

### Environment Variables

Create `.env.local` in the root directory:

```env
# Frontend
VITE_API_BASE_URL=http://localhost:5174

# Backend
PORT=5174
NODE_ENV=development
API_BASE_URL=http://localhost:5174

# WhatsApp Bot
BAILEYS_LOG_LEVEL=info
BOT_PREFIX=!

# WebSocket
WS_PORT=5174
WS_HOST=localhost

# Database (optional - for production)
DB_HOST=localhost
DB_PORT=5432
DB_NAME=ultimate_bot
DB_USER=postgres
DB_PASSWORD=your_password

# Optional Services
SUPABASE_URL=your_supabase_url
SUPABASE_KEY=your_supabase_key
```

### Package.json Scripts

Your `package.json` includes these npm scripts:

```json
{
  "scripts": {
    "dev": "vite",                              # Start frontend dev server (port 5173)
    "build": "vite build",                      # Build for production
    "api": "node src/server/index.js",          # Start Express API (port 5174)
    "bot:dev": "cd whatsapp-bot && npm run dev" # Start WhatsApp bot
  }
}
```

---

## 🏃 Running the Services

### Architecture Overview

```
User (WhatsApp)
    ↓
Baileys Bot (port 3001)
    ↓
Express API (port 5174)
    ↓
JSON/PostgreSQL Storage
    ↑
React Dashboard (port 5173)
```

### Starting Each Service

#### Option 1: Run Services Separately (Recommended for Development)

```bash
# Terminal 1: Start Express API Server
cd /workspaces/ultimate-bot
npm run api

# Expected output:
# ✅ Dashboard API Server running on http://localhost:5174
# ✅ WebSocket server ready at ws://localhost:5174/ws
# 💾 Data stored in: /workspaces/ultimate-bot/data
```

```bash
# Terminal 2: Create Test Data (Run Once)
bash ./create_test_data.sh

# This creates:
# - 3 merchants (Pizza Palace, Fresh Bakery, Cool Beverages)
# - 18 products (5-6 per merchant)
# - Data stored in data/ folder
```

```bash
# Terminal 3: Start Vite Frontend Dev Server
npm run dev

# Expected output:
# ➜  Local:   http://localhost:5173/
# ➜  press h to show help
```

```bash
# Terminal 4: Start WhatsApp Bot
cd whatsapp-bot
npm run dev

# Expected output:
# 🤖 Enterprise WhatsApp Bot v2.0
# ✅ Bot initialized successfully
# 📱 Scan this QR code with WhatsApp:
# [QR CODE DISPLAYS]
# Waiting for connection...
```

#### Option 2: Run All Services with Docker (Optional)

```bash
# Using Docker Compose (if configured)
docker-compose up

# This starts all services in containers
```

### Service Ports Reference

| Service | Port | URL | Purpose |
|---------|------|-----|---------|
| React Dashboard | 5173 | http://localhost:5173 | Frontend UI |
| Express API | 5174 | http://localhost:5174 | REST API endpoints |
| WebSocket | 5174 | ws://localhost:5174/ws | Real-time events |
| WhatsApp Bot | 3001 | - | Message processing |

---

## 🧪 Testing

### 1. API Health Check

```bash
# Test if API is running
curl http://localhost:5174/api/health

# Expected response:
# {"status":"ok"}
```

### 2. Create a Merchant

```bash
curl -X POST http://localhost:5174/api/merchants \
  -H "Content-Type: application/json" \
  -d '{
    "phone_number": "263712345601",
    "store_name": "My Store",
    "category": "Food"
  }'

# Expected response:
# {"success":true,"message":"Merchant created successfully",...}
```

### 3. Add Products

```bash
# First, get merchant ID from the previous response
MERCHANT_ID="1234567890"

curl -X POST http://localhost:5174/api/merchants/$MERCHANT_ID/products \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Pizza",
    "price": 2500,
    "category": "Food",
    "stock": 50,
    "description": "Delicious pizza"
  }'
```

### 4. Get All Merchants

```bash
curl http://localhost:5174/api/merchants

# Expected response:
# {"success":true,"merchants":[...]}
```

### 5. Get Products for a Merchant

```bash
MERCHANT_ID="1234567890"

curl http://localhost:5174/api/merchants/$MERCHANT_ID/products

# Expected response:
# {"success":true,"data":{"products":[...]}}
```

### 6. Test Bot Commands

After scanning QR code in WhatsApp, type:

| Command | Expected Response |
|---------|-------------------|
| `!help` | Shows all commands |
| `!menu` | Shows all products |
| `!search pizza` | Searches for pizza |
| `!cart` | Shows shopping cart |
| `!categories` | Shows categories |

---

## 🐛 Troubleshooting

### Common Issues and Solutions

#### Issue: "Port 5174 already in use"

```bash
# Find process using port
lsof -i :5174

# Kill the process
kill -9 <PID>

# Or use different port
PORT=5175 npm run api
```

#### Issue: "Cannot find module 'express'"

```bash
# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install

# Or in bot folder
cd whatsapp-bot
rm -rf node_modules package-lock.json
npm install
cd ..
```

#### Issue: "API not responding"

```bash
# Check if API server is running
curl http://localhost:5174/api/health

# Check for errors
ps aux | grep "node src/server"

# Restart API server
npm run api
```

#### Issue: "Bot not connecting to WhatsApp"

```bash
# Check QR code is scanned
# Check internet connection
# Check WhatsApp permissions
# Try rescanning QR code
# Restart bot: npm run bot:dev
```

#### Issue: "[object Object] error in logs"

```bash
# This means no merchants exist
# Run the test data script
bash ./create_test_data.sh

# Or manually create a merchant
curl -X POST http://localhost:5174/api/merchants \
  -H "Content-Type: application/json" \
  -d '{"phone_number":"263712345601","store_name":"Store","category":"Food"}'
```

#### Issue: "CORS error when frontend calls API"

```bash
# Check API is running on correct port
curl http://localhost:5174/api/health

# Check frontend is calling correct URL
# Should be http://localhost:5174 not http://localhost:5173
```

---

## 📦 Docker Setup (Optional)

### Dockerfile Structure

```dockerfile
# dockerfile
FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

EXPOSE 5174

CMD ["npm", "run", "api"]
```

### Docker Compose Setup

```yaml
# docker-compose.yml
version: '3.8'

services:
  api:
    build: .
    ports:
      - "5174:5174"
    environment:
      - NODE_ENV=production
      - PORT=5174
    volumes:
      - ./data:/app/data
    networks:
      - ultimate-bot

  postgres:
    image: postgres:15
    environment:
      POSTGRES_DB: ultimate_bot
      POSTGRES_PASSWORD: password
    volumes:
      - postgres_data:/var/lib/postgresql/data
    networks:
      - ultimate-bot

volumes:
  postgres_data:

networks:
  ultimate-bot:
```

### Running with Docker

```bash
# Build image
docker build -t ultimate-bot .

# Run container
docker run -p 5174:5174 ultimate-bot

# Or use Docker Compose
docker-compose up -d
```

---

## 🌐 Production Deployment

### Pre-Deployment Checklist

- [ ] Environment variables configured (.env)
- [ ] Database migrated to PostgreSQL
- [ ] SSL certificates obtained
- [ ] API keys secured
- [ ] Error logging set up
- [ ] Monitoring configured
- [ ] Backup strategy in place
- [ ] Rate limiting configured
- [ ] CORS properly configured
- [ ] Load balancing set up (if needed)

### Deployment Steps

#### 1. Prepare Server

```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Node.js
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs

# Install PostgreSQL
sudo apt install -y postgresql postgresql-contrib

# Install Nginx (reverse proxy)
sudo apt install -y nginx
```

#### 2. Clone Repository

```bash
# Clone your repository
git clone https://github.com/yourusername/ultimate-bot.git
cd ultimate-bot

# Install dependencies
npm install
cd whatsapp-bot && npm install && cd ..
```

#### 3. Configure Environment

```bash
# Create .env for production
cat > .env << EOF
NODE_ENV=production
PORT=5174
API_BASE_URL=https://yourdomain.com

DB_HOST=localhost
DB_PORT=5432
DB_NAME=ultimate_bot
DB_USER=postgres
DB_PASSWORD=your_secure_password
EOF
```

#### 4. Setup PostgreSQL

```bash
# Create database
sudo -u postgres psql

CREATE DATABASE ultimate_bot;
CREATE USER bot_user WITH PASSWORD 'secure_password';
GRANT ALL PRIVILEGES ON DATABASE ultimate_bot TO bot_user;

# Load schema
psql -U bot_user -d ultimate_bot < docker/init.sql
```

#### 5. Configure Nginx

```nginx
# /etc/nginx/sites-available/ultimate-bot
upstream api_backend {
    server localhost:5174;
}

server {
    listen 80;
    server_name yourdomain.com;

    location / {
        proxy_pass http://api_backend;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }

    # WebSocket upgrade
    location /ws {
        proxy_pass http://api_backend;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
    }
}
```

#### 6. Setup PM2 (Process Manager)

```bash
# Install PM2 globally
sudo npm install -g pm2

# Create ecosystem.config.js
cat > ecosystem.config.js << EOF
module.exports = {
  apps: [{
    name: 'ultimate-bot',
    script: 'src/server/index.js',
    instances: 2,
    exec_mode: 'cluster',
    env: {
      NODE_ENV: 'production'
    }
  }]
};
EOF

# Start with PM2
pm2 start ecosystem.config.js

# Save PM2 startup
pm2 startup
pm2 save
```

#### 7. Enable HTTPS with Let's Encrypt

```bash
# Install Certbot
sudo apt install certbot python3-certbot-nginx

# Get certificate
sudo certbot certonly --standalone -d yourdomain.com

# Auto-renew
sudo systemctl enable certbot.timer
```

### Monitoring and Maintenance

```bash
# Monitor logs
pm2 logs ultimate-bot

# Monitor system
pm2 monit

# View process status
pm2 status

# Restart on crash
pm2 restart ultimate-bot
```

---

## 📊 API Endpoints Reference

### Merchants

```
GET    /api/merchants              # Get all merchants
POST   /api/merchants              # Create merchant
GET    /api/merchants/:id          # Get specific merchant
PUT    /api/merchants/:id          # Update merchant
DELETE /api/merchants/:id          # Delete merchant
```

### Products

```
GET    /api/merchants/:id/products         # Get products
POST   /api/merchants/:id/products         # Add product
PUT    /api/merchants/:id/products/:pid    # Update product
DELETE /api/merchants/:id/products/:pid    # Delete product
```

### Orders

```
GET    /api/orders                 # Get all orders
POST   /api/orders                 # Create order
GET    /api/orders/:id             # Get order details
PUT    /api/orders/:id             # Update order status
```

### Shopping Cart

```
GET    /api/carts/:phone           # Get cart
POST   /api/carts/:phone           # Add to cart
DELETE /api/carts/:phone/:product  # Remove from cart
```

### Users

```
GET    /api/users                  # Get all users
POST   /api/users                  # Register user
GET    /api/users/:phone           # Get user info
PUT    /api/users/:phone           # Update user
```

---

## 🎓 Learning Resources

### Key Files to Understand

1. **Entry Points**
   - `src/server/index.js` - Express API server
   - `whatsapp-bot/src/index.js` - Bot initialization
   - `src/App.tsx` - React main component

2. **Command System**
   - `whatsapp-bot/src/registry/commandRegistry.js` - Command definitions
   - `whatsapp-bot/src/handlers/customerHandler.js` - Customer commands
   - `whatsapp-bot/src/utils/prefixManager.js` - Prefix handling

3. **API Integration**
   - `whatsapp-bot/src/api/backendAPI.js` - API client
   - `src/server/index.js` - API endpoints

4. **Data Management**
   - `data/*.json` - Data files (dev)
   - `docker/init.sql` - Database schema (production)

### Next Steps

1. ✅ Complete local setup following this guide
2. ✅ Run test data script to populate merchants
3. ✅ Test all API endpoints
4. ✅ Test bot commands in WhatsApp
5. ✅ Customize for your business
6. ✅ Deploy to production
7. ✅ Set up monitoring and backups

---

## 📞 Support

- **Issues?** Check the troubleshooting section above
- **Questions?** Review the API reference section
- **Need help?** Check START_HERE.txt for quick overview

---

**Happy coding! 🚀**

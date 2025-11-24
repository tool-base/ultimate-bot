# 🚀 QUICK START - LOCAL TESTING GUIDE

Get the WhatsApp Bot + Dashboard running locally in under 5 minutes.

---

## ⚡ Prerequisites

- ✅ Node.js 16+ installed
- ✅ npm or yarn package manager
- ✅ WhatsApp account (for bot testing)
- ✅ Terminal/Command Prompt

---

## 📦 Installation

### 1. Install Dependencies
```bash
cd /workspaces/Bot
npm install
```

### 2. Create Environment File
Copy the example environment file:
```bash
cp .env.example .env.local
```

### 3. Update Environment Variables (Optional)
Edit `.env.local` to customize:
```env
BOT_PREFIX=!           # Change if you want different prefix
BOT_NAME=Smart Bot
ADMIN_PHONE=your_phone_number
API_BASE_URL=http://localhost:5174
API_PORT=5174
NODE_ENV=development
```

---

## 🎮 Running the Project

### Option 1: Start Everything Together (Recommended)
```bash
npm run dev:all
```

This starts in parallel:
- 🟢 **Frontend** (Vite) - http://localhost:5173
- 🔵 **Backend API** - http://localhost:5174
- 🟣 **WhatsApp Bot** - Waits for QR code scan

### Option 2: Start Separately

**Terminal 1 - Backend API:**
```bash
npm run api
# Backend runs on http://localhost:5174
```

**Terminal 2 - Frontend:**
```bash
npm run dev
# Frontend runs on http://localhost:5173
# Auto-opens in browser
```

**Terminal 3 - Bot:**
```bash
npm run bot:dev
# Shows QR code in terminal
# Scan with WhatsApp phone camera
```

---

## 📱 Testing the Bot

### Step 1: Scan QR Code
When you run `npm run bot:dev`, a QR code appears in the terminal:
```
📱 Scan this QR code with WhatsApp:

████████████████████████████████
████ ▄▄▄▄▄ █ ▀▀ █▀█ █ ▄▄▄▄▄ ████
████ █   █ █▀ ▀ █▀▄█ █ █   █ ████
████ █▄▄▄█ █    ▄   █ █ █▄▄▄█ ████
████▄▄▄▄▄▄▄█ ▀ █▀▀▀ █▄▄▄▄▄▄▄████
████▄ ▀█▀█▄▀███▀██▀█ ▀█ ▄▄ ▀ ████
████████████████████████████████
```

Open WhatsApp on your phone, click the camera icon (if available), and scan the QR code.

### Step 2: Test Commands

Send any of these messages to the bot:

#### Main Menu
```
!menu           → Shows product list
!help           → Shows all commands
#menu           → Same as !menu but with # prefix
.menu           → Same as !menu but with . prefix
```

#### Shopping Commands
```
!shoppingmenu   → Shows shopping category menu
!search pizza   → Search for products
!categories     → Browse by category
!nearby         → Find nearby stores
```

#### Cart & Checkout
```
!cart           → View shopping cart
!checkout       → Proceed to checkout
```

#### Orders
```
!orders         → View order history
!ordermenu      → Shows order category menu
!track order-id → Track order status
```

#### Group Commands (in groups only)
```
!groupmenu      → Shows group management menu
!groupinfo      → Get group details
!memberlist     → List group members
!groupstats     → Show group statistics
```

#### Account & Deals
```
!accountmenu    → Account settings menu
!dealmenu       → Today's deals menu
!deals          → Show available deals
```

#### Help & Info
```
!help           → Show general help
!help menu      → Get help for specific command
!about          → About this bot
!ping           → Check bot response time
!status         → Bot status and info
```

---

## 🔍 What to Expect

### Success Indicators
✅ Bot responds immediately to commands  
✅ No "Unknown command" errors  
✅ Interactive menus appear as WhatsApp lists  
✅ Emoji and formatting display correctly  
✅ Terminal shows `📝 Command: menu from [number]`  
✅ No red `❌ ERROR:` messages in terminal  

### Terminal Output Example
```
📝 Command: menu from 263771234567 [!]
⏱️  Response time: 245ms
✅ Menu sent successfully
```

### If Something Goes Wrong

**Issue: "Unknown command"**
- ✅ Check command is in registry: `grep "commandname:" whatsapp-bot/src/registry/commandRegistry.js`
- ✅ Check command is routed: `grep "case 'commandname'" whatsapp-bot/src/index.js`

**Issue: "API Request Failed"**
- ✅ Backend should be running on port 5174
- ✅ Check: `curl http://localhost:5174/api/merchants`
- ✅ Bot will fallback to dummy data automatically

**Issue: Interactive menu not showing**
- ✅ Try sending `!menu` (most reliable)
- ✅ Check WhatsApp has latest version
- ✅ Use text menu fallback if needed

**Issue: Bot doesn't respond at all**
- ✅ Check QR code was scanned (look for logged-in confirmation)
- ✅ Check no errors in bot terminal (red text)
- ✅ Try restarting bot: Ctrl+C and `npm run bot:dev`

---

## 📊 Available Endpoints (for testing)

### API Endpoints
```
GET    http://localhost:5174/api/merchants
GET    http://localhost:5174/api/merchants/:id
GET    http://localhost:5174/api/merchants/:id/products
GET    http://localhost:5174/api/products
POST   http://localhost:5174/api/orders
GET    http://localhost:5174/api/users/:phone
```

### Test with curl
```bash
# Get all merchants
curl http://localhost:5174/api/merchants

# Get all products  
curl http://localhost:5174/api/products

# Create a new merchant
curl -X POST http://localhost:5174/api/merchants \
  -H "Content-Type: application/json" \
  -d '{
    "business_name": "My Store",
    "region": "ZW",
    "currency": "ZWL"
  }'
```

---

## 🌐 Access Dashboard

Open your browser and go to:
```
http://localhost:5173
```

You'll see the admin dashboard with options for:
- 👥 User management
- 🏪 Merchant management
- 📦 Product catalog
- 📊 Analytics & reports
- 💳 Billing & payments

---

## 🧪 Sample Test Flows

### Flow 1: Browse Products
```
User: !menu
Bot:  Shows 6 popular products in interactive list

User: (taps on "Margherita Pizza")
Bot:  Shows pizza details with price and reviews
```

### Flow 2: Search Products
```
User: !search chicken
Bot:  Shows all chicken products

User: (taps on "Fried Chicken Combo")
Bot:  Shows product details
```

### Flow 3: Get Help
```
User: !help menu
Bot:  Shows help for menu command with aliases

User: !help search
Bot:  Shows help for search command
```

### Flow 4: Multi-Prefix
```
User: !menu
Bot:  Shows menu with ! prefix

User: #menu
Bot:  Shows same menu with # prefix

User: .menu
Bot:  Shows same menu with . prefix
```

---

## 📝 Sample Data

The bot comes pre-loaded with sample data:

### Merchants (in `/data/merchants.json`)
- **Quick Eats** - Pizza, burgers, drinks

### Products (in `/data/products.json`)
- Margherita Pizza - ZWL 2,500
- Fried Chicken Combo - ZWL 3,200

When you test, the bot automatically uses this data if backend isn't available.

---

## 🛑 Stopping the Bot

Press `Ctrl+C` in any terminal to stop:

```bash
^C
# Bot disconnects gracefully
```

To fully restart, you may need to:
```bash
# Kill all node processes
killall node

# Or restart just the bot
npm run bot:dev
```

---

## 🔗 Useful Links

- **Full Documentation:** See `.github/copilot-instructions.md`
- **API Endpoints:** See `whatsapp-bot/src/api/ENDPOINTS.md`
- **Command Registry:** See `whatsapp-bot/src/registry/commandRegistry.js`
- **Fix Summary:** See `PROJECT_FIX_SUMMARY.md`

---

## ✅ Checklist

Before considering local testing complete:

- [ ] Bot runs without errors
- [ ] QR code scans successfully
- [ ] `!menu` command shows interactive list
- [ ] `!help` command works without errors
- [ ] Category menus work (`!shoppingmenu`, `!cartmenu`, etc.)
- [ ] Multi-prefix works (test with !, #, . prefixes)
- [ ] Frontend dashboard loads at http://localhost:5173
- [ ] Backend API responds at http://localhost:5174/api/merchants
- [ ] Dummy data appears when API unavailable
- [ ] No "Unknown command" errors in terminal

---

## 🎉 You're Ready!

Your local development environment is now fully functional. Start building features and testing commands!

For detailed development workflows, see `.github/copilot-instructions.md`.

---

**Last Updated:** November 24, 2025  
**Status:** ✅ Ready for Local Testing

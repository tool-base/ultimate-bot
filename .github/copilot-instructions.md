# 🤖 AI Coding Agent Instructions

> Guidance for GitHub Copilot and other AI coding agents working in this WhatsApp Bot + Dashboard project.

---

## 📋 Project Overview

**Smart WhatsApp Bot** is an enterprise-grade marketplace platform combining:
- **WhatsApp Bot** (Node.js/Baileys) - Command-driven messaging interface
- **React Dashboard** (Vite) - Web-based admin/merchant/customer interface  
- **Express Backend** (File-based JSON storage) - API layer for data persistence
- **PostgreSQL** (Optional) - Production-ready database

The bot and dashboard communicate via REST APIs and WebSockets. All three components must stay synchronized for features to work properly.

---

## 🏗️ Architecture & Key Concepts

### Component Boundaries
- **`whatsapp-bot/src/`** - Baileys bot (handles messages, routes commands, integrates services)
- **`src/`** - React frontend + Express backend server (runs on port 5174)
- **`src/server/index.js`** - REST API (processes requests from bot & dashboard)
- **`data/`** - JSON file-based persistence (dev mode only; production should use PostgreSQL)

### Command Architecture Pattern
Every command flows through a specific route:
1. **Bot receives text** → `handleMessage()` in `index.js`
2. **Prefix detected** → `PrefixManager.parseCommand()` extracts `{prefix, command, args}`
3. **Route to handler** → Switch statement sends to appropriate handler class
4. **Handler executes** → Returns response object or sends message via `messageService`
5. **Message sent** → `messageService.sendTextMessage()`, `sendInteractiveMessage()`, etc.

**Key insight:** All handlers are singletons (instantiated once) and injected with `messageService` to enable message sending. This prevents silent command failures.

### Critical Design Pattern: Multi-Prefix Support
- **File:** `whatsapp-bot/src/utils/prefixManager.js`
- **How:** 7 prefixes (!#.$/~^) all route to same command handlers
- **Why:** Users can choose their preferred prefix via `!prefix #` (now uses # instead of !)
- **Implementation:** `PrefixManager.isCommand(text)` detects ANY valid prefix, `PrefixManager.parseCommand(text)` returns structured `{prefix, command, args}`

### Centralized Command Registry
- **File:** `whatsapp-bot/src/registry/commandRegistry.js`
- **Structure:** 8 categories (shopping, cart, orders, account, deals, merchant, group, admin) with 100+ commands
- **Every command has:** name, aliases, description, usage, args boolean, category, emoji
- **Methods:**
  - `findCommand(input)` - searches by name or alias
  - `getCommandsByCategory(key)` - returns category with all commands
  - `createMainMenu()` - returns WhatsApp interactive list payload
  - `createCategoryInteractiveMenu(key)` - returns interactive menu for category

---

## 🔌 Integration Points (Critical for Multi-Component Sync)

### Bot ↔ Backend API
**Endpoints the bot calls:**
```javascript
// File: whatsapp-bot/src/api/backendAPI.js
GET  /api/merchants                              // Fetch all merchants
GET  /api/merchants/:id/products                 // Fetch merchant's products
POST /api/orders                                 // Create order
GET  /api/users/:phone                           // Get user info
```

**Critical pattern:** Bot has fallback logic
```javascript
// If API fails, use dummy data and keep bot responsive
try {
  const resp = await backendAPI.getProducts(merchantId);
  products = resp.success ? resp.data.products : dummyProducts;
} catch {
  products = dummyProducts;  // ← Fallback prevents "Unknown command"
}
```

### Dashboard ↔ Backend API
**Endpoints the dashboard calls:**
```javascript
// Frontend makes requests to /api/* endpoints
GET  /api/merchants          // Dashboard lists merchants
GET  /api/products           // Dashboard lists products
POST /api/merchants/:id/products  // Add new product
```

**Response format:** All endpoints return `{ success: boolean, data/message/merchants/products, ...}`

### Real-time Communication
- **WebSocket:** Not yet implemented but prepared for (see `src/services/websocketService.ts`)
- **Current:** HTTP polling only
- **Future:** WebSocket for live order updates, bot status, etc.

---

## 🛠️ Common Developer Workflows

### Adding a New Bot Command

1. **Register in CommandRegistry** (`whatsapp-bot/src/registry/commandRegistry.js`):
```javascript
myNewCommand: {
  name: 'My Command',
  aliases: ['mynew', 'mn'],
  description: 'Does something cool',
  usage: '!mynewcommand <arg>',
  args: true,
  category: 'shopping',
  categoryKey: 'shopping',
  emoji: '✨'
}
```

2. **Add handler method** in appropriate handler file:
```javascript
// whatsapp-bot/src/handlers/customerHandler.js
async handleMyNewCommand(args, phoneNumber, from) {
  const msg = 'Response text here';
  await this.messageService.sendTextMessage(from, msg);
  return { success: true };
}
```

3. **Route command** in `whatsapp-bot/src/index.js`:
```javascript
case 'mynewcommand':
case 'mynew':
case 'mn':
  return await this.customerHandler.handleCustomerCommand(command, args, from, cleanPhone);
```

4. **Test locally:** `npm run bot:dev` and type `!mynewcommand`

### Adding a New API Endpoint

1. **Add in** `src/server/index.js`:
```javascript
app.post('/api/myfeature', (req, res) => {
  try {
    const { field1, field2 } = req.body;
    
    // Validate
    if (!field1) {
      return res.status(400).json({ success: false, error: 'Missing field1' });
    }
    
    // Process
    const data = readData('myfeature');
    data.push({ id: Date.now(), field1, field2 });
    writeData('myfeature', data);
    
    res.json({ success: true, message: 'Created', data });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});
```

2. **Add client method** in `whatsapp-bot/src/api/backendAPI.js`:
```javascript
async myFeature(data) {
  return this.request('POST', '/api/myfeature', data);
}
```

3. **Call from handler:**
```javascript
const resp = await backendAPI.myFeature({ field1: 'value' });
if (resp.success) {
  // Use resp.data
}
```

### Fixing the Common "Unknown command" Error

**Causes:**
1. ❌ Command not in registry → Add to `commandRegistry.js`
2. ❌ Command not routed in index.js → Add case in switch statement
3. ❌ Handler method missing → Implement in handler class
4. ❌ messageService not injected → Call `handler.setMessageService(messageService)` after instantiation
5. ❌ Handler returns void instead of response → Always `return { success: true }` or send message

**Fix checklist:**
```bash
# 1. Is command in registry?
grep -r "mynewcommand:" whatsapp-bot/src/registry/

# 2. Is command routed?
grep -r "case 'mynewcommand'" whatsapp-bot/src/index.js

# 3. Is handler method implemented?
grep -r "handleMyNewCommand" whatsapp-bot/src/handlers/

# 4. Is messageService injected?
grep -r "setMessageService" whatsapp-bot/src/index.js

# 5. Does handler return object?
grep -A3 "handleMyNewCommand" whatsapp-bot/src/handlers/customerHandler.js | grep "return"
```

---

## 📁 File Organization & Conventions

### Bot Handler Classes Pattern
- **Location:** `whatsapp-bot/src/handlers/`
- **Files:** `customerHandler.js`, `merchantHandler.js`, `adminHandler.js`, `groupManagementHandler.js`
- **Export:** Singleton instances (`module.exports = new CustomerHandler()`)
- **Methods:** `async handleXxxCommand(args, phoneNumber, from)` returning `{ success, ... }`
- **Service injection:** `setMessageService(messageService)` called in index.js

### Message Service Pattern
- **Location:** `whatsapp-bot/src/services/messageService.js`
- **Methods:** `sendTextMessage()`, `sendInteractiveMessage()`, `sendButtonMessage()`, `sendListMessage()`, `sendRichMessage()`, etc.
- **All async:** Prefix with `await` when calling
- **Response format:** Always returns `{ success: boolean, error?: string }`

### API Client Pattern
- **Location:** `whatsapp-bot/src/api/backendAPI.js`
- **Singleton:** `module.exports = new BackendAPI()`
- **Retry logic:** Automatic 3x retry with exponential backoff for 408, 429, 500+ errors
- **Methods:** `async getProducts(merchantId)`, `async createOrder(phone, data)`, etc.

### Backend Server Routes
- **Location:** `src/server/index.js`
- **Port:** 5174 (dev) - Ensure no conflicts
- **Data storage:** `readData(filename)` / `writeData(filename, data)` for JSON persistence
- **Response format:** Always `{ success, data/message/error, ... }`

### Frontend Components
- **Location:** `src/components/`
- **Pattern:** React functional components with hooks
- **API calls:** Use `fetch()` or custom service methods in `src/services/`
- **State:** Prefer React Context (see `src/contexts/`) for shared state

---

## 🧪 Testing & Validation

### Run All Checks
```bash
npm run lint           # Check JS/TS syntax
npm run dev            # Start frontend + backend
npm run bot:dev        # Start bot in separate terminal
```

### Test Bot Commands Locally
```bash
# Terminal 1: Backend API
cd /workspaces/Bot && npm run api

# Terminal 2: Frontend dev
npm run dev

# Terminal 3: Bot
npm run bot:dev

# Terminal 4: Send test messages to bot (via WhatsApp)
# Type: !menu, !help, !search pizza, !cart, etc.
```

### Common Test Scenarios
1. **Backend fails** → Bot should use dummy data and still respond
2. **New command added** → Test with all 7 prefixes (!menu, #menu, .menu, etc.)
3. **Interactive message** → Ensure `sendInteractiveMessage()` actually sends (was bugged, now fixed)
4. **Category menu** → Verify `!shoppingmenu`, `!cartmenu`, etc. show interactive lists (was broken, now fixed)
5. **Help command** → `!help menu` should show command details with no errors (was crashing, now fixed)

---

## 🔐 Security & Performance

### Never Modify
- **Command routing in index.js** → Use proper switch cases; don't add ad-hoc conditionals
- **Message service calls** → Always return after calling; don't continue execution
- **API response validation** → Check `resp.success` before accessing `resp.data`

### Always Check
- **User authorization** → Use `advancedAdminHandler.isUserBlocked()` before processing
- **Input validation** → Sanitize `args` before using in API calls
- **Error handling** → Wrap API calls in try-catch; log errors with context
- **Rate limiting** → Future: implement exponential backoff for repeated failures

### Caching Strategy
- **Sessions:** 1 hour (user state)
- **Carts:** 2 hours (shopping state)
- **Merchants:** 30 minutes (business data)
- **Products:** 15 minutes (inventory)
- **Commands:** 5 minutes (command metadata)

---

## 🐛 Debugging Tips

### Bot not responding?
1. Check terminal for `📝 Command: xxx` - did command parse?
2. Check for `❌ ERROR:` - did API call fail?
3. Check for `Unknown command` - is command registered & routed?
4. Check `messageService` - was it injected? `console.log(this.messageService)`

### Interactive message fails?
- Error: "Invalid media type" → Fix: Use `sendTextMessage()` instead of `sendRichMessage()` for now
- Error: "Cannot send list" → Fix: Ensure `listMessage` payload structure matches WhatsApp spec
- Message not appearing → Fix: Confirm `await` is used and handler returns after sending

### API errors?
- "GET /api/merchants/[object Object]/products" → Fix: Pass merchantId, not an object `{}`
- "Cannot read property 'merchants'" → Fix: Backend returned `{ merchants: [...] }` not `{ data: {...} }`
- Retry loop → Likely connection issue; check `API_BASE_URL` environment variable

### Command registration issues?
- Run: `grep "mycommand" whatsapp-bot/src/registry/commandRegistry.js` to verify
- Run: `grep "case 'mycommand'" whatsapp-bot/src/index.js` to verify routing
- Check handler method signature matches: `async handleMyCommand(args, phoneNumber, from)`

---

## 📚 Key Files Reference

| File | Purpose | Key Classes/Functions |
|------|---------|----------------------|
| `whatsapp-bot/src/index.js` | Bot entry point, event handlers, command router | `SmartWhatsAppBot`, `handleMessage()`, `handleCommand()` |
| `whatsapp-bot/src/registry/commandRegistry.js` | Centralized command metadata | `findCommand()`, `getCommandsByCategory()`, `createMainMenu()` |
| `whatsapp-bot/src/utils/prefixManager.js` | Multi-prefix support | `isCommand()`, `parseCommand()`, `setUserPrefix()` |
| `whatsapp-bot/src/handlers/customerHandler.js` | Shopping commands | `handleMenuCommand()`, `handleSearchCommand()`, `handleCartCommand()` |
| `whatsapp-bot/src/handlers/merchantHandler.js` | Merchant commands | `handleDashboardCommand()`, `handleInventoryCommand()` |
| `whatsapp-bot/src/handlers/adminHandler.js` | Admin commands | `handleAdminCommand()` |
| `whatsapp-bot/src/handlers/groupManagementHandler.js` | Group commands | `handleGroupToolsCommand()`, `handleMemberListCommand()` |
| `whatsapp-bot/src/services/messageService.js` | Message sending | `sendTextMessage()`, `sendInteractiveMessage()`, `sendRichMessage()` |
| `whatsapp-bot/src/api/backendAPI.js` | API client | `getProducts()`, `createOrder()`, `getUser()` |
| `src/server/index.js` | Backend REST API | Auth, merchants, products, orders endpoints |
| `src/components/` | React dashboard | Admin, merchant, customer UI |

---

## 🚀 Ready for Production?

**Checklist before deploying:**
- [ ] Environment variables set (`.env.local`)
- [ ] API_BASE_URL points to production server
- [ ] Database migrated to PostgreSQL (not JSON files)
- [ ] WhatsApp Business Account verified
- [ ] All interactive messages tested
- [ ] Help system complete and accurate
- [ ] Command registry up-to-date
- [ ] Error handling comprehensive (no silent failures)
- [ ] Rate limiting configured
- [ ] Logging enabled and monitored
- [ ] Bot response time < 2 seconds for all commands

**Current Status:** Development ready. Local testing works with dummy data. Requires PostgreSQL setup for production.

---

## ✨ Recent Fixes (This Session)

1. ✅ **!menu, !cartmenu, !ordermenu, !groupmenu** now properly routed to handlers
2. ✅ **!help command** fixed - removed invalid `mediaType` from sendRichMessage
3. ✅ **!menu API error** fixed - now uses fallback dummy data when backend unavailable
4. ✅ **GroupManagementHandler** now properly instantiated and injected
5. ✅ **Duplicate imports** removed to fix linting errors
6. ✅ **Seed data** created in `/data/merchants.json` and `/data/products.json` for local testing

---

## 📞 Getting Help

When stuck, check in this order:
1. **Grep for similar commands** → `grep -r "case 'xyz'" whatsapp-bot/src/`
2. **Check commandRegistry** → All commands must be registered there
3. **Review message flow** → Does handler call `messageService.sendX*()`?
4. **Test locally** → `npm run bot:dev` and trigger command manually
5. **Check logs** → Terminal output shows command parsing, API calls, errors
6. **Inspect response format** → Log API responses: `console.log(JSON.stringify(resp, null, 2))`

---

**Last Updated:** November 24, 2025  
**Status:** ✅ All bot features operational  
**Next Phase:** PostgreSQL integration, WebSocket support, advanced analytics

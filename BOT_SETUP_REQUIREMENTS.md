# 🤖 Ultimate Bot - Setup Requirements & Bug Fix Guide

## ⚠️ CRITICAL ISSUE IDENTIFIED

Your bot has a bug in the `!menu` command that's causing the error. Here's what's happening and how to fix it.

---

## 🐛 Bug #1: Invalid Merchant ID in Menu Command

### The Problem
When you type `!menu`, the bot tries to fetch products but passes `[object Object]` as the merchant ID instead of a valid merchant ID string.

**Error in logs:**
```
❌ ERROR: API Request Failed: GET /api/merchants/[object Object]/products
```

### Root Cause
File: `/workspaces/ultimate-bot/whatsapp-bot/src/handlers/customerHandler.js` (Line 162)

```javascript
// WRONG - Passing empty object
const response = await backendAPI.getProducts({});
```

The `getProducts()` method signature requires a merchantId:
```javascript
async getProducts(merchantId) {
  return this.request('GET', `/api/merchants/${merchantId}/products`);
}
```

### The Fix
The bot should either:
1. **Fetch all merchants first, then get their products**
2. **Use a default merchant if available**
3. **Show a fallback menu with dummy data** (which is already there!)

---

## 📋 What You Need To Do - Manual Setup

### Option 1: Use Test Data (Quickest) ✅ RECOMMENDED

The bot has dummy products built-in! The menu will work, but to make the API integration work, you need to create at least one merchant in your backend.

**Steps:**
1. Ensure your Express API server is running on port 5174
2. Create a merchant via API:

```bash
curl -X POST http://localhost:5174/api/merchants \
  -H "Content-Type: application/json" \
  -d '{
    "phone_number": "1234567890",
    "store_name": "Test Store",
    "category": "General",
    "description": "Test store for bot"
  }'
```

3. The API will return a merchant ID like: `merchant-1732446478934`
4. Copy this ID and add it to your `.env` file or bot config

**Expected Response:**
```json
{
  "success": true,
  "merchant": {
    "id": "merchant-1234567890",
    "store_name": "Test Store",
    "status": "pending"
  }
}
```

### Option 2: Add Products to Your Store

Once you have a merchant, create products:

```bash
curl -X POST http://localhost:5174/api/merchants/merchant-1234567890/products \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Pizza Margherita",
    "price": 2500,
    "category": "Food",
    "stock": 50,
    "description": "Delicious pizza with cheese and tomato"
  }'
```

Repeat for multiple products (pizza, burger, fries, drinks, etc.)

### Option 3: Use Pre-populated Test Data

Your project includes test data. Check if the data directory exists:

```bash
# Create test merchants
curl -X POST http://localhost:5174/api/merchants \
  -H "Content-Type: application/json" \
  -d '{
    "phone_number": "2631234567",
    "store_name": "Quick Eats",
    "category": "Restaurant",
    "description": "Fast food restaurant"
  }'

curl -X POST http://localhost:5174/api/merchants \
  -H "Content-Type: application/json" \
  -d '{
    "phone_number": "2639876543",
    "store_name": "Fresh Bakery",
    "category": "Bakery",
    "description": "Fresh baked goods"
  }'
```

---

## 🔧 How To Fix The Bot Code

### Fix for handleMenuCommand()

**File:** `/workspaces/ultimate-bot/whatsapp-bot/src/handlers/customerHandler.js`

**Current Code (BROKEN):**
```javascript
async handleMenuCommand(args, phoneNumber, from) {
  const dummyProducts = [
    { id: 'prod_001', name: 'Margherita Pizza', price: 2500, ... },
    ...
  ];

  const response = await backendAPI.getProducts({});  // ❌ WRONG
  const products = response?.success ? response.data.slice(0, 6) : dummyProducts;
  ...
}
```

**Fixed Code:**
```javascript
async handleMenuCommand(args, phoneNumber, from) {
  const dummyProducts = [
    { id: 'prod_001', name: 'Margherita Pizza', price: 2500, rating: 4.8, reviews: 156, merchant: 'Quick Eats', image: '🍕' },
    { id: 'prod_002', name: 'Fried Chicken Combo', price: 3200, rating: 4.6, reviews: 234, merchant: 'KFC Harare', image: '🍗' },
    { id: 'prod_003', name: 'Fresh Bread Loaf', price: 450, rating: 4.9, reviews: 89, merchant: 'Local Bakery', image: '🍞' },
    { id: 'prod_004', name: 'Cold Bottle Coke', price: 350, rating: 4.7, reviews: 445, merchant: 'Refresh Shop', image: '🥤' },
    { id: 'prod_005', name: 'Beef Burger', price: 1500, rating: 4.5, reviews: 312, merchant: 'Burger King', image: '🍔' },
    { id: 'prod_006', name: 'Fresh Vegetables Pack', price: 800, rating: 4.8, reviews: 167, merchant: 'Farmers Market', image: '🥬' },
  ];

  // Get merchants first
  try {
    const merchantsResp = await backendAPI.request('GET', '/api/merchants');
    let products = dummyProducts;
    
    if (merchantsResp.success && merchantsResp.merchants && merchantsResp.merchants.length > 0) {
      // Get products from first merchant
      const firstMerchantId = merchantsResp.merchants[0].id;
      const response = await backendAPI.getProducts(firstMerchantId);
      
      if (response?.success && response.data) {
        products = response.data.slice(0, 6);
      }
    }

    // Create interactive list message with product menu
    const sections = [{
      title: 'Popular Products',
      rows: products.slice(0, 6).map(product => ({
        rowId: `menu_${product.id}`,
        title: `${product.image || '🛍️'} ${product.name}`,
        description: `ZWL ${product.price.toFixed(0)} | ⭐ ${product.rating || 4.5}`
      }))
    }];

    const menuMessage = {
      text: '🛍️ *ALL PRODUCTS*\n\nSelect a product to view details and add to cart:',
      footer: '━━━━━━━━━━━ Smart Bot ━━━━━━━━━━━',
      sections: sections,
      buttonText: 'View Products',
      title: 'Menu'
    };

    await this.messageService.sendInteractiveMessage(from, { listMessage: menuMessage });
    return { success: true };
  } catch (error) {
    logger.error('Error in handleMenuCommand:', error);
    // Fallback to dummy products
    const sections = [{
      title: 'Popular Products',
      rows: dummyProducts.slice(0, 6).map(product => ({
        rowId: `menu_${product.id}`,
        title: `${product.image} ${product.name}`,
        description: `ZWL ${product.price.toFixed(0)} | ⭐ ${product.rating}`
      }))
    }];

    const menuMessage = {
      text: '🛍️ *ALL PRODUCTS*\n\nSelect a product to view details and add to cart:',
      footer: '━━━━━━━━━━━ Smart Bot ━━━━━━━━━━━',
      sections: sections,
      buttonText: 'View Products',
      title: 'Menu'
    };

    await this.messageService.sendInteractiveMessage(from, { listMessage: menuMessage });
    return { success: true };
  }
}
```

---

## 🐛 Bug #2: Invalid Media Type Error

**Error:**
```
❌ Error sending interactive message: Invalid media type
```

This happens when the bot tries to send certain message types with `sendRichMessage()`. The fix is already in the code - use `sendInteractiveMessage()` instead, which is what the corrected code above does.

---

## ✅ Manual Requirements Checklist

**Before the bot works properly, you need:**

- [ ] **Express API server running** on port 5174
  ```bash
  npm run api  # or: node src/server/index.js
  ```

- [ ] **At least ONE merchant created**
  ```bash
  curl -X POST http://localhost:5174/api/merchants \
    -H "Content-Type: application/json" \
    -d '{"phone_number":"263123456","store_name":"My Store","category":"General"}'
  ```

- [ ] **At least 3-6 products in that merchant**
  ```bash
  curl -X POST http://localhost:5174/api/merchants/{MERCHANT_ID}/products \
    -H "Content-Type: application/json" \
    -d '{"name":"Pizza","price":2500,"category":"Food","stock":50}'
  ```

- [ ] **Optional: Product images** (emoji or URLs)
  - The dummy data includes emoji images (🍕, 🍔, 🥤, etc.)
  - You can add real images via API

- [ ] **Optional: Merchant metadata**
  - Store name ✅
  - Store description ✅
  - Store location/address ✅

---

## 🚀 Quick Start With Test Data

### Step 1: Start the API server
```bash
cd /workspaces/ultimate-bot
npm run api
```

### Step 2: Create test merchants and products
```bash
# Create merchant 1
MERCHANT1=$(curl -s -X POST http://localhost:5174/api/merchants \
  -H "Content-Type: application/json" \
  -d '{
    "phone_number": "2631234567",
    "store_name": "Pizza Palace",
    "category": "Restaurant",
    "description": "Delicious pizzas and pasta"
  }' | jq -r '.merchant.id')

# Add products to merchant 1
for i in {1..5}; do
  curl -s -X POST http://localhost:5174/api/merchants/$MERCHANT1/products \
    -H "Content-Type: application/json" \
    -d "{
      \"name\": \"Product $i\",
      \"price\": $((2000 + i * 500)),
      \"category\": \"Food\",
      \"stock\": 20,
      \"description\": \"Delicious product $i\"
    }"
done

echo "Created merchant: $MERCHANT1"
```

### Step 3: Start the bot
```bash
cd whatsapp-bot
npm run dev
```

### Step 4: Test commands
```
!menu          # Should show products now
!search pizza  # Should find products
!cart          # Should show empty cart
```

---

## 📊 Test Data Template

You can use this JSON to populate your database manually:

```json
{
  "merchants": [
    {
      "id": "merchant-1",
      "phone_number": "2631234567",
      "store_name": "Pizza Palace",
      "category": "Restaurant",
      "status": "approved"
    },
    {
      "id": "merchant-2",
      "phone_number": "2639876543",
      "store_name": "Fresh Bakery",
      "category": "Bakery",
      "status": "approved"
    }
  ],
  "products": [
    {
      "id": "prod-1",
      "merchant_id": "merchant-1",
      "name": "Margherita Pizza",
      "price": 2500,
      "category": "Pizza",
      "stock": 50,
      "description": "Classic pizza with tomato, mozzarella, and basil",
      "is_active": true
    },
    {
      "id": "prod-2",
      "merchant_id": "merchant-1",
      "name": "Pepperoni Pizza",
      "price": 3000,
      "category": "Pizza",
      "stock": 50,
      "description": "Pizza with pepperoni slices",
      "is_active": true
    },
    {
      "id": "prod-3",
      "merchant_id": "merchant-2",
      "name": "Sourdough Bread",
      "price": 450,
      "category": "Bread",
      "stock": 100,
      "description": "Fresh sourdough bread",
      "is_active": true
    }
  ]
}
```

---

## 🔗 API Endpoints You'll Need

```bash
# Get all merchants
GET /api/merchants

# Create merchant
POST /api/merchants
Body: { phone_number, store_name, category, description }

# Get merchant products
GET /api/merchants/{merchantId}/products

# Add product
POST /api/merchants/{merchantId}/products
Body: { name, price, category, stock, description, imageUrl }

# Search products
GET /api/products/search?q=pizza

# Create order
POST /api/orders
Body: { merchant_id, customer_phone, customer_name, items, total }
```

---

## 📝 Summary

**The bot is working!** The issues are:

1. ✅ **Menu command bug** - Code tries to call API with wrong parameters
2. ✅ **Missing data** - No merchants/products in your database
3. ✅ **Message format** - Using wrong message type for some responses

**To fix:**
1. Start Express API server
2. Create at least 1 merchant
3. Add 3-6 products to that merchant
4. Apply the code fix above
5. Test with `!menu` command

The bot has **fallback dummy data**, so `!menu` will still work even without real products - it just won't integrate with your API until you set up merchants and products.

---

**Last Updated:** 2025-11-24  
**Status:** 🟡 PARTIALLY WORKING - Needs merchant/product setup

#!/bin/bash

# Test Data Creation Script for Ultimate Bot
# Creates 3 merchants with 5-6 products each

set -e

API_BASE="http://localhost:5174"
TIMEOUT=5

echo "🤖 Ultimate Bot - Test Data Setup Script"
echo "═══════════════════════════════════════════"
echo ""

# Check if API is running
echo "⏳ Checking if API is running at $API_BASE..."
if ! curl -s --max-time $TIMEOUT "$API_BASE/api/health" > /dev/null 2>&1; then
    echo "❌ ERROR: API is not running!"
    echo "   Please start it with: npm run api"
    echo "   Then run this script again"
    exit 1
fi
echo "✅ API is running!"
echo ""

# Create Merchant 1: Pizza Palace
echo "📍 Creating Merchant 1: Pizza Palace..."
MERCHANT_1=$(curl -s -X POST "$API_BASE/api/merchants" \
  -H "Content-Type: application/json" \
  -d '{
    "phone_number": "263712345601",
    "store_name": "Pizza Palace",
    "category": "Food"
  }' | grep -o '"id":"[^"]*' | cut -d'"' -f4)

if [ -z "$MERCHANT_1" ]; then
    echo "❌ Failed to create Pizza Palace"
    exit 1
fi
echo "✅ Pizza Palace created (ID: $MERCHANT_1)"

# Add products to Merchant 1
echo "   Adding products..."
curl -s -X POST "$API_BASE/api/merchants/$MERCHANT_1/products" \
  -H "Content-Type: application/json" \
  -d '{"name":"Margherita Pizza","price":1500,"category":"Pizza","stock":50,"description":"Classic Italian pizza"}' > /dev/null
echo "      ✅ Margherita Pizza"

curl -s -X POST "$API_BASE/api/merchants/$MERCHANT_1/products" \
  -H "Content-Type: application/json" \
  -d '{"name":"Pepperoni Pizza","price":2000,"category":"Pizza","stock":40,"description":"Loaded with pepperoni"}' > /dev/null
echo "      ✅ Pepperoni Pizza"

curl -s -X POST "$API_BASE/api/merchants/$MERCHANT_1/products" \
  -H "Content-Type: application/json" \
  -d '{"name":"Vegetarian Pizza","price":1800,"category":"Pizza","stock":35,"description":"Fresh veggies"}' > /dev/null
echo "      ✅ Vegetarian Pizza"

curl -s -X POST "$API_BASE/api/merchants/$MERCHANT_1/products" \
  -H "Content-Type: application/json" \
  -d '{"name":"Garlic Bread","price":500,"category":"Sides","stock":60,"description":"Crispy and delicious"}' > /dev/null
echo "      ✅ Garlic Bread"

curl -s -X POST "$API_BASE/api/merchants/$MERCHANT_1/products" \
  -H "Content-Type: application/json" \
  -d '{"name":"Caesar Salad","price":800,"category":"Salads","stock":25,"description":"Fresh lettuce and dressing"}' > /dev/null
echo "      ✅ Caesar Salad"

curl -s -X POST "$API_BASE/api/merchants/$MERCHANT_1/products" \
  -H "Content-Type: application/json" \
  -d '{"name":"Coca Cola 2L","price":400,"category":"Drinks","stock":100,"description":"Cold refreshing drink"}' > /dev/null
echo "      ✅ Coca Cola 2L"

echo ""

# Create Merchant 2: Fresh Bakery
echo "📍 Creating Merchant 2: Fresh Bakery..."
MERCHANT_2=$(curl -s -X POST "$API_BASE/api/merchants" \
  -H "Content-Type: application/json" \
  -d '{
    "phone_number": "263712345602",
    "store_name": "Fresh Bakery",
    "category": "Bakery"
  }' | grep -o '"id":"[^"]*' | cut -d'"' -f4)

if [ -z "$MERCHANT_2" ]; then
    echo "❌ Failed to create Fresh Bakery"
    exit 1
fi
echo "✅ Fresh Bakery created (ID: $MERCHANT_2)"

# Add products to Merchant 2
echo "   Adding products..."
curl -s -X POST "$API_BASE/api/merchants/$MERCHANT_2/products" \
  -H "Content-Type: application/json" \
  -d '{"name":"Whole Wheat Bread","price":600,"category":"Bread","stock":40,"description":"Healthy wholemeal"}' > /dev/null
echo "      ✅ Whole Wheat Bread"

curl -s -X POST "$API_BASE/api/merchants/$MERCHANT_2/products" \
  -H "Content-Type: application/json" \
  -d '{"name":"Chocolate Cake","price":1200,"category":"Cakes","stock":20,"description":"Rich chocolate delight"}' > /dev/null
echo "      ✅ Chocolate Cake"

curl -s -X POST "$API_BASE/api/merchants/$MERCHANT_2/products" \
  -H "Content-Type: application/json" \
  -d '{"name":"Croissants","price":300,"category":"Pastries","stock":50,"description":"Buttery and flaky"}' > /dev/null
echo "      ✅ Croissants"

curl -s -X POST "$API_BASE/api/merchants/$MERCHANT_2/products" \
  -H "Content-Type: application/json" \
  -d '{"name":"Cinnamon Rolls","price":400,"category":"Pastries","stock":30,"description":"Sweet and aromatic"}' > /dev/null
echo "      ✅ Cinnamon Rolls"

curl -s -X POST "$API_BASE/api/merchants/$MERCHANT_2/products" \
  -H "Content-Type: application/json" \
  -d '{"name":"Donut Mix","price":500,"category":"Donuts","stock":60,"description":"Assorted fresh donuts"}' > /dev/null
echo "      ✅ Donut Mix"

echo ""

# Create Merchant 3: Cool Beverages
echo "📍 Creating Merchant 3: Cool Beverages..."
MERCHANT_3=$(curl -s -X POST "$API_BASE/api/merchants" \
  -H "Content-Type: application/json" \
  -d '{
    "phone_number": "263712345603",
    "store_name": "Cool Beverages",
    "category": "Drinks"
  }' | grep -o '"id":"[^"]*' | cut -d'"' -f4)

if [ -z "$MERCHANT_3" ]; then
    echo "❌ Failed to create Cool Beverages"
    exit 1
fi
echo "✅ Cool Beverages created (ID: $MERCHANT_3)"

# Add products to Merchant 3
echo "   Adding products..."
curl -s -X POST "$API_BASE/api/merchants/$MERCHANT_3/products" \
  -H "Content-Type: application/json" \
  -d '{"name":"Fresh Orange Juice","price":700,"category":"Juices","stock":50,"description":"100% natural orange"}' > /dev/null
echo "      ✅ Fresh Orange Juice"

curl -s -X POST "$API_BASE/api/merchants/$MERCHANT_3/products" \
  -H "Content-Type: application/json" \
  -d '{"name":"Iced Coffee","price":900,"category":"Coffee","stock":45,"description":"Smooth cold coffee"}' > /dev/null
echo "      ✅ Iced Coffee"

curl -s -X POST "$API_BASE/api/merchants/$MERCHANT_3/products" \
  -H "Content-Type: application/json" \
  -d '{"name":"Smoothie Mix","price":1000,"category":"Smoothies","stock":30,"description":"Tropical fruit smoothies"}' > /dev/null
echo "      ✅ Smoothie Mix"

curl -s -X POST "$API_BASE/api/merchants/$MERCHANT_3/products" \
  -H "Content-Type: application/json" \
  -d '{"name":"Iced Tea","price":500,"category":"Tea","stock":80,"description":"Refreshing iced tea"}' > /dev/null
echo "      ✅ Iced Tea"

curl -s -X POST "$API_BASE/api/merchants/$MERCHANT_3/products" \
  -H "Content-Type: application/json" \
  -d '{"name":"Bottled Water","price":250,"category":"Water","stock":200,"description":"Pure drinking water"}' > /dev/null
echo "      ✅ Bottled Water"

curl -s -X POST "$API_BASE/api/merchants/$MERCHANT_3/products" \
  -H "Content-Type: application/json" \
  -d '{"name":"Milkshake","price":1100,"category":"Shakes","stock":25,"description":"Creamy chocolate shake"}' > /dev/null
echo "      ✅ Milkshake"

echo ""
echo "═══════════════════════════════════════════"
echo "✅ SUCCESS! Test data created"
echo ""
echo "📊 Created:"
echo "   • 3 merchants"
echo "   • 18 total products"
echo "   • All data in: /workspaces/ultimate-bot/data/"
echo ""
echo "🚀 Next steps:"
echo "   1. Start bot: cd whatsapp-bot && npm run dev"
echo "   2. Scan QR code with WhatsApp"
echo "   3. Type: !menu"
echo "   4. Should now show products without errors!"
echo ""

# Payment Gateway Integration Guide for Bangladesh

## Overview

This guide explains how to integrate bKash, Nagad, Rocket, and Cash on Delivery (COD) payment methods into your e-commerce platform.

## Step 1: Get API Credentials

### bKash

1. Go to https://developer.bkash.com
2. Create a merchant account
3. Get your credentials:
   - App Key
   - App Secret
4. Use sandbox URL for testing: https://checkout.sandbox.bkash.com
5. Use production URL when live: https://checkout.bkash.com

### Nagad

1. Go to https://www.nagad.com.bd
2. Apply for merchant account
3. Get your credentials:
   - Merchant ID
   - Merchant Key
4. Use sandbox URL: https://api.sandbox.nagad.com.bd
5. Use production URL: https://api.nagad.com.bd

### Rocket

1. Go to https://www.rocketmoneytransfer.com
2. Register as merchant
3. Get your credentials:
   - Merchant ID
   - Merchant Password
4. Use sandbox URL: https://sandbox.rocketmoneytransfer.com
5. Use production URL: https://rocketmoneytransfer.com

## Step 2: Configure Environment Variables

Update your `.env` file with:

```env
# Backend URL
BACKEND_URL = http://localhost:4000

# bKash
BKASH_APP_KEY = your_bkash_app_key
BKASH_APP_SECRET = your_bkash_app_secret
BKASH_BASE_URL = https://checkout.sandbox.bkash.com

# Nagad
NAGAD_MERCHANT_ID = your_nagad_merchant_id
NAGAD_MERCHANT_KEY = your_nagad_merchant_key
NAGAD_BASE_URL = https://api.sandbox.nagad.com.bd

# Rocket
ROCKET_MERCHANT_ID = your_rocket_merchant_id
ROCKET_MERCHANT_PASSWORD = your_rocket_merchant_password
ROCKET_BASE_URL = https://sandbox.rocketmoneytransfer.com
```

## Step 3: API Endpoints

### Initiate bKash Payment

```
POST /api/v1/payment/bkash/initiate
Body: {
  "orderId": "ORD123",
  "amount": 5000,
  "customerEmail": "user@example.com",
  "customerPhone": "01700000000"
}
Response: {
  "success": true,
  "paymentURL": "bkash_checkout_url",
  "paymentID": "payment_id"
}
```

### Initiate Nagad Payment

```
POST /api/v1/payment/nagad/initiate
Body: {
  "orderId": "ORD123",
  "amount": 5000,
  "customerEmail": "user@example.com",
  "customerPhone": "01700000000"
}
```

### Initiate Rocket Payment

```
POST /api/v1/payment/rocket/initiate
Body: {
  "orderId": "ORD123",
  "amount": 5000,
  "customerEmail": "user@example.com",
  "customerPhone": "01700000000"
}
```

### Initiate COD (Cash on Delivery)

```
POST /api/v1/payment/cod/initiate
Body: {
  "orderId": "ORD123",
  "amount": 5000
}
Response: {
  "success": true,
  "message": "Cash on Delivery initiated successfully",
  "paymentMethod": "COD"
}
```

### Get Payment Status

```
GET /api/v1/payment/status/:orderId
Response: {
  "success": true,
  "payment": {
    "id": "payment_id",
    "order_id": "ORD123",
    "payment_method": "bKash",
    "amount": 5000,
    "currency": "BDT",
    "payment_status": "Paid",
    "transaction_id": "txn_id",
    "paid_at": "2024-01-15T10:30:00Z"
  }
}
```

## Frontend Implementation

### Payment Method Selection Component

```jsx
import { useState } from 'react'
import { loadBkashScript } from './bkash.js'
import { loadNagadScript } from './nagad.js'
import { loadRocketScript } from './rocket.js'

const PaymentMethod = ({ orderId, amount, onSuccess }) => {
  const [selectedMethod, setSelectedMethod] = useState('bkash')

  const handlePayment = async (method) => {
    switch (method) {
      case 'bkash':
        await initiateBkashPayment(orderId, amount)
        break
      case 'nagad':
        await initiateNagadPayment(orderId, amount)
        break
      case 'rocket':
        await initiateRocketPayment(orderId, amount)
        break
      case 'cod':
        await initiateCODPayment(orderId, amount)
        break
    }
  }

  return (
    <div className="payment-methods">
      <div className="method">
        <input
          type="radio"
          name="payment"
          value="bkash"
          checked={selectedMethod === 'bkash'}
          onChange={(e) => setSelectedMethod(e.target.value)}
        />
        <label>bKash</label>
      </div>

      <div className="method">
        <input
          type="radio"
          name="payment"
          value="nagad"
          checked={selectedMethod === 'nagad'}
          onChange={(e) => setSelectedMethod(e.target.value)}
        />
        <label>Nagad</label>
      </div>

      <div className="method">
        <input
          type="radio"
          name="payment"
          value="rocket"
          checked={selectedMethod === 'rocket'}
          onChange={(e) => setSelectedMethod(e.target.value)}
        />
        <label>Rocket</label>
      </div>

      <div className="method">
        <input
          type="radio"
          name="payment"
          value="cod"
          checked={selectedMethod === 'cod'}
          onChange={(e) => setSelectedMethod(e.target.value)}
        />
        <label>Cash on Delivery</label>
      </div>

      <button onClick={() => handlePayment(selectedMethod)}>Pay {amount} BDT</button>
    </div>
  )
}
```

## Testing

### Test Credentials (Sandbox)

**bKash Test Account:**

- Phone: 01700000000
- Pin: 12345

**Nagad Test Account:**

- Phone: 01700000000
- Pin: 1234

**Rocket Test Account:**

- Account: 01700000000
- Pin: 1234

## Important Notes

1. **Always test in sandbox** before going to production
2. **Never commit credentials** to git - use environment variables
3. **Implement proper error handling** on frontend
4. **Validate payments** on backend before marking as paid
5. **Store transaction IDs** for reconciliation
6. **Implement webhooks** for real-time payment confirmations
7. **Use HTTPS** in production
8. **Set up CORS** properly for payment callbacks

## Troubleshooting

### bKash Payment Failed

- Check App Key and App Secret
- Verify callback URL is accessible
- Check sandbox vs production endpoints

### Nagad Payment Failed

- Verify Merchant ID and Merchant Key
- Check signature generation
- Ensure phone number format is correct (880XXXXXXXXXX or 01XXXXXXXXX)

### Rocket Payment Failed

- Check Merchant ID and Password
- Verify MD5 signature generation
- Check customer account balance

### COD Issues

- Verify order status updates correctly
- Ensure order confirmation email is sent
- Check delivery partner integration

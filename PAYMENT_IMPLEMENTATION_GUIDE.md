# Bangladesh Payment Integration - Implementation Guide

## Quick Setup Status

### ✅ Already Working

- **COD (Cash on Delivery)**: Fully functional ✓
- **Currency**: BDT (৳) formatting throughout ✓
- **Shipping**: Division/District based calculation ✓
- **Tax**: 5% applied to subtotal ✓
- **Database**: Orders, shipping_info, payments tables ready ✓

### ⚠️ Needs Configuration

- **Stripe**: Currency fixed (USD → BDT) ✓
- **bKash**: Requires merchant account
- **Nagad**: Requires merchant account

---

## Step 1: Fix Stripe Configuration

**File**: `.env` (Backend)

```env
# Stripe Configuration (for international card payments)
STRIPE_SECRET_KEY=sk_test_your_secret_key_here
STRIPE_FRONTEND_KEY=pk_test_your_public_key_here
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret_here

# For production, use live keys:
# STRIPE_SECRET_KEY=sk_live_xxxxx
# STRIPE_FRONTEND_KEY=pk_live_xxxxx
```

**Currency Fixed**: ✓ Changed from USD to BDT in `generatePaymentIntent.js`

**Test Stripe Payment** (When ready):

1. Visit payment page
2. Ensure Stripe option available
3. Use test card: `4242 4242 4242 4242`
4. Expiry: Any future date
5. CVC: Any 3 digits

---

## Step 2: Implement bKash Payment (Optional)

### 2.1 Get Merchant Account

Apply at: https://merchant.bkash.com

You'll receive:

- Merchant Username
- Merchant API Key
- Merchant Account Number (017XXXXXXXX)
- App Key & App Secret

### 2.2 Add Environment Variables

**File**: `.env` (Backend)

```env
# bKash Configuration
BKASH_MERCHANT_USERNAME=your_username
BKASH_MERCHANT_API_KEY=your_api_key
BKASH_MERCHANT_ACCOUNT=017XXXXXXXX
BKASH_APPKEY=your_app_key
BKASH_APPSECRET=your_app_secret
BKASH_SANDBOX_URL=https://sandbox.bkash.com
BKASH_PRODUCTION_URL=https://api.bkash.com
```

### 2.3 Create bKash Backend Controller

**File**: `/server/controllers/paymentController.js` (Add this)

```javascript
import axios from 'axios'
import database from '../database/db.js'

const bkashBaseUrl =
  process.env.NODE_ENV === 'development'
    ? process.env.BKASH_SANDBOX_URL
    : process.env.BKASH_PRODUCTION_URL

// Get bKash Access Token
async function getBkashToken() {
  try {
    const response = await axios.post(
      `${bkashBaseUrl}/api/oauth2/token/grant`,
      {
        app_key: process.env.BKASH_APPKEY,
        app_secret: process.env.BKASH_APPSECRET,
      },
      {
        headers: {
          'Content-Type': 'application/json',
        },
      },
    )
    return response.data.id_token
  } catch (error) {
    console.error('bKash Token Error:', error)
    throw error
  }
}

// Create bKash Payment
export const createBkashPayment = async (req, res) => {
  try {
    const { orderId, amount, invoiceNumber } = req.body

    const token = await getBkashToken()

    const paymentPayload = {
      amount: amount.toString(),
      invoice: invoiceNumber,
      currency: 'BDT',
      intent: 'payment',
      merchantInvoiceNumber: invoiceNumber,
    }

    const response = await axios.post(
      `${bkashBaseUrl}/api/v1.2.0/tokenized/checkout/create`,
      paymentPayload,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          'X-APP-Key': process.env.BKASH_APPKEY,
          'Content-Type': 'application/json',
        },
      },
    )

    // Save payment record
    await database.query(
      `INSERT INTO payments (order_id, payment_type, payment_status, transaction_id)
       VALUES ($1, $2, $3, $4)`,
      [orderId, 'bKash', 'Pending', response.data.paymentID],
    )

    res.status(200).json({
      success: true,
      paymentURL: response.data.bkashURL,
      paymentID: response.data.paymentID,
    })
  } catch (error) {
    console.error('bKash Payment Error:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to initiate bKash payment',
    })
  }
}

// Execute bKash Payment
export const executeBkashPayment = async (req, res) => {
  try {
    const { paymentID, orderId } = req.body

    const token = await getBkashToken()

    const response = await axios.post(
      `${bkashBaseUrl}/api/v1.2.0/tokenized/checkout/execute`,
      { paymentID },
      {
        headers: {
          Authorization: `Bearer ${token}`,
          'X-APP-Key': process.env.BKASH_APPKEY,
          'Content-Type': 'application/json',
        },
      },
    )

    if (response.data.statusCode === '0000') {
      // Payment successful
      await database.query(
        `UPDATE payments SET payment_status = $1, transaction_id = $2
         WHERE transaction_id = $3`,
        ['Paid', response.data.trxID, paymentID],
      )

      await database.query(`UPDATE orders SET paid_at = NOW() WHERE id = $1`, [orderId])

      res.status(200).json({
        success: true,
        message: 'Payment successful',
        transactionID: response.data.trxID,
      })
    } else {
      res.status(400).json({
        success: false,
        message: 'Payment failed',
      })
    }
  } catch (error) {
    console.error('bKash Execute Error:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to complete payment',
    })
  }
}
```

### 2.4 Add bKash Routes

**File**: `/server/router/paymentRoutes.js` (Create/Update)

```javascript
import express from 'express'
import { createBkashPayment, executeBkashPayment } from '../controllers/paymentController.js'
import { isAuthenticated } from '../middlewares/authMiddleware.js'

const router = express.Router()

// bKash Routes
router.post('/bkash/create', isAuthenticated, createBkashPayment)
router.post('/bkash/execute', isAuthenticated, executeBkashPayment)

export default router
```

### 2.5 Add to Main App

**File**: `/server/app.js` (Add import)

```javascript
import paymentRouter from './router/paymentRoutes.js'

// Add this line with other routes
app.use('/api/v1/payment', paymentRouter)
```

### 2.6 Update Frontend Payment Handler

**File**: `/frontend/src/pages/Payment.jsx` (Update handlePayment)

```javascript
const handlePayment = async () => {
  if (paymentMethod === 'bkash') {
    await handleBkashPayment()
  } else if (paymentMethod === 'nagad') {
    toast.info('Nagad payment integration coming soon')
  } else if (paymentMethod === 'cod') {
    await handleCODPayment()
  }
}

const handleBkashPayment = async () => {
  if (!validateShippingDetails()) return

  setSubmitting(true)
  try {
    // First create the order
    const orderedItems = cartItems.map((item) => ({
      product: {
        id: item.id,
        images: [{ url: item.image || 'https://via.placeholder.com/300' }],
      },
      quantity: item.quantity,
    }))

    const orderResponse = await axiosInstance.post('/order/new', {
      full_name: shippingDetails.fullName,
      phone: shippingDetails.phone,
      email: shippingDetails.email,
      orderedItems,
    })

    const orderId = orderResponse.data.orderId

    // Create shipping info
    await axiosInstance.post('/order/shipping', {
      orderId,
      full_name: shippingDetails.fullName,
      phone: shippingDetails.phone,
      address: shippingDetails.address,
      division: shippingDetails.division,
      district: shippingDetails.district,
      country: 'Bangladesh',
    })

    // Initiate bKash payment
    const bkashResponse = await axiosInstance.post('/payment/bkash/create', {
      orderId,
      amount: total,
      invoiceNumber: orderId.slice(0, 8),
    })

    // Redirect to bKash payment page
    window.location.href = bkashResponse.data.paymentURL
  } catch (error) {
    toast.error('Failed to initiate bKash payment')
    console.error(error)
  } finally {
    setSubmitting(false)
  }
}
```

---

## Step 3: Implement Nagad Payment (Optional)

### 3.1 Get Merchant Account

Apply at: https://merchant.nagad.com.bd

You'll receive:

- Merchant Key
- Merchant Secret
- Account ID

### 3.2 Add Environment Variables

**File**: `.env` (Backend)

```env
# Nagad Configuration
NAGAD_MERCHANT_KEY=your_merchant_key
NAGAD_MERCHANT_SECRET=your_merchant_secret
NAGAD_ACCOUNT_ID=your_account_id
NAGAD_API_URL=https://api.nagad.com.bd
```

### 3.3 Create Nagad Backend Controller

**File**: `/server/controllers/paymentController.js` (Add)

```javascript
import crypto from 'crypto'

const nagadApiUrl = process.env.NAGAD_API_URL

// Generate Nagad Authorization Header
function generateNagadAuth() {
  const timestamp = Math.floor(Date.now() / 1000)
  const message = `${process.env.NAGAD_MERCHANT_KEY}${process.env.NAGAD_ACCOUNT_ID}${timestamp}`
  const signature = crypto
    .createHmac('sha256', process.env.NAGAD_MERCHANT_SECRET)
    .update(message)
    .digest('hex')

  return {
    Authorization: `Bearer ${process.env.NAGAD_MERCHANT_KEY}`,
    'X-Signature': signature,
    'X-Timestamp': timestamp,
  }
}

// Create Nagad Payment
export const createNagadPayment = async (req, res) => {
  try {
    const { orderId, amount, invoiceNumber } = req.body

    const paymentPayload = {
      accountId: process.env.NAGAD_ACCOUNT_ID,
      orderId: invoiceNumber,
      amount,
      callbackUrl: `${process.env.FRONTEND_URL}/payment/nagad/callback`,
      language: 'en',
    }

    const response = await axios.post(`${nagadApiUrl}/api/dfs/initiate-payment`, paymentPayload, {
      headers: generateNagadAuth(),
    })

    if (response.data.statusCode === 200) {
      // Save payment record
      await database.query(
        `INSERT INTO payments (order_id, payment_type, payment_status, transaction_id)
         VALUES ($1, $2, $3, $4)`,
        [orderId, 'Nagad', 'Pending', response.data.paymentRefId],
      )

      res.status(200).json({
        success: true,
        paymentData: response.data,
      })
    } else {
      res.status(400).json({
        success: false,
        message: 'Failed to initiate Nagad payment',
      })
    }
  } catch (error) {
    console.error('Nagad Payment Error:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to initiate Nagad payment',
    })
  }
}

// Handle Nagad Callback
export const nagadPaymentCallback = async (req, res) => {
  try {
    const { referenceId, status, trxId } = req.body

    if (status === 'success') {
      // Update payment status
      const paymentRecord = await database.query(
        `UPDATE payments SET payment_status = $1, transaction_id = $2
         WHERE transaction_id = $3 RETURNING order_id`,
        ['Paid', trxId, referenceId],
      )

      const orderId = paymentRecord.rows[0].order_id

      // Update order payment status
      await database.query(`UPDATE orders SET paid_at = NOW() WHERE id = $1`, [orderId])

      res.status(200).json({
        success: true,
        message: 'Payment confirmed',
      })
    } else {
      // Payment failed
      await database.query(
        `UPDATE payments SET payment_status = $1
         WHERE transaction_id = $2`,
        ['Failed', referenceId],
      )

      res.status(400).json({
        success: false,
        message: 'Payment failed',
      })
    }
  } catch (error) {
    console.error('Nagad Callback Error:', error)
    res.status(500).json({
      success: false,
      message: 'Callback processing failed',
    })
  }
}
```

---

## Current Payment Workflow

```
Customer Places Order
        ↓
Select Payment Method
        ├─ COD ────────────────────────────────→ Order Created (paid_at = NULL)
        │                                        ↓
        │                                    Admin Dashboard
        │                                        ↓
        │                                    Update Status when paid
        │
        ├─ bKash ──→ Create Payment ────────→ Redirect to bKash
        │                ↓
        │            Wait for Callback
        │                ↓
        │            Update Order (paid_at)
        │
        ├─ Nagad ───→ Create Payment ────────→ Show Nagad Modal
        │                ↓
        │            Wait for Callback
        │                ↓
        │            Update Order (paid_at)
        │
        └─ Stripe ──→ Create Intent ────────→ Show Payment Form
                         ↓
                     Webhook Callback
                         ↓
                     Update Order (paid_at)
```

---

## Testing Checklist

### COD Testing ✅

- [x] Select COD payment
- [x] Fill shipping details
- [x] Order created successfully
- [x] paid_at = NULL
- [x] Admin can see order
- [x] Admin can update status

### bKash Testing (When configured)

- [ ] Create bKash merchant account
- [ ] Add environment variables
- [ ] Test payment initiation
- [ ] Confirm callback received
- [ ] Verify order payment updated
- [ ] Check payment appears in dashboard

### Nagad Testing (When configured)

- [ ] Create Nagad merchant account
- [ ] Add environment variables
- [ ] Test payment initiation
- [ ] Confirm callback received
- [ ] Verify order payment updated
- [ ] Check payment appears in dashboard

### Stripe Testing (When configured)

- [ ] Add Stripe keys
- [ ] Test with 4242 4242 4242 4242
- [ ] Confirm webhook received
- [ ] Verify paid_at updated
- [ ] Check payment shows in dashboard

---

## Production Deployment Checklist

- [ ] All merchant accounts approved
- [ ] Environment variables configured for production
- [ ] HTTPS enabled on all domains
- [ ] Webhook URLs verified
- [ ] Error logging implemented
- [ ] Rate limiting configured
- [ ] Security audit completed
- [ ] Load testing done
- [ ] Backup/recovery plan ready
- [ ] Customer support trained

---

## Support & Troubleshooting

### Common Issues

**bKash Token Error**

- Check API Key and Secret are correct
- Ensure sandbox/production URL matches account type
- Verify network connectivity

**Nagad Signature Mismatch**

- Verify merchant key and secret
- Check timestamp calculation
- Ensure HMAC SHA256 implementation

**Stripe Currency Not Supported**

- Check account country supports BDT
- Use USD alternative if needed
- Contact Stripe support for BDT enablement

---

**Status**: Ready for implementation
**Last Updated**: February 6, 2026
**Next Steps**: Choose payment methods and implement accordingly

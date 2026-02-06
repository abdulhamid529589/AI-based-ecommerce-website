# Payment System Audit & Setup Guide - Bangladeshi E-Commerce

## Current Status

### ✅ Correctly Implemented

1. **Currency**: All prices display in ৳ (Bangladeshi Taka) ✓
2. **Payment Methods UI**:
   - bKash option available
   - Nagad option available
   - Cash on Delivery (COD) fully functional
3. **Bangladesh Shipping**:
   - Division/District dropdown
   - Chittagong: ৳60 shipping
   - Other districts: ৳100 shipping
   - Free shipping for orders over ৳5000
4. **Tax Calculation**: 5% tax applied to subtotal
5. **Order Creation**: COD orders successfully created with shipping info

### ⚠️ Issues Found

#### 1. **Stripe Configuration - CRITICAL**

**File**: `/server/utils/generatePaymentIntent.js`
**Issue**: Using USD currency instead of BDT

```js
currency: "usd",  // ❌ WRONG - Should be "bdt"
```

**Impact**: Stripe payments would charge in USD, not BDT

#### 2. **Payment Methods - Partially Implemented**

**File**: `/frontend/src/pages/Payment.jsx`
**Issue**:

- bKash/Nagad show UI but don't process payments
- Merchant numbers placeholder: `01XXX-XXXXX` (not real)
- No backend API for bKash/Nagad payments
- Only `handleCODPayment()` is functional

#### 3. **Missing Payment Gateway Setup**

**Required for Bangladesh**:

- bKash Merchant Account (if integrating)
- Nagad Merchant Account (if integrating)
- Stripe account configured for BDT

#### 4. **No Payment Verification**

**Issue**: bKash/Nagad transaction IDs aren't validated
**Risk**: User could enter any TXN ID without verification

#### 5. **Incomplete Payment Record**

**Issue**: bKash/Nagad payments don't update order payment status

---

## Recommended Bangladeshi Payment Setup

### Option 1: COD Only (Current - Safest for Testing)

✅ **Advantages**:

- No payment gateway fees
- Simple implementation
- Good for local deliveries
- Currently working

❌ **Disadvantages**:

- No online payment option
- Higher payment failure risk

### Option 2: COD + Stripe (International Cards)

✅ **Advantages**:

- Works for all card holders
- Professional payment processing
- Secure & PCI compliant
- Easy webhook integration

❌ **Disadvantages**:

- 2.9% + 30¢ per transaction fee
- Not available for Bangladesh-specific mobile money

### Option 3: COD + bKash/Nagad (Best for Bangladesh)

✅ **Advantages**:

- Most accessible for Bangladeshi users
- Lower fees (~1.5%)
- Instant payment confirmation
- Trusted by Bangladeshi customers

❌ **Disadvantages**:

- Requires merchant account
- Integration complexity
- Manual verification needed initially

### Option 4: All Three (Recommended Production Setup)

- COD (for preference)
- bKash/Nagad (for digital payments)
- Stripe (for international cards)

---

## Setup Instructions by Payment Method

### Current Working Setup: Cash on Delivery (COD)

**Status**: ✅ FULLY FUNCTIONAL

**Flow**:

1. User selects COD at payment page
2. Fills shipping details (division/district required)
3. Order created with `paid_at = NULL`
4. Order shows as "Pending" payment
5. Admin updates status when payment received

**Testing**:

```bash
# Create test order with COD
# Visit: http://localhost:5173/payment
# Select "Cash on Delivery"
# Fill all shipping details
# Click "Place Order"
```

---

### TODO: bKash Integration (Manual)

**Current State**: UI only, no payment processing

**Required for Production**:

1. **Get bKash Account**
   - Apply at: https://merchant.bkash.com
   - Requires business registration
   - 2-3 days approval

2. **Get Merchant Details**
   - Merchant Username
   - Merchant API Key
   - Merchant Account Number

3. **Add to Backend Environment**

   ```env
   BKASH_MERCHANT_USERNAME=your_username
   BKASH_MERCHANT_API_KEY=your_api_key
   BKASH_MERCHANT_ACCOUNT=017XXXXXXXX
   BKASH_APPKEY=your_app_key
   BKASH_APPSECRET=your_app_secret
   ```

4. **Implement Backend API**
   - Create `/api/v1/payment/bkash/create` endpoint
   - Create `/api/v1/payment/bkash/execute` endpoint
   - Handle IPN (Instant Payment Notification) webhooks

5. **Frontend Integration**
   - Update `handlePayment()` to call bKash API
   - Show bKash payment modal/redirect
   - Handle success/failure response

---

### TODO: Nagad Integration (Manual)

**Current State**: UI only, no payment processing

**Required for Production**:

1. **Get Nagad Account**
   - Apply at: https://merchant.nagad.com.bd
   - Requires business verification
   - 3-5 days approval

2. **Get Merchant Details**
   - Merchant Key
   - Merchant Secret
   - Merchant Account ID

3. **Add to Backend Environment**

   ```env
   NAGAD_MERCHANT_KEY=your_key
   NAGAD_MERCHANT_SECRET=your_secret
   NAGAD_ACCOUNT_ID=your_account_id
   NAGAD_API_URL=https://api.nagad.com.bd
   ```

4. **Implement Backend API**
   - Create `/api/v1/payment/nagad/init` endpoint
   - Create `/api/v1/payment/nagad/confirm` endpoint
   - Handle webhook for transaction status

5. **Frontend Integration**
   - Update `handlePayment()` to call Nagad API
   - Show Nagad payment modal/redirect
   - Handle success/failure response

---

### Current: Stripe Integration (Partially Done)

**Status**: ⚠️ NEEDS FIX - Currency issue

**File**: `/server/utils/generatePaymentIntent.js`

**Issue**: Currency is "usd" should be "bdt"

**Fix Required**:

```js
// Change from:
currency: "usd",

// To:
currency: "bdt",
```

**Note**: Stripe support for BDT (Bangladesh Taka) depends on your Stripe account region. If not available in your region, you may need to use USD.

---

## Payment Status Flow

```
Order Created
    ↓
Payment Method Selection
    ├→ COD: paid_at = NULL (Pending)
    ├→ bKash: paid_at = NULL until confirmed
    ├→ Nagad: paid_at = NULL until confirmed
    └→ Stripe: paid_at = NULL until webhook success
    ↓
Payment Received (for non-COD)
    ↓
Webhook Updates: paid_at = NOW()
    ↓
Order Status Updated by Admin
    └→ Processing → Shipped → Delivered
```

---

## Database Tables

### Orders Table

```sql
CREATE TABLE orders (
    id UUID PRIMARY KEY,
    buyer_id UUID REFERENCES users(id),
    total_price DECIMAL NOT NULL,
    tax_price DECIMAL DEFAULT 0.05,
    shipping_price DECIMAL NOT NULL,
    order_status VARCHAR DEFAULT 'Processing',
    paid_at TIMESTAMP,  -- NULL = Unpaid, NOT NULL = Paid
    created_at TIMESTAMP DEFAULT NOW()
);
```

### Payments Table

```sql
CREATE TABLE payments (
    id UUID PRIMARY KEY,
    order_id UUID REFERENCES orders(id),
    payment_type VARCHAR,  -- 'COD', 'bKash', 'Nagad', 'Stripe'
    payment_status VARCHAR,  -- 'Pending', 'Paid', 'Failed'
    transaction_id VARCHAR,  -- bKash/Nagad TXN ID or Stripe Intent ID
    created_at TIMESTAMP DEFAULT NOW()
);
```

### Shipping Info Table

```sql
CREATE TABLE shipping_info (
    id UUID PRIMARY KEY,
    order_id UUID REFERENCES orders(id),
    full_name VARCHAR NOT NULL,
    phone VARCHAR NOT NULL,
    address VARCHAR NOT NULL,
    division VARCHAR NOT NULL,
    district VARCHAR NOT NULL,
    country VARCHAR DEFAULT 'Bangladesh',
    pincode VARCHAR,
    created_at TIMESTAMP DEFAULT NOW()
);
```

---

## Current Issues Summary

| Issue                                 | Status     | Priority | Effort |
| ------------------------------------- | ---------- | -------- | ------ |
| Stripe currency (USD → BDT)           | ⚠️ Found   | HIGH     | 2min   |
| bKash integration                     | ❌ Missing | MEDIUM   | 4hrs   |
| Nagad integration                     | ❌ Missing | MEDIUM   | 4hrs   |
| Payment verification for mobile money | ❌ Missing | MEDIUM   | 2hrs   |
| Receipt generation                    | ❌ Missing | LOW      | 1hr    |
| Payment status tracking in admin      | ⚠️ Partial | MEDIUM   | 1hr    |

---

## Recommended Actions (Priority Order)

### Immediate (Today)

1. ✅ Fix Stripe currency to BDT
2. ✅ Verify COD is working correctly
3. ✅ Test order creation with proper shipping data

### Short Term (This Week)

1. Implement bKash payment API integration
2. Implement Nagad payment API integration
3. Add payment verification webhook handlers
4. Create admin payment reconciliation page

### Medium Term (Next 2 Weeks)

1. Create payment receipt generation
2. Add payment refund capability
3. Implement payment analytics dashboard
4. Add SMS/Email notifications for payment status

---

## Testing Checklist

### COD Payment Testing

- [ ] Select COD payment method
- [ ] Fill all shipping details correctly
- [ ] Verify order created in database
- [ ] Confirm `paid_at = NULL`
- [ ] Check shipping_info saved
- [ ] Verify order appears in dashboard

### Stripe Testing (When Ready)

- [ ] Use Stripe test card: 4242 4242 4242 4242
- [ ] Verify payment intent created
- [ ] Confirm webhook received
- [ ] Check `paid_at = NOW()` updated
- [ ] Verify order shows "Paid" status

### bKash Testing (When Ready)

- [ ] Test payment initiation
- [ ] Simulate payment confirmation
- [ ] Verify IPN webhook received
- [ ] Check payment status updated
- [ ] Test payment failure handling

---

## Merchant Account Requirements

### bKash

- **Document**: National ID/Passport
- **Business**: Trade License or Incorporation Document
- **Bank**: Business Bank Account
- **Fee**: 1.5% per transaction
- **Settlement**: Daily to registered bank account

### Nagad

- **Document**: National ID
- **Business**: Trade License
- **Bank**: Business Bank Account
- **Fee**: 1.5% per transaction
- **Settlement**: Within 2-3 days

### Stripe

- **Document**: National ID
- **Business**: Tax ID or Business License
- **Bank**: Any valid bank account
- **Fee**: 2.9% + 30¢ per transaction
- **Settlement**: Daily to connected bank account

---

## Support Resources

### bKash

- Merchant Portal: https://merchant.bkash.com
- Documentation: https://developer.bkash.com
- Support: merchant@bkash.com

### Nagad

- Merchant Portal: https://merchant.nagad.com.bd
- Documentation: https://api.nagad.com.bd/docs
- Support: merchant.support@nagad.com.bd

### Stripe

- Dashboard: https://dashboard.stripe.com
- Documentation: https://stripe.com/docs
- Support: https://support.stripe.com

---

## Security Considerations

### Critical Security Measures

1. **Never expose merchant keys** in frontend code
2. **Use HTTPS only** for all payment transactions
3. **Validate all transaction IDs** on backend
4. **Implement CSRF protection** for payment forms
5. **Store sensitive data encrypted** in database
6. **Log all payment attempts** for audit trail
7. **Implement rate limiting** on payment endpoints

### PCI Compliance

- Don't store card details (use Stripe tokenization)
- Use TLS 1.2+ for all connections
- Implement strong authentication
- Regular security audits

---

## Next Steps

1. **Decide payment methods** to support
2. **Apply for merchant accounts** (if needed)
3. **Implement backend APIs** for each payment method
4. **Setup webhook handlers** for payment confirmations
5. **Test thoroughly** with real test credentials
6. **Deploy with proper error handling** and logging

---

**Last Updated**: February 6, 2026
**Status**: Payment system analysis complete
**Ready for**: Integration implementation

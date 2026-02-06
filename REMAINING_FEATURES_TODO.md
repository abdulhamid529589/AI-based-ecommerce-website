# Remaining Backend-Frontend Feature Gaps

## HIGH PRIORITY (Should Implement Next)

### 1. User Profile Management

**Backend Available:**

- `PUT /auth/password/update` - Change password (logged in user)
- `PUT /auth/profile/update` - Update name, email, avatar (logged in user)

**Frontend Missing:**

- No profile/settings page
- No avatar upload functionality
- No name/email edit form
- No change password interface

**Implementation Needed:**

```
File: /frontend/src/pages/Profile.jsx
- Form to edit name and email
- Upload avatar to Cloudinary
- Change password with current password verification
- Profile picture display
```

---

### 2. Cash on Delivery (COD) Payment

**Backend Available:**

- `POST /payment/cod/initiate` - Initialize COD order

**Frontend Missing:**

- No COD button/option in payment page
- No COD order flow implementation

**Implementation Needed:**

- Add COD button to payment page
- On click: Place order with COD status
- Show order confirmation

---

## MEDIUM PRIORITY

### 1. bKash Payment Integration

**Backend Available:**

- `POST /payment/bkash/initiate` - Start bKash payment
- `GET /payment/bkash/callback` - Handle bKash response

**Frontend Missing:**

- No bKash payment form
- No integration with bKash gateway

**Implementation Needed:**

- bKash form/modal in payment page
- Request bKash payment initiation
- Handle callback response

---

### 2. Nagad Payment Integration

**Backend Available:**

- `POST /payment/nagad/initiate` - Start Nagad payment
- `POST /payment/nagad/callback` - Handle Nagad response

**Frontend Missing:**

- No Nagad payment form
- No integration with Nagad gateway

**Implementation Needed:**

- Nagad form/modal in payment page
- Request Nagad payment initiation
- Handle callback response

---

### 3. Rocket Payment Integration

**Backend Available:**

- `POST /payment/rocket/initiate` - Start Rocket payment
- `POST /payment/rocket/callback` - Handle Rocket response

**Frontend Missing:**

- No Rocket payment form
- No integration with Rocket gateway

**Implementation Needed:**

- Rocket form/modal in payment page
- Request Rocket payment initiation
- Handle callback response

---

### 4. Payment Status Tracking

**Backend Available:**

- `GET /payment/status/:orderId` - Get current payment status

**Frontend Missing:**

- No payment status checking
- No payment status display in orders

**Implementation Needed:**

- Check payment status in Orders page
- Display payment status for each order
- Show payment success/failure indicators

---

## LOWER PRIORITY

### 1. AI-Powered Search

**Backend Available:**

- `POST /product/ai-search` - Search products using AI

**Frontend Missing:**

- No AI search interface
- Current search is basic text matching

**Implementation Needed:**

- Create AI search page/modal
- Natural language query input
- Display AI-filtered results
- Integration with productSlice

---

### 2. Wishlist Functionality

**Backend:** No specific wishlist endpoints (can use product/user relationship)

**Frontend Exists But Empty:**

- `/frontend/src/pages/Wishlist.jsx` - Empty component
- `/frontend/src/store/slices/wishlistSlice.js` - Has basic actions

**Implementation Needed:**

- Add to/remove from wishlist buttons
- Display wishlist page with products
- Persist wishlist to backend
- Show wishlist count in navbar

---

### 3. Admin Dashboard Features

**Backend Available:**

- `GET /admin/getallusers` - Get all users
- `PUT /admin/update/:id` - Update user
- `DELETE /admin/delete/:id` - Delete user
- `GET /admin/fetch/dashboard-stats` - Get statistics
- `GET /order/admin/getall` - Get all orders
- `PUT /order/admin/update/:orderId` - Update order status
- `DELETE /order/admin/delete/:orderId` - Delete order

**Frontend Missing:**

- Admin dashboard doesn't use these endpoints
- No user management interface
- No order management interface
- No statistics display

---

## IMPLEMENTATION ROADMAP

### Week 1: Payment Methods

1. [ ] Implement COD payment flow
2. [ ] Set up bKash integration
3. [ ] Test payment callback handling

### Week 2: Payment Methods (Continued)

1. [ ] Implement Nagad integration
2. [ ] Implement Rocket integration
3. [ ] Add payment status tracking

### Week 3: User Features

1. [ ] Create Profile page
2. [ ] Implement avatar upload
3. [ ] Add change password functionality

### Week 4: Advanced Features

1. [ ] Build AI search interface
2. [ ] Complete wishlist functionality
3. [ ] Start admin dashboard

### Week 5: Admin Features

1. [ ] User management interface
2. [ ] Order management interface
3. [ ] Dashboard statistics display

---

## CODE SNIPPETS FOR QUICK REFERENCE

### Payment Method Selection (to add to Payment.jsx)

```javascript
const paymentMethods = [
  { id: 'card', name: 'Credit/Debit Card', icon: 'CreditCard' },
  { id: 'bkash', name: 'bKash', icon: 'Send' },
  { id: 'nagad', name: 'Nagad', icon: 'Send' },
  { id: 'rocket', name: 'Rocket', icon: 'Send' },
  { id: 'cod', name: 'Cash on Delivery', icon: 'Truck' },
]
```

### Profile Update Form Structure

```javascript
const profileFields = {
  name: { type: 'text', required: true },
  email: { type: 'email', required: true },
  avatar: { type: 'file', accept: 'image/*', required: false },
  currentPassword: { type: 'password', required: true }, // for verification
  newPassword: { type: 'password', required: false },
  confirmPassword: { type: 'password', required: false },
}
```

### AI Search Input

```javascript
const aiSearchPrompt = 'Find me summer clothes that are trending'
// Send to: POST /product/ai-search
// Body: { userPrompt }
```

---

## TESTING ENDPOINTS

All payment endpoints are located at: `POST /api/v1/payment/`

### Test bKash Initiation

```bash
curl -X POST http://localhost:5000/api/v1/payment/bkash/initiate \
  -H "Content-Type: application/json" \
  -d '{
    "amount": 5000,
    "orderId": "123",
    "userPhone": "01700000000"
  }'
```

### Test COD

```bash
curl -X POST http://localhost:5000/api/v1/payment/cod/initiate \
  -H "Content-Type: application/json" \
  -d '{
    "orderId": "123"
  }'
```

### Test AI Search

```bash
curl -X POST http://localhost:5000/api/v1/product/ai-search \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer {token}" \
  -d '{
    "userPrompt": "summer dresses under 3000 taka"
  }'
```

---

## NOTES

1. **Payment Callbacks**: Backend returns transaction IDs that should be stored for verification
2. **Avatar Upload**: Use Cloudinary (same as backend implementation)
3. **AI Search**: Requires backend ML model integration (already implemented)
4. **Wishlist**: Can be stored in localStorage or backend (suggest backend for persistence)
5. **Admin Role**: Check user.role === 'Admin' before showing admin features

---

## PRIORITY RANKING FOR NEXT PHASE

1. 🔴 **CRITICAL**: User Profile Management (affects UX)
2. 🔴 **CRITICAL**: Payment Method Implementation (revenue dependent)
3. 🟡 **HIGH**: Payment Status Tracking
4. 🟡 **HIGH**: Admin Dashboard (operations dependent)
5. 🟢 **MEDIUM**: Wishlist Functionality
6. 🟢 **MEDIUM**: AI Search Feature

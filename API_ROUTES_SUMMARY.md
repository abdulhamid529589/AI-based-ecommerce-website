# API Routes Summary

## Base URL

```
http://localhost:4000/api/v1
```

## Route Structure

### 1. Authentication Routes (`/auth`)

**File**: [server/router/authRoutes.js](server/router/authRoutes.js)

| Method | Endpoint                      | Auth Required | Description                        |
| ------ | ----------------------------- | ------------- | ---------------------------------- |
| POST   | `/auth/register`              | ❌ No         | Register new user or admin         |
| POST   | `/auth/login`                 | ❌ No         | Login user/admin                   |
| GET    | `/auth/me`                    | ✅ Yes        | Get current user profile           |
| GET    | `/auth/logout`                | ✅ Yes        | Logout current user                |
| POST   | `/auth/password/forgot`       | ❌ No         | Request password reset             |
| PUT    | `/auth/password/reset/:token` | ❌ No         | Reset password with token          |
| PUT    | `/auth/password/update`       | ✅ Yes        | Update password for logged-in user |
| PUT    | `/auth/profile/update`        | ✅ Yes        | Update profile information         |

---

### 2. Product Routes (`/product`)

**File**: [server/router/productRoutes.js](server/router/productRoutes.js)

| Method | Endpoint                              | Auth Required | Admin Only | Description                |
| ------ | ------------------------------------- | ------------- | ---------- | -------------------------- |
| POST   | `/product/admin/create`               | ✅ Yes        | ✅ Yes     | Create new product         |
| GET    | `/product/`                           | ❌ No         | ❌ No      | Get all products           |
| GET    | `/product/singleProduct/:productId`   | ❌ No         | ❌ No      | Get single product details |
| PUT    | `/product/post-new/review/:productId` | ✅ Yes        | ❌ No      | Post product review        |
| DELETE | `/product/delete/review/:productId`   | ✅ Yes        | ❌ No      | Delete product review      |
| PUT    | `/product/admin/update/:productId`    | ✅ Yes        | ✅ Yes     | Update product             |
| DELETE | `/product/admin/delete/:productId`    | ✅ Yes        | ✅ Yes     | Delete product             |
| POST   | `/product/ai-search`                  | ✅ Yes        | ❌ No      | AI-powered product search  |

---

### 3. Admin Routes (`/admin`)

**File**: [server/router/adminRoutes.js](server/router/adminRoutes.js)

| Method | Endpoint                       | Auth Required | Admin Only | Description              |
| ------ | ------------------------------ | ------------- | ---------- | ------------------------ |
| GET    | `/admin/getallusers`           | ✅ Yes        | ✅ Yes     | Get all users            |
| DELETE | `/admin/delete/:id`            | ✅ Yes        | ✅ Yes     | Delete user by ID        |
| GET    | `/admin/fetch/dashboard-stats` | ✅ Yes        | ✅ Yes     | Get dashboard statistics |

**Dashboard Stats Response**:

```json
{
  "totalRevenue": 50000,
  "totalOrders": 25,
  "totalCustomers": 100,
  "totalProducts": 45,
  "monthlySales": [...],
  "topProducts": [...]
}
```

---

### 4. Order Routes (`/order`)

**File**: [server/router/orderRoutes.js](server/router/orderRoutes.js)

| Method | Endpoint                       | Auth Required | Admin Only | Description               |
| ------ | ------------------------------ | ------------- | ---------- | ------------------------- |
| POST   | `/order/new`                   | ✅ Yes        | ❌ No      | Create new order          |
| GET    | `/order/:orderId`              | ✅ Yes        | ❌ No      | Get single order          |
| GET    | `/order/orders/me`             | ✅ Yes        | ❌ No      | Get current user's orders |
| GET    | `/order/admin/getall`          | ✅ Yes        | ✅ Yes     | Get all orders (admin)    |
| PUT    | `/order/admin/update/:orderId` | ✅ Yes        | ✅ Yes     | Update order status       |
| DELETE | `/order/admin/delete/:orderId` | ✅ Yes        | ✅ Yes     | Delete order              |

**Order Status Values**: `Pending`, `Processing`, `Shipped`, `Delivered`, `Cancelled`

---

### 5. Payment Gateway Routes (`/payment`)

**File**: [server/router/paymentGatewayRoutes.js](server/router/paymentGatewayRoutes.js)

#### bKash Payment Routes

| Method | Endpoint                  | Description            |
| ------ | ------------------------- | ---------------------- |
| POST   | `/payment/bkash/initiate` | Initiate bKash payment |
| GET    | `/payment/bkash/callback` | bKash payment callback |

#### Nagad Payment Routes

| Method | Endpoint                  | Description            |
| ------ | ------------------------- | ---------------------- |
| POST   | `/payment/nagad/initiate` | Initiate Nagad payment |
| POST   | `/payment/nagad/callback` | Nagad payment callback |

#### Rocket Payment Routes

| Method | Endpoint                   | Description             |
| ------ | -------------------------- | ----------------------- |
| POST   | `/payment/rocket/initiate` | Initiate Rocket payment |
| POST   | `/payment/rocket/callback` | Rocket payment callback |

#### Cash on Delivery

| Method | Endpoint                | Description          |
| ------ | ----------------------- | -------------------- |
| POST   | `/payment/cod/initiate` | Initiate COD payment |

#### Payment Status

| Method | Endpoint                   | Description        |
| ------ | -------------------------- | ------------------ |
| GET    | `/payment/status/:orderId` | Get payment status |

---

## Middleware Applied

### Rate Limiting

- Applied to all `/api/v1` routes
- Configured with express-rate-limit

### Authentication

- `isAuthenticated`: Checks if user is logged in
- `authorizedRoles("Admin")`: Checks if user has Admin role

### Error Handling

- Global error handler catches all errors
- 404 Not Found handler for unmatched routes
- Custom error formatting

---

## Request/Response Example

### Successful Admin Login

```
POST /api/v1/auth/login
Content-Type: application/json

{
  "email": "admin@ecommerce.com",
  "password": "Admin@123456"
}

Response (200 OK):
{
  "success": true,
  "message": "Login successful",
  "user": {
    "id": 1,
    "name": "Admin User",
    "email": "admin@ecommerce.com",
    "role": "Admin"
  }
}
```

### Get All Users (Admin)

```
GET /api/v1/admin/getallusers
Headers:
  Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

Response (200 OK):
[
  {
    "id": 1,
    "name": "Customer Name",
    "email": "customer@example.com",
    "role": "Customer",
    "createdAt": "2026-02-05T10:30:00Z"
  }
]
```

---

## Webhook Routes

### Stripe Webhook

```
POST /api/v1/payment/webhook
```

- **Signature Verification**: Required
- **Secret**: `process.env.STRIPE_WEBHOOK_SECRET`
- **Handles**: `payment_intent.succeeded` event

---

## Environment Variables Required

```env
FRONTEND_URL=http://localhost:3000
DASHBOARD_URL=http://localhost:5174
BKASH_BASE_URL=https://sandbox.bkashopen.com
BKASH_APP_KEY=your_bkash_app_key
BKASH_APP_SECRET=your_bkash_app_secret
NAGAD_BASE_URL=https://api.dev.nagad.com.bd
NAGAD_MERCHANT_ID=your_nagad_merchant_id
ROCKET_BASE_URL=https://sandbox.rocket.net.bd
ROCKET_MERCHANT_ID=your_rocket_merchant_id
STRIPE_WEBHOOK_SECRET=your_stripe_webhook_secret
```

---

## Testing Routes with Postman

1. **Register Admin**
   - Method: POST
   - URL: `http://localhost:4000/api/v1/auth/register`
   - Body: Include role as "Admin"

2. **Login**
   - Method: POST
   - URL: `http://localhost:4000/api/v1/auth/login`
   - Save token from response

3. **Use token in headers**
   - Header: `Authorization: Bearer <token>`

---

**Last Updated**: February 5, 2026
**Version**: 1.0

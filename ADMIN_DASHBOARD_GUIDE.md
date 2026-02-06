# Complete Admin Dashboard Setup Guide

## 📋 Table of Contents

1. [Register as Admin](#register-as-admin)
2. [Login to Dashboard](#login-to-dashboard)
3. [Dashboard Navigation](#dashboard-navigation)
4. [Dashboard Features](#dashboard-features)
5. [API Endpoints Reference](#api-endpoints-reference)

---

## Register as Admin

### Step 1: Prepare Backend

Ensure your backend server is running on `http://localhost:4000`

### Step 2: Register Admin User with Postman

#### Option A: Using Postman GUI

1. **Open Postman** and create a new request
2. **Set Request Type**: POST
3. **Enter URL**: `http://localhost:4000/api/v1/auth/register`
4. **Go to Headers tab** and add:

   ```
   Content-Type: application/json
   ```

5. **Go to Body tab**, select `raw` and `JSON`, then paste:

   ```json
   {
     "name": "Admin User",
     "email": "admin@ecommerce.com",
     "password": "Admin@123456",
     "confirmPassword": "Admin@123456",
     "role": "Admin"
   }
   ```

6. **Click Send**

#### Expected Response (Success):

```json
{
  "success": true,
  "message": "Admin registered successfully",
  "user": {
    "id": 1,
    "name": "Admin User",
    "email": "admin@ecommerce.com",
    "role": "Admin"
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

### Step 3: Save Your Credentials

```
Email: admin@ecommerce.com
Password: Admin@123456
Token: (save this for later API requests)
```

---

## Login to Dashboard

### Important: Dashboard Port

The dashboard can run on any available port (5173, 5174, 5175, etc.).
- **Check your terminal** when running `npm run dev` to see which port is active
- In the examples below, **5174** is used, but yours might be **5175** or different
- The exact URL will be shown in your terminal

### Method 1: Using Admin Dashboard UI

1. **Start Frontend Dashboard Server**:

   ```bash
   cd dashboard
   npm install
   npm run dev
   ```

2. **Check Terminal Output**:
   ```
   VITE v6.2.5 ready in 685 ms
   ➜  Local:   http://localhost:5175/
   ```
   Note the port number shown in your terminal

3. **Navigate** to `http://localhost:<YOUR_PORT>` (e.g., `http://localhost:5175`)

4. **You'll see Login Page** with:
   - Email field
   - Password field
   - "Login" button
   - "Forgot Password" link

5. **Enter Admin Credentials**:

   ```
   Email: admin@ecommerce.com
   Password: Admin@123456
   ```

6. **Click Login**

7. **You'll be redirected to Dashboard**

### Method 2: Using Postman to Get Token

**Request**:

```
POST http://localhost:4000/api/v1/auth/login

Headers:
Content-Type: application/json

Body (raw JSON):
{
  "email": "admin@ecommerce.com",
  "password": "Admin@123456"
}
```

**Response**:

```json
{
  "success": true,
  "message": "Login successful",
  "user": {
    "id": 1,
    "name": "Admin User",
    "email": "admin@ecommerce.com",
    "role": "Admin",
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

### Admin Dashboard URL Structure

Once logged in, you can navigate to:

- **Dashboard Home**: `http://localhost:5175/`
- **Products Page**: `http://localhost:5175/products`
- **Orders Page**: `http://localhost:5175/orders`
- **Users Page**: `http://localhost:5175/users`
- **Profile Page**: `http://localhost:5175/profile`

---

## Dashboard Navigation

### Dashboard Structure

```
Admin Dashboard (localhost:5174)
│
├── Dashboard (/)
│   ├── Sales Analytics
│   ├── Order Stats
│   ├── Monthly Sales Chart
│   └── Top Products
│
├── Products (/products)
│   ├── Product List
│   ├── Add New Product
│   ├── Edit Product
│   ├── View Product Details
│   └── Delete Product
│
├── Orders (/orders)
│   ├── All Orders List
│   ├── Filter by Status
│   ├── Update Order Status
│   ├── View Order Details
│   └── Track Shipments
│
└── Users (/users)
    ├── All Users List
    ├── Filter by Role
    ├── User Statistics
    ├── Delete User
    └── User Details
```

### Sidebar Navigation

- **Logo/Menu Toggle** - Click to collapse/expand sidebar
- **Dashboard** - Main analytics page
- **Products** - Product management
- **Orders** - Order management
- **Users** - User management
- **User Profile** - Shows your name and email
- **Logout** - Exit dashboard

---

## Dashboard Features

### 1. Dashboard (Home)

**Purpose**: View business overview and analytics

**Features**:

- ✅ Total Revenue
- ✅ Total Orders Count
- ✅ Total Customers
- ✅ Monthly Sales Chart
- ✅ Top Products Chart
- ✅ Top Selling Products List
- ✅ Recent Order Statistics

**No actions required** - Just view analytics

---

### 2. Products Management

**Purpose**: Manage your product catalog

**URL**: `http://localhost:5174/products`

**Features**:

- 📋 View all products in table format
- 🔍 Search products by name or ID
- ➕ Add new product (Create Product Modal)
- ✏️ Edit existing product (Update Product Modal)
- 👁️ View product details (View Product Modal)
- 🗑️ Delete products
- 📊 Stock status indicators
- 🏷️ Category display
- 📄 Pagination (10 products per page)

**How to Add a Product**:

1. Click **"Add New Product"** button
2. Fill in product details:
   - Product Name
   - Description
   - Price (in BDT)
   - Stock Quantity
   - Category
   - Images
   - Status (Active/Inactive)
3. Click **Save**

**How to Edit a Product**:

1. Find product in the list
2. Click **Edit Icon** (pencil)
3. Modify details
4. Click **Update**

**How to Delete a Product**:

1. Click **Delete Icon** (trash)
2. Confirm deletion in popup

---

### 3. Orders Management

**Purpose**: Track and manage customer orders

**URL**: `http://localhost:5174/orders`

**Features**:

- 📋 View all orders with customer info
- 🔍 Search orders by Order ID or Email
- 🏷️ Filter by status:
  - Pending
  - Processing
  - Shipped
  - Delivered
  - Cancelled
- 🔄 Update order status (dropdown selector)
- 💰 Payment status tracking
- 👁️ View detailed order information
- 📊 Order statistics (Total, Pending, Delivered)
- 📄 Pagination

**Order Details Modal Shows**:

- Order ID and Date
- Customer Name, Email, Phone
- Shipping Address (Full address details)
- Order Items (Product list with quantities)
- Total Amount
- Current Status
- Payment Status

**How to Update Order Status**:

1. Find order in table
2. Click **Status Dropdown** (shows current status)
3. Select new status:
   - `Pending` → `Processing`
   - `Processing` → `Shipped`
   - `Shipped` → `Delivered`
   - Any status → `Cancelled`
4. Status updates immediately

**How to View Order Details**:

1. Click **Eye Icon** in Actions column
2. Modal opens showing all order information
3. Close by clicking X or clicking outside modal

---

### 4. Users Management

**Purpose**: Manage customer and admin accounts

**URL**: `http://localhost:5174/users`

**Features**:

- 👥 View all users in card grid layout
- 🔍 Search by name or email
- 🏷️ Filter by role:
  - All Users
  - Customers
  - Admins
- 📊 User statistics:
  - Total Orders
  - Total Spent (BDT)
- 🗑️ Delete user accounts
- 📅 Join date display
- 👤 User profile avatar with initials
- 📄 Pagination

**User Card Shows**:

- User avatar with role badge
- Full name
- Email
- Phone number (if available)
- Total orders placed
- Total amount spent
- Join date
- Delete button

**How to Delete a User**:

1. Click **Delete** button on user card
2. Confirm in popup dialog
3. User account is removed

**How to Filter Users**:

1. Click filter buttons:
   - **All Users** - Show everyone
   - **Customers** - Show only customers
   - **Admins** - Show only admins
2. Search bar filters by name or email in real-time

---

## API Endpoints Reference

### Authentication Endpoints

#### Register Admin

```
POST /api/v1/auth/register
Content-Type: application/json

{
  "name": "Admin User",
  "email": "admin@ecommerce.com",
  "password": "Admin@123456",
  "confirmPassword": "Admin@123456",
  "role": "Admin"
}
```

#### Login

```
POST /api/v1/auth/login
Content-Type: application/json

{
  "email": "admin@ecommerce.com",
  "password": "Admin@123456"
}
```

#### Get Current User

```
GET /api/v1/auth/me
Headers:
Authorization: Bearer <your_token>
```

#### Logout

```
GET /api/v1/auth/logout
Headers:
Authorization: Bearer <your_token>
```

#### Update Profile

```
PUT /api/v1/auth/profile/update
Headers:
Authorization: Bearer <your_token>
Content-Type: application/json

{
  "name": "Updated Name",
  "email": "newemail@example.com"
}
```

#### Update Password

```
PUT /api/v1/auth/password/update
Headers:
Authorization: Bearer <your_token>
Content-Type: application/json

{
  "oldPassword": "Admin@123456",
  "newPassword": "NewPassword@123456",
  "confirmPassword": "NewPassword@123456"
}
```

---

### Products Endpoints

#### Get All Products

```
GET /api/v1/product/
```

#### Get Single Product

```
GET /api/v1/product/singleProduct/<productId>
```

#### Create Product (Admin Only)

```
POST /api/v1/product/admin/create
Headers:
Authorization: Bearer <your_token>
Content-Type: multipart/form-data

{
  "name": "Product Name",
  "description": "Product description",
  "price": 1500,
  "stock": 100,
  "category": "Electronics",
  "images": [files]
}
```

#### Update Product (Admin Only)

```
PUT /api/v1/product/admin/update/<productId>
Headers:
Authorization: Bearer <your_token>
Content-Type: multipart/form-data

{
  "name": "Updated Name",
  "price": 2000,
  "stock": 50
}
```

#### Delete Product (Admin Only)

```
DELETE /api/v1/product/admin/delete/<productId>
Headers:
Authorization: Bearer <your_token>
```

#### Post Product Review

```
PUT /api/v1/product/post-new/review/<productId>
Headers:
Authorization: Bearer <your_token>
Content-Type: application/json

{
  "rating": 5,
  "comment": "Great product!"
}
```

#### Delete Review

```
DELETE /api/v1/product/delete/review/<productId>
Headers:
Authorization: Bearer <your_token>
```

#### AI Search Products

```
POST /api/v1/product/ai-search
Headers:
Authorization: Bearer <your_token>
Content-Type: application/json

{
  "query": "blue electronic gadgets"
}
```

---

### Orders Endpoints

#### Place New Order

```
POST /api/v1/order/new
Headers:
Authorization: Bearer <your_token>
Content-Type: application/json

{
  "items": [
    {
      "productId": 1,
      "quantity": 2,
      "price": 1500
    }
  ],
  "shippingAddress": {
    "addressLine1": "123 Main St",
    "city": "Dhaka",
    "state": "Dhaka",
    "postalCode": "1000",
    "country": "Bangladesh",
    "phone": "01700000000"
  },
  "totalAmount": 3000,
  "paymentMethod": "stripe"
}
```

#### Get Single Order

```
GET /api/v1/order/<orderId>
Headers:
Authorization: Bearer <your_token>
```

#### Get My Orders (Current User)

```
GET /api/v1/order/orders/me
Headers:
Authorization: Bearer <your_token>
```

#### Get All Orders (Admin Only)

```
GET /api/v1/order/admin/getall
Headers:
Authorization: Bearer <your_token>
```

#### Update Order Status (Admin Only)

```
PUT /api/v1/order/admin/update/<orderId>
Headers:
Authorization: Bearer <your_token>
Content-Type: application/json

{
  "orderStatus": "Processing"
}
```

Valid statuses: `Pending`, `Processing`, `Shipped`, `Delivered`, `Cancelled`

#### Delete Order (Admin Only)

```
DELETE /api/v1/order/admin/delete/<orderId>
Headers:
Authorization: Bearer <your_token>
```

---

### Admin Endpoints

#### Get All Users (Admin Only)

```
GET /api/v1/admin/getallusers
Headers:
Authorization: Bearer <your_token>
```

#### Delete User (Admin Only)

```
DELETE /api/v1/admin/delete/<userId>
Headers:
Authorization: Bearer <your_token>
```

#### Dashboard Statistics (Admin Only)

```
GET /api/v1/admin/fetch/dashboard-stats
Headers:
Authorization: Bearer <your_token>
```

Response includes:
- Total revenue
- Total orders
- Total customers
- Total products
- Monthly sales data

---

### Payment Endpoints

#### Initiate bKash Payment

```
POST /api/v1/payment/bkash/initiate
Content-Type: application/json

{
  "orderId": 1,
  "amount": 3000,
  "customerEmail": "customer@example.com",
  "customerPhone": "01700000000"
}
```

#### bKash Payment Callback

```
GET /api/v1/payment/bkash/callback?paymentID=<paymentID>&status=<status>
```

#### Initiate Nagad Payment

```
POST /api/v1/payment/nagad/initiate
Content-Type: application/json

{
  "orderId": 1,
  "amount": 3000,
  "customerEmail": "customer@example.com",
  "customerPhone": "01700000000"
}
```

#### Nagad Payment Callback

```
POST /api/v1/payment/nagad/callback
Content-Type: application/json

{
  "paymentID": "nagad_payment_id",
  "status": "Completed"
}
```

#### Initiate Rocket Payment

```
POST /api/v1/payment/rocket/initiate
Content-Type: application/json

{
  "orderId": 1,
  "amount": 3000,
  "customerEmail": "customer@example.com",
  "customerPhone": "01700000000"
}
```

#### Rocket Payment Callback

```
POST /api/v1/payment/rocket/callback
Content-Type: application/json

{
  "paymentID": "rocket_payment_id",
  "status": "Completed"
}
```

#### Initiate Cash on Delivery

```
POST /api/v1/payment/cod/initiate
Content-Type: application/json

{
  "orderId": 1,
  "amount": 3000,
  "customerEmail": "customer@example.com",
  "customerPhone": "01700000000"
}
```

#### Get Payment Status

```
GET /api/v1/payment/status/<orderId>
```

---

## Common Issues & Solutions

### Issue: "Unauthorized" error when accessing dashboard

**Solution**:

1. Check if you're logged in with Admin role
2. Verify token is valid in browser localStorage
3. Try logging out and logging back in
4. Check if backend server is running

### Issue: Products/Orders/Users not loading

**Solution**:

1. Ensure backend is running on port 4000
2. Check if API endpoints are correct
3. Verify authentication token is valid
4. Check browser console for error messages
5. Restart dashboard dev server

### Issue: "Role is not 'Admin'" error

**Solution**:

1. Register with `"role": "Admin"` in request body
2. Or modify user role in database directly
3. Ensure you're not logged in as regular customer

### Issue: Cannot add/edit/delete products

**Solution**:

1. Verify token in localStorage
2. Check backend modal implementations exist
3. Ensure all required fields are filled
4. Check for validation errors in console

---

## Quick Start Checklist

- [ ] Backend running on `http://localhost:4000`
- [ ] Register admin user with Postman
- [ ] Save admin credentials
- [ ] Start dashboard dev server (`npm run dev`)
- [ ] Navigate to `http://localhost:5174`
- [ ] Login with admin credentials
- [ ] View Dashboard page
- [ ] Navigate to Products page
- [ ] Navigate to Orders page
- [ ] Navigate to Users page
- [ ] Test add/edit/delete operations

---

## Dashboard Access URLs

| Page      | URL                                    | Notes                    |
| --------- | -------------------------------------- | ------------------------ |
| Dashboard | http://localhost:5174                  | Home/Analytics page      |
| Products  | http://localhost:5174/products         | Product management       |
| Orders    | http://localhost:5174/orders           | Order management         |
| Users     | http://localhost:5174/users            | User management          |
| Profile   | http://localhost:5174/profile          | Admin profile settings   |
| Login     | http://localhost:5174/login            | Admin login page         |

**⚠️ Note**: Port number may differ (5173, 5175, etc.). Check your terminal when running `npm run dev` to see the actual port.

---

## Tips & Tricks

1. **Search & Filter**: Use search bar to quickly find products, orders, or users
2. **Status Updates**: Click status dropdown in orders to update quickly
3. **Mobile Friendly**: Dashboard works on mobile - click menu toggle
4. **Dark Mode**: Dashboard supports system dark mode preference
5. **Pagination**: Use pagination buttons to browse through large lists
6. **Real-time Updates**: Changes appear immediately without refresh
7. **Confirmation Dialogs**: Always confirm before deleting items

---

## Next Steps

After accessing the dashboard, you can:

1. ✅ Add sample products to your catalog
2. ✅ Create test orders from frontend
3. ✅ Track orders and update statuses
4. ✅ Manage user accounts
5. ✅ View analytics and reports

---

**Last Updated**: February 5, 2026
**Version**: 1.0
**Status**: ✅ Production Ready

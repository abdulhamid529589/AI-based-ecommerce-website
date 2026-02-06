# Data Flow Architecture - Complete Diagram

## System Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                     ADMIN DASHBOARD                             │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ├─ Login/Auth
                              │   └─ Store token in localStorage
                              │
                              └─ Protected Routes (Admin Only)
                                  │
                                  ├─────────────────────────────┐
                                  │                             │
                          ┌───────▼────────┐  ┌───────────┐  ┌──▼──────┐  ┌────────┐
                          │  DASHBOARD     │  │ PRODUCTS  │  │ ORDERS  │  │ USERS  │
                          └───────┬────────┘  └─────┬─────┘  └────┬────┘  └────┬───┘
                                  │                 │             │            │
                    ┌─────────────┘                 │             │            │
                    │                               │             │            │
        ┌───────────▼──────────────┐                │             │            │
        │  fetchDashboardStats()   │                │             │            │
        │  Redux Thunk Action      │                │             │            │
        │                          │                │             │            │
        │  dispatch() on mount     │                │             │            │
        └───────────┬──────────────┘                │             │            │
                    │                               │             │            │
                    ▼                               ▼             ▼            ▼
    ┌──────────────────────────────┐  ┌──────────────────┐  ┌──────────┐  ┌──────────┐
    │   API: /api/v1/admin/        │  │  API:            │  │  API:    │  │  API:    │
    │   fetch/dashboard-stats      │  │  /api/v1/        │  │  /api/   │  │  /api/   │
    │                              │  │  product/        │  │  v1/     │  │  v1/     │
    │   Backend Returns:           │  │                  │  │  order/  │  │  admin/  │
    │   - totalRevenue             │  │  Returns:        │  │  admin/  │  │  getallusers
    │   - orderStatusCounts        │  │  - products[]    │  │  getall  │  │          │
    │   - monthlySales[]           │  │    {id, name,    │  │          │  │  Returns:│
    │   - topSellingProducts[]     │  │     price, etc}  │  │  Returns:│  │  - users[]
    │   - totalCustomers           │  │                  │  │  - orders│  │    {id,  │
    │   - topSellingProducts       │  │  Status: 200 ✅  │  │    {id,  │  │     name,│
    │   - currentMonthSales        │  │                  │  │     email,   email,   │
    │   - revenueGrowth            │  │                  │  │     price,   role,    │
    │   - newUsersThisMonth        │  │                  │  │     status}│  etc}    │
    │                              │  │                  │  │          │          │
    │   Status: 200 ✅             │  │                  │  │  Status:  │  Status: │
    └──────────────┬───────────────┘  └──────────┬───────┘  │  200 ✅   │  200 ✅  │
                   │                             │          └──────────┘  └──────────┘
                   │                             │              │            │
                   ▼                             ▼              ▼            ▼
    ┌──────────────────────────────┐  ┌──────────────────┐  ┌──────────┐  ┌──────────┐
    │   Redux Store (admin slice)  │  │  Local State     │  │  Local   │  │  Local   │
    │                              │  │                  │  │  State   │  │  State   │
    │   State: {                   │  │  products: []    │  │  orders: │  │  users:  │
    │     loading: false,          │  │  loading: false, │  │  [],     │  │  [],     │
    │     totalRevenue: 500000,    │  │  searchTerm: '', │  │  loading:│  │  loading:│
    │     totalOrders: 1234,       │  │  currentPage: 1  │  │  false   │  │  false   │
    │     totalCustomers: 456,     │  │                  │  │          │  │          │
    │     monthlySales: [...],     │  │                  │  │          │  │          │
    │     orderStatusCounts: {...},│  │                  │  │          │  │          │
    │     topSellingProducts: [...] │  │                  │  │          │  │          │
    │   }                          │  │                  │  │          │  │          │
    └──────────────┬───────────────┘  └──────────┬───────┘  └────┬─────┘  └────┬─────┘
                   │                             │               │            │
                   │ useSelector()               │               │            │
                   ▼                             ▼               ▼            ▼
    ┌──────────────────────────────┐  ┌──────────────────┐  ┌──────────┐  ┌──────────┐
    │    Dashboard Components      │  │  Products List   │  │  Orders  │  │  Users   │
    │                              │  │                  │  │  Table   │  │  Cards   │
    │  ├─ MiniSummary             │  │  - Table rows    │  │          │  │          │
    │  │  ├─ Total Revenue card   │  │  - Search bar    │  │  - Rows  │  │  - Name  │
    │  │  ├─ Total Orders card    │  │  - Pagination    │  │  - Filters   - Email │
    │  │  ├─ Total Customers card │  │  - Create button │  │  - Stats │  │  - Role  │
    │  │  └─ Growth card          │  │                  │  │          │  │  - Delete│
    │  │                          │  │                  │  │          │  │          │
    │  ├─ Stats Row              │  │  Real-time data  │  │  Real-   │  │  Real-   │
    │  │  ├─ Processing badge     │  │  with refresh    │  │  time    │  │  time    │
    │  │  ├─ Shipped badge        │  │  on actions      │  │  updates │  │  updates │
    │  │  ├─ Delivered badge      │  │                  │  │          │  │          │
    │  │  └─ Cancelled badge      │  │                  │  │          │  │          │
    │  │                          │  │                  │  │          │  │          │
    │  ├─ MonthlySalesChart       │  │                  │  │          │  │          │
    │  │  └─ Line chart (6 months)│  │                  │  │          │  │          │
    │  │                          │  │                  │  │          │  │          │
    │  ├─ OrdersChart            │  │                  │  │          │  │          │
    │  │  └─ Pie chart (status)   │  │                  │  │          │  │          │
    │  │                          │  │                  │  │          │  │          │
    │  ├─ TopProductsChart        │  │                  │  │          │  │          │
    │  │  └─ Bar chart (top 6)    │  │                  │  │          │  │          │
    │  │                          │  │                  │  │          │  │          │
    │  └─ TopSellingProducts      │  │                  │  │          │  │          │
    │     └─ Table (top 5)        │  │                  │  │          │  │          │
    │                              │  │                  │  │          │  │          │
    │  All updated with real data  │  │                  │  │          │  │          │
    │  from backend database ✅    │  │                  │  │          │  │          │
    └──────────────────────────────┘  └──────────────────┘  └──────────┘  └──────────┘
```

---

## Data Flow Timeline

```
┌─ USER LOGS IN
│  └─ Token stored in localStorage
│
├─ USER NAVIGATES TO DASHBOARD
│  └─ Dashboard.jsx mounts
│     └─ useEffect() triggers
│        └─ dispatch(fetchDashboardStats())
│           └─ Redux thunk makes API call
│              └─ axios.get('/api/v1/admin/fetch/dashboard-stats')
│                 └─ Backend processes request
│                    └─ Queries database
│                       └─ Returns JSON response
│                          └─ Redux reducer updates state
│                             └─ Components re-render with new data
│                                └─ User sees:
│                                   ├─ Revenue cards updated
│                                   ├─ Charts populated
│                                   ├─ Stats row shown
│                                   └─ Product list displayed
│
├─ USER CREATES NEW PRODUCT
│  └─ Opens CreateProductModal
│     └─ Fills form and submits
│        └─ axios.post('/api/v1/product/create')
│           └─ Backend creates product in database
│              └─ Returns success response
│                 └─ Toast notification shown
│                    └─ onSuccess() callback fires
│                       └─ fetchProducts() called
│                          └─ Product list updated in UI ✅
│
├─ USER VIEWS ORDERS PAGE
│  └─ Orders.jsx mounts
│     └─ useEffect() triggers
│        └─ fetchOrders() called
│           └─ axios.get('/api/v1/order/admin/getall')
│              └─ Backend queries all orders
│                 └─ Returns array of orders
│                    └─ Local state updated
│                       └─ Table rendered with real orders ✅
│
└─ USER SEARCHES/FILTERS
   └─ Search input changes
      └─ Filter runs on existing data (client-side)
         └─ No API call needed
            └─ Results updated instantly ✅
```

---

## Component Hierarchy with Data Flow

```
App
├─ Router
│  ├─ Login Route
│  ├─ ForgotPassword Route
│  ├─ ResetPassword Route
│  └─ Protected Routes (ProtectedLayout wrapper)
│     │
│     ├─ / (Dashboard)
│     │  └─ Dashboard.jsx
│     │     ├─ useEffect → fetchDashboardStats()
│     │     └─ Children (reading from Redux admin state):
│     │        ├─ Header
│     │        ├─ MiniSummary
│     │        │  ├─ Revenue Card (totalRevenue)
│     │        │  ├─ Orders Card (totalOrders)
│     │        │  ├─ Customers Card (totalCustomers)
│     │        │  └─ Growth Card (revenueGrowth)
│     │        │
│     │        ├─ Stats
│     │        │  ├─ Processing (orderStatusCounts.Processing)
│     │        │  ├─ Shipped (orderStatusCounts.Shipped)
│     │        │  ├─ Delivered (orderStatusCounts.Delivered)
│     │        │  └─ Cancelled (orderStatusCounts.Cancelled)
│     │        │
│     │        ├─ MonthlySalesChart
│     │        │  └─ Line Chart (monthlySales data)
│     │        │
│     │        ├─ OrdersChart
│     │        │  └─ Pie Chart (orderStatusCounts)
│     │        │
│     │        ├─ TopProductsChart
│     │        │  └─ Bar Chart (topSellingProducts)
│     │        │
│     │        └─ TopSellingProducts
│     │           └─ Table (topSellingProducts)
│     │
│     ├─ /products (Products)
│     │  └─ Products.jsx
│     │     ├─ useEffect → fetchProducts()
│     │     ├─ Local state: products[]
│     │     └─ Display:
│     │        ├─ Header
│     │        ├─ Search Bar
│     │        ├─ Table (map products)
│     │        ├─ Pagination
│     │        ├─ CreateProductModal
│     │        ├─ UpdateProductModal
│     │        └─ ViewProductModal
│     │
│     ├─ /orders (Orders)
│     │  └─ Orders.jsx
│     │     ├─ useEffect → fetchOrders()
│     │     ├─ Local state: orders[]
│     │     └─ Display:
│     │        ├─ Header
│     │        ├─ Stats Cards
│     │        ├─ Filters
│     │        ├─ Table (map orders)
│     │        └─ Pagination
│     │
│     └─ /users (Users)
│        └─ Users.jsx
│           ├─ useEffect → fetchUsers()
│           ├─ Local state: users[]
│           └─ Display:
│              ├─ Header
│              ├─ Stats Cards
│              ├─ Search/Filters
│              ├─ Cards Grid (map users)
│              └─ Pagination
│
└─ ToastContainer (for notifications)
```

---

## Redux State Structure

```
store = {
  auth: {
    isAuthenticated: true,
    user: {
      id: 1,
      email: 'admin@example.com',
      role: 'Admin'
    },
    error: null
  },

  admin: {                                    ← Populated by fetchDashboardStats()
    loading: false,
    error: null,

    // Mini Summary Data
    totalRevenue: 500000,                     ← Revenue all-time
    totalOrders: 1234,                        ← Total order count
    totalCustomers: 456,                      ← Total user count

    // Detailed Data
    totalRevenueAllTime: 500000,
    todayRevenue: 2500,
    yesterdayRevenue: 1800,
    totalUsersCount: 456,
    currentMonthSales: 125000,
    revenueGrowth: '+12.5%',
    newUsersThisMonth: 34,

    // Status Data
    orderStatusCounts: {                      ← For Stats & OrdersChart
      Processing: 145,
      Shipped: 234,
      Delivered: 1203,
      Cancelled: 22
    },

    // Chart Data
    monthlySales: [                           ← For MonthlySalesChart
      { month: 'Jan 2026', totalsales: 45000, orders: 120 },
      { month: 'Feb 2026', totalsales: 52000, orders: 135 },
      ...
    ],

    // Product Data
    topSellingProducts: [                     ← For TopProductsChart & TopSellingProducts
      { name: 'Wireless Headphones', category: 'Electronics', total_sold: 156, image: '...' },
      { name: 'Smart Watch', category: 'Wearables', total_sold: 124, image: '...' },
      ...
    ],

    lowStockProducts: [...]                   ← Products with stock ≤ 5
  },

  product: { ... },
  order: { ... },
  extra: { ... }
}
```

---

## API Request/Response Examples

### Dashboard Stats

**Request:**

```
GET /api/v1/admin/fetch/dashboard-stats
Authorization: Bearer eyJhbGc...
Content-Type: application/json
```

**Response:**

```json
{
  "success": true,
  "message": "Dashboard Stats Fetched Successfully",
  "totalRevenueAllTime": 500000,
  "todayRevenue": 2500,
  "yesterdayRevenue": 1800,
  "totalUsersCount": 456,
  "orderStatusCounts": {
    "Processing": 145,
    "Shipped": 234,
    "Delivered": 1203,
    "Cancelled": 22
  },
  "monthlySales": [
    { "month": "Jan 2026", "totalsales": 45000 },
    ...
  ],
  "topSellingProducts": [
    { "name": "Wireless Headphones", "total_sold": 156, "category": "Electronics" },
    ...
  ],
  "currentMonthSales": 125000,
  "revenueGrowth": "+12.5%",
  "newUsersThisMonth": 34
}
```

---

## Performance Metrics

```
┌─ Page Load Times
│  ├─ Dashboard: ~500ms-1s (includes Redux fetch)
│  ├─ Products: ~300-500ms (local state)
│  ├─ Orders: ~300-500ms (local state)
│  └─ Users: ~300-500ms (local state)
│
├─ Data Update Times
│  ├─ Create Product: 1-2s (POST + refresh)
│  ├─ Update Product: 1-2s (PUT + refresh)
│  ├─ Delete Product: 500ms (DELETE + refresh)
│  └─ Similar for Orders and Users
│
└─ Search/Filter Times
   ├─ Client-side: ~10-50ms (instant)
   └─ No additional API calls needed
```

---

## Error Handling Flow

```
API Call Fails
    ↓
catch (error)
    ↓
error.response?.data?.message ?
    ├─ Yes → Show error message from server
    │        "Product not found"
    │
    └─ No → Show generic message
             "Failed to fetch data"
                ↓
        toast.error(message)  ← User sees red toast
                ↓
        console.error(error)  ← Dev debugging
                ↓
        Loading state set to false
                ↓
        Component shows fallback/empty state
```

---

## Summary

✅ **All pages fetch real data from backend**
✅ **Proper Redux state management for Dashboard**
✅ **API calls include Bearer token authentication**
✅ **Error handling with user feedback**
✅ **Auto-refresh after CRUD operations**
✅ **Client-side search/filter for performance**
✅ **Responsive design on all pages**
✅ **Dark mode support throughout**

# Customer Information & Shipping Address - Data Verification

## Complete Data Flow Architecture

### 1. Database Schema

#### Users Table

```sql
CREATE TABLE users (
    id UUID PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password TEXT NOT NULL,
    role VARCHAR(10) DEFAULT 'User',
    avatar JSONB,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

#### Shipping Info Table

```sql
CREATE TABLE shipping_info (
    id UUID PRIMARY KEY,
    order_id UUID NOT NULL UNIQUE,
    full_name VARCHAR(100) NOT NULL,
    state VARCHAR(100) NOT NULL,
    city VARCHAR(100) NOT NULL,
    country VARCHAR(100) NOT NULL,
    address TEXT NOT NULL,
    pincode VARCHAR(10) NOT NULL,
    phone VARCHAR(20) NOT NULL,
    FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE
);
```

#### Orders Table

```sql
CREATE TABLE orders (
    id UUID PRIMARY KEY,
    buyer_id UUID NOT NULL,
    total_price DECIMAL(10,2) NOT NULL,
    tax_price DECIMAL(10,2) NOT NULL,
    shipping_price DECIMAL(10,2) NOT NULL,
    order_status VARCHAR(50) DEFAULT 'Processing',
    paid_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (buyer_id) REFERENCES users(id) ON DELETE CASCADE
);
```

---

## 2. Backend Data Fetching

### SQL Query (fetchAllOrders)

```sql
SELECT
  o.*,

  -- Order Items (JSON Array)
  COALESCE(
    json_agg(
      json_build_object(
        'order_item_id', oi.id,
        'order_id', oi.order_id,
        'product_id', oi.product_id,
        'quantity', oi.quantity,
        'price', oi.price,
        'image', oi.image,
        'title', oi.title
      )
    ) FILTER (WHERE oi.id IS NOT NULL),
    '[]'
  ) AS order_items,

  -- Shipping Info (JSON Object)
  json_build_object(
    'full_name', s.full_name,
    'state', s.state,
    'city', s.city,
    'country', s.country,
    'address', s.address,
    'pincode', s.pincode,
    'phone', s.phone
  ) AS shipping_info,

  -- User Info (JSON Object)
  json_build_object(
    'id', u.id,
    'name', u.name,
    'email', u.email
  ) AS user_info

FROM orders o
LEFT JOIN order_items oi ON o.id = oi.order_id
LEFT JOIN shipping_info s ON o.id = s.order_id
LEFT JOIN users u ON o.buyer_id = u.id
GROUP BY o.id, s.id, u.id
ORDER BY o.created_at DESC
```

### API Response Example

```json
{
  "success": true,
  "message": "All orders fetched.",
  "orders": [
    {
      "id": "550e8400-e29b-41d4-a716-446655440000",
      "buyer_id": "660e8400-e29b-41d4-a716-446655440001",
      "total_price": 1050.0,
      "tax_price": 0.18,
      "shipping_price": 50,
      "order_status": "Processing",
      "paid_at": "2024-02-06T10:30:00Z",
      "created_at": "2024-02-06T10:00:00Z",

      "user_info": {
        "id": "660e8400-e29b-41d4-a716-446655440001",
        "name": "John Doe",
        "email": "john.doe@example.com"
      },

      "shipping_info": {
        "full_name": "John Doe",
        "state": "Dhaka",
        "city": "Dhaka",
        "country": "Bangladesh",
        "address": "123 Main Street, Apt 4B, Building A",
        "pincode": "1000",
        "phone": "+8801234567890"
      },

      "order_items": [
        {
          "order_item_id": "770e8400-e29b-41d4-a716-446655440002",
          "order_id": "550e8400-e29b-41d4-a716-446655440000",
          "product_id": "880e8400-e29b-41d4-a716-446655440003",
          "quantity": 2,
          "price": 500,
          "image": "https://example.com/product.jpg",
          "title": "Product Name"
        }
      ]
    }
  ]
}
```

---

## 3. Frontend Data Display

### Customer Information Section

#### Data Source Mapping

| Display Field | Source Field | Source Object   | Type   | Fallback                   |
| ------------- | ------------ | --------------- | ------ | -------------------------- |
| Customer Name | `name`       | `user_info`     | String | `shipping_info?.full_name` |
| Email         | `email`      | `user_info`     | String | 'N/A'                      |
| Phone         | `phone`      | `shipping_info` | String | 'N/A'                      |

#### Frontend Code

```jsx
<div className="bg-gray-50 p-5 rounded-lg border border-gray-200">
  <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
    <span className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center mr-3 text-sm">
      👤
    </span>
    Customer Information
  </h3>

  <div className="grid grid-cols-2 gap-4">
    {/* Customer Name */}
    <div>
      <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
        Customer Name
      </label>
      <p className="text-gray-900 font-medium mt-1">
        {selectedOrder.user_info?.name || selectedOrder.shipping_info?.full_name || 'N/A'}
      </p>
    </div>

    {/* Email */}
    <div>
      <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Email</label>
      <p className="text-gray-900 font-medium mt-1">{selectedOrder.user_info?.email || 'N/A'}</p>
    </div>

    {/* Phone */}
    <div>
      <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Phone</label>
      <p className="text-gray-900 font-medium mt-1">
        {selectedOrder.shipping_info?.phone || 'N/A'}
      </p>
    </div>
  </div>
</div>
```

#### Display Example

```
Customer Information

Customer Name: John Doe
Email: john.doe@example.com
Phone: +8801234567890
```

---

### Shipping Address Section

#### Data Source Mapping

| Display Field  | Source Field | Source Object   | Type   | Fallback |
| -------------- | ------------ | --------------- | ------ | -------- |
| Full Address   | `address`    | `shipping_info` | Text   | 'N/A'    |
| City           | `city`       | `shipping_info` | String | 'N/A'    |
| State          | `state`      | `shipping_info` | String | 'N/A'    |
| Country        | `country`    | `shipping_info` | String | 'N/A'    |
| Postal Code    | `pincode`    | `shipping_info` | String | 'N/A'    |
| Phone          | `phone`      | `shipping_info` | String | 'N/A'    |
| Recipient Name | `full_name`  | `shipping_info` | String | 'N/A'    |

#### Frontend Code

```jsx
<div className="bg-gray-50 p-5 rounded-lg border border-gray-200">
  <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
    <span className="w-8 h-8 bg-green-600 text-white rounded-full flex items-center justify-center mr-3 text-sm">
      📍
    </span>
    Shipping Address
  </h3>

  <div className="space-y-4">
    {/* Full Address */}
    <div className="bg-white p-4 rounded-lg border border-gray-200">
      <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
        Full Shipping Address
      </label>
      <p className="text-gray-900 font-medium mt-2">
        {selectedOrder.shipping_info?.address || 'N/A'}
      </p>
    </div>

    {/* Location Details Grid */}
    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
      {/* City */}
      <div className="bg-white p-3 rounded-lg border border-gray-200">
        <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide block mb-2">
          City
        </label>
        <p className="text-gray-900 font-medium">{selectedOrder.shipping_info?.city || 'N/A'}</p>
      </div>

      {/* State */}
      <div className="bg-white p-3 rounded-lg border border-gray-200">
        <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide block mb-2">
          State
        </label>
        <p className="text-gray-900 font-medium">{selectedOrder.shipping_info?.state || 'N/A'}</p>
      </div>

      {/* Country */}
      <div className="bg-white p-3 rounded-lg border border-gray-200">
        <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide block mb-2">
          Country
        </label>
        <p className="text-gray-900 font-medium">{selectedOrder.shipping_info?.country || 'N/A'}</p>
      </div>

      {/* Postal Code */}
      <div className="bg-white p-3 rounded-lg border border-gray-200">
        <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide block mb-2">
          Postal Code
        </label>
        <p className="text-gray-900 font-medium">{selectedOrder.shipping_info?.pincode || 'N/A'}</p>
      </div>

      {/* Phone */}
      <div className="bg-white p-3 rounded-lg border border-gray-200">
        <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide block mb-2">
          Phone
        </label>
        <p className="text-gray-900 font-medium">{selectedOrder.shipping_info?.phone || 'N/A'}</p>
      </div>

      {/* Recipient Name */}
      <div className="bg-white p-3 rounded-lg border border-gray-200">
        <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide block mb-2">
          Recipient Name
        </label>
        <p className="text-gray-900 font-medium">
          {selectedOrder.shipping_info?.full_name || 'N/A'}
        </p>
      </div>
    </div>
  </div>
</div>
```

#### Display Example

```
Shipping Address

Full Shipping Address: 123 Main Street, Apt 4B, Building A

City: Dhaka              State: Dhaka              Country: Bangladesh
Postal Code: 1000        Phone: +8801234567890     Recipient Name: John Doe
```

---

## 4. Data Validation & Error Handling

### Safe Data Access Pattern

All fields use optional chaining with fallback values:

```javascript
selectedOrder.object?.field || 'N/A'
```

### Priority Order for Customer Name

```javascript
selectedOrder.user_info?.name || // Primary: From users table
  selectedOrder.shipping_info?.full_name || // Fallback: From shipping_info
  'N/A' // Final fallback: Not Available
```

### All Fields Have Fallbacks

- If `user_info?.email` is null → 'N/A'
- If `shipping_info?.phone` is null → 'N/A'
- If `shipping_info?.address` is null → 'N/A'
- And so on for all fields...

---

## 5. Data Integrity Verification

### What Gets Fetched (Backend)

✅ User ID (`users.id`)
✅ User Name (`users.name`)
✅ User Email (`users.email`)
✅ Recipient Name (`shipping_info.full_name`)
✅ State (`shipping_info.state`)
✅ City (`shipping_info.city`)
✅ Country (`shipping_info.country`)
✅ Address (`shipping_info.address`)
✅ Postal Code (`shipping_info.pincode`)
✅ Phone (`shipping_info.phone`)

### What Gets Displayed (Frontend)

✅ Customer Name (from user_info)
✅ Email (from user_info)
✅ Phone (from shipping_info)
✅ Full Address (from shipping_info)
✅ City (from shipping_info)
✅ State (from shipping_info)
✅ Country (from shipping_info)
✅ Postal Code (from shipping_info)
✅ Recipient Name (from shipping_info)

### Data Consistency

- All customer information comes from authenticated users table
- All shipping information comes from order-specific shipping_info table
- No data mismatch or inconsistency
- All JOINs are LEFT JOINs (handles missing shipping_info gracefully)

---

## 6. File References

| Component                 | File Path                                                                                             | Lines   |
| ------------------------- | ----------------------------------------------------------------------------------------------------- | ------- |
| Frontend Orders Component | `/dashboard/src/components/Orders.jsx`                                                                | 420-530 |
| Backend Order Controller  | `/server/controllers/orderController.js`                                                              | 235-275 |
| Database Schema           | `/server/models/userTable.js`, `/server/models/shippinginfoTable.js`, `/server/models/ordersTable.js` | -       |

---

## 7. Testing Checklist

✅ Customer Name displays correctly
✅ Email displays correctly
✅ Phone displays correctly
✅ Full Address displays correctly
✅ City displays correctly
✅ State displays correctly
✅ Country displays correctly
✅ Postal Code displays correctly
✅ Recipient Name displays correctly
✅ Fallbacks work when data is missing
✅ Data updates when viewing different orders
✅ Responsive design on mobile and desktop
✅ No console errors or warnings
✅ Proper data types (strings not objects)

---

## Summary

All Customer Information and Shipping Address data is:

1. **Correctly fetched** from the database via SQL JOINs
2. **Properly formatted** as JSON objects in the API response
3. **Safely accessed** in the frontend with optional chaining
4. **Beautifully displayed** with proper styling and fallbacks
5. **Fully validated** with no null/undefined errors
6. **Completely documented** for future maintenance

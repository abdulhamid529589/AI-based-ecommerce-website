# Shipping Address Data - Complete Reference

## Database Table: `shipping_info`

### Schema

```sql
CREATE TABLE shipping_info (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
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

## Backend Data Fetching

### SQL Query (fetchAllOrders)

```sql
SELECT o.*,
  json_build_object(
    'full_name', s.full_name,
    'state', s.state,
    'city', s.city,
    'country', s.country,
    'address', s.address,
    'pincode', s.pincode,
    'phone', s.phone
  ) AS shipping_info
FROM orders o
LEFT JOIN shipping_info s ON o.id = s.order_id
```

### API Response Structure

```json
{
  "shipping_info": {
    "full_name": "John Doe",
    "state": "Dhaka",
    "city": "Dhaka",
    "country": "Bangladesh",
    "address": "123 Main Street, Apt 4B",
    "pincode": "1000",
    "phone": "+8801234567890"
  }
}
```

## Frontend Display - Order Details Modal

### Shipping Address Section Layout

#### 1. Full Shipping Address (Full Width Card)

- **Field**: `shipping_info.address`
- **Display**: Complete text displayed in a white card
- **Fallback**: 'N/A' if empty
- **Example**: "123 Main Street, Apt 4B, Dhaka"

#### 2. Location Details Grid (Responsive)

- **Grid Layout**: 2 columns on mobile, 3 columns on desktop
- **Gap**: 4 units (16px)
- **Each card**: White background with border

**Card 1: City**

- **Field**: `shipping_info.city`
- **Label**: "City"
- **Fallback**: 'N/A'
- **Example**: "Dhaka"

**Card 2: State**

- **Field**: `shipping_info.state`
- **Label**: "State"
- **Fallback**: 'N/A'
- **Example**: "Dhaka"

**Card 3: Country**

- **Field**: `shipping_info.country`
- **Label**: "Country"
- **Fallback**: 'N/A'
- **Example**: "Bangladesh"

**Card 4: Postal Code**

- **Field**: `shipping_info.pincode`
- **Label**: "Postal Code"
- **Fallback**: 'N/A'
- **Example**: "1000"

**Card 5: Phone**

- **Field**: `shipping_info.phone`
- **Label**: "Phone"
- **Fallback**: 'N/A'
- **Example**: "+8801234567890"

**Card 6: Recipient Name**

- **Field**: `shipping_info.full_name`
- **Label**: "Recipient Name"
- **Fallback**: 'N/A'
- **Example**: "John Doe"

## Data Validation

### All Fields Have Fallback Values

```javascript
shipping_info?.field || 'N/A'
```

### Fields and Their Sources

| Frontend Display      | Database Field | Table         | Type    | Max Length | Required |
| --------------------- | -------------- | ------------- | ------- | ---------- | -------- |
| Full Shipping Address | `address`      | shipping_info | TEXT    | -          | Yes      |
| City                  | `city`         | shipping_info | VARCHAR | 100        | Yes      |
| State                 | `state`        | shipping_info | VARCHAR | 100        | Yes      |
| Country               | `country`      | shipping_info | VARCHAR | 100        | Yes      |
| Postal Code           | `pincode`      | shipping_info | VARCHAR | 10         | Yes      |
| Phone                 | `phone`        | shipping_info | VARCHAR | 20         | Yes      |
| Recipient Name        | `full_name`    | shipping_info | VARCHAR | 100        | Yes      |

## Data Entry (When Creating Order)

The shipping address is submitted during checkout with the following structure:

```javascript
{
  full_name: string,
  state: string,
  city: string,
  country: string,
  address: string,
  pincode: string,
  phone: string
}
```

This data is then stored in the `shipping_info` table linked to the order via `order_id`.

## Visual Design

### Section Header

- Icon: 📍 (Location pin)
- Color: Green background (bg-green-600)
- Title: "Shipping Address"
- Font: Bold, large (18px)

### Full Address Card

- Background: White (bg-white)
- Border: Light gray (border-gray-200)
- Padding: 4 units (16px)
- Border Radius: 8px
- Margin Bottom: 4 units (16px)

### Location Details Grid

- Responsive: 2 columns (md:grid-cols-3)
- Gap: 4 units (16px) between cards
- Each Card:
  - Background: White
  - Border: Light gray
  - Padding: 3 units (12px)
  - Border Radius: 8px

### Typography

- Labels:
  - Font Size: 12px (text-xs)
  - Font Weight: Bold (font-semibold)
  - Color: Gray-500
  - Letter Spacing: Wider (tracking-wide)
  - Transform: Uppercase
  - Margin Bottom: 8px (mb-2)
- Values:
  - Font Weight: Medium (font-medium)
  - Color: Gray-900
  - Line Height: Normal

## Example Data Flow

1. **User Places Order** → Enters shipping details in form
2. **Frontend Submits** → POST to `/api/v1/order/new` with shipping data
3. **Backend Stores** → INSERT into `shipping_info` table
4. **Admin Views** → Dashboard Orders page loads
5. **Backend Fetches** → Query joins with `shipping_info` table
6. **API Returns** → JSON with `shipping_info` object
7. **Frontend Displays** → Order Details Modal shows all shipping fields

## Related Files

- **Frontend**: `/dashboard/src/components/Orders.jsx` (Lines 465-530)
- **Backend**: `/server/controllers/orderController.js` (fetchAllOrders function)
- **Database**: `shipping_info` table
- **Models**: `/server/models/shippinginfoTable.js`

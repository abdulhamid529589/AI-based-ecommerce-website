# Orders Data Structure - Complete Reference

## Backend API Response Structure

### Endpoint: `GET /api/v1/order/admin/getall`

The backend returns complete order data with all related information:

```json
{
  "success": true,
  "message": "All orders fetched.",
  "orders": [
    {
      "id": "uuid",
      "buyer_id": "uuid",
      "total_price": 1000,
      "tax_price": 0.18,
      "shipping_price": 50,
      "order_status": "Processing|Shipped|Delivered|Cancelled",
      "paid_at": "2024-02-06T10:30:00Z",
      "created_at": "2024-02-06T10:00:00Z",

      "order_items": [
        {
          "order_item_id": "uuid",
          "order_id": "uuid",
          "product_id": "uuid",
          "quantity": 2,
          "price": 500,
          "image": "url",
          "title": "Product Name"
        }
      ],

      "shipping_info": {
        "full_name": "John Doe",
        "state": "Dhaka",
        "city": "Dhaka",
        "country": "Bangladesh",
        "address": "123 Main Street",
        "pincode": "1000",
        "phone": "+8801234567890"
      },

      "user_info": {
        "id": "uuid",
        "name": "John Doe",
        "email": "john@example.com"
      }
    }
  ]
}
```

## Data Displayed in Orders Table

| Column           | Data Source                                   | Field               | Display                                |
| ---------------- | --------------------------------------------- | ------------------- | -------------------------------------- |
| Order ID         | `order.id`                                    | UUID (last 8 chars) | `#a1b2c3d4`                            |
| Customer         | `user_info.name` or `shipping_info.full_name` | String              | "John Doe"                             |
| Customer Contact | `user_info.email` or `shipping_info.phone`    | String              | Email or phone                         |
| Date             | `order.created_at`                            | Timestamp           | Formatted date                         |
| Amount           | `order.total_price`                           | Decimal             | `৳ 1000`                               |
| Status           | `order.order_status`                          | Enum                | Processing/Shipped/Delivered/Cancelled |
| Payment          | `order.paid_at`                               | Timestamp           | "Paid" or "Pending"                    |
| Actions          | `order.id`                                    | UUID                | View Details button                    |

## Data Displayed in Order Details Modal

### Order Information (Quick Stats)

- **Total Amount**: `order.total_price`
- **Status**: `order.order_status`
- **Item Count**: `order.order_items.length`

### Customer Information Section

- **Customer Name**: `user_info.name` or `shipping_info.full_name`
- **Email**: `user_info.email`
- **Phone**: `shipping_info.phone`

### Shipping Address Section

- **Address**: `shipping_info.address`
- **City**: `shipping_info.city`
- **Postal Code**: `shipping_info.pincode`
- **Country**: `shipping_info.country`
- **State**: `shipping_info.state`

### Order Items Section

For each item in `order_items`:

- **Product Name**: `item.title`
- **Quantity**: `item.quantity`
- **Price per Unit**: `item.price`
- **Total Price**: `item.price * item.quantity`
- **Product Image**: `item.image` (optional)

### Order Summary

- **Subtotal**: Calculated from items
- **Tax (18%)**: `order.tax_price * subtotal`
- **Shipping**: `order.shipping_price`
- **Grand Total**: `order.total_price`

## Field Mapping Reference

### From Users Table

```
users.id → user_info.id
users.name → user_info.name
users.email → user_info.email
```

### From Orders Table

```
orders.id → order.id
orders.buyer_id → order.buyer_id
orders.total_price → order.total_price
orders.tax_price → order.tax_price
orders.shipping_price → order.shipping_price
orders.order_status → order.order_status
orders.paid_at → order.paid_at
orders.created_at → order.created_at
```

### From Shipping Info Table

```
shipping_info.full_name → shipping_info.full_name
shipping_info.state → shipping_info.state
shipping_info.city → shipping_info.city
shipping_info.country → shipping_info.country
shipping_info.address → shipping_info.address
shipping_info.pincode → shipping_info.pincode
shipping_info.phone → shipping_info.phone
```

### From Order Items Table

```
order_items.id → order_items[].order_item_id
order_items.order_id → order_items[].order_id
order_items.product_id → order_items[].product_id
order_items.quantity → order_items[].quantity
order_items.price → order_items[].price
order_items.image → order_items[].image
order_items.title → order_items[].title
```

## Data Validation & Fallbacks

### Customer Name Priority

```javascript
user_info?.name || shipping_info?.full_name || 'N/A'
```

### Customer Contact Priority

```javascript
user_info?.email || shipping_info?.phone || 'N/A'
```

### Payment Status

```javascript
paid_at ? 'Paid' : 'Pending'
```

### Order Status Values

- `Processing` - Order is being processed
- `Shipped` - Order has been shipped
- `Delivered` - Order has been delivered
- `Cancelled` - Order has been cancelled

## SQL Query Used

The backend uses a complex PostgreSQL query with:

- LEFT JOINs with order_items, shipping_info, and users tables
- JSON aggregation for order_items array
- JSON object construction for shipping_info and user_info objects
- GROUP BY clause for proper data aggregation

This ensures all related data is fetched in a single query for performance.

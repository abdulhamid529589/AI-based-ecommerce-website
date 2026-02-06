# Error Handling & 404 Management Guide

## Overview

This guide explains the comprehensive error handling system implemented in the e-commerce platform, including 404 error pages, rate limiting, and error middleware.

## 📋 Table of Contents

1. [Backend Error Handling](#backend-error-handling)
2. [Frontend 404 Page](#frontend-404-page)
3. [Rate Limiting](#rate-limiting)
4. [Error Types & Responses](#error-types--responses)
5. [Configuration](#configuration)
6. [Best Practices](#best-practices)
7. [Testing](#testing)

---

## Backend Error Handling

### ErrorHandler Class

A custom error class for consistent error management:

```javascript
import { ErrorHandler } from './middlewares/errorHandlerMiddleware.js'

// Usage in controllers
throw new ErrorHandler('Product not found', 404)
throw new ErrorHandler('Invalid credentials', 401)
throw new ErrorHandler('Unauthorized access', 403)
```

### Middleware Components

#### 1. **notFoundMiddleware**

Catches requests to undefined routes and returns a 404 error.

```javascript
app.use(notFoundMiddleware) // Place after all routes
```

#### 2. **globalErrorHandler**

Catches and formats all errors in a standardized format.

```javascript
app.use(globalErrorHandler) // Must be the last middleware
```

**Features:**

- Handles specific error types (CastError, JsonWebTokenError, TokenExpiredError)
- Sanitizes error messages in production
- Includes full stack traces in development
- Logs all errors for monitoring

**Error Response Format:**

```json
{
  "success": false,
  "statusCode": 404,
  "message": "Resource not found",
  "timestamp": "2024-01-15T10:30:00.000Z"
}
```

#### 3. **rateLimitMiddleware**

Prevents abuse by limiting requests per IP address.

```javascript
// Applied to all API routes
app.use('/api/v1', rateLimitMiddleware)
```

**Configuration:**

- Window: 15 minutes (900,000 ms)
- Limit: 100 requests per window
- Configurable via environment variables:
  ```
  RATE_LIMIT_WINDOW_MS=900000
  RATE_LIMIT_MAX_REQUESTS=100
  ```

#### 4. **validateRequestBody**

Validates incoming request headers and body.

```javascript
// Checks for:
// - Valid Content-Type header
// - Non-empty request body for POST/PUT/PATCH
```

#### 5. **handleDatabaseError**

Handles PostgreSQL-specific errors.

```javascript
// Handles:
// - Unique constraint violations (23505)
// - Foreign key violations (23503)
// - Data type errors (22P02)
```

### Error Handler Order (app.js)

```javascript
// 1. Rate limiting (early, for all API routes)
app.use('/api/v1', rateLimitMiddleware)

// 2. All route handlers
app.use('/api/v1/auth', authRouter)
app.use('/api/v1/product', productRouter)
// ... other routes

// 3. 404 Not Found (catches unmatched routes)
app.use(notFoundMiddleware)

// 4. Global error handler (must be last)
app.use(errorMiddleware)
app.use(globalErrorHandler)
```

---

## Frontend 404 Page

### Features

The custom 404 page provides:

1. **Visual Appeal**
   - Animated 404 number with gradient
   - Smooth sliding animations
   - Dark mode support

2. **User Guidance**
   - Requested URL display
   - 6 suggested navigation links
   - "Go Home" and "Go Back" buttons

3. **Troubleshooting Section**
   - Collapsible details toggle
   - Common error causes listed
   - Support contact link

4. **Error Information**
   - Error code display
   - Current timestamp
   - URL of the failed request

### File Structure

```
frontend/src/pages/
├── NotFound.jsx       # React component
└── NotFound.css       # Styling with animations
```

### Usage

The 404 page is automatically shown for any unmatched routes:

```jsx
// In App.jsx
<Routes>
  <Route path="/" element={<Home />} />
  <Route path="/products" element={<Products />} />
  {/* ... other routes ... */}
  <Route path="*" element={<NotFound />} /> {/* Catch all */}
</Routes>
```

### Customization

To add or modify suggested pages:

```jsx
const suggestedPages = [
  { path: '/', label: 'Home' },
  { path: '/products', label: 'All Products' },
  { path: '/cart', label: 'Shopping Cart' },
  { path: '/orders', label: 'My Orders' },
  { path: '/about', label: 'About Us' },
  { path: '/contact', label: 'Contact Us' },
]
```

---

## Rate Limiting

### How It Works

1. **Tracking**: Requests are tracked by IP address (includes X-Forwarded-For for proxies)
2. **Window**: Default 15-minute sliding window
3. **Limit**: Default 100 requests per window
4. **Response**: 429 Too Many Requests when limit exceeded

### Configuration

Update in `.env`:

```env
RATE_LIMIT_WINDOW_MS=900000    # 15 minutes in milliseconds
RATE_LIMIT_MAX_REQUESTS=100     # requests per window
```

### Response When Exceeded

```json
{
  "success": false,
  "statusCode": 429,
  "message": "Too many requests from this IP, please try again later.",
  "retryAfter": 300
}
```

### Exempted Endpoints

- `/health` - Health check endpoint
- Can add more in `skip` function of `rateLimitMiddleware`

---

## Error Types & Responses

### Common HTTP Status Codes

| Code | Meaning                | Example                  |
| ---- | ---------------------- | ------------------------ |
| 400  | Bad Request            | Invalid input data       |
| 401  | Unauthorized           | Missing/invalid JWT      |
| 403  | Forbidden              | Insufficient permissions |
| 404  | Not Found              | Resource doesn't exist   |
| 409  | Conflict               | Duplicate unique field   |
| 415  | Unsupported Media Type | Wrong Content-Type       |
| 429  | Too Many Requests      | Rate limit exceeded      |
| 500  | Server Error           | Unexpected error         |

### JWT-Related Errors

```javascript
// Invalid token
{
  "success": false,
  "statusCode": 400,
  "message": "Json Web Token is invalid. Try again"
}

// Expired token
{
  "success": false,
  "statusCode": 400,
  "message": "Json Web Token is expired. Try again"
}
```

### Database Errors

```javascript
// Duplicate entry (Unique constraint)
{
  "success": false,
  "statusCode": 400,
  "message": "This record already exists"
}

// Foreign key violation
{
  "success": false,
  "statusCode": 400,
  "message": "Cannot delete this record as it has related data"
}
```

---

## Configuration

### Environment Variables

Add these to `.env`:

```env
# Error Handling
NODE_ENV=development  # development | production

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100

# Email for error notifications (optional)
ERROR_LOG_EMAIL=your-email@gmail.com
```

### Production vs Development

**Development Mode** (`NODE_ENV=development`):

- Full error details included
- Stack traces shown
- Detailed debugging information

**Production Mode** (`NODE_ENV=production`):

- Sanitized error messages
- No stack traces
- Logs sent to external service

### Logging

All errors are logged with:

- Timestamp
- HTTP method & URL
- Client IP address
- Error message
- Status code

```javascript
// Log format:
// [2024-01-15T10:30:00Z] 404 GET /api/v1/product/invalid - IP: 192.168.1.1 - Error: Product not found
```

---

## Best Practices

### 1. **Always Use ErrorHandler**

```javascript
// ✅ Good
throw new ErrorHandler('User not found', 404)

// ❌ Bad
throw new Error('User not found')
res.status(404).json({ error: 'User not found' })
```

### 2. **Wrap Async Controllers**

```javascript
// ✅ Good
export const getProduct = catchAsyncError(async (req, res, next) => {
  // controller code
})

// ❌ Bad
export const getProduct = async (req, res) => {
  try {
    // controller code
  } catch (error) {
    // manual error handling
  }
}
```

### 3. **Validate Input Early**

```javascript
// ✅ Good
export const updateProduct = catchAsyncError(async (req, res, next) => {
  const { name, price } = req.body

  if (!name || !price) {
    return next(new ErrorHandler('Name and price are required', 400))
  }

  // Update logic
})
```

### 4. **Handle Database Errors**

```javascript
// ✅ Good
try {
  await product.save()
} catch (error) {
  const dbError = handleDatabaseError(error)
  throw dbError
}
```

### 5. **Meaningful Error Messages**

```javascript
// ✅ Good - Specific and actionable
throw new ErrorHandler('Email already registered. Please login or use forgot password.', 409)

// ❌ Bad - Vague
throw new ErrorHandler('Error', 500)
```

---

## Testing

### Testing 404 Errors

**Frontend:**

1. Navigate to `/invalid-url`
2. Should see custom 404 page
3. Suggestions should work
4. Troubleshooting toggle should expand

**Backend:**

```bash
# Test non-existent endpoint
curl http://localhost:4000/api/v1/invalid

# Response:
{
  "success": false,
  "statusCode": 404,
  "message": "Requested URL /api/v1/invalid not found on this server"
}
```

### Testing Rate Limiting

```bash
# Make 101 requests quickly (should fail on 101st)
for i in {1..101}; do
  curl http://localhost:4000/api/v1/product
done

# 101st request returns:
{
  "success": false,
  "statusCode": 429,
  "message": "Too many requests from this IP, please try again later."
}
```

### Testing Error Types

```bash
# Invalid token
curl -H "Authorization: Bearer invalid_token" \
  http://localhost:4000/api/v1/admin/products

# Expired token
curl -H "Authorization: Bearer expired_token" \
  http://localhost:4000/api/v1/admin/products

# Missing required fields
curl -X POST http://localhost:4000/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email": "test@test.com"}'

# Returns 400 - Missing required field: password
```

---

## Troubleshooting

### Issue: 404 page not showing

**Solution:**

```jsx
// Ensure catch-all route is last
<Routes>
  {/* All specific routes first */}
  <Route path="/" element={<Home />} />
  {/* Catch-all last */}
  <Route path="*" element={<NotFound />} />
</Routes>
```

### Issue: Rate limiting too strict

**Solution:**
Increase limits in `.env`:

```env
RATE_LIMIT_MAX_REQUESTS=500  # Increased from 100
RATE_LIMIT_WINDOW_MS=300000   # 5 minutes instead of 15
```

### Issue: Errors not logging

**Solution:**

1. Check `NODE_ENV` is set correctly
2. Verify `globalErrorHandler` is after all routes
3. Check console output for logs

### Issue: CORS errors with 404

**Solution:**
Ensure CORS middleware is before routes but after app initialization:

```javascript
app.use(
  cors({
    /* config */
  }),
) // Before routes
app.use('/api/v1', routes)
app.use(notFoundMiddleware) // After routes
```

---

## Integration Checklist

- [x] Backend error middleware created
- [x] Frontend 404 page implemented
- [x] Rate limiting configured
- [x] Error handler integrated in app.js
- [x] Rate limiting installed (express-rate-limit)
- [x] Environment variables documented
- [x] Middleware order correct in app.js
- [x] Error logging functional
- [x] Production/development modes differentiated
- [x] Database error handling implemented

---

## Next Steps

1. **SMS Notifications**: Add order confirmation SMS
2. **Admin Dashboard**: Build management interface
3. **Legal Pages**: Add Terms of Service, Privacy Policy
4. **Error Monitoring**: Integrate Sentry or similar service
5. **Email Alerts**: Alert admins of critical errors

---

## Support

For questions or issues with error handling:

1. Check this guide
2. Review error logs in console
3. Test with specific endpoint
4. Contact development team

---

**Last Updated:** January 2024
**Maintained by:** Development Team
**Status:** ✅ Production Ready

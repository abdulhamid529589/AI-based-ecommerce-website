# Complete Setup Guide - Rebuilding the Project

This guide will walk you through setting up the entire E-Commerce project from scratch. Follow these steps in order.

## Table of Contents

1. [Prerequisites](#1-prerequisites)
2. [Database Setup](#2-database-setup)
3. [Backend Setup](#3-backend-setup)
4. [Frontend Setup](#4-frontend-setup)
5. [Dashboard Setup](#5-dashboard-setup)
6. [Configuration](#6-configuration)
7. [Running the Project](#7-running-the-project)
8. [Initial Setup Tasks](#8-initial-setup-tasks)
9. [Verification](#9-verification)

---

## 1. Prerequisites

### Install Node.js

**Linux (Ubuntu/Debian):**

```bash
# Using NodeSource repository
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Verify installation
node --version  # Should show v18.x.x or higher
npm --version   # Should show 9.x.x or higher
```

**macOS:**

```bash
# Using Homebrew
brew install node@18

# Verify installation
node --version
npm --version
```

**Windows:**

- Download and install from [nodejs.org](https://nodejs.org/)
- Choose LTS version (18.x or higher)
- Verify in Command Prompt: `node --version` and `npm --version`

### Install PostgreSQL

**Linux (Ubuntu/Debian):**

```bash
sudo apt update
sudo apt install postgresql postgresql-contrib -y

# Start PostgreSQL service
sudo systemctl start postgresql
sudo systemctl enable postgresql

# Verify installation
psql --version
```

**macOS:**

```bash
# Using Homebrew
brew install postgresql@15
brew services start postgresql@15

# Verify installation
psql --version
```

**Windows:**

- Download from [postgresql.org](https://www.postgresql.org/download/windows/)
- Install with default settings
- Remember the password you set for the `postgres` user

### Install Git

**Linux:**

```bash
sudo apt install git -y
```

**macOS:**

```bash
brew install git
```

**Windows:**

- Download from [git-scm.com](https://git-scm.com/download/win)

### Verify All Prerequisites

```bash
node --version    # Should be v18.x.x or higher
npm --version     # Should be 9.x.x or higher
psql --version    # Should be 12.x or higher
git --version     # Any recent version
```

---

## 2. Database Setup

### Step 1: Access PostgreSQL

**Linux/macOS:**

```bash
sudo -u postgres psql
```

**Windows:**

- Open "SQL Shell (psql)" from Start Menu
- Press Enter for all prompts (defaults are fine)
- Enter the password you set during installation

### Step 2: Create Database

Once in PostgreSQL prompt:

```sql
-- Create the database
CREATE DATABASE mern_ecommerce_store;

-- Verify it was created
\l

-- Exit PostgreSQL
\q
```

### Step 3: Note Database Credentials

You'll need these for the backend configuration:

- **Host:** `localhost` (usually)
- **Port:** `5432` (default)
- **Database:** `mern_ecommerce_store`
- **User:** `postgres` (default)
- **Password:** The password you set (or default if none)

---

## 3. Backend Setup

### Step 1: Navigate to Backend Directory

```bash
cd /path/to/E-commerceFinalYearProject/backend
```

### Step 2: Install Dependencies

```bash
# Install all dependencies (production + development)
npm install

# OR install only production dependencies
npm install --production

# OR install only development dependencies
npm install --only=dev
```

**Note:** For development, use `npm install` (without flags) to install both production and development dependencies.

This will install all packages listed in `package.json`:

- **Production dependencies:**

  - express
  - pg (PostgreSQL client)
  - jsonwebtoken
  - bcrypt
  - stripe
  - cloudinary
  - nodemailer
  - cookie-parser
  - cors
  - dotenv
  - express-fileupload
  - And others...

- **Development dependencies:**
  - nodemon (for auto-restarting server during development)

**Important:** The backend uses `nodemon` for the `npm run dev` command. If `nodemon` is not installed, you can install it:

```bash
# Install nodemon as a dev dependency
npm install --save-dev nodemon

# OR install nodemon globally (optional)
npm install -g nodemon
```

**Expected output:** Should complete without errors. May take 1-2 minutes.

### Step 3: Create Uploads Directory

```bash
mkdir uploads
```

This directory is used for temporary file storage before uploading to Cloudinary.

### Step 4: Configure Database Connection

Edit `database/db.js`:

```javascript
import pkg from 'pg'
const { Client } = pkg

const database = new Client({
  user: 'postgres', // Your PostgreSQL username
  host: 'localhost', // Database host
  database: 'mern_ecommerce_store', // Database name
  password: 'YOUR_PASSWORD_HERE', // Your PostgreSQL password
  port: 5432, // PostgreSQL port
})

// ... rest of the file remains the same
```

**Replace `YOUR_PASSWORD_HERE` with your actual PostgreSQL password.**

### Step 5: Configure Environment Variables

Edit `config/config.env`:

```env
# Server Configuration
PORT=4000

# Frontend URLs (for CORS - update these when you know your frontend URLs)
FRONTEND_URL=http://localhost:5173
DASHBOARD_URL=http://localhost:5174

# JWT Configuration
JWT_SECRET_KEY=your-super-secret-jwt-key-minimum-32-characters-long
JWT_EXPIRES_IN=7d
COOKIE_EXPIRES_IN=7

# Email Configuration (Gmail)
SMTP_SERVICE=gmail
SMTP_MAIL=your-email@gmail.com
SMTP_PASSWORD=your-gmail-app-password
SMTP_HOST=smtp.gmail.com
SMTP_PORT=465

# Google Gemini API (Optional - for AI recommendations)
GEMINI_API_KEY=your-gemini-api-key-here

# Cloudinary Configuration (for image storage)
CLOUDINARY_CLIENT_NAME=your-cloudinary-cloud-name
CLOUDINARY_CLIENT_API=your-cloudinary-api-key
CLOUDINARY_CLIENT_SECRET=your-cloudinary-api-secret

# Stripe Configuration (Payment processing)
STRIPE_SECRET_KEY=sk_test_your-stripe-secret-key
STRIPE_WEBHOOK_SECRET=whsec_your-webhook-secret
STRIPE_FRONTEND_KEY=pk_test_your-stripe-public-key
```

**Important:**

- Generate a strong JWT_SECRET_KEY (you can use: `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"`)
- For Gmail, you need to create an App Password (see Gmail setup below)
- Get API keys from respective services (see API Keys section)

### Step 6: Get Required API Keys

#### Gmail App Password Setup

1. Go to your Google Account: [myaccount.google.com](https://myaccount.google.com)
2. Enable **2-Step Verification** (if not already enabled)
3. Go to **Security** → **2-Step Verification** → **App passwords**
4. Select **Mail** and your device
5. Click **Generate**
6. Copy the 16-character password
7. Use this password in `SMTP_PASSWORD`

#### Cloudinary Setup

1. Sign up at [cloudinary.com](https://cloudinary.com/users/register/free)
2. Go to **Dashboard**
3. Copy:
   - **Cloud name** → `CLOUDINARY_CLIENT_NAME`
   - **API Key** → `CLOUDINARY_CLIENT_API`
   - **API Secret** → `CLOUDINARY_CLIENT_SECRET`

#### Stripe Setup

1. Sign up at [stripe.com](https://dashboard.stripe.com/register)
2. Go to **Developers** → **API keys**
3. Copy:
   - **Publishable key** → `STRIPE_FRONTEND_KEY`
   - **Secret key** → `STRIPE_SECRET_KEY`
4. For webhook (local development):
   ```bash
   # Install Stripe CLI
   # Then run:
   stripe listen --forward-to localhost:4000/api/v1/payment/webhook
   # Copy the webhook signing secret to STRIPE_WEBHOOK_SECRET
   ```

#### Google Gemini API (Optional)

1. Visit [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Click **Create API Key**
3. Copy the key to `GEMINI_API_KEY`

### Step 7: Test Backend Setup

```bash
# Start the backend server
npm run dev
```

**Expected output:**

```
Connected to the database successfully
All Tables Created Successfully.
Server is running on port 4000
```

**If you see errors:**

- Database connection error → Check `database/db.js` credentials
- Port already in use → Change `PORT` in `config.env` or kill the process
- Missing dependencies → Run `npm install` again

**Press Ctrl+C to stop the server.**

---

## 4. Frontend Setup

### Step 1: Navigate to Frontend Directory

Open a **new terminal window** and:

```bash
cd /path/to/E-commerceFinalYearProject/frontend
```

### Step 2: Install Dependencies

```bash
# Install all dependencies (production + development)
npm install

# OR install only production dependencies
npm install --production

# OR install only development dependencies
npm install --only=dev
```

**Note:** For development, use `npm install` (without flags) to install both production and development dependencies.

This will install:

- **Production dependencies:**

  - react
  - react-dom
  - react-router-dom
  - @reduxjs/toolkit
  - react-redux
  - axios
  - @stripe/react-stripe-js
  - @stripe/stripe-js
  - react-toastify
  - lucide-react
  - tailwindcss-animate
  - And others...

- **Development dependencies:**
  - vite (build tool and dev server)
  - @vitejs/plugin-react
  - tailwindcss
  - postcss
  - autoprefixer
  - eslint
  - @eslint/js
  - eslint-plugin-react-hooks
  - eslint-plugin-react-refresh
  - @types/react
  - @types/react-dom
  - globals
  - And others...

**Expected output:** Should complete without errors. May take 2-3 minutes.

### Step 3: Configure API Endpoint (if needed)

Check `src/lib/axios.js` to ensure the base URL points to your backend:

```javascript
// Should be something like:
const baseURL = 'http://localhost:4000/api/v1'
```

If your backend runs on a different URL/port, update this.

### Step 4: Test Frontend Setup

```bash
npm run dev
```

**Expected output:**

```
  VITE v7.x.x  ready in xxx ms

  ➜  Local:   http://localhost:5173/
  ➜  Network: use --host to expose
```

Open `http://localhost:5173` in your browser. You should see the frontend (may show errors if backend isn't running, which is normal).

**Press Ctrl+C to stop the dev server.**

---

## 5. Dashboard Setup

### Step 1: Navigate to Dashboard Directory

Open a **new terminal window** and:

```bash
cd /path/to/E-commerceFinalYearProject/dashboard
```

### Step 2: Install Dependencies

```bash
# Install all dependencies (production + development)
npm install

# OR install only production dependencies
npm install --production

# OR install only development dependencies
npm install --only=dev
```

**Note:** For development, use `npm install` (without flags) to install both production and development dependencies.

This will install:

- **Production dependencies:**

  - react
  - react-dom
  - react-router-dom
  - @reduxjs/toolkit
  - react-redux
  - axios
  - react-toastify
  - lucide-react
  - recharts
  - And others...

- **Development dependencies:**
  - vite (build tool and dev server)
  - @vitejs/plugin-react
  - tailwindcss
  - postcss
  - autoprefixer
  - eslint
  - @eslint/js
  - eslint-plugin-react-hooks
  - eslint-plugin-react-refresh
  - @types/react
  - @types/react-dom
  - globals
  - And others...

**Expected output:** Should complete without errors. May take 2-3 minutes.

### Step 3: Configure API Endpoint (if needed)

Check the API configuration in dashboard source files to ensure it points to your backend URL (usually in a config file or axios setup).

### Step 4: Test Dashboard Setup

```bash
npm run dev
```

**Expected output:**

```
  VITE v6.x.x  ready in xxx ms

  ➜  Local:   http://localhost:5174/
  ➜  Network: use --host to expose
```

Open `http://localhost:5174` in your browser. You should see the dashboard login page.

**Press Ctrl+C to stop the dev server.**

---

## 6. Configuration

### Update CORS URLs (if needed)

If your frontend or dashboard run on different ports, update `backend/config/config.env`:

```env
FRONTEND_URL=http://localhost:5173    # Your frontend URL
DASHBOARD_URL=http://localhost:5174   # Your dashboard URL
```

### Verify All Configuration Files

**Backend:**

- ✅ `config/config.env` - All variables filled
- ✅ `database/db.js` - Database credentials correct
- ✅ `uploads/` directory exists

**Frontend:**

- ✅ API base URL configured correctly
- ✅ Dependencies installed

**Dashboard:**

- ✅ API base URL configured correctly
- ✅ Dependencies installed

---

## 7. Running the Project

You need **3 terminal windows** running simultaneously:

### Terminal 1: Backend

```bash
cd backend
npm run dev
```

**Keep this running.** You should see:

```
Connected to the database successfully
All Tables Created Successfully.
Server is running on port 4000
```

### Terminal 2: Frontend

```bash
cd frontend
npm run dev
```

**Keep this running.** Frontend will be at `http://localhost:5173`

### Terminal 3: Dashboard

```bash
cd dashboard
npm run dev
```

**Keep this running.** Dashboard will be at `http://localhost:5174`

### Access the Applications

- **Frontend (Customer):** http://localhost:5173
- **Dashboard (Admin):** http://localhost:5174
- **Backend API:** http://localhost:4000/api/v1

---

## 8. Initial Setup Tasks

### Create an Admin User

1. **Register a user through the frontend:**

   - Go to http://localhost:5173
   - Click Register/Sign Up
   - Fill in name, email, password
   - Register

2. **Make the user an Admin:**

   ```bash
   # Connect to PostgreSQL
   sudo -u postgres psql -d mern_ecommerce_store

   # Update user role (replace email with your registered email)
   UPDATE users SET role = 'Admin' WHERE email = 'your-email@example.com';

   # Verify
   SELECT name, email, role FROM users WHERE email = 'your-email@example.com';

   # Exit
   \q
   ```

3. **Login to Dashboard:**
   - Go to http://localhost:5174
   - Login with your admin credentials
   - You should now have admin access

### Add Test Products

1. Login to the dashboard as admin
2. Navigate to Products section
3. Click "Add Product" or similar
4. Fill in:
   - Product name
   - Description
   - Price
   - Category
   - Stock quantity
   - Upload product images
5. Save the product

### Test the Application

1. **Frontend Tests:**

   - ✅ Browse products
   - ✅ View product details
   - ✅ Add products to cart
   - ✅ Register/Login
   - ✅ View profile

2. **Dashboard Tests:**

   - ✅ View products
   - ✅ Add/Edit/Delete products
   - ✅ View orders
   - ✅ View users
   - ✅ View statistics

3. **Order Flow Test:**
   - ✅ Add products to cart (frontend)
   - ✅ Proceed to checkout
   - ✅ Fill shipping information
   - ✅ Complete payment (use Stripe test card: 4242 4242 4242 4242)
   - ✅ View order in dashboard

---

## 9. Verification

### Checklist

Run through this checklist to verify everything works:

- [ ] Backend server starts without errors
- [ ] Database connection successful
- [ ] All tables created (check console output)
- [ ] Frontend loads in browser
- [ ] Dashboard loads in browser
- [ ] Can register a new user
- [ ] Can login with registered user
- [ ] Can view products (if any exist)
- [ ] Admin user created and can login to dashboard
- [ ] Can add products from dashboard
- [ ] Products appear in frontend
- [ ] Can add products to cart
- [ ] Can proceed to checkout
- [ ] Payment processing works (test mode)

### Common Issues and Solutions

#### Backend won't start

**Error: "Cannot connect to database"**

- Check PostgreSQL is running: `sudo systemctl status postgresql`
- Verify credentials in `database/db.js`
- Test connection: `psql -U postgres -d mern_ecommerce_store`

**Error: "Port already in use"**

- Change PORT in `config.env`
- Or kill the process: `lsof -ti:4000 | xargs kill -9`

#### Frontend/Dashboard won't start

**Error: "Port already in use"**

- Vite will automatically use the next available port
- Or specify port: `npm run dev -- --port 5175`

**Error: "Cannot find module"**

- Run `npm install` again (this installs both production and dev dependencies)
- Delete `node_modules` and `package-lock.json`, then `npm install`
- If using `npm run dev` and getting "nodemon not found", install it: `npm install --save-dev nodemon`

**Error: "nodemon: command not found" (Backend)**

- Install nodemon as a dev dependency: `npm install --save-dev nodemon`
- Or install globally: `npm install -g nodemon`
- Make sure you're running `npm run dev` from the backend directory

#### CORS Errors

**Error: "CORS policy blocked"**

- Verify `FRONTEND_URL` and `DASHBOARD_URL` in `backend/config/config.env`
- URLs must match exactly (including http/https and port)
- Restart backend after changing CORS settings

#### Database Tables Not Created

- Check backend console for error messages
- Verify database connection is working
- Check PostgreSQL logs: `sudo tail -f /var/log/postgresql/postgresql-*.log`

#### Images Not Uploading

- Verify Cloudinary credentials in `config.env`
- Check `uploads/` directory exists and is writable
- Check file size limits

#### Email Not Sending

- Verify Gmail app password is correct (16 characters, no spaces)
- Ensure 2-Step Verification is enabled
- Check SMTP settings in `config.env`

---

## Quick Reference Commands

### Start Everything

```bash
# Terminal 1
cd backend && npm run dev

# Terminal 2
cd frontend && npm run dev

# Terminal 3
cd dashboard && npm run dev
```

### Stop Everything

Press `Ctrl+C` in each terminal window.

### Reset Database

```bash
# Connect to PostgreSQL
sudo -u postgres psql

# Drop and recreate database
DROP DATABASE mern_ecommerce_store;
CREATE DATABASE mern_ecommerce_store;
\q

# Restart backend (tables will be recreated)
cd backend && npm run dev
```

### Reinstall Dependencies

```bash
# Backend
cd backend
rm -rf node_modules package-lock.json
npm install                    # Installs both production and dev dependencies
# OR
npm install --production       # Only production dependencies
npm install --only=dev        # Only development dependencies

# Frontend
cd frontend
rm -rf node_modules package-lock.json
npm install                    # Installs both production and dev dependencies
# OR
npm install --production       # Only production dependencies
npm install --only=dev        # Only development dependencies

# Dashboard
cd dashboard
rm -rf node_modules package-lock.json
npm install                    # Installs both production and dev dependencies
# OR
npm install --production       # Only production dependencies
npm install --only=dev        # Only development dependencies
```

### Install Specific Dependencies

```bash
# Backend - Install nodemon if missing (needed for npm run dev)
cd backend
npm install --save-dev nodemon

# Install a specific package
npm install <package-name>              # Production dependency
npm install --save-dev <package-name>   # Development dependency

# Install exact version
npm install <package-name>@<version>
```

---

## Project Structure Reminder

```
E-commerceFinalYearProject/
├── backend/          # Node.js/Express API
│   ├── config/       # Environment config
│   ├── controllers/  # Route handlers
│   ├── database/     # DB connection
│   ├── models/       # Database schemas
│   ├── router/       # API routes
│   └── utils/        # Helper functions
├── frontend/         # Customer React app
│   └── src/          # Source code
├── dashboard/         # Admin React app
│   └── src/          # Source code
└── README.md         # Main documentation
```

---

## Next Steps

After setup is complete:

1. Read the main [README.md](./README.md) for detailed documentation
2. Check [API_DOCUMENTATION.md](./API_DOCUMENTATION.md) for API reference
3. Review [DEPLOYMENT.md](./DEPLOYMENT.md) for production deployment
4. Use [SETUP_CHECKLIST.md](./SETUP_CHECKLIST.md) to verify everything

---

## Support

If you encounter issues not covered here:

1. Check the [Troubleshooting](./README.md#troubleshooting) section in README.md
2. Review error messages in console/terminal
3. Verify all environment variables are set correctly
4. Ensure all services (PostgreSQL, etc.) are running
5. Check that ports are not in use by other applications

---

**Setup Complete!** 🎉

Your E-Commerce application should now be running. Happy coding!

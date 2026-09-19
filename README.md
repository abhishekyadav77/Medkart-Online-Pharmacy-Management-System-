# MedKart — Online Pharmacy Management System (MERN Stack)

A full-stack pharmacy management system built with **MongoDB, Express, React, and Node.js**.

## Features

- **Authentication**: JWT-based register/login with role-based access (customer / admin)
- **Medicine Catalog**: Search, filter by category, pagination
- **Cart & Checkout**: Add to cart, adjust quantity, place orders (COD / Online)
- **Order Management**: Customers track their orders; admin updates order status
- **Admin Dashboard**: Full CRUD on medicine inventory + order status management
- **Prescription flag**: Medicines can be marked as requiring a prescription

## Tech Stack

| Layer     | Tech                                   |
|-----------|----------------------------------------|
| Frontend  | React 18, Vite, React Router, Tailwind CSS, Axios, react-hot-toast |
| Backend   | Node.js, Express, JWT, bcryptjs         |
| Database  | MongoDB (Mongoose ODM)                  |

## Folder Structure

```
pharmacy-mern/
├── backend/
│   ├── config/db.js
│   ├── models/ (User, Medicine, Order)
│   ├── controllers/ (auth, medicine, order)
│   ├── routes/ (auth, medicine, order)
│   ├── middleware/auth.js
│   ├── seed.js          # sample data
│   └── server.js
└── frontend/
    └── src/
        ├── api/axios.js
        ├── context/ (AuthContext, CartContext)
        ├── components/ (Navbar, MedicineCard, ProtectedRoute)
        └── pages/ (Medicines, Login, Register, Cart, Orders, AdminDashboard)
```

## Setup Instructions

### Prerequisites
- Node.js (v18+) installed
- MongoDB running locally (or a MongoDB Atlas connection string)

### 1. Backend Setup

```bash
cd backend
npm install
cp .env.example .env
# Edit .env if needed (MONGO_URI, JWT_SECRET, etc.)
npm run dev
```

This starts the API server at `http://localhost:5000`.

**(Optional) Seed sample data** — creates an admin account + 8 sample medicines:

```bash
node seed.js
```

Admin login after seeding: `admin@pharmacy.com` / `admin123`

### 2. Frontend Setup

Open a new terminal:

```bash
cd frontend
npm install
cp .env.example .env
npm run dev
```

This starts the React app at `http://localhost:5173`.

### 3. Usage

1. Visit `http://localhost:5173`
2. Register a new customer account, or log in as admin (after seeding) to manage inventory/orders
3. As a customer: browse medicines → add to cart → checkout → track orders
4. As admin: go to **Admin Panel** → add/edit/delete medicines, update order statuses

## Possible Extensions (for resume/portfolio depth)

- Razorpay/Stripe integration for real online payments
- Prescription image upload (Cloudinary/Multer)
- Email notifications on order status change
- Low-stock admin alerts
- Reviews & ratings on medicines

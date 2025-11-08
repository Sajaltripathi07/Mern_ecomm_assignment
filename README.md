# MERN E-Commerce Application

A full-stack e-commerce application built with MongoDB, Express, React, and Node.js.



Watch the demo video on Loom:
https://www.loom.com/share/c3754b89c66e4b43ab8f7d8655e7f63b

## 🚀 Project Structure

```
mern/
├── backend/          # Node.js/Express backend
├── frontend/         # React frontend
└── README.md         # This file
```

## Backend Server

### Setup Instructions

#### 1. Install Dependencies

```bash
npm install
```

#### 2. MongoDB Setup

##### MongoDB Atlas (Cloud)

1. Create a free account at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a cluster and get your connection string
3. Create a `.env` file in the backend directory:
   ```
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/mern-ecommerce
   PORT=5000
   ```

#### 3. Run the Server

Development mode (with auto-reload):
```bash
npm run dev
```

Production mode:
```bash
npm start
```

## API Endpoints

- `GET /api/health` - Health check
- `GET /api/products` - Get all products
- `GET /api/products/:id` - Get product by ID
- `POST /api/products` - Create product
- `PUT /api/products/:id` - Update product
- `DELETE /api/products/:id` - Delete product
- `GET /api/cart` - Get cart
- `POST /api/cart/add` - Add item to cart
- `PUT /api/cart/items/:itemId` - Update cart item
- `DELETE /api/cart/items/:itemId` - Remove item from cart
- `DELETE /api/cart/clear` - Clear cart
- `POST /api/checkout` - Process checkout




```bash
cd frontend
npm install
npm run dev
```

## 🎯 Features

- Product browsing and management
- Shopping cart functionality
- Checkout process
- Receipt generation




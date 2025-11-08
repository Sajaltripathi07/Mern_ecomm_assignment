# Backend Server

## Setup Instructions

### 1. Install Dependencies
```bash
npm install
```

### 2. MongoDB Setup

You have two options:

#### Option A: Local MongoDB
1. Install MongoDB on your system
2. Start MongoDB service:
   - Windows: MongoDB should start automatically as a service
   - Mac/Linux: `sudo systemctl start mongod` or `brew services start mongodb-community`
3. The default connection string will work: `mongodb://localhost:27017/mern-ecommerce`

#### Option B: MongoDB Atlas (Cloud)
1. Create a free account at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a cluster and get your connection string
3. Create a `.env` file in the backend directory:
   ```
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/mern-ecommerce
   PORT=5000
   ```

### 3. Environment Variables

Create a `.env` file in the backend directory (copy from `.env.example`):
```
MONGODB_URI=mongodb://localhost:27017/mern-ecommerce
PORT=5000
```

### 4. Run the Server

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


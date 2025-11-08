require('dotenv').config();
const connectDB = require('../config/db');
const Product = require('../models/Product');

const seedProducts = async () => {
  try {
    await connectDB();
    
    const existingProducts = await Product.countDocuments();
    if (existingProducts > 0) {
      console.log(`⚠️  Products already exist in database (${existingProducts} products)`);
      console.log('💡 To clear and reseed, run: npm run clear (then npm run seed)');
      console.log('💡 Or use: npm run reseed (clears and seeds in one command)');
      process.exit(0);
    }

    const sampleProducts = [
      {
        name: 'Laptop',
        description: 'High-performance laptop with latest processor, 16GB RAM, 512GB SSD',
        price: 82999,
        image: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?auto=format&fit=crop&w=800&q=80',
        stock: 10
      },
      {
        name: 'Smartphone',
        description: 'Latest smartphone with advanced camera, 128GB storage, 5G ready',
        price: 58099,
        image: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=800&q=80',
        stock: 25
      },
      {
        name: 'Headphones',
        description: 'Wireless noise-cancelling headphones with 30-hour battery life',
        price: 16599,
        image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80',
        stock: 50
      },
      {
        name: 'Tablet',
        description: '10-inch tablet with high-resolution display, perfect for work and entertainment',
        price: 37349,
        image: 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?auto=format&fit=crop&w=800&q=80',
        stock: 15
      },
      {
        name: 'Smart Watch',
        description: 'Fitness tracking smartwatch with heart rate monitor and GPS',
        price: 24899,
        image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=800&q=80',
        stock: 30
      },
      {
        name: 'Keyboard',
        description: 'Mechanical gaming keyboard with RGB lighting and tactile switches',
        price: 10789,
        image: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&w=800&q=80',
        stock: 40
      },
      {
        name: 'Gaming Mouse',
        description: 'Precision gaming mouse with customizable DPI and RGB lighting',
        price: 6639,
        image: 'https://images.unsplash.com/photo-1527814050087-3793815479db?auto=format&fit=crop&w=800&q=80',
        stock: 35
      },
      {
        name: 'Monitor',
        description: '27-inch 4K Ultra HD monitor with HDR support and slim bezels',
        price: 29049,
        image: 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?auto=format&fit=crop&w=800&q=80',
        stock: 20
      },
      {
        name: 'Webcam',
        description: '1080p HD webcam with auto-focus and built-in microphone',
        price: 7469,
        image: 'https://images.unsplash.com/photo-1587825147138-346237c04b52?auto=format&fit=crop&w=800&q=80',
        stock: 45
      }
    ];

    const products = await Product.insertMany(sampleProducts);
    console.log(`✅ Successfully seeded ${products.length} products!`);
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding products:', error.message);
    process.exit(1);
  }
};

seedProducts();
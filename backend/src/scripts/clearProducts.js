require('dotenv').config();
const connectDB = require('../config/db');
const Product = require('../models/Product');

const clearProducts = async () => {
  try {
    await connectDB();
    
    const existingProducts = await Product.countDocuments();
    
    if (existingProducts === 0) {
      console.log('ℹ️  No products found in database. Nothing to clear.');
      process.exit(0);
    }

    const result = await Product.deleteMany({});
    
    console.log(`✅ Successfully deleted ${result.deletedCount} product(s) from database!`);
    console.log('💡 You can now run "npm run seed" to add fresh products.');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error clearing products:', error.message);
    process.exit(1);
  }
};

clearProducts();
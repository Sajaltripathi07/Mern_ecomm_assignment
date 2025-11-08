const Product = require('../models/Product');

exports.getAllProducts = async (req, res) => {
  try {
    const products = await Product.find({});
    res.json(products);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }
    res.json(product);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.createProduct = async (req, res) => {
  try {
    const product = new Product(req.body);
    await product.save();
    res.status(201).json(product);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.updateProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }
    res.json(product);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.deleteProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }
    res.json({ message: 'Product deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.seedProducts = async (req, res) => {
  try {
    const existingProducts = await Product.countDocuments();
    if (existingProducts > 0) {
      return res.status(400).json({ 
        message: 'Products already exist in database',
        count: existingProducts 
      });
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
    res.status(201).json({ 
      message: 'Products seeded successfully',
      count: products.length,
      products 
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.clearAllProducts = async (req, res) => {
  try {
    const result = await Product.deleteMany({});
    res.json({ 
      message: 'All products cleared successfully',
      deletedCount: result.deletedCount 
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.seedFromFakeStore = async (req, res) => {
  try {
    const existingProducts = await Product.countDocuments();
    if (existingProducts > 0) {
      return res.status(400).json({ 
        message: 'Products already exist in database. Clear existing products first.',
        count: existingProducts 
      });
    }

    const response = await fetch('https://fakestoreapi.com/products?limit=10');
    if (!response.ok) {
      throw new Error('Failed to fetch products from Fake Store API');
    }

    const fakeStoreProducts = await response.json();

    const products = fakeStoreProducts.map(item => ({
      name: item.title,
      description: item.description,
      price: item.price,
      image: item.image,
      stock: Math.floor(Math.random() * 50) + 10
    }));

    const insertedProducts = await Product.insertMany(products);
    
    res.status(201).json({ 
      message: 'Products fetched from Fake Store API and seeded successfully',
      count: insertedProducts.length,
      source: 'Fake Store API',
      products: insertedProducts 
    });
  } catch (error) {
    res.status(500).json({ 
      error: error.message,
      message: 'Failed to fetch from Fake Store API. Make sure you have internet connection.'
    });
  }
};
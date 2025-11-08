const Cart = require('../models/Cart');
const CartItem = require('../models/CartItem');
const Product = require('../models/Product');

exports.getCart = async (req, res) => {
  try {
    let cart = await Cart.findOne().populate({
      path: 'items',
      populate: {
        path: 'product',
        model: 'Product'
      }
    });

    if (!cart) {
      cart = new Cart();
      await cart.save();
    }

    const validItems = [];
    const invalidItemIds = [];
    
    if (cart.items && cart.items.length > 0) {
      for (const item of cart.items) {
        if (!item.product || !item.product._id) {
          invalidItemIds.push(item._id);
        } else {
          validItems.push(item);
        }
      }
    }

    if (invalidItemIds.length > 0) {
      await CartItem.deleteMany({ _id: { $in: invalidItemIds } });
      cart.items = cart.items.filter(item => !invalidItemIds.includes(item._id));
    }

    let total = 0;
    if (validItems.length > 0) {
      total = validItems.reduce((sum, item) => {
        return sum + (item.price * item.quantity);
      }, 0);
    }
    cart.total = total;
    await cart.save();

    const cartResponse = cart.toObject();
    cartResponse.items = validItems;

    res.json(cartResponse);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.addToCart = async (req, res) => {
  try {
    const { productId, quantity } = req.body;

    if (!productId || !quantity || quantity < 1) {
      return res.status(400).json({ error: 'Product ID and quantity are required' });
    }

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    if (product.stock < quantity) {
      return res.status(400).json({ error: 'Insufficient stock' });
    }

    let cart = await Cart.findOne().populate({
      path: 'items',
      populate: {
        path: 'product',
        model: 'Product'
      }
    });
    if (!cart) {
      cart = new Cart();
      await cart.save();
    }

    const existingItem = cart.items.find(item => 
      item.product && item.product._id.toString() === productId.toString()
    );

    if (existingItem) {
      existingItem.quantity += quantity;
      existingItem.price = product.price;
      await existingItem.save();
    } else {
      const cartItem = new CartItem({
        product: productId,
        quantity: quantity,
        price: product.price
      });
      await cartItem.save();
      cart.items.push(cartItem._id);
    }

    await cart.save();

    const updatedCart = await Cart.findById(cart._id).populate({
      path: 'items',
      populate: {
        path: 'product',
        model: 'Product'
      }
    });

    let total = 0;
    if (updatedCart.items && updatedCart.items.length > 0) {
      total = updatedCart.items.reduce((sum, item) => {
        return sum + (item.price * item.quantity);
      }, 0);
    }
    updatedCart.total = total;
    await updatedCart.save();

    res.json(updatedCart);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.updateCartItem = async (req, res) => {
  try {
    const { quantity } = req.body;
    const { itemId } = req.params;

    if (!quantity || quantity < 1) {
      return res.status(400).json({ error: 'Valid quantity is required' });
    }

    const cartItem = await CartItem.findById(itemId).populate('product');
    if (!cartItem) {
      return res.status(404).json({ error: 'Cart item not found' });
    }

    const availableStock = cartItem.product.stock + cartItem.quantity;
    if (availableStock < quantity) {
      return res.status(400).json({ error: 'Insufficient stock' });
    }

    cartItem.quantity = quantity;
    cartItem.price = cartItem.product.price;
    await cartItem.save();

    const cart = await Cart.findOne().populate({
      path: 'items',
      populate: {
        path: 'product',
        model: 'Product'
      }
    });

    if (cart) {
      let total = 0;
      if (cart.items && cart.items.length > 0) {
        total = cart.items.reduce((sum, item) => {
          return sum + (item.price * item.quantity);
        }, 0);
      }
      cart.total = total;
      await cart.save();
    }

    res.json(cartItem);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.removeFromCart = async (req, res) => {
  try {
    const itemId = req.params.id;

    const cartItem = await CartItem.findById(itemId);
    if (!cartItem) {
      return res.status(404).json({ error: 'Cart item not found' });
    }

    const cart = await Cart.findOne();
    if (cart) {
      cart.items = cart.items.filter(item => item.toString() !== itemId);
      await cart.save();
    }

    await CartItem.findByIdAndDelete(itemId);

    const updatedCart = await Cart.findOne().populate({
      path: 'items',
      populate: {
        path: 'product',
        model: 'Product'
      }
    });

    if (updatedCart) {
      let total = 0;
      if (updatedCart.items && updatedCart.items.length > 0) {
        total = updatedCart.items.reduce((sum, item) => {
          return sum + (item.price * item.quantity);
        }, 0);
      }
      updatedCart.total = total;
      await updatedCart.save();
    }

    res.json({ message: 'Item removed from cart' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.clearCart = async (req, res) => {
  try {
    const cart = await Cart.findOne();
    if (cart) {
      await CartItem.deleteMany({ _id: { $in: cart.items } });
      cart.items = [];
      cart.total = 0;
      await cart.save();
    }
    res.json({ message: 'Cart cleared successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
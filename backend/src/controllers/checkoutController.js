const Cart = require('../models/Cart');
const CartItem = require('../models/CartItem');
const Product = require('../models/Product');

exports.processCheckout = async (req, res) => {
  try {
    const { customerInfo } = req.body;

    if (!customerInfo || !customerInfo.name || !customerInfo.email || !customerInfo.address) {
      return res.status(400).json({ error: 'Customer information is required' });
    }

    const cart = await Cart.findOne().populate({
      path: 'items',
      populate: {
        path: 'product',
        model: 'Product'
      }
    });

    if (!cart || !cart.items || cart.items.length === 0) {
      return res.status(400).json({ error: 'Cart is empty' });
    }

    const validItems = [];
    for (const item of cart.items) {
      if (!item.product || !item.product._id) {
        await CartItem.findByIdAndDelete(item._id);
        continue;
      }

      if (item.product.stock < item.quantity) {
        return res.status(400).json({ 
          error: `Insufficient stock for ${item.product.name || 'product'}` 
        });
      }

      validItems.push(item);
    }

    if (validItems.length === 0) {
      await CartItem.deleteMany({ _id: { $in: cart.items } });
      cart.items = [];
      cart.total = 0;
      await cart.save();
      return res.status(400).json({ error: 'Cart contains invalid products. Cart has been cleared.' });
    }

    for (const item of validItems) {
      await Product.findByIdAndUpdate(item.product._id, {
        $inc: { stock: -item.quantity }
      });
    }

    const receipt = {
      orderId: `ORD-${Date.now()}`,
      customer: customerInfo,
      items: validItems.map(item => ({
        product: {
          name: item.product.name,
          price: item.price
        },
        quantity: item.quantity,
        subtotal: item.price * item.quantity
      })),
      total: validItems.reduce((sum, item) => sum + (item.price * item.quantity), 0),
      date: new Date()
    };

    await CartItem.deleteMany({ _id: { $in: validItems.map(item => item._id) } });
    cart.items = [];
    cart.total = 0;
    await cart.save();

    res.status(201).json(receipt);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
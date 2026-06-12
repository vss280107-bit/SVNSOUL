const express = require('express');
const router = express.Router();
const Razorpay = require('razorpay');
const crypto = require('crypto');
const Order = require('../models/Order');
const Product = require('../models/Product');
const { protect, adminOnly } = require('../middleware/auth');

const getRazorpay = () => new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// POST /api/orders/razorpay/create-order
router.post('/razorpay/create-order', protect, async (req, res) => {
  try {
    const { amount } = req.body; // amount in paise
    const razorpay = getRazorpay();
    const options = {
      amount: Math.round(amount * 100), // convert ₹ to paise
      currency: 'INR',
      receipt: 'svn_' + Date.now(),
    };
    const razorpayOrder = await razorpay.orders.create(options);
    res.json({ success: true, order: razorpayOrder, key: process.env.RAZORPAY_KEY_ID });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Razorpay error: ' + err.message });
  }
});

// POST /api/orders/razorpay/verify
router.post('/razorpay/verify', protect, async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, orderId } = req.body;
    const body = razorpay_order_id + '|' + razorpay_payment_id;
    const expectedSig = crypto.createHmac('sha256', process.env.RAZORPAY_KEY_SECRET).update(body).digest('hex');
    if (expectedSig !== razorpay_signature) {
      return res.status(400).json({ success: false, message: 'Payment verification failed' });
    }
    const order = await Order.findById(orderId);
    if (!order) return res.status(404).json({ success: false, message: 'Order not found' });
    order.payment.status = 'paid';
    order.payment.razorpayOrderId = razorpay_order_id;
    order.payment.razorpayPaymentId = razorpay_payment_id;
    order.payment.razorpaySignature = razorpay_signature;
    order.payment.paidAt = new Date();
    order.status = 'confirmed';
    order.statusHistory.push({ status: 'confirmed', note: 'Payment received via Razorpay' });
    await order.save();
    res.json({ success: true, order });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// POST /api/orders
router.post('/', protect, async (req, res) => {
  try {
    const { items, shippingAddress, pricing, payment } = req.body;
    // Validate stock
    for (const item of items) {
      const product = await Product.findById(item.product);
      if (!product) return res.status(404).json({ success: false, message: `Product ${item.name} not found` });
      const variant = product.variants.find(v => v.size === item.size && v.color === item.color);
      if (variant && variant.stock < item.qty) {
        return res.status(400).json({ success: false, message: `Insufficient stock for ${product.name} - ${item.size}` });
      }
    }
    // Create order
    const order = await Order.create({
      user: req.user._id, items, shippingAddress, pricing,
      payment: { method: payment.method, status: payment.method === 'cod' ? 'pending' : 'pending' },
      status: payment.method === 'cod' ? 'confirmed' : 'placed',
      statusHistory: [{ status: payment.method === 'cod' ? 'confirmed' : 'placed', note: 'Order created' }]
    });
    // Deduct stock
    for (const item of items) {
      await Product.updateOne(
        { _id: item.product, 'variants.size': item.size, 'variants.color': item.color },
        { $inc: { 'variants.$.stock': -item.qty } }
      );
    }
    res.status(201).json({ success: true, order });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// GET /api/orders/my (customer's orders)
router.get('/my', protect, async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 }).populate('items.product', 'name images');
    res.json({ success: true, orders });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// GET /api/orders (admin - all orders)
router.get('/', protect, adminOnly, async (req, res) => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 }).populate('user', 'name email').populate('items.product', 'name');
    res.json({ success: true, orders });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// GET /api/orders/:id
router.get('/:id', protect, async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate('items.product', 'name images price');
    if (!order) return res.status(404).json({ success: false, message: 'Not found' });
    if (order.user.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }
    res.json({ success: true, order });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// PUT /api/orders/:id/status (admin)
router.put('/:id/status', protect, adminOnly, async (req, res) => {
  try {
    const { status, note, tracking } = req.body;
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ success: false, message: 'Not found' });
    order.status = status;
    order.statusHistory.push({ status, note: note || '' });
    if (tracking) order.tracking = tracking;
    await order.save();
    res.json({ success: true, order });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;

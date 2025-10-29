const Product = require('../models/Product');
const Order = require('../models/Order');

exports.showCart = (req, res) => {
  const cart = req.session.cart || [];
  res.render('cart/index', { cart });
};

exports.addToCart = async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (!product) return res.redirect('/products');
  const cart = req.session.cart || [];
  const existing = cart.find((i) => i.product.toString() === product._id.toString());
  if (existing) existing.quantity += 1;
  else cart.push({ product: product._id, name: product.name, price: product.price, quantity: 1 });
  req.session.cart = cart;
  res.redirect('/cart');
};

exports.checkout = async (req, res) => {
  const cart = req.session.cart || [];
  if (!req.session.user) return res.redirect('/auth/login');
  const total = cart.reduce((s, i) => s + i.price * i.quantity, 0);
  const order = new Order({ user: req.session.user.id, items: cart, total });
  await order.save();
  req.session.cart = [];
  res.render('cart/checkout-success', { order });
};

exports.removeFromCart = (req, res) => {
  const cart = req.session.cart || [];
  const id = req.params.id;
  req.session.cart = cart.filter((i) => i.product.toString() !== id);
  res.redirect('/cart');
};

const Product = require('../models/Product');

exports.list = async (req, res) => {
  const products = await Product.find();
  res.render('products/index', { products });
};

exports.show = async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (!product) return res.redirect('/products');
  res.render('products/show', { product });
};

// Admin actions
exports.adminList = async (req, res) => {
  const products = await Product.find();
  res.render('admin/dashboard', { products });
};

exports.showAddForm = (req, res) => {
  res.render('admin/add-product');
};

exports.addProduct = async (req, res) => {
  const { name, category, price, description, stock } = req.body;
  // Use uploaded image if provided; otherwise leave empty so views use placeholder
  let finalImage = '';
  if (req.file) {
    finalImage = '/uploads/' + req.file.filename;
  }
  const p = new Product({ name, category, price, description, imageUrl: finalImage, stock });
  await p.save();
  res.redirect('/admin/dashboard');
};

exports.deleteProduct = async (req, res) => {
  await Product.findByIdAndDelete(req.params.id);
  res.redirect('/admin/dashboard');
};

exports.showEditForm = async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (!product) return res.redirect('/admin/dashboard');
  res.render('admin/edit-product', { product });
};

exports.updateProduct = async (req, res) => {
  const { name, category, price, description, stock } = req.body;
  let finalImage = undefined;
  if (req.file) {
    finalImage = '/uploads/' + req.file.filename;
  }
  const update = { name, category, price, description, stock };
  if (finalImage !== undefined) update.imageUrl = finalImage;
  await Product.findByIdAndUpdate(req.params.id, update);
  res.redirect('/admin/dashboard');
};

const express = require('express');
const router = express.Router();
const Product = require('../models/Product');

router.get('/', async (req, res) => {
  const featured = await Product.find().limit(8);
  res.render('index', { featured });
});

module.exports = router;

const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: String,
  description: String,
  price: Number,
  imageUrl: String, // URL for the product image
  inStock: Number,
  boughtByOther: Number,
  categoryId: { type: mongoose.Schema.Types.ObjectId, ref: 'Category' }, // Reference to Category});,
});

module.exports = mongoose.model('Product', productSchema);
const mongoose = require("mongoose");
const category = require('./category-model');
const productSchema = new mongoose.Schema(
  {
    productName: {
      type: String,
      required: true,
      upperCase: true,
    },
    description: {
      type: String,
      required: true,
    },
    regularPrice: {
      type: Number,
      required: true,
    },
    discount: {
      type: Number,
      default: 0,
    },
    stock: {
      type: Number,
      default: 0,
      min: 0,
    },
    brand: {
      type: String,
      required: true,
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: category,
      required: true
    },
    image: {
      type: Array
    },
    deleted: {
      type: Boolean,
      default: false
    },
    hidden: {
      type: Boolean,
      default: false
    }
  },
  { collection: "products" }
);

const product = mongoose.model("product", productSchema);

module.exports = product;

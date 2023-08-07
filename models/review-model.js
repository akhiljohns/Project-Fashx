const mongoose = require("mongoose");
const customer = require("./user-model");
const product = require("./product-model");

const reviewschema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: customer,
    },
    reviews: [ {
        product: {
          type: String,
        
        },
        name: {
          type: String,
        },
        message: {
          type: String,
        },
      }],
      
},
  { collection: "reviews" }
);

const review = mongoose.model("reviews", reviewschema);

module.exports = review;

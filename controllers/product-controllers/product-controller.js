const session = require("express-session");
const productHelper = require("../../helpers/product-helpers/product-helper");
const categoryHelper = require("../../helpers/product-helpers/category-helper");

module.exports = {


  getAddproduct: (req, res, next) => {
    categoryHelper.allCategory().then((category) => {
      res.render("admin/add-product", { admin: true, category });
    });
  },


  postAddproduct: async (req, res) => {
    let productDetails = req.body;
    let images = req.files;
    console.log("---------------PRODUCTDETIALS------------", productDetails);

    try {
      await productHelper.addProduct(productDetails, images);
      res.redirect("/admin/productS");
    } catch (err) {
      console.log(err);
    }
  },


  showProducts: (req, res, next) => {
    productHelper.showProductsAdmin().then((products) => {
      res.render("admin/products", { products, admin: true });
    });
  },

  
  deleteImg: (req, res) => {
    const imgId = req.body.imgId;
    const productId = req.body.productId;
    console.log("<=--=>", imgId + " " + productId);
    productHelper
      .deleteImg(imgId, productId)
      .then((response) => {
        if (response) {
          res.status(200).json({ response });
        }
      })
      .catch((err) => {
        console.log(err);
      });
  },
};

const productHelper = require("../../helpers/product-helpers/product-helper");
const categoryHelper = require("../../helpers/product-helpers/category-helper");
const product = require("../../models/product-model");
const fs = require("fs");

module.exports = {


  
  showProducts: (req, res, next) => {
    productHelper.showProducts().then((products) => {
      res.render("admin/products", { products, admin: true,prdp:true });
    });
  },




  getEditProduct: (req, res, next) => {
    let id = req.params.id;
    productHelper.findProductById(id).then((product) => {
      categoryHelper.allCategory().then((category) => {
        res.render("admin/edit-product", { product, category, admin: true });
      });
    });
  },



  postEditProduct: (req, res, next) => {
    let id = req.params.id;
    let productDetails = req.body;
    let image = req.files;
    let deletedImages = req.body.deletedImages; // Get the deleted image filenames from the request body

    productHelper
      .updateProductById(id, productDetails, image, deletedImages)
      .then((response) => {
        if (response) {
          res.redirect("/admin/products");
        }
      });
  },




  softDeleteProduct: (req, res, next) => {
    const productId = req.body.productId;

    productHelper
      .hasPendingOrderWithProductId(productId)
      .then((hasPending) => {
        if (hasPending) {
          res.status(200).json({ status: false });
        } else {
          product
            .findByIdAndDelete(productId)
            .then(() => {
              res.status(200).json({ status: true });
            })
            .catch((err) => {
              console.log("Error while deleting product: " + err);
              res.redirect("/admin/products");
            });
        }
      })
      .catch((err) => {
        console.error("Error checking pending order:", err);
      });

    // product.findByIdAndDelete(productId).then(() => {
    //   res.redirect("/admin/products");
    // })
    // .catch((err) => {
    //   console.log("Error while deleting product: " + err);
    //   res.redirect("/admin/products");
    // })
  },

  hideunhideproduct: (req, res) => {
    try {
      let id = req.params.id;
      productHelper.hideunhideprod(id).then((result) => {
        res.redirect("/admin/products/");
        if (result) {
          console.log("PRODUCT HIDDEN " + req.params.id);
        } else {
          console.log("PRODUCT UNHIDDEN " + req.params.id);
        }
      });
    } catch (err) {
      console.log(err.message);
    }
  },
};

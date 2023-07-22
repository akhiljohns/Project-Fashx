const productHelper = require("../../helpers/product-helpers/product-helper");
const carthelper = require("../../helpers/product-helpers/cart-helper");
module.exports = {
  showProducts: (req, res, next) => {


    productHelper
      .showProductsUser()
      .then((products) => {
        if (!products.length <= 0) {
          res.render("user/products", { products, user: req.session.user });
        } else {
          products = false;
          res.render("user/products", { products, user: req.session.user });
        }
      })
      .catch((err) => {
        console.log("prd rende err", err);
      });
  },


  getSinPro: (req, res, next) => {
    let prodid = req.params.id;

    productHelper.findProductByIdUser(prodid).then((product) => {
      console.log("<=-------SINGLE PRODUCT PAGE---------=>", product);
      if (req.session.userloggedIn) {
        console.log(req.session.user);
        let userId = req.session.user._id;
        carthelper.checkProduct(userId, product).then((response) => {
          console.log("Product On Cart: ", response);
          if (response) {
            res.render("user/single-product", {
              product,
              oncart: true,
              user: req.session.user,
            });
          } else {
            res.render("user/single-product", {
              product,
              oncart: false,
              user: req.session.user,
            });
          }
        });
      } else {
        res.render("user/single-product", {
          product,
          oncart: false,
          user: req.session.user,
        });
      }
    });
  },

  
  getStock: (req, res) => {
    const productId = req.body.productId;
    productHelper
      .getStock(productId)
      .then((stock) => {
        res.status(200).json({ stock: stock });
      })
      .catch((error) => {
        console.log("Error in controller while getting stocks", error);
      });
  },
};

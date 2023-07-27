const { response } = require("express");
const cartHelper = require("../../helpers/product-helpers/cart-helper");
const productHelper = require("../../helpers/product-helpers/product-helper");
const couponManagement = require('../user-controllers/user-coupon-controller');


const cartController = {


  addtoCart: (req, res, next) => {
    if (!req.session.user) {
      res.status(200).json({ user: false });
    }
    // let data = JSON.parse(req.query.data);
    const productId = req.body.productId;
    const quantity = req.body.quantity;
    const customer = req.session.user;

    if (customer) {
      cartHelper.addtoCart(customer, productId, quantity).then((cart) => {
        req.session.user.cart = cart;

        productHelper.findProductByIdUser(productId).then((product) => {
          // res.render("user/single-product", {
          //   product,
          //   resmsg: true,
          //   user: req.session.user,
          // });

          res.status(200).json({ resmsg: true });
        });
      });
    } else {
      console.log("no user");
    }
  },


  showCart: (req, res) => {
    try {
      const customer = req.session.user;
      cartHelper.showCart(customer).then(async (cart) => {
        // let products = cart.items
        if (cart && cart.items.length > 0) {
          let products = cart.items,
            total = [],
            subtotal = 0;
          

          for (let i = 0; i < products.length; i++) {
            products[i].amount =
              products[i].product.regularPrice * products[i].quantity;
          } //to find total product price.
          for (let i = 0; i < products.length; i++) {
            subtotal += products[i].amount;
          }
          let coupons = await couponManagement.getActiveCoupons();

          res.render("user/cart", {
            products,
            user: req.session.user,
            subtotal,
            emptyCart: false,
          });
        } else {
          let products = null;
          res.render("user/cart", {
            products,
            user: req.session.user,
            emptyCart: true,
          });
        }
      });
    } catch (err) {
      console.log("Error while showing cart: " + err);
    }
  },


  removeItem: (req, res) => {
    const userId = req.session.user._id;
    const itemId = req.query.itemId;
    cartHelper.removeItem(userId, itemId).then((response) => {
      // res.redirect('/cart')
      res.status(200).json({ response: response });
    });
  },


  addQuantity: (req, res, next) => {
    const itemId = req.query.itemId;
    const userId = req.session.user._id;
    const productId = req.body.productId;
    cartHelper
      .addQuantity(itemId, userId, productId)
      .then((cart) => {
        res.status(200).json({ cart });
      })
      .catch((err) => {
        console.log("the error occurred: " + err);
      });
  },


  reduceQuantity: (req, res, next) => {
    const itemId = req.query.itemId;
    const userId = req.session.user._id;
    const productId = req.body.productId;
    cartHelper
      .reduceQuantity(itemId, userId, productId)
      .then((cart) => {

        res.status(200).json({ cart: cart });
      })
      .catch((err) => {
        console.log("the error occurred: " + err);
      });
  },


};

module.exports = cartController;

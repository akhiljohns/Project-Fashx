const session = require("express-session");
const productHelper = require("../../helpers/product-helpers/product-helper");

module.exports = {
  
  getCart: (req, res) => {
    res.render("user/cart", { user: req.session.user });
  },
  getTracking: (req, res) => {
    res.render("user/tracking", { user: req.session.user });
  },
  getContact: (req, res) => {
    res.render("user/contact", { user: req.session.user });
  },
  getProducts: (req, res) => {
    productHelper.showProducts().then((products) => {
      res.render("user/products", { products, user: req.session.user });
    });
  },

  getCheckout: (req, res) => {
    res.render("user/checkout", { user: req.session.user });
  },
  getElements: (req, res) => {
    res.render("user/elements", { user: req.session.user });
  },
  getProfile: (req, res) => {
    res.render("user/profile", { user: req.session.user });
  },
};

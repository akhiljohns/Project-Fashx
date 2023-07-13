const session = require("express-session");
const productHelper = require("../../helpers/product-helpers/product-helper");

module.exports = {
  getSignin:(req, res) =>{
    res.render("user/user-signin",{layout:false})
  },
  getSignup:(req, res) =>{
    res.render("user/user-signup",{layout:false})
  },

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
  getOverview: (req, res) => {
    res.render("user/prof-overview", { user: req.session.user });
  },
  getProfEdit: (req, res) => {
    res.render("user/prof-edit", { user: req.session.user });
  },
  getAddress: (req, res) => {
    res.render("user/prof-address", { user: req.session.user });
  },
  getChangePass: (req, res) => {
    res.render("user/prof-password", { user: req.session.user });
  },
};

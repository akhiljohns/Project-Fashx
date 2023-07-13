const session = require("express-session");
const loginhelper = require("../../helpers/admin-helpers/login-helper");
module.exports = {
  getSignin: (req, res) => {
    res.render("admin/signin", { admin: true, layout: false });
  },

  postSignin: (req, res, next) => {
    req.session.adminlog = loginhelper.adminValidation(req.body);
    if (req.session.adminlog) {
      console.log("--------ADMIN LOGGED IN STATUS : "+req.session.adminlog+"--------");
      res.redirect("/admin/dashboard");
    } else {
      console.log("--------ADMIN LOGGED IN STATUS : "+req.session.adminlog+"--------");

      res.render("admin/signin", { layout: false });
    }
  },

  getLogout: (req, res) => {
    req.session.adminlog = false;
    res.redirect("/admin/signin");
  },
  getUserEdit: (req, res) => {
   res.render("admin/user-edit");
  },
  getUserDetails: (req, res) => {
   res.render("admin/user-details");
  },
  getOrders: (req, res) => {
   res.render("admin/orders", {admin:true});
  },
};

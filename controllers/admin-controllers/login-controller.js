const session = require("express-session");
const loginhelper = require("../../helpers/admin-helpers/login-helper");
let errmsg = false;
module.exports = {

  getSignin: (req, res) => {
    res.render("admin/signin", { admin: true, layout: false, errmsg });
  },


  postSignin: async (req, res, next) => {
    let adminData = req.body;
    try {
      const response = await loginhelper.adminValidation(adminData);
      console.log("Admin Loggedin: " + response);
      if (response) {
        req.session.adminlog = response;
        res.redirect("/admin/dashboard");
      } else {
        errmsg = true;
        res.redirect("/admin/signin");
      }
    } catch (err) {
      console.log("post login error: ", err);
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
    res.render("admin/orders", { admin: true });
  },
};

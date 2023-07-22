const session = require("express-session");
const loginHelper = require("../../helpers/user-helpers/login-helper");
const userHelper = require("../../helpers/admin-helpers/user-helper");

module.exports = {

  getHome: (req, res, next) => {
    res.render("user/index", { user: req.session.user });
  },


  getLogout: (req, res) => {
    req.session.userloggedIn = false;
    const userloggedIn = false;
    const user = req.session.user;
    loginHelper.setActiveStatus(user, userloggedIn);
    req.session.user = null;
    res.redirect("/signin");

    console.log("USER LOGOUT");
  },

};

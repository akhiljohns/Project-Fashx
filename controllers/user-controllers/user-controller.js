const session = require("express-session");
const loginHelper = require("../../helpers/user-helpers/login-helper");
const userHelper = require("../../helpers/admin-helpers/user-helper");
const bannerHelper = require('../../helpers/admin-helpers/banner-helper');
module.exports = {

  // getHome: (req, res, next) => {
  //   res.render("user/index", { user: req.session.user });
  // },
  getHome: async (req, res, next) => {
    user = req.session.userloggedIn;
    customer = req.session.user;


    bannerHelper.getBanner().then((banner) => {
        if(!banner.error){
            if(user){
              res.render("user/index", { user: req.session.user, banner });
               
            } else {
              res.render("user/index", { user: req.session.user,banner });
            }
        } else {
            res.redirect('/products');
        }
    })

    
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

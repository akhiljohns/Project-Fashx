const session = require("express-session");
const loginHelper = require("../../helpers/user-helpers/login-helper");


module.exports = {


  getLogin: (req, res, next) => {
    res.render("user/user-signin", {layout: false,logsta: false,blocked: false});
  },



  postLogin: (req, res) => {
    try {
      loginHelper.doLogin(req.body).then((response) => {
        if (response.status) {
          let user = response.user;
          if (user.blocked) {
            console.log("USER IS BLOCKED");

            res.render("user/user-signin", {layout: false,blocked: true,signuptog: true});
          } else {
            req.session.userloggedIn = true;
            const userloggedIn = true;
            req.session.user = response.user;

            loginHelper.setActiveStatus(user, userloggedIn);

            res.redirect("/");
          }
        } else {
          res.render("user/user-signin", { layout: false, logsta: true });
        }
      });
    } catch (err) {
      console.log("ERROR WHILE USER LOGIN" + err);
    }
  },
};

const session = require("express-session");
const loginHelper = require("../../helpers/user-helpers/login-helper");

module.exports = {
  postSignup: (req, res, next) => {
    console.log(req.body);
    loginHelper.doSignup(req.body).then((response) => {
      req.session.userloggedIn=true;
     req.session.user = response
      // res.render('user/index', {user : response.username});
      res.status(200).json({status:true})
      console.log("---------------"+response + req.session.user+"---------------");
    });
  },

  signupValidation: (req, res) => {
    let email = req.body.email;
    const phone = req.body.number;
console.log("signupvalidation");
    loginHelper.signupValidate(email, phone).then((response) => {
      if (response.email) {
        res.status(200).json({ availability: false, err: 'email' });
      } else if(response.phone){
        res.status(200).json({ availability: false, err: 'phone' });
      } else {
        res.status(200).json({ availability: true });
      }
    }); 
  },
};


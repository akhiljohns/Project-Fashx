const session = require("express-session");
const loginHelper = require("../../helpers/user-helpers/login-helper");
const registerHelper = require('../../helpers/user-helpers/register-helper');
const otpController = require('./otp-controller');


let otpsent = false;
let regUser = false;
let phoneNumber = null;
let otpValid = false;
let inValidotp = false;
let otptimeout = false;
let zeroes = false;
let expired = false;
module.exports = {

  getSignup: (req, res) => {
    if (otpValid) {
      console.log("otpValid", phoneNumber);
      res.render("user/user-signup", { layout: false, phoneNumber:phoneNumber });
      otpValid = false;
      phoneNumber = null;
    }else if(inValidotp){
      res.render("user/user-signup-otp",{layout: false,phoneNumber:phoneNumber,regUser,inValidotp});
    } else {
      console.log("IN PHONE REGISTER PAGE");
      const invalid = zeroes, phone = phoneNumber;
      zeroes = false, phoneNumber = null;;
      res.render("user/user-signup-phone", {layout: false,phoneNumber:phone,regUser,zeroes:invalid,expired});
      expired = false;
    }
  },

  getSignupotp: (req, res) => {
    if (otpsent) {
      res.render("user/user-signup-otp", { layout: false, phoneNumber,inValidotp,otptimeout });
      otpsent = false;
    } else {
      res.redirect('/signup')
      
    }
  },
  
  postCheckNum: async (req, res) => {
      const userData = req.body;
      phoneNumber = userData.phone;
      console.log("At postchecknum user number :", phoneNumber);
      const response = await registerHelper.checkUser(phoneNumber);
      console.log("in postchecknum user response", response);
  
 
     if (!response) {
        phoneNumber = userData.phone
        otpController.sendOtp(userData).then((otpResponse)=>{
          if(!otpResponse){
            // res.render("user/user-signup-phone", {layout: false,zeroes:true});
            zeroes = true;
            res.redirect('/signup');
          }else{
            otpsent = true;
            res.redirect('/signup/otpform')
         
          }
        })

      } else {
        phoneNumber;
        regUser = true;
        res.render("user/user-signup-phone", {
          layout: false,
          phoneNumber,
          regUser,
        });
        // res.redirect("/signup");
        phoneNumber = null;
        regUser = false;
     
        
      }
    },
  postSignup: (req, res, next) => {
    console.log(req.body);
    loginHelper.doSignup(req.body).then((response) => {
      req.session.userloggedIn = true;
      req.session.user = response;
      // res.render('user/index', {user : response.username});
      res.status(200).json({ status: true });
      console.log(
        "---------------" + response + req.session.user + "---------------"
      );
    });
  },

  signupValidation: (req, res) => {
    let email = req.body.email;
    const phone = req.body.number;
    console.log("signupvalidation");
    loginHelper.signupValidate(email, phone).then((response) => {
      if (response.email) {
        res.status(200).json({ availability: false, err: "email" });
      } else if (response.phone) {
        res.status(200).json({ availability: false, err: "phone" });
      } else {
        res.status(200).json({ availability: true });
      }
    });
  },

  updatePassword: (req, res, next) => {
    const userData = req.body;
    console.log(userData);
    registerHelper.updatePassword(userData).then((result) => {
      if (result) {
        res.redirect("/signin");
      } else {
        res.redirect("/forgotPassword");
      }
    });
  },

  verifyOtpsignup: (req, res) => {
    const userData = req.body;
    const otp = userData.otp;
    const phone = userData.phone;

    console.log(userData);
    

    otpController.verifyOtp(userData).then((result) => {

      if(result == 'expired'){
        expired = true;
        phoneNumber = phone;
        res.redirect('/signup')

      }else if (result) {
        otpValid = true;
        phoneNumber = phone;
        res.redirect('/signup')
      
      } else {
      
       
      
        otpValid = false;
        inValidotp = true;
        phoneNumber = phone;
        res.redirect("/signup/otpform");
      
      }
    });
  },
};


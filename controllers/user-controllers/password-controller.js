const registerHelper = require('../../helpers/user-helpers/register-helper');
const otpController = require('./otp-controller');

const bcrypt = require('bcrypt');




module.exports = {
   
    getForgotPassword:(req, res)=>{

        res.render('user/otpform',{layout:false,otp:false,phoneNumber:false});
       
     
    },
    
    
    postForgotPassword: (req, res, next) => {
        const userData = req.body;
        console.log(userData);
        phoneNumber = req.body.phone;
        const response = registerHelper.checkUser(userData);
        if(response){
            otpController.sendOtp(userData);
            res.render('user/otpform',{layout:false, resmsg1:true,phoneNumber})
         } else{
                res.render('user/otpform',{layout:false,resmsg2:true,phoneNumber})
            }
        },
  

    updatePassword: (req, res, next) => {
        const userData = req.body;
        console.log(userData);
        registerHelper.updatePassword(userData).then((result) => {
            if(result){
                res.redirect('/signin');
            } else {
                res.redirect('/forgotPassword');
            }
        })
    },

    verifyOtp: (req, res) => {
        const userData = req.body;
        const otp = userData.otp
        const phoneNumber = userData.phone
        console.log(userData);
        
        otpController.verifyOtp(userData).then((result) => {
            
          result = true
            if(result){
                res.redirect('/resetpassword');
            } else {
                res.render('user/otpform',{layout:false,resmsg3:true,phoneNumber,otp})
            }
        })
    },

    getResetPassword:(req, res)=>{
        console.log("hi",req.session.phone);
        res.render('user/reset-password',{layout:false,phone:req.session.phone});
       
     
    },



}

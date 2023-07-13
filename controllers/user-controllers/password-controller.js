const registerHelper = require('../../helpers/user-helpers/register-helper');
const otpController = require('./otp-controller');

const bcrypt = require('bcrypt');


let phnumber = null;

module.exports = {
   
    getForgotPassword:(req, res)=>{

        res.render('user/otpform',{layout:false,otp:false,phoneNumber:false});
       
     
    },
    // resendOtp: (req, res) => {
    //    console.log("RESEND OTP",phnumber)
    //    phoneNumber=phnumber
    //     otpController.sendOtp(phnumber);
    //     console.log('RESEND OTP userData : '+userData.phone);
    //     res.render('user/otpform',{layout:false, resmsg1:true,phoneNumber})
       
    // },
    
    postForgotPassword: (req, res, next) => {
        const userData = req.body;
        console.log(userData);
        phoneNumber = req.body.phone;
        phnumber = phoneNumber
        const response = registerHelper.checkUser(phoneNumber);
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
        res.render('user/reset-password',{layout:false,phone:phnumber});
       
     
    },

    checkPassword: (req, res, next) => {
        console.log('entered the area');
        const oldpassword = req.body.oldpassword;
        const newpassword = req.body.newpassword;
        const user = req.session.user;
        console.log("old password: " + oldpassword+" new password: " + newpassword);
        const response = {};

        return new Promise((resolve, reject) => {
            if(oldpassword === newpassword){
                response.samePasswords = true;
            }

            bcrypt.compare(oldpassword, user.password).then((status)=>{
                response.oldPasswordCheck = status;
                res.status(200).json(response);
            })
        })



    },
    changePassword: async(req, res, next) => {
        try {
             const oldpassword = req.body.oldpassword;
        const newpassword = req.body.newpassword;
        const user = req.session.user;

        await bcrypt.compare(oldpassword, newpassword).then((status) => {
            if(!status){
                const newUserData = { phone : user.number, password: newpassword };
                registerHelper.updatePassword(newUserData)
                res.redirect('/profile')
                // let passupdate = true;
                // res.render('user/profile', { user, customer, address , passupdate });

            } else {
                res.status(200).json({})
            }
        })
    }
 catch (error) {
            console.log(error)
}

}
}

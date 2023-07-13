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
        res.render('user/reset-password',{layout:false,phone:req.session.phone});
       
     
    },

    checkPassword: (req, res, next) => {
        console.log('entered the area');
        const oldpassword = req.body.oldpassword;
        const newpassword = req.body.newpassword;
        const user = req.session.user;
        console.log(req.body.oldpassword);
        const response = {};

        return new Promise((resolve, reject) => {
            if(oldpassword === newpassword){
                response.samePasswords = true;
            }

            bcrypt.compare(oldPassword, user.password).then((stat)=>{
                response.oldPasswordCheck = stat;
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

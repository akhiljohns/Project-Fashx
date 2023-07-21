const registerHelper = require('../../helpers/user-helpers/register-helper');
const otpController = require('./otp-controller');
const userHelper = require('../../helpers/admin-helpers/user-helper');

const bcrypt = require('bcrypt');


let phnumber = null;
let passupdate = false;


module.exports = {
   
    getProfile: async (req, res, next) => {
        try {
            const userId = req.session.user._id
            const customer = user = await userHelper.findUserById(userId)
          
            const userAddress = await userHelper.getAddress(userId);
            if(userAddress){
                let address = userAddress.address;
                console.log("Address", address)
                console.log("passupdate", passupdate+"/n")
                res.render('user/profile', { user, customer, address ,passupdate});
                passupdate = false
            } else {
                res.render('user/profile', { user, customer, passupdate});
            passupdate = false
            }
        } catch (err) {
            console.log('Error fetching address'+err);
        }
    },
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
            
            if(result == 'expired'){
            let otpexpired = true;
            
                res.render('user/otpform',{layout:false,phoneNumber,otpexpired})
        
              }else if (result){
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
        console.log('entered the checkpassword area');
        const oldpassword = req.body.oldpassword;
        const newpassword = req.body.newpassword;
        const user = req.session.user;
        console.log("old password: " + oldpassword + " new password: " + newpassword);
        
        bcrypt.compare(oldpassword, user.password, (err, status) => {
          if (err) {
            console.log(err);
            res.status(500).json({});
            return;
          }
          
          const response = { oldPasswordCheck: status };
          res.status(200).json(response);
        });
      },
      
      changePassword: async (req, res, next) => {
        try {
          const oldpassword = req.body.oldpassword;
          const newpassword = req.body.newpassword;
          const user = req.session.user;
      
          const isPasswordMatch = await bcrypt.compare(oldpassword, user.password);
      
          if (isPasswordMatch) {
            const newUserData = { phone: user.number, password: newpassword };
            await registerHelper.updatePassword(newUserData);
            passupdate = true;
            console.log('updated password and passupdate = ' + passupdate);
             res.status(200).json(passupdate);
            // res.redirect('/profile');
          } else {
            res.redirect('/profile');
          }
        } catch (error) {
          console.log(error);
          res.status(500).json({});
        }
      }
      
}

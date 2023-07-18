const profileHelper = require('../../helpers/user-helpers/profile-helper');
const userHelper = require('../../helpers/user-helpers/user-helper');
const registerHelper = require('../../helpers/user-helpers/register-helper');
const otpController = require('./otp-controller');



module.exports = {
  updateProfile: (req, res, next) => {
    const userId = req.session.user._id;
    const newData = req.body;
    console.log("<=-----USEDATA-----=>", req.body);

    profileHelper.updateProfile(userId, newData).then((response) => {
      console.log("<=-----USERDATA-----=>", req.session.user);
      console.log("<=-----USER DATA UPDATED-----=>");
      req.session.user.username = newData.name;
      req.session.user.email = newData.email;
      res.redirect("/profile");
    });
  },
  updateNum: (req, res, next) => {
    const userId = req.session.user._id;
    const newData = req.body;
    console.log("<=-----USERDATA-----=>", req.body);

    profileHelper.updateNum(userId, newData).then((response) => {
      res.status(200).json(response);
 
      console.log("<=-----USERDATA-----=>", req.session.user);
      console.log("<=-----USER NUMBER UPDATED-----=>");
      req.session.user.number = newData.phone;

    });
  },

  addAddress: (req, res, next) => {
    const address = req.body;
    console.log("<=-----ADDRESS-----=>", address);
    userHelper.addAddress(req.session.user._id, address).then((response) => {
      console.log(response);
      req.session.user.address = response;
      console.log("user address: ", req.session.user);
      res.redirect("/profile");
    });
  },

  deleteAddress: (req, res, next) => {
    const id = req.params.id;
    const userId = req.session.user._id;
    userHelper.deleteAddress(id, userId).then((response) => {
      console.log("delete response" + response);
      res.redirect("/profile");
    });
  },

  getAnAddrress: (req, res, next) => {
    try {
      const addressId = req.body.addressId;
      const userId = req.session.user._id;
      let address;
      userHelper.getAddress(userId).then((response) => {
        let addressList = response.address;
        console.log(addressList);
        for (let i = 0; i < addressList.length; i++) {
          if (addressList[i]._id == addressId) {
            address = addressList[i];
            break;
          }
        }
        console.log("single adddress::", address);
        res.status(200).json(address);
      });
    } catch (err) {
      console.log("Error getting single address ::", err);
    }
  },
  getEditnumber: (req, res) => {
    res.render("user/phone-change", { layout: false });
  },

  numExist: (req, res, next) => {
    const userData = req.body;
    phoneNumber = req.body.phone;
    console.log("phone", phoneNumber);
    profileHelper.checkExistUser(phoneNumber).then((response) => {
      console.log("hii", response);
      if (response) {
        res.status(200).json(response);
      } else {
        otpController.sendOtp(userData).then((resp) => {
         
          res.status(200).json(response);
      
        });
      }
    });
  },

  resendOtp: (req, res) => {
    console.log("RESEND OTP", phnumber);
    userData = req.body;
    otpController.sendOtp(userData);
    console.log("RESEND OTP userData : " + userData.phone);
    res.status(200).json(response);
  },
  verifyProfOtp: (req, res) => {
    const userData = req.body;
    const otp = userData.otp
    const phoneNumber = userData.phone
    console.log(userData);
    
    otpController.verifyOtp(userData).then((result) => {
        
 
        if(result){
          res.status(200).json(result);

        } else {
          res.status(200).json(result);

        }
    })
},
};
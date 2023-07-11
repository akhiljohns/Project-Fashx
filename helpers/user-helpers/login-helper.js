var collection = require("../../config/collections");
const bcrypt = require("bcrypt");

//importing models
const user = require("../../models/user-model");

module.exports = {
  doLogin: (userData) => {
    try {
      let loginStatus = false;
      let response = {};
      return new Promise((resolve, reject) => {
        user.findOne({ email: userData.email }).then(async (foundUser) => {
          console.log(foundUser + "----------------------");
          if (foundUser) {
            let status = await bcrypt.compare(
              userData.password,
              foundUser.password
            );
            console.log(status + "_______________");
            if (status) {
            
              console.log("logined Successfully");
              response.user = foundUser;
              response.status = true;
            
          } else {
              console.log("login failed");
              response.status = false;
            }
          } else {
            console.log("login failed");
            response.status = false;
          }

          resolve(response);
        });
      });
    } catch (error) {
      throw error;
    }
  },

  doSignup: (userData) => {
    return new Promise(async (resolve, reject) => {
      try {
        userData.password = await bcrypt.hash(userData.password, 10);
        let customer = new user(userData);
        await customer.save().then((response) => {
          resolve(response);
        });
      } catch (error) {
        reject(error);
      }
    });
  },

  signupValidate: (email, phone) => {
    return new Promise(function (resolve, reject) {
      user.findOne({ email: email }).then((response) => {
        if(response){
          resolve({email: true});
        } else {
          user.findOne({number: phone}).then((response) => {
            if(response){
              resolve({phone:true})
            } else {
              resolve({phone: false, email:false})
            }
          })
        }

      });
    });
  },
  setActiveStatus: async(actuser, loggedIn) => {
    try {
      
        if(loggedIn){
            await user.updateOne({_id: actuser._id}, {$set: {activeStatus: true}});
            return;
        } else {
            await user.updateOne({_id: actuser._id}, {$set: {activeStatus: false}});
            return;
        }
    } catch (err) {
        console.log('Error while setting Active status of the user: '+ err);
    }
},
};

var db = require('../../config/connection');
var user = require("../../models/user-model");
const loginHelper = require('../../helpers/user-helpers/login-helper')
const user_address = require('../../models/address-model');
const cart = require('../../models/cart-model');
const customerCollection = require('../../models/user-model');
const { ObjectId } = require('mongodb');


module.exports = {

    allCustomers: () => {
      try{
          return new Promise(async (resolve, reject) => {
              await user.find().lean().exec().then((result) => {
                  resolve(result);
              })
          })
      } catch(err) {
          console.log('Error while fetching customers: '+ err);
      }
  },



checkBlockStatus: async (id) => {
    try {  
      const customer = await user.findOne({ _id: id });
  
      if (customer.blocked) {
        await user.updateOne({ _id: id }, { $set: { blocked: false } });
        return false;
      } else {
        await user.updateOne({ _id: id }, { $set: { blocked: true } });
        
        return true;
      }
    } catch (err) {
      console.log(err.message);
      throw err;
    }
  },

  findBlockStatus: (email) => {
    try {
        return new Promise(async (resolve, reject) => {
            let status = {};
            await user.findOne({ email: email }).then((response) => {
                console.log(response);

                resolve(response);
            })
        })
    } catch (err) {
        console.log('Error while finding block status: '+ err);
    }
},
getAddress: (userId) => {
  try{
      return new Promise((resolve, reject) => {
          user_address.findOne({userId: userId}).lean().then((userAddress) => {
              cart.findOne({userId: userId}).then((cart) => {
                  resolve(userAddress, cart);
              }).catch((err) => {
                  console.log('Error (inside return) in getting cart while checkout in helper: ' + err);
              })
          }).catch((err) => {
              console.log('Error (outside) in getting cart while checkout in helper',err);
          })
      })
  } catch(err){
      console.log('Error while getting address: ' + err);
  }
},

findUserById: (id) => {
    try{
        return new Promise((resolve, reject) => {
            customerCollection.findOne({ _id: new ObjectId(id) }).lean().then((result) => {
                resolve(result);
            })
        })
    } catch(err){
        console.log('Error while fetching user by Id: '+ err);
    }
},


}
const { response } = require('express');
const user = require('../../models/user-model');
const bcrypt = require('bcrypt');


module.exports = {

    checkUser: async(userData) => {
        try{
            const customer = await user.findOne({number: userData.phone});
            if(customer) {
                return true;
            } else {
                return false;
            }
        } catch (err) {
            console.log('Error while checking user'+err);
        }
    },

    updatePassword: (userData) => {
        try {
            return new Promise(async (resolve, reject) => {
                const password = await bcrypt.hash(userData.password, 10);
                user.updateOne({number: userData.phone}, {$set:{password: password}}).then((response) => {
                    console.log('User updated')    
                    resolve(response);
                })
            })
        } catch (err) {
            console.log('Error while updating password: '+ err);
        }
    },


    


}
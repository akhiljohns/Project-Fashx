
const { response } = require('express');
const user = require('../../models/user-model');

const bcrypt = require('bcrypt');




module.exports = {

    updateProfile: (userId, newData) => {
        try{
            return new Promise((resolve, reject) => {

                user.updateOne({_id: userId}, {$set: {username: newData.name, email: newData.email}})
                .then((response) => {
                    resolve(response);
                }).catch((err) => {
                    console.log('Error updating profile: ' + err);
                    reject(err);
                })
            })
        } catch (err) {
            console.log('Error while updating user profile: ' + err);
        }
    },
    updateNum: (userId, newData) => {
        try{
            return new Promise((resolve, reject) => {

                user.updateOne({_id: userId}, {$set: {number: newData.phone}})
                .then((response) => {
                    resolve(response);
                }).catch((err) => {
                    console.log('Error updating profile: ' + err);
                    reject(err);
                })
            })
        } catch (err) {
            console.log('Error while updating user profile: ' + err);
        }
    },
    checkExistUser: async(number) => {
        try{
            return new Promise(async (resolve, reject) => {
                const customer = await user.findOne({number:number});
                console.log("in checkexistuser findone funct customer status: ",customer)
                if(customer) {
                    resolve (true);
                } else {
                    resolve (false);
                }
            })
        } catch (err) {
            console.log('Error while checking user number'+err);
        }
    },


    
}

const { response } = require('express');
const user = require('../../models/user-model');

const bcrypt = require('bcrypt');




module.exports = {

    updateProfile: (userId, newData) => {
        try{
            return new Promise((resolve, reject) => {

                user.updateOne({_id: userId}, {$set: {username: newData.name, email: newData.email, number:newData.phone}})
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


    
}
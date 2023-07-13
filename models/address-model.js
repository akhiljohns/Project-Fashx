const mongoose = require('mongoose');

//models
const user = require('./user-model');


const addressSchema = new mongoose.Schema({
    
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: user
    },

    address: [{
        fname: String,

        lname: String,

        phone: String,

        houseName: String,
        
        landmark : String,

        city: String,

        district: String,

        pincode: String,
            
        state: String,
        
        country: String,
        
    }]
    
},{collection: 'address'});


const address = mongoose.model('address', addressSchema);

module.exports = address;
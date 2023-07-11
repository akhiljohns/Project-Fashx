const mongoose = require('mongoose');
const customer = require('./user-model');
const product = require('./product-model');


const cartSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: customer
    },
    items: [{
        product:{
            type: mongoose.Schema.Types.ObjectId,
            ref: product
        }
    }]
    
    
},{collection: 'cart'});


const cart = mongoose.model('cart', cartSchema);

module.exports = cart;
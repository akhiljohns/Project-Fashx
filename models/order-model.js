const mongoose = require('mongoose');
const customer = require('./user-model');
const cart = require('./cart-model');
const address = require('./address-model');
const product = require('./product-model');

const orderSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: customer
    },
    order: [{
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: customer
        },
        orderNo: {
            type: String,
            unique: true
        },
        items: [{
            product: {
                type: mongoose.Schema.Types.ObjectId,
                ref: product
            },
            quantity: {
                type: Number,
            },
            productTotal: {
                type: Number
            },
        }],
        totalAmount:{
            type: Number,
            required: true
        },
        date: {
            type: Date,
            default: Date.now()
        },
        deliveryDate: {
            type: Date,
            default: Date.now()
        },
        status: {
            type: String,
            default: 'Pending'
        },
        address: {
            fname:String,
            lname:String,
            phone:String,
            houseName:String,
            landmark:String,
            city:String,
            district:String,
            pincode:String,
            state:String,
            country:String,
        },
        paymentMethod: {
            type: String,
            required: true
        },
        shippingCharge: {
            type: Number
        }
    }]
    
},{collection: 'orders'});


const order = mongoose.model('order', orderSchema);

module.exports = order;

// db.orders.find({"order.items.product": "64b63e89843d8e4d8622f524","order.status": "Pending",})
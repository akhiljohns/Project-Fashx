const mongoose = require('mongoose')
const coupon = require('./coupon-model');
const { ObjectId } = require('mongodb');


const userSchema = new mongoose.Schema({

    username: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    number: {
        type: Number,
        required: true
    },
    image: {
        type: String,
        default: null
    },
    activeStatus: {
        type: Boolean,
        default: false
    },
    usedCoupons: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: coupon
    }],
    blocked: {
        type: Boolean,
        default: false
    },createdAt: {
        type: Date,
        default: new Date()
    },
    wallet: {
        type: Number,
        default: 0
    }
},{collection: 'user'});


const user = mongoose.model('user', userSchema);

module.exports = user;

const mongoose = require('mongoose')


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
    blocked: {
        type: Boolean,
        default: false
    }
},{collection: 'user'});


const user = mongoose.model('user', userSchema);

module.exports = user;
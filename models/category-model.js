const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
     hiddenstatus: {
        type: Boolean,
        default: false
    }
    
    
},{collection: 'category'});


const category = mongoose.model('category', categorySchema);

module.exports = category;

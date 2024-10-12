const mongoose = require('mongoose')

const Schema = mongoose.Schema

const productSchema = new Schema({
    name: {
        type: String,
        required: true,
        
    },
    description:{
        type: String,
        required: true
    },
    seller: {
        type: String,
        required: true,
        ref: 'user'
    },
    image:[{
        type: String,
        
    }],
    price:{
        type: Number,
        required: true
    }

}, {timestamps: true})

const Product = mongoose.model('product', productSchema)

module.exports = Product
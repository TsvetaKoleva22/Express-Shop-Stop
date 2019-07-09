const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    name: { type: mongoose.Schema.Types.String, required: true, unique: true},
    description: { type: mongoose.Schema.Types.String },
    price: { type: mongoose.Schema.Types.Number, required: true, min:0, default:0 },
    image: { type: mongoose.Schema.Types.String },
    creator: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    buyer: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    category: {type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true },
});

const Product = mongoose.model('Product', productSchema);
module.exports = Product;
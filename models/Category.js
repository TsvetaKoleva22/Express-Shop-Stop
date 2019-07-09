const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
    name: { type: mongoose.Schema.Types.String, required: true, unique: true},
    products: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Product' }],
    creator: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
});

const Category = mongoose.model('Category', categorySchema);
module.exports = Category;
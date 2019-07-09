const Product = require('../models/Product');
const Category = require('../models/Category');

module.exports = {
    index: (req, res) => {
        Product.find({ buyer : null })
        .populate('category')
        .then(function (results) {
            res.render('home/index', { productsArr: results })
        }).catch(function (err) {
            console.log(err);
            return;
        })
    },
    search: (req, res) => {
        let nameToFind = req.body.query.toLowerCase();
        Product.find({ buyer : null }).populate('category').then(function(results){
            let prods = results.filter(p => p.name.toLowerCase().includes(nameToFind));
            res.render('home/index', { productsArr: prods })
        })
    }
};
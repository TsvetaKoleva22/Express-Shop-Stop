const Product = require('../models/Product');
const Category = require('../models/Category');

module.exports = {
    addCategoryGet: (req, res) => {
        res.render('category/addCategory');
    },
    addCategoryPost: (req, res) => {
        let currCategory = new Category(req.body);
        currCategory.creator = req.user._id;
        currCategory.products = [];
        currCategory.save().then(function () {
            res.redirect('/');
        }).catch(function (err) {
            console.log(err);
            return;
        })
    },
    prodsByCatGet: (req, res) => {
        let currCategoryName = req.params.category;
        Category.find({ name : currCategoryName })
        .populate('products')
        .then(function(result){
            let containedProdsArr = result[0].products;
            containedProdsArr = containedProdsArr.filter(p => !p.buyer);
            res.render('category/prodsByCategory', {
                name : currCategoryName, 
                containedProdsArr
            })
        }).catch(function (err) {
            console.log(err);
            return;
        })
    }
};
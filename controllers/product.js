const Product = require('../models/Product');
const Category = require('../models/Category');

module.exports = {
    addProductGet: (req, res) => {
        Category.find({}).then(function (results) {
            res.render('product/addProduct', { categoriesArr: results });
        }).catch(function (err) {
            console.log(err);
        })
    },
    addProductPost: (req, res) => {
        let currProduct = new Product(req.body);
        currProduct.price = Number(currProduct.price)
        currProduct.creator = req.user._id;
        currProduct.save().then(function (resultProduct) {
            let prodId = resultProduct._id;
            let catId = resultProduct.category;
            Category.findById(catId).then(function (resultCategory) {
                resultCategory.products.push(prodId);
                resultCategory.save().then(function (c) {
                    res.redirect('/');
                })
            })
        }).catch(function (err) {
            console.log(err);
            return;
        })
    },
    
    editProductGet: (req, res) => {
        let id = req.params.id;
        Product.findById(id)
            .then(function (resultProduct) {
                if(resultProduct.creator.equals(req.user._id) || req.user.roles.indexOf('Admin') >= 0){
                    Category.find({}).then(function (resultCats) {
                        res.render('product/edit', {
                            product: resultProduct,
                            categoriesArr: resultCats
                        });
                    })
                } else{
                    res.redirect('/');
                }
            }).catch(function (err) {
                console.log(err);
                return;
            })
    },
    editProductPost: (req, res) => {
        let id = req.params.id;
        Product.findById(id).then(function (resultProd) {
            if(resultProd.creator.equals(req.user._id) || req.user.roles.indexOf('Admin') >= 0){
                let oldCategory = resultProd.category;

                resultProd.name = req.body.name;
                resultProd.description = req.body.description;
                resultProd.price = Number(req.body.price);
                resultProd.image = req.body.image;
    
                if (oldCategory !== req.body.category) {
                    Category.findById(resultProd.category).then(function (currentCat) {
                        Category.findById(req.body.category).then(function (nextCat) {

                            let index = currentCat.products.indexOf(resultProd._id);
                            if (index >= 0) {
                                currentCat.products.splice(index, 1);
                            }
                            currentCat.save();
                            
                            if(nextCat.products.indexOf(resultProd._id) < 0){
                                nextCat.products.push(resultProd._id);
                                nextCat.save();
                            }
                            
                            resultProd.category = req.body.category;
                            resultProd.save().then(function () {
                                res.redirect('/');
                            })
                        })
                    })
                } else {
                    resultProd.save().then(function () {
                        res.redirect('/');
                    })
                }
            } else{
                res.redirect('/');
            }
            
        }).catch(function (err) {
            console.log(err);
            return;
        })
    },

    deleteProductGet: (req, res) => {
        let id = req.params.id;
        Product.findById(id)
            .then(function (resultProduct) {
                if(resultProduct.creator.equals(req.user._id) || req.user.roles.indexOf('Admin') >= 0){
                    res.render('product/delete', resultProduct);
                } else{
                    res.redirect('/')
                }
            }).catch(function (err) {
                console.log(err);
                return;
            })
    },
    deleteProductPost: (req, res) => {
        let id = req.params.id;
        Product.findByIdAndDelete(id)
            .then(function (resultProd) {
                Category.findById(resultProd.category).then(function (cat) {
                    let index = cat.products.indexOf(resultProd._id);
                    if (index >= 0) {
                        cat.products.splice(index, 1);
                    }
                    cat.save();
                })
                res.redirect('/');
            }).catch(function (err) {
                console.log(err);
                return;
            })
    },

    buyProductGet: (req, res) => {
        let id = req.params.id;
        Product.findById(id)
            .then(function (resultProduct) {
                res.render('product/buy', resultProduct);
            }).catch(function (err) {
                console.log(err);
                return;
            })
    },
    buyProductPost: (req, res) => {
        let id = req.params.id;
        Product.findById(id).then(function(result){
            result.buyer = req.user._id;
            result.save().then(function(){
                req.user.boughtProducts.push(id);
                req.user.save().then(function(){
                    res.redirect('/');
                })
            }).catch(function (err) {
                console.log(err);
                return;
            })
        })  
    }
};
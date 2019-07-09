const restrictedPages = require('./auth');

const homeController = require('../controllers/home');
const productController = require('../controllers/product');
const categoryController = require('../controllers/category');
const userController = require('../controllers/user');

module.exports = app => {
    app.get('/', homeController.index);
    app.post('/search', homeController.search);
    
    app.get('/user/register', restrictedPages.isAnonymous, userController.registerGet);
    app.post('/user/register', restrictedPages.isAnonymous, userController.registerPost);
    app.get('/user/login', restrictedPages.isAnonymous, userController.loginGet);
    app.post('/user/login', restrictedPages.isAnonymous, userController.loginPost);
    app.post('/user/logout', restrictedPages.isAuthed, userController.logout);

    app.get('/product/add',  restrictedPages.isAuthed, productController.addProductGet);
    app.post('/product/add', restrictedPages.isAuthed, productController.addProductPost);

    app.get('/product/edit/:id', restrictedPages.isAuthed, productController.editProductGet);
    app.post('/product/edit/:id',restrictedPages.isAuthed, productController.editProductPost);

    app.get('/product/delete/:id', restrictedPages.isAuthed, productController.deleteProductGet);
    app.post('/product/delete/:id', restrictedPages.isAuthed, productController.deleteProductPost);

    app.get('/product/buy/:id', restrictedPages.isAuthed, productController.buyProductGet);
    app.post('/product/buy/:id', restrictedPages.isAuthed, productController.buyProductPost);

    app.get('/category/add', restrictedPages.hasRole('Admin'),categoryController.addCategoryGet);
    app.post('/category/add', restrictedPages.hasRole('Admin'), categoryController.addCategoryPost);
    app.get('/category/:category', categoryController.prodsByCatGet);

    
    app.all('*', (req, res) => {
        res.status(404);
        res.send('404 Not Found');
        res.end();
    });
};
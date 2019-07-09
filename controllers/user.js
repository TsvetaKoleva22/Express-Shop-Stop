const encryption = require('../util/encryption');
const User = require('../models/User');
const Product = require('../models/Product');
const Category = require('../models/Category');

module.exports = {
    registerGet: (req, res) => {
        res.render('user/register');
    },
    registerPost: async (req, res) => {
        let reqUser = req.body;

        if(!reqUser.password || !reqUser.confirmedPassword){
            reqUser.error = 'Please fill all fields';
            res.render('user/register', reqUser);
            return;
        }

        if(reqUser.password !== reqUser.confirmedPassword){
            reqUser.error = 'Passwords must match';
            res.render('user/register', reqUser);
            return;
        }

        let salt = encryption.generateSalt();
        let hashedPass = encryption.generateHashedPassword(salt, reqUser.password);

        try{
            const user = await User.create({
                username: reqUser.username,
                hashedPass,
                salt,
                firstName: reqUser.firstName,
                lastName: reqUser.lastName,
                age: Number(reqUser.age),
                gender: reqUser.gender,
                roles: [ 'User' ]
            });
            req.logIn(user, function(err){
                if(err){
                    reqUser.error = err;
                    res.render('user/register', reqUser);
                    return;
                } else {
                    res.redirect('/');
                }
            });
        } catch(err){
            reqUser.error = err;
            res.rendes('user/register', reqUser)
        }       
    },
    logout: (req, res) => {
        req.logout();
        res.redirect('/');
    },
    loginGet: (req, res) => {
        res.render('user/login');
    },
    loginPost: async (req, res) => {
        let reqUser = req.body;
        try {
            const user = await User.findOne({username : reqUser.username});
            if(!user){
                reqUser.error = 'Invalid username';
                res.render('user/login', reqUser);
                return;
            }
            if(!user.authenticate(reqUser.password)){
                reqUser.error = 'Invalid password';
                res.render('user/login', reqUser);
                return;
            }
            req.logIn(user, function(err){
                if(err){
                    reqUser.error = err;
                    res.render('user/login', reqUser);
                    return;
                } else {
                    res.redirect('/');
                }
            })
        } catch(err){
            reqUser.error = err;
            res.rendes('user/login', reqUser)
        }  
    },
};
const mongoose = require('mongoose');
const encryption = require('../util/encryption');

const userSchema = new mongoose.Schema({
    username: { type: mongoose.Schema.Types.String, required: true, unique: true },
    hashedPass: { type: mongoose.Schema.Types.String, required: true },
    firstName: { type: mongoose.Schema.Types.String },
    lastName: { type: mongoose.Schema.Types.String },
    age: { type: mongoose.Schema.Types.Number, min: 0, max: 120 },
    gender: { type: mongoose.Schema.Types.String, enum: { values: ['Male', 'Female'] }},
    salt: { type: mongoose.Schema.Types.String, required: true },
    roles: [{ type: mongoose.Schema.Types.String }],
    boughtProducts: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Product' }],
    createdProducts: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Product' }],
    createdCategories: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Category' }]
});

userSchema.method({
    authenticate: function (password) {
        return encryption.generateHashedPassword(this.salt, password) === this.hashedPass;
    }
});

const User = mongoose.model('User', userSchema);

User.seedAdmin = async function (){
    try {
        let users = await User.find({});
        if(users.length > 0 ){
            return;
        }

        let salt = encryption.generateSalt();
        let hashedPass = encryption.generateHashedPassword(salt, 'admin123');

        return User.create({
            username: 'admin',
            hashedPass,
            firstName: 'Pesho',
            lastName: 'Peshov',
            age: 23,
            gender: 'Male',
            salt, 
            roles: ['Admin']
        })
    } catch (err){
        console.log(err);
    }
}

module.exports = User;

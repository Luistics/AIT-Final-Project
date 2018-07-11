const mongoose = require('mongoose');
const bcrypt = require('bcrypt-nodejs');
const URLSlugs = require('mongoose-url-slugs');

const Schema = mongoose.Schema;

const userSchema = new Schema({

    local:{
        username: {
            type: String,
            unique: true
        },
        password: String,
        profile: {type:Schema.Types.ObjectId, ref: 'Profile'},
    },

});


userSchema.plugin(URLSlugs('local.username'));

userSchema.methods.generateHash = function (password){

    return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

userSchema.methods.validPassword = function(password){

    return bcrypt.compareSync(password, this.local.password);
};

module.exports = mongoose.model('User', userSchema);
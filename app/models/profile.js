const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const profileSchema = new Schema({

    user: {type:Schema.Types.ObjectId, ref: 'User'},
    username: String,
    epicID: {type: String},
    psnID: {type:String},
    xboxLiveID: {type:String},
    location: {type: String, default: "Unknown"},
    games: [String],
    gameData: String,
    age: Number,
    description: String,
    gender: String,
    likes: [String],

});

module.exports = mongoose.model('Profile', profileSchema);
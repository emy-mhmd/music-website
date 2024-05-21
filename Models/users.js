const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
    First_Name: {
        type : String,
        require : true
    },
    Last_Name: {
        type : String,
        require : true
    },
    email:{
        type : String,
        require : true,
        unique: true
    },
    password: {
        type: String,
        require : true
    },
    genre:{
        type: [String],
        require : false
    },
    artist:{
        type: [String],
        require : false
    },
    country:{
        type: [ String],
        require : false
    }
},{Timestamp: true});

const User = mongoose.model("users", userSchema);
module.exports = User;
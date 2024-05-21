const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
    Name:{
        type: String,
        require : true,
        unique: true
    },
    id:{
        type: String,
        require: true,
        unique: true
    }
},{Timestamp: true});

const User = mongoose.model("genres", userSchema);
module.exports = User;
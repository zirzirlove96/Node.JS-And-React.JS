const mongoose = require('mongoose')

const userSchema = mongoose.Schema({
    name: {
        type:String,
        maxlength: 50
    },

    email : {
        type: String,
        trim: true,
        unique
    },

    password : {
        type:String,
        maxlength:50
    },

    lastname: {
        type:String,
        maxlength:50
    },

    role: {
        type: Number,
        default: 0
    },

    image: String,

    token: {
        type: String
    },

    tokenExp: {
        type: Number
    }
    
})

const User = mongoose.model("User", userSchema);
module.exports = {User}
//model을 다른 곳에서도 쓸 수 있게 exports한다.
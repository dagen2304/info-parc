const mongoose = require('mongoose')

const Schema = mongoose.Schema


const UserSchema = new Schema({
    cuid: {
        type: String
    },
    password: {
        type: String
    },
    fullname: {
        type: String
    },
    passwordChanged: {
        type: Boolean,
        default: false
    }
},{
    timestamps: true
})

module.exports = mongoose.model('User' , UserSchema)


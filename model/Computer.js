const mongoose = require('mongoose')

const Schema = mongoose.Schema

const computerSchema = new Schema({
    username: {
        type: String,
        required: true
    },
    cuid: {
        type: String
    },
    status: {
        type: String
    },
    direction: {
        type: String,
        required: true
    },
    site: {
        type: String,
        required: true
    },
    hostname: {
        type: String,
        required: true
    },
    serialNumber: {
        type: String
    },
    osVersion: {
        type: String
    },
    type: {
        type: String
    },
    model: {
        type: String,
        required: true
    },
    sac: {
        type:  String
    },
    clavier: {
        type:  String
    },
    souris: {
        type:  String
    },
    ecran: {
        type:  String
    },
    imprimente: {
        type:  String
    },
    token: {
        type:  String
    },
    cableSecure: {
        type:  String
    },
    filtreSecure: {
        type:  String
    },
    anneeAttr: {
        type: String
    },
},{
    timestamps: true
})

module.exports = mongoose.model('Computer' , computerSchema)


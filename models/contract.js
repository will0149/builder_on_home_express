const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const contractSchema = new Schema({
    userID: String,
    clientID: String,
    serviceID: String,
    detail: String,
    price: Number,
    created: { type: Date, default: Date.now },
    updated_date: { type: Date, default: Date.now },
    stateID: String
});

module.exports = mongoose.model('Contract', contractSchema);

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const serviceSchema = new Schema({
    name: String,
    userID: String,
    categoryID: String,
    description: String,
    price: Number,
    active: Boolean,
    created: { type: Date, default: Date.now },
    updated_date: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Service', serviceSchema);
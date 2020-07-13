const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
    name: String,
    age: Number,
    email: String,
    phone_number: String,
    direction: String,
    password: String,
    active: Boolean,
    rating: Number,
    typeID: String,
    created: { type: Date, default: Date.now },
    updated_date: { type: Date, default: Date.now },
});

module.exports = mongoose.model('User', userSchema);

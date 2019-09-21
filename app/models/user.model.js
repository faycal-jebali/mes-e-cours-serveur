const mongoose = require('mongoose');

const UserSchema = mongoose.Schema({
    identity: {
        civility: String,
        lastname: String,
        firstname: String,
        birthday: Date,
        familysituation: String,
        // image: String
    },
    address: {
        country: String,
        city: String,
        address: String,
        zip: String
    },
    contact: {
        mobile: String,
        telephone: String,
        email: String,
        password: String,
    },
    createdate: Date,
    role: Array
});

module.exports = mongoose.model('User', UserSchema);
const mongoose = require('mongoose');

const CategorySchema = mongoose.Schema({
    title: String,
    description: String,
    parent: Array,
    createdate: Date,
});

module.exports = mongoose.model('Category', CategorySchema);
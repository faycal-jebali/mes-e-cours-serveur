const mongoose = require('mongoose');

const FormationShema = mongoose.Schema({
    trainer: Array,
    statut: String,
    title: String,
    description: String,
    buttonText: String,
    img: String,
    price: String,
    promotionPrice: String,
    categoriesId: String | Number,
    chapiters: Array,
});

module.exports = mongoose.model('Formation', FormationShema);
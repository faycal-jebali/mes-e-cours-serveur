const mongoose = require('mongoose');
const lessonSchema = mongoose.Schema({
    title: String,
    description: String,
    video: String,
    id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'child',
    }
});

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
    chapiters: [{
        title: String,
        description: String,
        id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'child',
        },
        lessons: [lessonSchema]
    }],

});

module.exports = mongoose.model('Formation', FormationShema);
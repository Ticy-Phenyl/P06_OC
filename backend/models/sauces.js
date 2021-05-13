const mongoose = require('mongoose');

//const sanitizerPlugin = require('mongoose-sanitizer-plugin');

const sauceSchema = mongoose.Schema({
    userId: { type: String, required: true },
    name: { type: String, required: true },
    manufacturer: { type: String, required: true },
    description: { type: String, required: true },
    mainPepper: { type: String, required: true },
    imageUrl: { type: String, required: true },
    heat: { type: Number, required: true },
    likes: { type: Number, required: false },
    dislikes: { type: Number, required: false },
    userLiked: { type: [String], required: false },
    userDisliked: { type: [String], required: false },
});

//sauceSchema.plugin(sanitizerPlugin);

module.exports = mongoose.model('sauce', sauceSchema);

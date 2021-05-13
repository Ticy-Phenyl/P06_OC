//Modèle user avec mongoose:
const mongoose = require('mongoose');

//Ajout plugin validator:
const uniqueValidator = require('mongoose-unique-validator');

//Création userSchema utilisateur:
const userSchema = mongoose.Schema({
    //Mail unique:
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true }
});

userSchema.plugin(uniqueValidator);

module.exports = mongoose.model('User', userSchema);

const bcrypt = require('bcrypt');

const jwt = require('jsonwebtoken');

const passwordValidator = require('password-validator');

const User = require('../models/user')

var schema = new passwordValidator();
//Spécificités pr password:
schema
    .is().min(8)
    .is().max(20)
    .has().uppercase()
    .has().lowercase()
    .has().digits(2)
    .has().not().spaces()
    .is().not().oneOf(['Passw0rd', 'Password123', 'PassWord123']);


//Création d'un nouveau compte utilisateur
exports.signup = (req, res, next) => {
    if (!schema.validate(req.body.password)) {
        return res.status(400).json({ error: 'Veuillez entrer un mot de passe valide !' });
    } else if (schema.validate(req.body.password)) {
        bcrypt
            .hash(req.body.password, 10)
            .then((hash) => {
                const user = new User({
                    email: req.body.email,
                    password: hash,
                });
                user
                    .save()
                    .then(() => res.status(201).json({ message: 'Un nouvel Utilisateur a été créé' }))
                    .catch((error) => res.status(400).json({ error }))
            })
            .catch((error) => res.status(500).json({ error }));
    }
};

//Connexion à un compte existant:
exports.login = (req, res, next) => {
    //Trouver l'utilisateur via le mail enregistré:
    User.findOne({ email: req.body.email })
        .then((user) => {
            //test user= false instead of !user:
            //si utilisateur inconnu:
            if (!user) {
                return res.status(404).json({ error: 'Cet utilisateur est inconnu' });
            }
            //Vérification du mdp:
            bcrypt
                .compare(req.body.password, user.password)
                .then((valid) => {
                    //si mdp ko:
                    if (!valid) {
                        return res.status(401).json({ error: 'Votre mot de passe est incorrect' });
                    }
                    //si mdp ok:
                    res.status(200).json({
                        userId: user._id,
                        token: jwt.sign(
                            { userId: user._id }, 'RANDOM_TOKEN_SECRET', { expiresIn: '24h' }
                        ),
                    });
                })
                .catch((error) => res.status(500).json({ error }));
        })
        .catch((error) => res.status(500).json({ error }));
};

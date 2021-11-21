//Création router contenant les fctns des différentes routes pour les sauces (la logique métier est dans contoller/sauces.js):

//Ajout Express pr utiliser son Router:
const express = require('express');
//Appel du Routeur:
const router = express.Router();

//Import du controller pr associer les fctns aux routes:
const saucesCtrl = require('../controllers/sauces');

//Middleware auth pr sécuriser les routes:
const auth = require('../middleware/auth');
//Middleware multer pr la config des img:
const multer = require('../middleware/multer-config');


//Déclaration des routes pr créer une sauce:
router.post('/', auth, multer, saucesCtrl.createSauce);
//Route pr les likes/dislikes:
router.post('/:id/like', auth, multer, saucesCtrl.likeSauce);
//Route pr modifier une sauce (via son id):
router.put('/:id', auth, multer, saucesCtrl.updateSauce);
//Route pr supprimer une sauce (via son id):
router.delete('/:id', auth, saucesCtrl.deleteSauce);
//Route pr récupérer une sauce:
router.get('/:id', auth, saucesCtrl.getOneSauce);
//Route pr récupérer l'ensemble des sauces:
router.get('/', auth, saucesCtrl.getAllSauces);

module.exports = router;
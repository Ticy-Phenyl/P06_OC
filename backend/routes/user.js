//Création route pour la partie user:
//Appel d'Express:
const express = require('express');

//Création Router via Express:
const router = express.Router();

//Importation bouncer pr éviter bruteforce (pbté d'add une whitelist):
const bouncer = require('express-bouncer')(10000, 600000, 3);

//Importation du Controller:
const userCtrl = require('../controllers/user');

//Création des routes (création et login user):
router.post('/signup', userCtrl.signup);
router.post('/login', bouncer.block, userCtrl.login);

module.exports = router;

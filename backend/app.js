const express = require('express'); //Framework basé sur Node.js



const mongoose = require('mongoose'); //Plugin pr se connecter à la database MongoDB

const path = require('path'); //Plugin qui sert à l'upload des images

const helmet = require('helmet'); //Module permettant de sécuriser les requêtes http, d'éviter de détourner les clics, etc

//const nocache = require('nocache'); //Module empêchant la mise en cache


//Routes:
//Route sauces:
const saucesRoutes = require('./routes/sauces');

//Route user:
const userRoutes = require('./routes/user');


//Module dotenv pr masquer les infos de connexion MongoDB:
//require('dotenv').config();


//Connexion à MongoDB en utilisant .env (masquer mdp):
mongoose.connect("mongodb+srv://UserAlpha:Rand0mizeMe@cluster0.n5ira.mongodb.net/myFirstDatabase?retryWrites=true&w=majority", {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
    .then(() => console.log('Réussite de la connexion à MongoDB'))
    .catch(() => console.log('Echec de la connexion à MongoDB'))


//Création application Express:
const app = express();

//BodyParser utilisation: 
app.use(express.urlencoded({
    extended: true
}));
app.use(express.json());


app.use((req, res, next) => {
    //partage ressources depuis n'importe quelle origine:
    res.setHeader('Access-Control-Allow-Origin', '*');
    //headers utilisés pr donner l'autorisation:
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    //métodes autorisées pr requêtes http:
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
});



//Helmet pr -------------------------:
app.use(helmet());
//Nocache pr éviter mise en cache du navigateur:
//app.use(nocache());

//Middleware permettant le chargement des images:
app.use('/images', express.static(path.join(__dirname, 'images')));

//Route dédiée aux utilisateurs:
app.use('/api/auth', userRoutes);
//Route dédiée aux sauces:
app.use('/api/sauces', saucesRoutes);


//Export application Express pr utilisation dans server.js:
module.exports = app;


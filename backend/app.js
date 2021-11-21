const express = require('express'); //Express
const mongoose = require('mongoose'); //Plugin pr se connecter à la database MongoDB
const path = require('path'); //Plugin qui sert à l'upload des images
const helmet = require('helmet'); //Module permettant de sécuriser les requêtes http, d'éviter de détourner les clics, etc
require('dotenv').config(); //déclaration dotenv


//Routes:
//Route sauces:
const saucesRoutes = require('./routes/sauces');
//Route user:
const userRoutes = require('./routes/user');

//Connexion à MongoDB en utilisant .env:
mongoose.connect(`mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@cluster0.n5ira.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
})
    .then(() => console.log('Réussite de la connexion à MongoDB'))
    .catch(() => console.log('Echec de la connexion à MongoDB'));

//Création application Express:
const app = express();

//BodyParser utilisation: 
app.use(express.urlencoded({
    extended: true
}));
app.use(express.json());

//CORS:
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


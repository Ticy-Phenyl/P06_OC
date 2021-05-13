//Middleware permettant de vérifier que l'utilisateur est bien identifié avant d'autoriser l'envoi des requêtes:

const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
    try {
        //Récupération token:
        const token = req.headers.authorization.split(' ')[1];
        //Vérification que le token correspond:
        const decodedToken = jwt.verify(token, 'RANDOM_TOKEN_SECRET');
        //Vérification que l'id correspond au token décodé:
        const userId = decodedToken.userId;
        //Cas où les datas ne matchent pas avec celles de la database:
        if (req.body.userId && req.body.userId !== userId) {
            throw 'Cet utilisateur est inconnu';
        } else { //Cas où les datas matchent:
            next();
        }
    } catch (error) { //Problème d'authentification:
        res.status(401).json({
            error: new Error('Erreur de requête')
        })
    }
};

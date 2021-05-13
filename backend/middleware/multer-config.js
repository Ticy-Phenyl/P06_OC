//Importation multer qui permet de gérer les fichiers entrants dans les requêtes http: 
const multer = require('multer');

//Types MIME selon format img:
const MIME_TYPES = {
    'image/jpg': 'jpg',
    'image/jpeg': 'jpg',
    'image/png': 'png'
};


//Configuration destination enregistrement des img + rename:
const storage = multer.diskStorage({
    destination: (req, file, callback) => {
        callback(null, 'images');
    },
    filename: (req, file, callback) => {
        //Génération nveau nom avec suppression des espaces et remplacements par des _:
        const name = file.originalname.split(' ').join('_');
        const extension = MIME_TYPES[file.mimetype];
        //Appel callback, null = pas d'erreur et création filename sur le mode NomDateduJour.extension:
        callback(null, name + Date.now() + '.' + extension);
    }
});

//Export du module auquel on ajoute l'objet storage et précision via methode single que l'objet est unique et qu'il s'agit d'une img:
module.exports = multer({ storage }).single('image');



const Sauce = require('../models/sauces');

const fs = require('fs');


//Création d'une nouvelle sauce:

exports.createSauce = (req, res, next) => {
    const sauceObject = JSON.parse(req.body.sauce);

    //Creation d'une sauce:
    const sauce = new Sauce({
        ...sauceObject,
        //Modification url img pr l'avoir dynamique:
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`,
        likes: 0,
        dislikes: 0,
        usersLiked: [],
        usersDisliked: []
    });

    sauce
        .save()
        .then(() => res.status(201).json({ message: 'Nouvelle sauce ajoutée' }))
        .catch((error) => res.status(400).json({ error }));
};


//Modifier une sauce:
exports.updateSauce = (req, res, next) => {
    const sauceObject = req.file
        ? {
            ...JSON.parse(req.body.sauce),
            imageUrl: `${req.protocol}://${req.get("host")}/images/${req.file.filename
                }`,
        }
        : { ...req.body };
    if (req.file) {
        Sauce.findOne({ _id: req.params.id })
            .then((sauce) => {
                const filename = sauce.imageUrl.split("/images/")[1];
                fs.unlink(`images/${filename}`, () => {
                    Sauce.updateOne(
                        { _id: req.params.id },
                        { ...sauceObject, _id: req.params.id }
                    )
                        .then(() => {
                            res.status(200).json({ message: "Sauce mise à jour!" });
                        })
                        .catch((error) => {
                            res.status(400).json({ error: error });
                        });
                });
            })
            .catch((error) => {
                res.status(500).json({ error });
            });
    } else {
        Sauce.updateOne(
            { _id: req.params.id },
            { ...sauceObject, _id: req.params.id }
        )
            .then(() => res.status(200).json({ message: "Sauce modifiée !" }))
            .catch((error) => res.status(400).json({ error }));
    }
};


//Supprimer une sauce:
exports.deleteSauce = (req, res, next) => {
    //Récupération de l'item et de son image à supprimer:
    Sauce.findOne({ _id: req.params.id })
        .then((sauce) => {
            const filename = sauce.imageUrl.split('/images')[1];
            //Appel de unlink pr supprimer l'image:
            fs.unlink(`images/${filename}`, () => {
                //Suppression de l'item sélectionné:
                Sauce.deleteOne({ _id: req.params.id })
                    .then(() => res.status(200).json({ message: 'Suppression réalisée' }))
                    .catch((error) => res.status(400).json({ error }));
            });
        })
        .catch((error) => res.status(500).json({ error }));
};


//Récupérer une sauce spécifique via son id :
exports.getOneSauce = (req, res, next) => {
    Sauce.findOne({ _id: req.params.id })
        .then((sauce) => res.status(200).json(sauce))
        .catch((error) => res.status(404).json({ error }));
};

//Récupérer toutes les sauces de la dataBase:
exports.getAllSauces = (req, res, next) => {
    Sauce.find()
        .then((sauces) => res.status(200).json(sauces))
        .catch((error) => res.status(404).json({ error }));
};

//Like/dislike une sauce:
exports.likeSauce = (req, res, next) => {
    switch (req.body.like) {
        //Côté front cancel like = 0
        case 0:
            Sauce.findOne({ _id: req.params.id })
                .then((sauce) => {
                    if (sauce.usersLiked.find((user) => user === req.body.userId)) {
                        Sauce.updateOne(
                            { _id: req.params.id },
                            {
                                $inc: { likes: -1 },
                                $pull: { usersLiked: req.body.userId },
                                _id: req.params.id,
                            }
                        )
                            .then(() => {
                                res.status(200).json({ message: "Vous avez changé d'avis sur cette sauce" });
                            })
                            .catch((error) => {
                                res.status(400).json({ error: error });
                            });
                    }
                    if (sauce.usersDisliked.find((user) => user === req.body.userId)) {
                        Sauce.updateOne(
                            { _id: req.params.id },
                            {
                                $inc: { dislikes: -1 },
                                $pull: { usersDisliked: req.body.userId },
                                _id: req.params.id,
                            }
                        )
                            .then(() => {
                                res.status(200).json({ message: "Vous avez changé d'avis sur cette sauce" });
                            })
                            .catch((error) => {
                                res.status(400).json({ error: error });
                            });
                    }
                })
                .catch((error) => {
                    res.status(404).json({ error: error });
                });
            break;

        //côté front likes = 1

        case 1:
            Sauce.updateOne(
                { _id: req.params.id },
                {
                    $inc: { likes: 1 },
                    $push: { usersLiked: req.body.userId },
                    _id: req.params.id,
                }
            )




                //Modifier  messages -------------------------


                .then(() => {
                    res
                        .status(200)
                        .json({ message: "Merci ! Votre avis a été pris en compte" });
                })
                .catch((error) => {
                    res.status(400).json({ error: error });
                });
            break;

        //Côté front => dislikes = -1
        case -1:
            Sauce.updateOne(
                { _id: req.params.id },
                {
                    $inc: { dislikes: 1 },
                    $push: { usersDisliked: req.body.userId },
                    _id: req.params.id,
                }
            )
                .then(() => {
                    res
                        .status(200)
                        .json({ message: "Merci ! Votre avis a été pris en compte!" });
                })
                .catch((error) => {
                    res.status(400).json({ error: error });
                });
            break;
        default:
            console.error("Erreur de destination");
    }
};
const FormationModel = require('../models/formation.model.js');

// Create and Save a new Formation
exports.create = (req, res) => {
    // Validate request
    if (!req.body) {
        return res.status(400).send({
            message: "Formation content can not be empty"
        });
    }
    console.log('req formation :: ', req.body);
    const formationData = {
        statut: req.body.statut,
        title: req.body.title,
        description: req.body.description,
        price: req.body.price,
        promotionPrice: req.body.promotionPrice,
        categoriesId: req.body.categoriesId,
        chapiters: req.body.chapiters,
        buttonText: 'Button',
        img: req.body.image,
    };
    // Create a Formation
    const formation = new FormationModel(formationData);

    // Save Formation in the database
    formation.save()
        .then(data => {
            res.send(data);
        }).catch(err => {
            res.status(500).send({
                message: err.message || "Some error occurred while creating the formation."
            });
        });
};

// Retrieve and return all formations from the database.
exports.findAll = (req, res) => {
    FormationModel.find()
        .then(formations => {
            res.send(formations);
        }).catch(err => {
            res.status(500).send({
                message: err.message || "Some error occurred while retrieving formations."
            });
        });
};

// Find a single formation with a id
exports.findOne = (req, res) => {
    const idFormation = req.params.id;
    FormationModel.findById(idFormation)
        .then(formation => {
            if (!formation) {
                return res.status(404).send({
                    message: "formation not found with id " + idFormation
                });
            }
            res.send(formation);
        }).catch(err => {
            if (err.kind === 'ObjectId') {
                return res.status(404).send({
                    message: "formation not found with id " + idFormation
                });
            }
            return res.status(500).send({
                message: "Error retrieving formation with id " + idFormation
            });
        });
};

// Update a formation identified by the ID in the request
exports.update = (req, res) => {
    // Validate Request
    if (!req.body) {
        return res.status(400).send({
            message: "formation content can not be empty"
        });
    }
    const idFormation = req.params.id;
    const formationData = {
        statut: req.body.statut,
        title: req.body.title,
        description: req.body.description,
        price: req.body.price,
        promotionPrice: req.body.promotionPrice,
        categoriesId: req.body.categoriesId,
        chapiters: req.body.chapiters,
        buttonText: 'Button',
        img: req.body.image,
    };
    // Find formation and update it with the request body
    FormationModel.findByIdAndUpdate(
            idFormation,
            formationData, { new: true }
        )
        .then(formation => {
            if (!formation) {
                return res.status(404).send({
                    message: "formation not found with id " + idFormation
                });
            }
            res.send(formation);
        }).catch(err => {
            if (err.kind === 'ObjectId') {
                return res.status(404).send({
                    message: "formation not found with id " + idFormation
                });
            }
            return res.status(500).send({
                message: "Error updating formation with id " + idFormation
            });
        });
};

// Delete a formation with the specified id in the request
exports.delete = (req, res) => {
    const idFormation = req.params.id
    FormationModel.findByIdAndRemove(idFormation)
        .then(formation => {
            if (!formation) {
                return res.status(404).send({
                    message: "Formation not found with id " + idFormation
                });
            }
            res.send({ message: "Formation deleted successfully!" });
        }).catch(err => {
            if (err.kind === 'ObjectId' || err.name === 'NotFound') {
                return res.status(404).send({
                    message: "Formation not found with id " + idFormation
                });
            }
            return res.status(500).send({
                message: "Could not delete Formation with id " + idFormation
            });
        });
};
const Bcrypt = require("bcryptjs");

const UserModel = require('../models/user.model.js');

// Create and Save a new User
exports.create = (req, res) => {
    // Validate request
    if (!req.body) {
        return res.status(400).send({
            message: "User content can not be empty"
        });
    }

    console.log('req User :: ', req.body);
    const identity = req.body.identity;
    req.body.contact.password = Bcrypt.hashSync(req.body.contact.password, 10);
    identity.birthday = new Date();
    const userData = {
        identity: identity,
        address: req.body.address,
        contact: req.body.contact,
        createdate: new Date(),
        role: req.body.role,
    };
    // Create a User
    const user = new UserModel(userData);



    // Save User in the database
    user.save()
        .then(data => {
            res.send(data);
        }).catch(err => {
            res.status(500).send({
                message: err.message || "Some error occurred while creating the User."
            });
        });
};

// Retrieve and return all users from the database.
exports.findAll = (req, res) => {
    UserModel.find()
        .then(users => {
            res.send(users);
        }).catch(err => {
            res.status(500).send({
                message: err.message || "Some error occurred while retrieving users."
            });
        });
};

// Find a single user with a userId
exports.findOne = (req, res) => {
    const idUser = req.params.id;
    UserModel.findById(idUser)
        .then(user => {
            if (!user) {
                return res.status(404).send({
                    message: "User not found with id " + idUser
                });
            }

            user.contact.password = '';
            res.send(user);
        }).catch(err => {
            if (err.kind === 'ObjectId') {
                return res.status(404).send({
                    message: "User not found with id " + idUser
                });
            }
            return res.status(500).send({
                message: "Error retrieving user with id " + idUser
            });
        });
};

exports.attachTraining = (req, res) => {
    // Validate Request
    if (!req.body) {
        return res.status(400).send({
            message: "formation content can not be empty"
        });
    }
    const idUser = req.body.user;
    const idTraining = req.body.training;

    // Find User and Attach new Training to him
    return UserModel.findOneAndUpdate(idUser, { $push: { attached: idTraining } }, () => {
        console.log('Training Attached succufly!!!!!!!');
    });


    // const idFormation = req.params.id;
    // const formationData = {
    //     trainer: req.body.trainer,
    //     statut: req.body.statut,
    //     title: req.body.title,
    //     description: req.body.description,
    //     price: req.body.price,
    //     promotionPrice: req.body.promotionPrice,
    //     categoriesId: req.body.categoriesId,
    //     chapiters: req.body.chapiters,
    //     buttonText: 'Button',
    //     img: req.body.image,
    // };
    // Find formation and update it with the request body
    // FormationModel.findByIdAndUpdate(
    //         idFormation,
    //         formationData, { new: true }
    //     )
    //     .then(formation => {
    //         if (!formation) {
    //             return res.status(404).send({
    //                 success: false,
    //                 message: "formation not found with id " + idFormation,
    //             });
    //         }
    //         res.send({
    //             success: true,
    //             message: "Formation updated successfully!",
    //             data: { id: idFormation }
    //         });
    //     }).catch(err => {
    //         if (err.kind === 'ObjectId') {
    //             return res.status(404).send({
    //                 success: false,
    //                 message: "formation not found with id " + idFormation
    //             });
    //         }
    //         return res.status(500).send({
    //             success: false,
    //             message: "Error updating formation with id " + idFormation
    //         });
    //     });
};
// Find a single user with a userId
exports.getCurrentUser = (req, res) => {
    const idUser = req.params.id;
    UserModel.findById(idUser)
        .then(user => {
            if (!user) {
                return res.status(404).send({
                    message: "User not found with id " + idUser
                });
            }
            delete user.contact.password;
            res.send(user);
        }).catch(err => {
            if (err.kind === 'ObjectId') {
                return res.status(404).send({
                    message: "User not found with id " + idUser
                });
            }
            return res.status(500).send({
                message: "Error retrieving user with id " + idUser
            });
        });
};

// Update a user identified by the ID in the request
exports.update = (req, res) => {
    // Validate Request
    if (!req.body) {
        return res.status(400).send({
            message: "User content can not be empty"
        });
    }
    const idUser = req.params.id;
    const identity = req.body.identity;
    identity.birthday = new Date();
    req.body.contact.password = Bcrypt.hashSync(req.body.contact.password, 10);
    // Find user and update it with the request body
    UserModel.findByIdAndUpdate(idUser, {
            $set: {
                role: req.body.role,
                identity: req.body.identity,
                address: req.body.address,
                contact: req.body.contact
            }
        }, { new: true })
        .then(user => {
            if (!user) {
                return res.status(404).send({
                    message: "User not found with id " + idUser
                });
            }
            res.send(user);
        }).catch(err => {
            if (err.kind === 'ObjectId') {
                return res.status(404).send({
                    message: "User not found with id " + idUser
                });
            }
            return res.status(500).send({
                message: "Error updating user with id " + idUser
            });
        });
};

// Delete a user with the specified userId in the request
exports.delete = (req, res) => {
    const idUser = req.params.id
    UserModel.findByIdAndRemove(idUser)
        .then(user => {
            if (!user) {
                return res.status(404).send({
                    message: "User not found with id " + idUser
                });
            }
            res.send({ message: "User deleted successfully!" });
        }).catch(err => {
            if (err.kind === 'ObjectId' || err.name === 'NotFound') {
                return res.status(404).send({
                    message: "User not found with id " + idUser
                });
            }
            return res.status(500).send({
                message: "Could not delete user with id " + idUser
            });
        });
};
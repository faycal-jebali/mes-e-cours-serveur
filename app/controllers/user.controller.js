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
    // Find user and update it with the request body
    UserModel.findByIdAndUpdate(idUser, {
            $set: {
                role: ['Customer'],
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
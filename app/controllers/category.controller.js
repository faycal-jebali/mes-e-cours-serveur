const CategoryModel = require('../models/category.model.js');

// Create and Save a new category
exports.create = (req, res) => {
    // Validate request
    if (!req.body) {
        return res.status(400).send({
            message: "category content can not be empty"
        });
    }

    console.log('req category :: ', req.body);
    const categoryData = {
        title: req.body.title,
        description: req.body.description,
        parent: req.body.parent,
        image: req.body.image,
        createdate: new Date(),
    };
    // Create a category
    const category = new CategoryModel(categoryData);


    // Save category in the database
    category.save()
        .then(data => {
            res.send({
                success: true,
                message: "category added successfully!",
                data: { id: data._id }
            });
        }).catch(err => {
            res.status(500).send({
                success: false,
                message: err.message || "Some error occurred while creating the category."
            });
        });
};

// Retrieve and return all categories from the database.
exports.findAll = (req, res) => {
    CategoryModel.find()
        .then(categories => {
            res.send(categories);
        }).catch(err => {
            res.status(500).send({
                message: err.message || "Some error occurred while retrieving categories."
            });
        });
};

// Find a single category with a categoryId
exports.findOne = (req, res) => {
    const id = req.params.id;
    CategoryModel.findById(id)
        .then(category => {
            if (!category) {
                return res.status(404).send({
                    message: "category not found with id " + id
                });
            }
            res.send(category);
        }).catch(err => {
            if (err.kind === 'ObjectId') {
                return res.status(404).send({
                    message: "category not found with id " + id
                });
            }
            return res.status(500).send({
                message: "Error retrieving category with id " + id
            });
        });
};

// Update a category identified by the ID in the request
exports.update = (req, res) => {
    // Validate Request
    if (!req.body) {
        return res.status(400).send({
            success: false,
            message: "category content can not be empty"
        });
    }
    const id = req.params.id;
    // Find category and update it with the request body
    CategoryModel.findByIdAndUpdate(id, {
            $set: {
                title: req.body.title,
                description: req.body.description,
                image: req.body.image,
                parent: req.body.parent
            }
        }, { new: true })
        .then(category => {
            if (!category) {
                return res.status(404).send({
                    success: false,
                    message: "category not found with id " + id
                });
            }
            res.send({
                data: { id: id },
                success: true,
                message: `Category ${id} updated successfully!`
            });
        }).catch(err => {
            if (err.kind === 'ObjectId') {
                return res.status(404).send({
                    success: false,
                    message: "category not found with id " + id
                });
            }
            return res.status(500).send({
                success: false,
                message: "Error updating category with id " + id
            });
        });
};

// Delete a category with the specified categoryId in the request
exports.delete = (req, res) => {
    const id = req.params.id
    CategoryModel.findByIdAndRemove(id)
        .then(category => {
            if (!category) {
                return res.status(404).send({
                    success: false,
                    message: "category not found with id " + id
                });
            }
            res.send({
                success: true,
                message: "category deleted successfully!"
            });
        }).catch(err => {
            if (err.kind === 'ObjectId' || err.name === 'NotFound') {
                return res.status(404).send({
                    success: false,
                    message: "category not found with id " + id
                });
            }
            return res.status(500).send({
                success: false,
                message: "Could not delete category with id " + id
            });
        });
};


exports.upload = (req, res) => {
    if (!req.file) {
        console.log("No file received");
        return res.send({
            success: false
        });

    } else {
        console.log('file received successfully');
        return res.send({
            success: true
        })
    }
};
// Upload File
// app.post('/api/upload', upload.single('photo'), function(req, res) {
//     if (!req.file) {
//         console.log("No file received");
//         return res.send({
//             success: false
//         });

//     } else {
//         console.log('file received successfully');
//         return res.send({
//             success: true
//         })
//     }
// });
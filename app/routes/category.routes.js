module.exports = (app) => {
    const categories = require('../controllers/category.controller.js');
    const multer = require('multer');

    const DIR = './uploads/categories';

    let storage = multer.diskStorage({
        destination: (req, file, cb) => {
            cb(null, DIR);
        },
        filename: (req, file, cb) => {
            cb(null, file.fieldname + '-' + Date.now() + '.' + file.originalname);
        }
    });
    let upload = multer({ storage: storage });

    // Create a new category
    app.post('/api/categories', categories.create);

    // Retrieve all categories
    app.get('/api/categories', categories.findAll);

    // Retrieve a single category with categoryId
    app.get('/api/categories/:id', categories.findOne);

    // Update a category with categoryId
    app.put('/api/categories/:id', categories.update);

    // Delete a category with categoryId
    app.delete('/api/categories/:id', categories.delete);

    // Upload
    app.post('/api/categories/upload', upload.single('photo'), categories.upload);
}
module.exports = (app) => {
    const formations = require('../controllers/formation.controller.js');
    const multer = require('multer');

    const DIR = './uploads/formations';

    let storage = multer.diskStorage({
        destination: (req, file, cb) => {
            cb(null, DIR);
        },
        filename: (req, file, cb) => {
            console.log('req :: ', req.alias);
            cb(null, file.fieldname + '-' + Date.now() + '.' + file.originalname);
            // cb(null, Date.now() + '.mp4');
        }
    });
    let upload = multer({ storage: storage });

    // Create a new Formation
    app.post('/api/formations', formations.create);

    // Retrieve all formations
    app.get('/api/formations', formations.findAll);

    // Retrieve a single Formation with id
    app.get('/api/formations/:id', formations.findOne);

    // Update a Formation with id
    app.put('/api/formations/:id', formations.update);

    // Delete a Formation with id
    app.delete('/api/formations/:id', formations.delete);

    // Upload
    // app.post('/api/formations/upload', upload.single('uploaded'), formations.upload);
}
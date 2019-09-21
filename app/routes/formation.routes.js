module.exports = (app) => {
    const formations = require('../controllers/formation.controller.js');

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
}
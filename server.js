const express = require('express');
const bodyParser = require('body-parser');

const multer = require('multer');
const jwt = require('jsonwebtoken');
const expressJwt = require('express-jwt');
const mongoose = require('mongoose');
const faker = require('faker');
const cors = require('cors');
const _ = require('lodash');

// create express app
const app = express();

const PORT = 4000;
const portFront = 4200;
const USERS = [
    { 'id': 1, 'username': 'jemma' },
    { 'id': 2, 'username': 'paul' },
    { 'id': 3, 'username': 'sebastian' },
    { 'id': 4, 'username': 'faycal.jebali1@gmail.com' },
];

const DIR = './uploads';

let storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, DIR);
    },
    filename: (req, file, cb) => {
        cb(null, file.fieldname + '-' + Date.now() + '.' + file.originalname);
    }
});
let upload = multer({ storage: storage });

// Allow Origin Host
app.use(cors({ origin: `http://localhost:${portFront}` }));

app.use(function(req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', `http://localhost:${portFront}`);
    res.setHeader('Access-Control-Allow-Methods', 'POST');
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
    res.setHeader('Access-Control-Allow-Credentials', true);
    next();
});
app.options('*', cors()) // include before other routes


// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }))

// parse application/json
app.use(bodyParser.json())

// Configuring the database
const dbConfig = require('./config/database.config.js');

mongoose.Promise = global.Promise;

// Connecting to the database
mongoose.connect(dbConfig.url, {
    useNewUrlParser: true
}).then(() => {
    console.log("Successfully connected to the database");
}).catch(err => {
    console.log('Could not connect to the database. Exiting now...', err);
    process.exit();
});

// define a simple route
app.get('/', (req, res) => {
    res.json({ "message": "Welcome to EasyNotes application. Take notes quickly. Organize and keep track of all your notes." });
});

require('./app/routes/note.routes.js')(app);
require('./app/routes/user.routes.js')(app);
require('./app/routes/formation.routes.js')(app);
require('./app/routes/category.routes.js')(app);
const formations = [];

function getFormations() {
    return formations;
}

function getFormation(formationID) {
    // var formation = _.find(formations, function(formation) { return formation; })
    return formations;
}



app.get('/login', (req, res) => {
    res.render('login', { title: 'Connexion' });
});

const fakeUser = { email: 'faycal.jebali1@gmail.com', password: '123' };
var urlencodedParser = bodyParser.urlencoded({ extended: false });
const secret = 'qsdjS12ozehdoIJ123DJOZJLDSCqsdeffdg123ER56SDFZedhWXojqshduzaohduihqsDAqsdq';

app.post('/login', urlencodedParser, (req, res) => {
    console.log('login post', req.body);
    if (!req.body) {
        return res.sendStatus(500);
    } else {
        const user = USERS.find(user => user.username == req.body.email);
        if (!user || req.body.password != 'todo') {
            return res.sendStatus(401);
        } else {
            // iss means 'issuer'
            const myToken = jwt.sign({ iss: 'http://localhost:4000', user: 'Faycal', role: 'admin' }, secret);
            console.log('myToken', myToken);
            res.json(myToken);
        }
        // if (fakeUser.email === req.body.email && fakeUser.password === req.body.password) {
        //     // iss means 'issuer'
        //     const myToken = jwt.sign({ iss: 'http://localhost:4000', user: 'Faycal', role: 'admin' }, secret);
        //     console.log('myToken', myToken);
        //     res.json(myToken);
        // } else {
        //     res.sendStatus(401);
        // }
    }
});

app.post('/api/auth', function(req, res) {
    const body = req.body;
    console.log('Body auth : ', req.body);
    const user = USERS.find(user => user.username == body.username);
    if (!user || body.password != 'todo') return res.sendStatus(401);

    var token = jwt.sign({ userID: user.id }, secret, { expiresIn: '2h' });
    res.send({ token });
});

app.get('/api/mock/users', function(req, res) {
    res.type("json");
    res.send(getUsers());
});

// Upload File
app.post('/api/upload', upload.single('photo'), function(req, res) {
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
});

// listen for requests
app.listen(PORT, () => {
    console.log(`Server is listening on port ${PORT}`);
});
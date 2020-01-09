const express = require('express');
const bodyParser = require('body-parser');

const multer = require('multer');
const jwt = require('jsonwebtoken');
const expressJwt = require('express-jwt');
const mongoose = require('mongoose');
const faker = require('faker');
const cors = require('cors');
const _ = require('lodash');
const Bcrypt = require("bcryptjs");

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
const UserModel = require('./app/models/user.model.js');
const idUser = '5d8937139a94a222b84b76e4';

function checkAuth(email, password) {
    return UserModel.findOne({ 'contact.password': password, 'contact.email': email })
        .then(user => {
            console.log('user :: ', user);
            if (!user) {
                return false;
            } else {
                return user;
            }
        });
}


app.get('/login', (req, res) => {
    res.render('login', { title: 'Connexion' });
});

const fakeUser = { email: 'faycal.jebali1@gmail.com', password: '123' };
var urlencodedParser = bodyParser.urlencoded({ extended: false });
const secret = 'qsdjS12ozehdoIJ123DJOZJLDSCqsdeffdg123ER56SDFZedhWXojqshduzaohduihqsDAqsdq';

app.post('/api/auth', async function(req, res) {
    const body = req.body;
    console.log('Body auth : ', req.body);
    // const user = USERS.find(user => user.username == body.username);
    // if (!user || body.password != 'todo') return res.sendStatus(401);
    try {
        var user = await UserModel.findOne({ 'contact.email': body.username }).exec();
        if (!user) {
            return res.status(400).send({ message: "The username does not exist" });
        }
        if (!Bcrypt.compareSync(body.password, user.contact.password)) {
            return res.status(400).send({ message: "The password is invalid" });
        }
        var token = jwt.sign({ userID: user._id }, secret, { expiresIn: '2h' });
        res.send({
            token: token,
            userData: user
        });
    } catch (error) {
        res.status(500).send(error);
    }
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
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
// Allow Origin Host
app.use(cors({
    origin: `http://localhost:${portFront}`,
}));

app.use(function(request, response, next) {
    request.setHeader('Access-Control-Allow-Origin', `http://localhost:${portFront}`);
    request.setHeader('Access-Control-Allow-Methods', 'POST');
    request.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
    request.setHeader('Access-Control-Allow-Credentials', true);
    next();
});
app.options('*', cors()); // include before other routes

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({
    extended: true
}));

// parse application/json
app.use(bodyParser.json());
require('./app/routes/note.routes.js')(app);
require('./app/routes/user.routes.js')(app);
require('./app/routes/formation.routes.js')(app);
require('./app/routes/category.routes.js')(app);

const UserModel = require('./app/models/user.model.js');
// Configuring the database
const dbConfig = require('./config/database.config.js');
const PORT = 4000;
const portFront = 4200;
const DIR = './uploads';

let storage = multer.diskStorage({
    destination: (request, file, cb) => {
        cb(null, DIR);
    },
    filename: (request, file, cb) => {
        cb(null, file.fieldname + '-' + Date.now() + '.' + file.originalname);
    },
});
let upload = multer({
    storage: storage,
});

mongoose.Promise = global.Promise;
// Connecting to the database
mongoose.connect(dbConfig.url, {
    useNewUrlParser: true,
}).then(() => {
    console.log("Successfully connected to the database");
}).catch(err => {
    console.log('Could not connect to the database. Exiting now...', err);
    process.exit();
});

// define a simple route
app.get('/', (request, response) => {
    request.json({
        "message": "Welcome to E-learning App",
    });
});

app.get('/login', (request, response) => {
    request.render('login', {
        title: 'Connexion',
    });
});

// const idUser = '5d8937139a94a222b84b76e4';
function checkAuth(email, password) {
    return UserModel.findOne({
            'contact.password': password,
            'contact.email': email,
        })
        .then(user => {
            console.log('user :: ', user);
            if (!user) {
                return false;
            }
            return user;
        });
}

const secret = 'qsdjS12ozehdoIJ123DJOZJLDSCqsdeffdg123ER56SDFZedhWXojqshduzaohduihqsDAqsdq';

app.post('/api/auth', async function(request, response) {
    const body = request.body;
    console.log('Body auth : ', request.body);
    try {
        var user = await UserModel.findOne({
            'contact.email': body.username,
        }).exec();

        if (!user) {
            return response.status(400).send({
                message: "The username does not exist",
            });
        }
        if (!Bcrypt.compareSync(body.password, user.contact.password)) {
            return response.status(400).send({
                message: "The password is invalid",
            });
        }
        var token = jwt.sign({
            userID: user._id,
        }, secret, {
            expiresIn: '2h',
        });
        response.send({
            token: token,
            userData: user,
        });
    } catch (error) {
        request.status(500).send(error);
    }
});

app.get('/api/mock/users', function(request, response) {
    request.type("json");
    request.send(getUsers());
});

// Upload File
app.post('/api/upload', upload.single('uploaded2'), function(request, response) {
    if (!request.file) {
        return response.send({
            success: false,
        });
    }
    console.log('file received successfully');
    return response.send({
        success: true,
    });
});

// listen for requests
app.listen(PORT, () => {
    console.log(`Server is listening on port ${PORT}`);
});
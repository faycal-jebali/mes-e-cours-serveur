const express = require('express')
const bodyParser = require('body-parser');
const multer = require('multer');
const jwt = require('jsonwebtoken');
const expressJwt = require('express-jwt');
const mongoose = require('mongoose');
const faker = require('faker');
const cors = require('cors');
const _ = require('lodash');

// const upload = multer();
const app = express()
const PORT = 4000;
const portFront = 4200;

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

const formations = [];

// create application/json parser
var jsonParser = bodyParser.json();

// create application/x-www-form-urlencoded parser
var urlencodedParser = bodyParser.urlencoded({ extended: false });
const secret = 'qsdjS12ozehdoIJ123DJOZJLDSCqsdeffdg123ER56SDFZedhWXojqshduzaohduihqsDAqsdq';
app.use(bodyParser.json());
app.use(expressJwt({ secret: secret }).unless({
    path: [
        '/',
        '/api/auth',
        '/login',
        '/formations',
        '/upload',
        '/api/upload'
    ]
}, ));

// app.use(expressJwt({ secret: secret }).unless({ path: ['/'] }));
app.use('/public', express.static("public")); //declarer les statiques
app.set(`views`, `./views`); // declarer le dossier des interfaces EJS
app.set(`view engine`, `ejs`);

/**
 * Connection MongoDB en ligne
 * MLAB.com
 */
mongoose.connect('mongodb://souladaUser:Sd01234560@ds119060.mlab.com:19060/coursenligne', { useNewUrlParser: true });
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'Connection error: can\'t connect to DB'));
db.once('open', () => {
    console.log('Connected to DB');
});

app.use(function(error, req, res, next) {
    // Won't get here, because Express doesn't catch the above error
    res.json({ message: error.message });
});


/**
 * Formation
 * Création Schema
 */
const formationShema = mongoose.Schema({
    statut: String,
    title: String,
    description: String,
    buttonText: String,
    img: String,
    price: String,
    promotionPrice: String,
    categoriesId: String | Number,
    chapiters: Array,
});

/**
 * Formation
 * Modéle Mongoose
 */
const Formation = mongoose.model('Formation', formationShema);

/**
 * Get Liste Formations
 */
app.get('/api/formations', function(req, res) {
    Formation.find((err, formations) => {
        if (err) {
            console.error('could not retrieve formations from DB');
            res.sendStatus(500);
        } else if (formations) {
            res.type("json");
            res.send(formations);
        }
    })
});

/**
 * Ajouter une nouvelle Formation
 */
app.post('/api/formation', (req, res) => {
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
    const formationDocument = new Formation(formationData);
    var idF = 0;
    formationDocument.save((err, savedFormation) => {
        if (err) {
            console.error('savedFormation Error :', err);
        } else {
            console.log('savedFormation Sucess :', savedFormation);
        }
        idF = savedFormation._id;
        console.log('FORMATION Inserée ID :: ', idF);
        if (idF !== 0) {
            var data = {
                success: true,
                message: "Produit ajouté ID 15",
                data: idF
            };
            // Adds header
            res.setHeader('custom_header_name', 'abcde');
            // responds with status code 200 and data
            res.status(200).json(data);
        }
    });
});

app.get('/api/formations/categorie/:id', function(req, res) {
    const categorieID = req.params.id;
    res.type("json");
    res.send(getFormationByCategorie(categorieID));
});
app.get('/api/formations', function(req, res) {
    Formation.find((err, formations) => {
        if (err) {
            console.error('could not retrieve formations from DB');
            res.sendStatus(500);
        } else if (formations) {
            res.type("json");
            res.send(formations);
        }
    })
});
app.get('/api/formations/:id', function(req, res) {
    const formationID = req.params.id;
    Formation.findById(formationID, function(err, formation) {
        if (err)
            res.send(err);
        res.type("json");
        res.send(formation);
    });
});

function getFormations() {
    return formations;
}

function getFormation(formationID) {
    // var formation = _.find(formations, function(formation) { return formation; })
    return formations;
}

function getFormationByCategorie(categorieID) {
    var listeByCategiorie = _.find(formations, function(formation) { return formation.categorieId == categorieID; })
    return listeByCategiorie;
}


function getUser(idUser) {
    var userData = _.find(users, function(user) { return user._id == idUser; })
    return userData;
}
/********************UTILISATREURS */

/**
 * User
 * Création Schema
 */
const userShema = mongoose.Schema({
    identity: {
        civility: String,
        lastname: String,
        firstname: String,
        birthday: Date,
        familysituation: String,
        // image: String
    },
    address: {
        country: String,
        city: String,
        address: String,
        zip: String
    },
    contact: {
        mobile: String,
        telephone: String,
        email: String,
        password: String,
    },
    createdate: Date,
    role: Array
});

/**
 * User Collection
 * Modéle Mongoose
 */
const UserModel = mongoose.model('User', userShema);


/**
 * Get Liste Users
 */
app.get('/api/users', function(req, res) {
    UserModel.find((err, users) => {
        if (err) {
            console.error('could not retrieve formations from DB');
            res.sendStatus(500);
        } else if (users) {
            res.type("json");
            res.send(users);
        }
    })
});

/**
 * Get Liste Users
 */
app.get('/api/user/:id', function(req, res) {
    const idUser = req.params.id;
    UserModel.find({ '_id': idUser }, (err, users) => {
        if (err) {
            console.error('could not retrieve formations from DB');
            res.sendStatus(500);
        } else if (users) {
            res.type("json");
            res.send(users);
        }
    })
});
/**
 * Add New User
 */
app.post('/api/user', (req, res) => {
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
    const dbUserDocument = new UserModel(userData);
    var idDoc = 0;
    dbUserDocument.save((err, dbUserSaved) => {
        if (err) {
            console.error('dbUserSaved Error :', err);
        } else {
            console.log('dbUserSaved Sucess :', dbUserSaved);
        }
        idDoc = dbUserSaved._id;
        console.log('User added ID :: ', idDoc);
        if (idDoc !== 0) {
            var data = {
                success: true,
                message: `User is added ID ${idDoc}`,
                data: idDoc
            };
            // Adds header
            res.setHeader('custom_header_name', 'abcde');
            // responds with status code 200 and data
            res.status(200).json(data);
        }
    });
});

function runUpdate(playerObj) {
    return new Promise((resolve, reject) => {
        //you update code here
        Users.findOneAndUpdate({ _id: gameId }, { $set: { role: ['sssssssssssssssssssssssss'] } }, { new: true })
            .then((result) => resolve())
            .catch((err) => reject(err));
    });
}
/**
 * Update User
 */
app.put('/api/user/:id', (req, res) => {
    const idUser = req.params.id;
    const identity = req.body.identity;
    identity.birthday = new Date();
    new Promise((resolve, reject) => {
        UserModel.findOneAndUpdate({ _id: idUser }, { $set: { role: ['Customer'], identity: req.body.identity, address: req.body.address, contact: req.body.contact } }, { new: true })
            .then((result) => {
                var data = {
                    success: true,
                    message: `User is added ID ${idUser}`,
                    data: idUser
                };
                res.status(200).json(data);
                resolve();
            })
            .catch((err) => {
                var data = {
                    success: false,
                    message: err,
                    data: idUser
                };
                // TODO 
                // get ERROR CODE Auto
                res.status(500).json(data);
                reject(err);
            });
    });

});

/**************** */

const TODOS = [
    { 'id': 1, 'user_id': 1, 'name': "Get Milk", 'completed': false },
    { 'id': 2, 'user_id': 1, 'name': "Fetch Kids", 'completed': true },
    { 'id': 3, 'user_id': 2, 'name': "Buy flowers for wife", 'completed': false },
    { 'id': 4, 'user_id': 3, 'name': "Finish Angular JWT Todo App", 'completed': false },
];
const USERS = [
    { 'id': 1, 'username': 'jemma' },
    { 'id': 2, 'username': 'paul' },
    { 'id': 3, 'username': 'sebastian' },
    { 'id': 4, 'username': 'faycal.jebali1@gmail.com' },
];


function getUsers() {
    return USERS;
}


app.get('/login', (req, res) => {
    res.render('login', { title: 'Connexion' });
});

const fakeUser = { email: 'faycal.jebali1@gmail.com', password: '123' };

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

app.listen(PORT, function() {
    console.log(`Angular JWT Todo API Server listening on port ${PORT}!`)
});

/******** */

function getTodos(userID) {
    var todos = _.filter(TODOS, ['user_id', userID]);
    return todos;
}

function getTodo(todoID) {
    var todo = _.find(TODOS, function(todo) { return todo.id == todoID; })
    return todo;
}
app.get('/api/todos', function(req, res) {
    res.type("json");
    res.send(getTodos(req.user.userID));
});
app.get('/api/todos/:id', function(req, res) {
    var todoID = req.params.id;
    res.type("json");
    res.send(getTodo(todoID));
});
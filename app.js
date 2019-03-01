const _ = require('lodash');
const express = require('express')
const app = express()
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const expressJwt = require('express-jwt');

var cors = require('cors');
// Allow Origin Host
app.use(cors({ origin: 'http://localhost:1013' }));

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
];

const formations = [];
  for (let i = 1; i <= 10; i++) {
      const formation = {
        id: i,
        title: `Formations compléte développement web ${i}`,
        description: 'Some quick example text to',
        buttonText: 'Button',
        img: 'https://mdbootstrap.com/img/Photos/Horizontal/Nature/4-col/img%20(34).jpg',
        prix: 200,
        prixPromotion: 10,
        categorieId: 1,
    };
    formations.push(formation);
  }

function getTodos(userID) {
    var todos = _.filter(TODOS, ['user_id', userID]);

    return todos;
}

function getTodo(todoID) {
    var todo = _.find(TODOS, function(todo) { return todo.id == todoID; })
    return todo;
}

function getUsers() {
    return USERS;
}

function getFormations() {
    return formations;
}

function getFormation(formationID) {
    var formation = _.find(formations, function(formation) { return formation.id == formationID; })
    return formation;
}

function getFormationByCategorie(categorieID) {
    var listeByCategiorie = _.find(formations, function(formation) { return formation.categorieId == categorieID; })
    return listeByCategiorie;
}


// create application/json parser
var jsonParser = bodyParser.json();
// create application/x-www-form-urlencoded parser
var urlencodedParser = bodyParser.urlencoded({ extended: false });
const secret = 'qsdjS12ozehdoIJ123DJOZJLDSCqsdeffdg123ER56SDFZedhWXojqshduzaohduihqsDAqsdq';
app.use(bodyParser.json());
app.use(expressJwt({ secret: secret }).unless({ path: ['/api/auth'] }));

app.get('/', function(req, res) {
    res.send('Angular JWT Todo API Server')
});
app.post('/api/auth', function(req, res) {
    const body = req.body;

    const user = USERS.find(user => user.username == body.username);
    if (!user || body.password != 'todo') return res.sendStatus(401);

    var token = jwt.sign({ userID: user.id }, secret, { expiresIn: '2h' });
    res.send({ token });
});
app.get('/api/todos', function(req, res) {
    res.type("json");
    res.send(getTodos(req.user.userID));
});
app.get('/api/formations', function(req, res) {
    res.type("json");
    res.send(getFormations());
});
app.get('/api/formations/categorie/id', function(req, res) {
    const categorieID = req.params.id;
    res.type("json");
    res.send(getFormationByCategorie(categorieID));
});
app.get('/api/formations/id', function(req, res) {
    const formationID = req.params.id;
    res.type("json");
    res.send(getFormation(formationID));
});
app.get('/api/todos/:id', function(req, res) {
    var todoID = req.params.id;
    res.type("json");
    res.send(getTodo(todoID));
});
app.get('/api/users', function(req, res) {
    res.type("json");
    res.send(getUsers());
});

app.listen(4000, function() {
    console.log('Angular JWT Todo API Server listening on port 4000!')
});
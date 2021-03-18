// Import express
const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
// Setup server port
const { database, port, environment } = require('./config/index');


// Initialize the app
let app = express();

// Configure bodyparser to handle post requests
// for parsing application/xwwww-form-urlencoded
app.use(bodyParser.urlencoded({
  extended: true
}));
// for parsing application/json
app.use(bodyParser.json());

app.use(express.static(path.join(__dirname, 'public')));

// api routes
const apiRoutes = require('./api/route/apiRoute');
apiRoutes(app);

// configure template engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'app/view'));

// app routes
app.get('/', (req, res) => {
  // sur la route '/' on affiche le rendu de la page app/view/index.ejs
  res.render('index');
});
app.get('/map', (req, res) => { res.render('map') });
app.get('/P1', (req, res) => { res.render('P1') });
app.get('/P2', (req, res) => { res.render('P2') });
app.get('/P3', (req, res) => { res.render('P3') });
app.get('/P4', (req, res) => { res.render('P4') });


// Connect to postgresql and set connection variable

// Launch app to listen to specified port
app.listen(port, function () {
  console.log(
    `
    Running carthageo app on port ${port} in environment ${environment}.
    Database config is: ${database}.

    App running there http://localhost:3000/
    Api running here http://localhost:3000/api
    `
  );
});

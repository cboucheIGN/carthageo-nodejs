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
// // for parsing application/json
app.use(bodyParser.json());

// je peux acceder par le navigateur a tous le fichier de mon
// repertoire public
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
app.get('/exo', (req, res) => { res.render('exoleaflet') });


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

// Import express
const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');

const { Pool } = require("pg");
const pool = new Pool({
  user: "postgres",
  host: "localhost",
  database: "olympic_games",
  password: "postgres",
  port: 5432
});

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

//Je peux acceder par le navigateur à tous les fichiers de mon répertoire public
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
app.get('/events', (req, res) => { res.render('events') });

app.get('/quizz', (req, res) => { res.render('quizz') });

app.get('/exo2', (req, res) => { res.render('chart') });

app.get('/testcarto', (req, res) => { res.render('testCarto') });

app.get("/recherche", (req, res) => {
  const sql = "SELECT * FROM json_athlete";
  pool.query(sql, [], (err, result) => {
    if (err) {
      return console.error(err.message);
    }
    res.render("recherche", { model: result.rows });
  });
});

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

'use strict';

const medalController = require('../controller/medalController');

const dbcontroller = require('../controller/dbcontroller');

module.exports = function(app) {

  app.route('/api/post/:table')
    .post(dbcontroller.listPost);


//Ici pour exécuter du fetch en mode POST (envoie de donnée du client vers le serveur). Notez le mot clé 'post', et aussi qu'on appelle une nouvelle fonction dans databaseController
  // app.route('/api/bdd/search')
  // .post(databaseController.listPost);


};

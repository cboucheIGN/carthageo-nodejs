'use strict';

const medalController = require('../controller/medalController');
const databaseController = require('../controller/databaseController');

module.exports = function(app) {

  app.route('/api/medal/:id')
    .get(medalController.read);

  app.route('/api/medal/search')
    .post(medalController.search);

  app.route('/api/bdd/:table')
    .get(databaseController.list);

  //Ici pour exécuter du fetch en mode POST (envoie de donnée du client vers le serveur).
  // Notez le mot clé 'post', et aussi qu'on appelle une nouvelle fonction dans databaseController
  app.route('/api/bdd/search')
    .post(databaseController.listPost);

};

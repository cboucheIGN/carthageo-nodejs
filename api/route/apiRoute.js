'use strict';

const medalController = require('../controller/medalController');
const databaseController = require('../controller/databaseController');
const databaseOlympics = require('../controller/databaseOlympics');

module.exports = function(app) {

  app.route('/api/medal/:id')
    .get(medalController.read);

  app.route('/api/medal/search')
    .post(medalController.search);

  // app.route('/api/bdd/:table')
  //   .get(databaseController.list);

  app.route('/api/bdd/:table')
    .get(databaseOlympics.list);

  //Ici pour exécuter du fetch en mode POST (envoie de donnée du client vers le serveur). Notez le mot clé 'post', et aussi qu'on appelle une nouvelle fonction dans databaseController
  app.route('/api/bdd/toto')
    .post(databaseOlympics.listPost);
};

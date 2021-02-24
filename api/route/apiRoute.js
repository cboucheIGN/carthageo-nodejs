'use strict';

const medalController = require('../controller/medalController');

module.exports = function(app) {

  app.route('/api/medal/:id')
    .get(medalController.read);

  app.route('/api/medal/search')
    .post(medalController.search);

};

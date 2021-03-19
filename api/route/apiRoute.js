'use strict';

const dbcontroller = require('../controller/dbcontroller');

module.exports = function(app) {

  app.route('/api/post/:table')
    .post(dbcontroller.listPost);

};

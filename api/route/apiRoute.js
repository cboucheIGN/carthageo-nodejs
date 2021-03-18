'use strict';

const databaseController = require('../controller/databaseController');

module.exports = function(app) {
    app.route('/api/sport')
        .post(databaseController.getMedalBySport)
};



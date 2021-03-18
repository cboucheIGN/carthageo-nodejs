'use strict';

const config = require('../../config');
const pgp = require('pg-promise') ({}); // eslint-disable-line
const db = pgp(config.database); // eslint-disable-line

exports.getMedalBySport = function(req, res) {

    var code = req.body.code;

    let sql = "SELECT * FROM med_spt_gh WHERE country_id ="+code;
    db.any(sql)
        .then((data) => {
            res.json(data);
        })
        .catch((error) => {
            res.send(error);
        })
}

'use strict';

const config = require('../../config');
const pgp = require('pg-promise')({});
const db = pgp(config.database);
const date = 1896


exports.list = function (req, res){
  const table = req.params.table;
  // // checking error Function
  //check(req, res);
  if(table == 'country'){
    return country(req, res);
  }
}

const premiereparticipation = function(req, res){
  let sql = "SELECT * FROM country WHERE (first_participation <= " + date + " AND last_participation > " + date + ");"
    .then((data) => {
      const result = data.map((item) => {
        return {
          type : 'Feature',
          propertie : {
            id: item.id,
            name: item.name,
            first_participation: item.first_participation,
            last_participation: item.last_participation
          }
        }
      });
      res.json({
        type:'FeatureCollection',
        features: result
      });
    })
    .catch((error) => {
      res.send(error);
    })
}

const premiereparticipation = function(date){


}


exports.list = function (req, res){
  const table = req.params.table;
  // // checking error Function
  //check(req, res);
  if(table == 'country'){
    return listPays(req, res);
  }
}

const listPays = function(req, res){
  let sql_pays = 'SELECT id, name FROM country';
    db.any(sql_pays)
    .then((data) => {
      const result = data.map((item) => {
        return {
          type : 'Feature',
          propertie : {
            id: item.id,
            name: item.name,
          }
        }
      });
      res.json({
        type:'FeatureCollection',
        features: result
      });
    })
    .catch((error) => {
      res.send(error);
    })
}

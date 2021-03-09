'use strict';

const config = require('../../config');
const pgp = require('pg-promise')({});
const db = pgp(config.database);



exports.list = function (req, res){
  const table = req.params.table;
  // // checking error Function
  //check(req, res);
  if(table == 'atheles'){
    return listAtheles(req, res);
  }
}

const listAtheles = function(req, res){
  let sql_athlete = 'SELECT id, name, gender, country_id FROM athele';
    db.any(sql_athlete)
    .then((data) => {
      const result = data.map((item) => {
        return {
          type : 'Feature',
          propertie : {
            id: item.id,
            name: item.name,
            gender: item.gender
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

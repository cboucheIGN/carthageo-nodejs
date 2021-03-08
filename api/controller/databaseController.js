'use strict';

const config = require('../../config');
const pgp = require('pg-promise')({});
const db = pgp(config.database);

// const TABLES = [
//   'athlete',
//   'olympiad',
//   'event'
// ]

// const check = function(req, res){
//   const table = req.params.table;
//   if(TABLES.find((t) => t === table)){
//     continue;
//   }else{
//     res.send("La table " + table + " n'existe pas");
//   }
// }


exports.list = function(req, res){
  const table = req.params.table;
  // check(req, res);
  if (table == 'olympiad') {
    return listLivres(req, res);
  }
}

const listLivres = function(req, res){
  let sql = "SELECT city, year, season FROM olympiad";
  db.any(sql)
    .then((data) => {
      const result = data.map((item) => {
        return {
          type : 'Feature',
          propertie : {
            ville: item.city,
            annee: item.year,
            saison: item.season
          }
        }
      });
      res.json({
        type: 'FeatureCollection',
        features: result
      });
    })
    .catch((error) => {
      res.send(error);
    })
}








//

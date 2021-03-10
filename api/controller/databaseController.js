'use strict';

const config = require('../../config');
const pgp = require('pg-promise')({});
const db = pgp(config.database);

exports.list = function(req, res){
  const table = req.params.table;
  // return joMedSports(req, res);
  // check(req, res);
  if (table == 'jomedgeom') {
    return joMed(req, res);
  }else if (table == 'jomedsportgeom'){
    return joMedSports(req, res);
  }
}

var annee = 1952
var saison = "'Summer'"
var sport = "'Boxing'"


const joMed = function(req, res){
  let sql = "SELECT * FROM jomedgeom INNER JOIN countryjson ON jomedgeom.code = countryjson.code WHERE year =" + annee + "AND season LIKE " + saison;
  db.any(sql)
    .then((data) => {
      const result = data.map((item) => {
        return {
          type : 'Feature',
          properties : {
            code: item.code,
            year: item.year,
            season: item.season,
            mall: item.mall,
            mg: item.mg,
            ms: item.ms,
            mb: item.mb
          },
          geometry: item.geometry
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

const joMedSports = function(req, res){
  let sql = "SELECT * FROM jomedsportgeom INNER JOIN countryjson ON jomedsportgeom.code = countryjson.code WHERE year =" + annee + "AND season LIKE " + saison + "AND sport LIKE " + sport;
  db.any(sql)
    .then((data) => {
      const result = data.map((item) => {
        return {
          type : 'Feature',
          properties : {
            code: item.code,
            year: item.year,
            season: item.season,
            mall: item.mall,
            mg: item.mg,
            ms: item.ms,
            mb: item.mb,
            sport: item.sport
          },
          geometry: item.geometry
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

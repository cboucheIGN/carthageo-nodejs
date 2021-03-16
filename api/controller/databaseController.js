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

exports.joMedAll = function(req, res){
  console.log(req.body.anneeNouv)
  let sql = "SELECT * FROM jomedgeom INNER JOIN countryjsonid ON jomedgeom.code = countryjsonid.code  AND year = " + req.body.anneeNouv + " AND season LIKE '" + req.body.saisNouv + "' LEFT JOIN countrysoc ON jomedgeom.code = countrysoc.cod ORDER BY "+ req.body.medNouv + " DESC --AND sport LIKE 'Boxing'  "  ;
  db.any(sql)
    .then((data) => {
      const result = data.map((item) => {
        return {
          type : 'Feature',
          properties : {
            code: item.code,
            name: item.name,
            year: item.year,
            season: item.season,
            mall: item.mall,
            mg: item.mg,
            ms: item.ms,
            mb: item.mb,
            soc: item.soc,
            boy80: item.boy80,
            boy84: item.boy84,
            exbloc: item.exbloc
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

var annee = 1980
var saison = "'Summer'"
var sport = "'Boxing'"


const joMed = function(req, res){
  let sql = "SELECT * FROM jomedgeom INNER JOIN countryjson ON jomedgeom.code = countryjson.code  AND year =  AND season LIKE 'Summer' LEFT JOIN countrysoc ON jomedgeom.code = countrysoc.cod  --AND sport LIKE 'Boxing'  "  ;
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
            soc: item.soc,
            boy80: item.boy80,
            boy84: item.boy84
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

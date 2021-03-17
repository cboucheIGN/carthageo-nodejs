'use strict';

const config = require('../../config');
const pgp = require('pg-promise')({});
const db = pgp(config.database);

exports.list = function(req, res){
  const table = req.params.table;
  // return joMedSports(req, res);
  // check(req, res);
  if (table == 'paystop') {
    return paysTop(req, res);
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

exports.paysTop = function(req, res){
  
  let sql = "SELECT sport, sum(med_sport) AS med FROM ath WHERE code LIKE '"+ req.body.paysClick +"' GROUP BY sport ORDER BY med DESC LIMIT 5";
  
  db.any(sql)
    .then((data) => {
      res.json(data);
    })
    .catch((error) => {
      res.send(error);
    })
}

exports.athTab = function(req, res){
  
  let sql = "SELECT name, sum(med_sport) AS med, all_sport, all_country, year FROM ath WHERE code LIKE '"+ req.body.paysClick +"' AND gender ILIKE '%men' GROUP BY name, med_sport, all_sport, all_country, year ORDER BY med DESC LIMIT 10";
  console.log(sql)
  db.any(sql)
    .then((data) => {
      res.json(data);
    })
    .catch((error) => {
      res.send(error);
    })
}

exports.paysGenre = function(req, res){
  
  let sql = "SELECT * FROM genre WHERE code LIKE '"+ req.body.paysClick +"'";
  
  db.any(sql)
    .then((data) => {
      res.json(data);
    })
    .catch((error) => {
      res.send(error);
    })
}




const paysTop = function(req, res){
  
  let sql = "SELECT sport, sum(med_sport) AS med FROM ath WHERE code LIKE 'FIN' GROUP BY sport ORDER BY med DESC LIMIT 5";
  
  db.any(sql)
    .then((data) => {
      const result = data.map((item) => {
        return {
          type : 'Feature',
          properties : {
            sport: item.sport,
            med: item.med
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

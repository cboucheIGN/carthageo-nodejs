'use strict';

const config = require('../../config');
const pgp = require('pg-promise')({});
const db = pgp(config.database_olympics);
const date = 1932;

exports.list = function (req, res){
  const table = req.params.table;
  console.log(req.params)
  // // checking error Function
  //check(req, res);
  if(table == 'country'){
    console.log(req.params);
    return premiereparticipation(req, res);
  }
}

exports.listcountry = function (req, res){
  console.log(req.body.c)
  let sql = "SELECT id, name, first_participation, last_participation, ST_AsGeoJSON(country.geometry)::json As geometry FROM country WHERE (first_participation <= " + req.body.c + " AND last_participation >= " + req.body.c + ") ORDER BY name;";
  console.log(sql)
    db.any(sql)
    .then((data) => {
      const result = data.map((item) => {
        return {
          type : 'Feature',
          properties : {
            id: item.id,
            name: item.name,
            first_participation: item.first_participation,
            last_participation: item.last_participation
          },
          geometry: item.geometry
        }
      });
      res.json({
        type:'featureatureCollection',
        features: result
      });
    })
    .catch((error) => {
      res.send(error);
    })
}

const premiereparticipation = function(req, res){
  console.log(req.params)
  let sql = "SELECT * FROM country WHERE (first_participation <= " + date + " AND last_participation >= " + date + ") ORDER BY name;";
  console.log(sql)
    db.any(sql)
    .then((data) => {
      const result = data.map((item) => {
        return {
          type : 'feature',
          propertie : {
            id: item.id,
            name: item.name,
            first_participation: item.first_participation,
            last_participation: item.last_participation
          }
        }
      });
      res.json({
        type:'featureatureCollection',
        features: result
      });
    })
    .catch((error) => {
      res.send(error);
    })
}




const searchdate = function(req, res){
  console.log(req.params)
  let sql = "SELECT * FROM country WHERE (first_participation <= " + date + " AND last_participation >= " + date + ") ORDER BY name;";
  console.log(sql)
    db.any(sql)
    .then((data) => {
      const result = data.map((item) => {
        return {
          type : 'feature',
          propertie : {
            id: item.id,
            name: item.name,
            first_participation: item.first_participation,
            last_participation: item.last_participation
          }
        }
      });
      res.json({
        type:'featureatureCollection',
        features: result
      });
    })
    .catch((error) => {
      res.send(error);
    })
}



// exports.listcountry = function (req, res){
//   console.log(req.body.c)
//   let sql = "SELECT * FROM country WHERE (first_participation <= " + req.body.c + " AND last_participation >= " + req.body.c + ") ORDER BY name;";
//   console.log(sql)
//     db.any(sql)
//     .then((data) => {
//       const result = data.map((item) => {
//         return {
//           type : 'feature',
//           propertie : {
//             id: item.id,
//             name: item.name,
//             first_participation: item.first_participation,
//             last_participation: item.last_participation
//           }
//         }
//       });
//       res.json({
//         type:'featureatureCollection',
//         features: result
//       });
//     })
//     .catch((error) => {
//       res.send(error);
//     })
// }
exports.medal_track = function(req, res){
  let sql = "SELECT * FROM medaller_country WHERE olympiad_id ="+ req.body.hello+" ORDER BY gold DESC,silver DESC, bronze DESC";
  db.any(sql)
    .then((data) => {
      const result = data.map((item) => {
        return {
          type : 'feature',
          propertie : {
            olympiad: item.olympiad_id,
            country_id: item.country_id,
            country: item.name,
            gold: item.gold,
            silver: item.silver,
            bronze: item.bronze,
            geometry:  item.geometry
          }
        }
      });
      res.json({
        type:'featureatureCollection',
        features: result
      });
    })
    .catch((error) => {
      res.send(error);
    })
}

exports.medal_track2 = function(req, res){
  console.log("il est passé par ici !")
  let sql = "SELECT * FROM medaller_country WHERE medaller_country.name = '"+ req.body.hola +"' ORDER BY olympiad_id";
  console.log(sql);
  db.any(sql)
    .then((data) => {
      const result = data.map((item) => {
        return {
          type : 'feature',
          propertie : {
            olympiad: item.olympiad_id,
            country_id: item.country_id,
            country: item.name,
            gold: item.gold,
            silver: item.silver,
            bronze: item.bronze,
            geometry:  item.geometry
          }
        }
      });
      res.json({
        type:'featureatureCollection',
        features: result
      });
    })
    .catch((error) => {
      res.send(error);
    })
}

exports.searchdate = function(req, res){
  let sql = "SELECT olympiad.year, olympiad.city, olympiad.season, country.name FROM olympiad JOIN country ON olympiad.country_id = country.id";
  db.any(sql)
    .then((data) => {
      const result = data.map((item) => {
        return {
          type : 'feature',
          propertie : {
            year: item.year,
            city: item.city,
            season: item.season,
            country: item.name
          }
        }
      });
      res.json({
        type:'featureatureCollection',
        features: result
      });
    })
    .catch((error) => {
      res.send(error);
    })
}

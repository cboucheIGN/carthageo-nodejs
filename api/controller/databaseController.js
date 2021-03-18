'use strict';

const config = require('../../config');
const pgp = require('pg-promise')({});
const db = pgp(config.database);

// const TABLES = [
//   'livres',
//   'auteurs'
// ]


// const check = function(req, res){
//   const table = req.params.table;
//   if(TABLES.find((t) => t === table)){
//     continue;
//   }else{
//     res.send("La table " + table + " n'existe pas");
//   }
// }


// exports.list = function(req, res){
//   const table = req.params.table;
//   // check(req, res);
//   if (table == 'livres'){
//     return listLivres(req, res);
//   }
// }

// const listLivres = function(req, res){
//   let sql = 'SELECT livre_id, titre, auteur FROM livres';
//   db.any(sql)
//     .then((data) => {
//       const result = data.map((item) => {
//         return {
//           type : 'Feature',
//           propertie : {
//             id: item.livre_id,
//             name: item.titre,
//             auteur: item.auteur
//           }
//         }
//       });
//       res.json({
//         type: 'FeatureCollection',
//         features: result
//       });
//     })
//     .catch((error) => {
//       res.send(error);
//     })
// }


exports.list = function(req, res){
  const table = req.params.table;
  // check(req, res);
  if (table == 'Olympics'){
    return listOlympics(req, res);
  }
}

const listOlympics = function(req, res){
  let sql = "SELECT count(medal)as 'or', c.name, c.geometry FROM medal AS m INNER JOIN athlete AS a ON a.id = m.athlete_id INNER JOIN olympiad AS o ON o.id = m.olympiad_id INNER JOIN country AS c ON a.country_id = c.id WHERE medal ILIKE 'Gold' AND o.season ILIKE 'Summer' AND o.year = 2008 GROUP BY c.name, c.geometry";
  db.any(sql)
    .then((data) => {
      const result = data.map((item) => {
        return {
          type : 'Feature',
          propertie : {
            or: item.or,
            name: item.name,
            geometry: item.geometry
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

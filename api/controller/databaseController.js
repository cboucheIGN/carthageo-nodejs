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


exports.list = function(req, res){
  const table = req.params.table;
  // check(req, res);
  if (table == 'athlete') {
    return listLivres(req, res);
  } else if (table == 'event'){
    return listEvents(req, res);
  }else if (table == 'json'){
    return listjson(req, res);
  }
}

//La fameuse fonction listPost appelée dans apiRoute
exports.listPost = function(req, res){
  //Je récupère ce que j'ai envoyé au serveur dans req.body
  console.log(req.body);
  //Ici : je renvoie quelque chose au client grâce à res.json(). Ici je renvoie req.body (qui correspond à ce que j'ai reçu...)
  res.json(req.body);
}

const listjson = function(req, res){
  // console.log(req.params)
  let sql = 'SELECT * FROM json3';
  db.any(sql)
    .then((data) => {
      const result = data.map((item) => {
        return {
          type : 'Feature',
          properties : {
            id: item.properties.id,
            name: item.properties.name,
            code: item.properties.code,
            pop: item.properties.pop
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

const listEvents = function(req, res){
  //faire une requête sql
  console.log(req.body);
  console.log("Coucou");
}

const listLivres = function(req, res){
  let sql = 'SELECT id, name, gender FROM athlete LIMIT 100';
  db.any(sql)
    .then((data) => {
      const result = data.map((item) => {
        return {
          type : 'Feature',
          propertie : {
            id: item.id,
            name: item.name,
            auteur: item.gender
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








//

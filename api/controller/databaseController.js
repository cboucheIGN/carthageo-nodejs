'use strict';

const config = require('../../config');
const pgp = require('pg-promise')({});
const db = pgp(config.database);

const TABLES = [
  'livres',
  'auteurs'
]

// const check = function(req, res){
//   const table = req.params.table;
//   if(TABLES.find((t) => t === table)){
//     continue;
//   }else{
//     res.send("La table " + table + " n'existe pas");
//   }
// }


/*exports.list = function(req, res){
  const table = req.params.table;
  // check(req, res);
  if (table == 'selection_json'){
    return listPays(req, res);
  }
}*/


exports.list = function(req, res){
  const table = req.params.table;
  // check(req, res);
  if (table == 'athlete') {
    return listLivres(req, res);
  }else if (table == 'json'){
    return listjson(req, res);
  }
  else if (table == 'json_ath') {
    return listjson_ath(req, res);
  }
}

/*function getMedal (event) {
  if (event.target.id = "b_gold") {
    return  query = "SELECT 'Feature' As type, (select row_to_json(t) from (select name, cnt_medal) t) As properties, ST_AsGeoJSON(lg.geometry)::json As geometry FROM (SELECT name,  SUM(gold) AS cnt_medal, geometry FROM public.olympic_games WHERE year = '2012' GROUP BY name, geometry) As lg "
  }
  else if (event.target.id = "b_silver") {
    return  query = "SELECT 'Feature' As type, (select row_to_json(t) from (select name, cnt_medal) t) As properties, ST_AsGeoJSON(lg.geometry)::json As geometry FROM (SELECT name,  SUM(silver) AS cnt_medal, geometry FROM public.olympic_games WHERE year = '2012' GROUP BY name, geometry) As lg "
  }
  else if (event.target.id = "b_bronze") {
    return  query = "SELECT 'Feature' As type, (select row_to_json(t) from (select name, cnt_medal) t) As properties, ST_AsGeoJSON(lg.geometry)::json As geometry FROM (SELECT name,  SUM(bronze) AS cnt_medal, geometry FROM public.olympic_games WHERE year = '2012' GROUP BY name, geometry) As lg "
  }
}

let monElement = document.getElementById("b_gold"); // cible #toto
monElement.addEventListener("click", getMedal);*/

//La fameuse fonction listPost appelée dans apiRoute
exports.listPost = function(req, res){
  //Je récupère ce que j'ai envoyé au serveur dans req.body
  console.log(req.body);
  //Ici : je renvoie quelque chose au client grâce à res.json(). Ici je renvoie req.body (qui correspond à ce que j'ai reçu...)
  res.json(req.body);
}

//DONNES EPREUVES

const listjson = function(req, res){
  let sql = "SELECT * FROM json5 ";
  db.any(sql)
    .then((data) => {
      const result = data.map((item) => {
        return {
          type : 'Feature',
          properties : {
            
            name: item.properties.name,
            cnt_bronze: item.properties.cnt_bronze,
            cnt_silver: item.properties.cnt_silver,
            cnt_gold: item.properties.cnt_gold
            
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

//DONNES ATHLETES

const listjson_ath = function(req, res){
  let sql = "SELECT * FROM json_athlete_rech2 ";
  db.any(sql)
    .then((data) => {
      const result = data.map((item) => {
        return {
          type : 'Feature',
          properties : {
            
            name: item.properties.nom_athlete,
            medal: item.properties.medal,
            city: item.properties.city,
            year: item.properties.year, 
            gender: item.properties.gender,
            epreuve: item.properties.nom_epreuve,
            country: item.properties.name

          
          },
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



exports.athelteSearch = function(req, res) {

  console.log(req.body.year, req.body.nation, req.body.medal);
  let sql = "SELECT * FROM ath_pays2 WHERE name LIKE '"+req.body.nation+"' AND year = "+req.body.year+" AND medal LIKE '"+req.body.medal+"'";
  db.any(sql)
    .then((data) => {
      console.log(data);
      res.json(data);
    })
    .catch((error) => {
      res.send(error);
    })

}

exports.medalCarto = function(req, res) {

  let sql = "SELECT type, "+req.body.medal+" as medal, properties, geometry FROM json_carte_medailles2 WHERE year = "+req.body.year+" AND "+req.body.medal+" > 0";
  console.log(req.body.year, req.body.medal, sql);
  db.any(sql)
  .then((data) => {
    const result = data.map((item) => {
      return {
        type : 'Feature',
        properties : {
          
          name: item.properties.name,
          
          medal: parseInt(item.properties[req.body.medal])

          
        
        },
        geometry: item.geometry

      }
    });
    res.json({
      type: 'FeatureCollection',
      features: result
    });
  })
    /*.then((data) => {
      const result = data.map((item) => {
        return JSON.parse({
          medal: parseInt(item.medal),
          geometry: JSON.parse(item.geojson),
          name: item.name
        });
      });
      res.json(result);
    })*/
    .catch((error) => {
      res.send(error);
    })

}


exports.chartEvol = function(req, res) {

  let sql = "SELECT year, gold, bronze, silver FROM json_carte_medailles WHERE left(SUBSTRING(CAST(properties AS VARCHAR), 23, 20), -2) ILIKE '" + req.body.pays + "' AND (gold > 0 OR silver > 0 OR bronze > 0)";
  console.log(req.body.pays, sql);
  db.any(sql)
  .then((data) => {
    const result = data.map((item) => {
      return {
        type : 'Feature',
        properties : {
          
          gold: item.gold,
          silver: item.silver, 
          bronze: item.bronze,
          year: item.year
          }
      }
    }
    );
    res.json(result)
    console.log(result)

  })
}

const config = require('../../config');
const pgp = require('pg-promise')({});
const db = pgp(config.database);


exports.list = function(req, res){
  const table = req.params.table;

if (table == 'json3'){
    return listjson(req, res);
  }else if (table == 'charto'){
    return listdata(req, res);
  }else if (table == 'sport_country'){
    return listMedalBySportByCountry(req, res);
  }
}

//La fonction listPost appelée dans apiRoute pour récupére la date
exports.listPost = function(req, res){
  //Je récupère ce que j'ai envoyé au serveur dans req.body
  console.log(req.body);
  //Ici : je renvoie quelque chose au client grâce à res.json(). Ici je renvoie req.body (qui correspond à ce que j'ai reçu...)
  return listjson(req,res)
}


/////// Carte principale /////////

const listjson = function(req, res){
  let sql = 'SELECT * FROM json3  WHERE year ='+req.body.c+'';
  console.log(sql);
   //Nom de la table que j'ai créé en SQL dans l'étape précédente
  db.any(sql)
    .then((data) => {
      const result = data.map((item) => {
        return {
          type : 'Feature',
          properties : {
            name: item.properties.name,
            or: item.properties.or,
            year: item.properties.year,
            tot: item.properties.tot
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

/////  Graphiques /////

/////  Graphique Evolution /////

const listdata = function(req, res){
  let sql = 'SELECT * FROM charto '; //Nom de la table que j'ai créé en SQL dans l'étape précédente
  db.any(sql)
    .then((data) => {
      const result = data.map((item) => {
        return {
          type : 'Feature',
          properties : {
            russia: item.properties.russia,
            france: item.properties.france,
            year: item.properties.year,
            usa: item.properties.usa,
            uk: item.properties.uk,
            germany: item.properties.germany
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

/////  Graphique radar /////

const listMedalBySportByCountry = function(req, res){
  console.log('sport_country ');
  let sql = "Select * from sport_country Where sport ILIKE 'Fencing' or sport ILIKE 'Athletics' or sport ILIKE 'Aquatics' or sport ILIKE 'Wrestling' or sport ILIKE 'cycling' "; //Nom de la table que j'ai créé en SQL dans l'étape précédente
  db.any(sql)
    .then((data) => {
      res.json(data);
    })
    .catch((error) => {
      res.send(error);
    })
}

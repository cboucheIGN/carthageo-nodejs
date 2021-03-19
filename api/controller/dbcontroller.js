'use strict';

const config = require('../../config');

const pgb = require('pg-promise')({});

const db = pgb(config.database);


// sortir des sorties spécifiques
exports.listPost = function(req, res){
  const table = req.params.table;
// check(req, res);
  if (table == 'country_medal_type') {
    return listMedal(req, res);
  }else if (table == 'carte'){
    return listeJSON(req, res);
  }else if (table == 'host'){
    return hostJSON(req, res);
  }else if (table == 'medal_pays'){
    return listMedalPays(req, res);
  }else if (table == 'athlete'){
    return listAthlete(req, res);
  }else if (table == 'evenement'){
    return listEvenement(req, res);
  }else if (table == 'epreuve'){
    return listEvent(req, res);
  }else if (table == 'epreuvedisparu'){
    return listEventDisparu(req, res);
  }
}

//liste nouvelles épreuves
const listEvent = function(req, res){
  var listAnnee = ['1896', '1900', '1904', '1908', '1912', '1920','1924','1928','1932','1936','1948','1952','1956','1960','1964','1968','1972','1976','1980','1984','1988','1992','1996','2000','2004','2008','2012']
  //recupere année actuelle et précédente
  var annee = req.body.annee
  var place = listAnnee.indexOf(annee);
  var anneePrecedent = listAnnee[place-1]
  let sql = '';
  if (annee==1896) {
    sql = 'SELECT discipline FROM sport_1896';
  }else{
    sql = 'SELECT discipline FROM sport_'+annee+' WHERE discipline NOT IN(SELECT discipline FROM sport_'+anneePrecedent+') order by discipline'
    console.log('cest la fin')
    console.log(annee)
    console.log(anneePrecedent)

  }
  db.any(sql)
    .then((data) => {
      const result = data.map((item) => {
        return {
          type : 'Feature',
          propertie : {
            discipline: item.discipline
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

//liste épreuves disparus
const listEventDisparu = function(req, res){
  var listAnnee = ['1896', '1900', '1904', '1908', '1912', '1920','1924','1928','1932','1936','1948','1952','1956','1960','1964','1968','1972','1976','1980','1984','1988','1992','1996','2000','2004','2008','2012']
  //recupere année actuelle et précédente
  var annee = req.body.annee
  var place = listAnnee.indexOf(annee);
  var anneePrecedent = listAnnee[place-1]
  let sql = '';
  if (annee==1896) {
    sql = 'SELECT * from table_vide';
  }else{
    sql = 'SELECT discipline FROM sport_'+anneePrecedent+' WHERE discipline NOT IN(SELECT discipline FROM sport_'+annee+') order by discipline';
  }
  db.any(sql)
    .then((data) => {
      const result = data.map((item) => {
        return {
          type : 'Feature',
          propertie : {
            discipline: item.discipline
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


//liste médailles 10 premier pays - Chart.js
const listMedal = function(req, res){
  var annee = req.body.annee
  let sql = 'SELECT * from country_medal_type WHERE year = '+annee+' order by year, gold desc, silver desc, bronze desc Limit 10';
  db.any(sql)
    .then((data) => {
      const result = data.map((item) => {
        return {
          type : 'Feature',
          properties : {
            pays: item.athlete_country_name,
            gold: item.gold,
            silver: item.silver,
            bronze:item.bronze,
            nb:item.count
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

// carte des pays
const listeJSON = function(req, res){
  var annee = parseInt(req.body.annee)
  let sql = 'SELECT * FROM json WHERE first <= '+annee+' and last >= '+annee; //Nom de la table que j'ai créé en SQL dans l'étape précédente
  db.any(sql)
    .then((data) => {
      const result = data.map((item) => {
        return {
          type : 'Feature',
          properties : {
            id: item.properties.id,
            name: item.properties.name,
            code: item.properties.code,
            pop: item.properties.pop,
            first: item.first,
            last: item.last
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

// carte des pays
const hostJSON = function(req, res){
  var annee = parseInt(req.body.annee)
  let sql = 'SELECT * FROM jsonhost WHERE year = '+annee; //Nom de la table que j'ai créé en SQL dans l'étape précédente
  db.any(sql)
    .then((data) => {
      const result = data.map((item) => {
        return {
          type : 'Feature',
          properties : {
            hostcities: item.properties.hostcities,
            countries: item.properties.countries,
            year: item.properties.year
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

// carte des médailles information par pays
const listMedalPays = function(req, res){
  var annee = parseInt(req.body.annee);
  var pays = req.body.pays;
  // let str = "    '  ' "
  // let str = '     \'  \' '
  // let str = ` ajzjea zejaklze '${str}' '  ' `;
  let sql = 'SELECT * FROM medal_pays_join WHERE year = '+annee+' and athlete_country_name = \''+pays+'\'' ; //Nom de la table que j'ai créé en SQL dans l'étape précédente
  db.any(sql)
    .then((data) => {
      const result = data.map((item) => {
        return {
          type : 'Feature',
          properties : {
            pays: item.athlete_country_name,
            gold: item.gold,
            silver: item.silver,
            bronze:item.bronze,
            nb:item.medal
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


// liste des athletes célebres
const listAthlete = function(req, res){

  var annee = parseInt(req.body.annee)
  var athletes = { 1896:"SCHUMANN, Carl",1900:'COOPER, Charlotte',1904:'HOWELL, Matilda Scott',1908:'ANDERSSON, Mauritz',1912:'CALBERG, G.Vilhelm'};
  // const keyValuePair = [["1896", "SCHUMANN, Carl"], ["1900", "COOPER, Charlotte"],["1904", "HOWELL, Matilda Scott"],["1908", "ANDERSSON, Mauritz"],["1912", "CALBERG, G.Vilhelm"]];
  var athlete = athletes[annee]
  // var athletes = ['SCHUMANN, Carl', 'COOPER, Charlotte','HOWELL, Matilda Scott','ANDERSSON, Mauritz','CALBERG, G.Vilhelm','NADI, Nedo','NURMI, Paavo','MIEZ, Georges','MADISON, Helene', 'OWENS, Jesse','BLANKERS-KOEN, Fanny','CHUKARIN, Viktor Ivanovich','KELETI, Agnes','BIKILA, Abebe','LATYNINA, Larisa','CASLAVSKA, Vera','SPITZ, Mark','COMANECI, Nadia','DITYATIN, Aleksandr','SZABO, Ecaterina','OTTO, Kristin','TULA, Derartu','PEREC, Marie-Jose','JAYASINGHE, Susanthika','PHELPS, Michael','BOLT, Usain','PHELPS, Michael']

  let sql = 'SELECT * FROM celebres WHERE year = '+annee; //Nom de la table que j'ai créé en SQL dans l'étape précédente
  db.any(sql)
    .then((data) => {
      const result = data.map((item) => {
        return {
          type : 'Feature',
          properties : {
            name: item.athlete_name,
            annee: item.year,
            country: item.athlete_country_name,
            genre: item.athlete_gender,
            gold: item.gold,
            silver: item.silver,
            bronze: item.bronze,
            discipline: item.discipline,
            event: item.event_name
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

// liste evenement marquant
const listEvenement = function(req, res){

  var annee =req.body.annee
  console.log(annee)

  let sql = 'SELECT evenement FROM evenements_jo WHERE annee = \''+annee+'\''; //Nom de la table que j'ai créé en SQL dans l'étape précédente
  db.any(sql)
    .then((data) => {
      const result = data.map((item) => {
        return {
          type : 'Feature',
          properties : {
            evenement: item.evenement
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

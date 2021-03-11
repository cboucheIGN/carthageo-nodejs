'use strict';

const config = require('../../config');
const pgp = require('pg-promise')({});
const db = pgp(config.database_olympics);
const date = 1896


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











// import des données de medaller pour création de table/


}

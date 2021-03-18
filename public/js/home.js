// var carteTest = L.map('carteTest').setView([51.50, -0.10], 1.5);
//
// var wmsLayer = L.tileLayer.wms(
//   'http://localhost:8080/geoserver/olympics/wms?',
//   {
//     layers: 'olympics:ne_110m_admin_0_countries'
//   }
// ).addTo(carteTest);


//fetch pour la carte teste
fetch('/api/bdd/json')
  .then((response) => response.json())
  .then((json) => {
    console.log('réponse', json.features);
    const result = document.getElementById('result');
    output = '<ul>';
    for (var i = 0; i<json.features.length; i++){
      output += '<li>' + json.features[i].properties.name + ' : <em>' +
      json.features[i].properties.id + '</em></li>'
    }
    output += '</ul>';
    result.innerHTML = output;
  });




// Carte leflet simple
var map = L.map('map').setView([51.50, -0.10], 1.5);
map.createPane('labels');
map.getPane('labels').style.zIndex = 650;

map.getPane('labels').style.pointerEvents = 'none';

var positron = L.tileLayer('https://{s}.basemaps.cartocdn.com/light_nolabels/{z}/{x}/{y}.png', {
        attribution: '©OpenStreetMap, ©CartoDB'
}).addTo(map);

// var positron = L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
//     attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
//     maxZoom: 18,
//     id: 'mapbox/streets-v11',
//     tileSize: 512,
//     zoomOffset: -1,
//     accessToken: 'pk.eyJ1IjoieW91bmctbWk5MCIsImEiOiJja2x1b3JpOHgyMWczMm9ud2R2Z3Bvc2R0In0.-p1MYbzTLB-2kI8ARp_-2Q'
// }).addTo(map);

const url = "http://localhost:8080/geoserver/olympics/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=olympics%3Apays&maxFeatures=50&outputFormat=application%2Fjson"

//création d'un style pour colorer la France en rouge
// const newColorFunction = function(feature) {
//   const name = feature.properties.name;
//   if(name ==='France'){
//     return 'red';
//   }
// }
//
// const newStyle = function(feature) {
//   return{
//       fillColor: newColorFunction(feature)
//   }
// }

//ajouter les pays sur une année


fetch('/api/bdd/json')
  .then((r) => r.json())
  .then((response) =>{L.geoJson(response).addTo(map);
  })


// var geojson = L.geoJson(GeoJsonData, geoJsonOptions).addTo(map);
//
// geojson.eachLayer(function (layer) {
//     layer.bindPopup(layer.feature.properties.name);
// });
//
// map.fitBounds(geojson.getBounds());

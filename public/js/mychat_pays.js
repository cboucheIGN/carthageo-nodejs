function pays(){
  var formepays = document.getElementById('forme_pays').elements["olym_pays"];
  var countrys = [];
  fetch('/api/bdd/track',{
    method : 'post',
    body: JSON.stringify({ hello: "9"}),
    headers: {'Content-Type': 'application/json'}
  })
    .then(req => req.json())
    .then((req) => {
      console.log(req);
      for (var i =0; i < req.features.length;i++){
        countrys += req.features[i].propertie.country;
        var option = document.createElement('option');
        option.innerHTML = req.features[i].propertie.country;
        formepays.appendChild(option);
      }
    console.log(countrys);
  })
}
pays();













//
// // Exo 2 ! USA Dansity Map !
// //Création de Token of mapbox
//
// var mapboxAccessToken = 'pk.eyJ1IjoidGFraWtvdiIsImEiOiJja2x1cTk0Y3AwOWhmMm9wbHk1cGlwbmdhIn0.4IZ_FJBkcBndgp2fdCWaIQ';
//
// var map = L.map('USAMap').setView([37.8, -96], 4);
//
// L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token=' + mapboxAccessToken, {
//     id: 'mapbox/light-v9',
//     attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
//     tileSize: 512,
//
//     zoomOffset: -1,
//     accessToken: 'pk.eyJ1IjoidGFraWtvdiIsImEiOiJja2x1cTk0Y3AwOWhmMm9wbHk1cGlwbmdhIn0.4IZ_FJBkcBndgp2fdCWaIQ'
// }).addTo(map);
//
//
// L.geoJson(statesData).addTo(map);
// function getColor(d) {
//     return d > 1000 ? '#800026' :
//            d > 500  ? '#BD0026' :
//            d > 200  ? '#E31A1C' :
//            d > 100  ? '#FC4E2A' :
//            d > 50   ? '#FD8D3C' :
//            d > 20   ? '#FEB24C' :
//            d > 10   ? '#FED976' :
//                       '#FFEDA0';
// }
//
//
//
//
// function style(feature) {
//     return {
//         fillColor: getColor(feature.properties.density),
//         weight: 2,
//         opacity: 1,
//         color: 'white',
//         dashArray: '3',
//         fillOpacity: 0.7
//     };
// }
//
//
//
// L.geoJson(statesData, {style: style}).addTo(map);
//
// function highlightFeature(e) {
//     var layer = e.target;
//     layer.setStyle({
//         weight: 5,
//         color: '#666',
//         dashArray: '',
//         fillOpacity: 0.7
//     });
//
//     /*if (!L.Browser.ie && !L.Browser.opera && !L.Browser.edge) {
//         layer.bringToFront();
//     }*/
//     info.update(e.target)
// }
//
// function resetHighlight(e) {
//     geojson.resetStyle(e.target);
// }
// function zoomToFeature(e) {
//     map.fitBounds(e.target.getBounds());
// }
// function onEachFeature(feature, layer) {
//     layer.on({
//         //Condition de position de souris
//         mouseover: highlightFeature,
//         mouseout: resetHighlight,
//         click: zoomToFeature
//     });
// }
//
//
//
//
//
// geojson = L.geoJson(statesData, {
//     style: style,
//     onEachFeature: onEachFeature
// }).addTo(map);
//
// // nouveau control vierge
// var info = L.control();
//
//
// info.onAdd = function (map) {
//     this._div = L.DomUtil.create('div', 'info');
//     this.update();
//     return this._div;
// };
//
//
//
// info.update = function(target) {
//     //console.log(target);
//     if(!target){
//         return this._div.innerHTML = `
//         <h4>Mon nouveau control</h4>
//         `;
//     }
//     // this._div.innerHTML = `
//     //     <h4>Densités de population</h4>
//     //     <p>Etat : ${target.feature.properties.name}</p>
//     //     <img src="img/canard.png">
//     //     `;
//     this._div.innerHTML = '<h4>US Population Density</h4>' +  (props ?
//         '<b>' + props.name + '</b><br />' + props.density + ' people / mi<sup>2</sup>'
//         : 'Hover over a state');
// }
// info.addTo(map);
//
// /*
// // method that we will use to update the control based on feature properties passed
// info.update = function (props) {
//     this._div.innerHTML = '<h4>US Population Density</h4>' +  (props ?
//         '<b>' + props.name + '</b><br />' + props.density + ' people / mi<sup>2</sup>'
//         : 'Hover over a state');
// };
//
// info.addTo(map);
// */
//
// var legend = L.control({position: 'bottomright'});
//
// legend.onAdd = function (map) {
//     var div = L.DomUtil.create('div', 'info legend'),
//         grades = [0, 10, 20, 50, 100, 200, 500, 1000],
//         labels = []
//     // loop through our density intervals and generate a label with a colored square for each interval
//     for (var i = 0; i < grades.length; i++) {
//         div.innerHTML +=
//             '<i style="background:' + getColor(grades[i] + 1) + '"></i> ' +
//             grades[i] + (grades[i + 1] ? '&ndash;' + grades[i + 1] + '<br>' : '+');
//         }
//
//     return div;
// };
// legend.addTo(map);
//
//
//
//
//
//
//
//
//
//




// Exo 3 carte Geoserver

//
// var geomap = L.map('geomap').setView([51.505,-0.09], 4);
//
// Données geoserver depuis directement chargé
// var wmsLayer = L.tileLayer.wms(
//     'http://localhost:8080/geoserver/infrastructure/wms?',
//     {
//         layers: 'infrastructure_agregation'
//     }
// ).addTo(geomap);
//

// // Données geoserver via postgreGIS
// var wmsLayer = L.tileLayer.wms(
//     'http://localhost:8080/geoserver/infrastructure/wms?',
//     {
//         layers: 'countries'
//     }
// ).addTo(geomap);
//
// // construction de chemin de url
// const url = "http://localhost:8080/geoserver/infrastructure/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=infrastructure%3Acountries&maxFeatures=50&outputFormat=application%2Fjson"
//
// const newColorFunction = function(feature){
//     const name = feature.properties.name_fr;
//     if (name === 'France'){
//         return 'red';
//     }
// }
//
// const newStyle = function(feature) {
//     return{
//         fillColor: newColorFunction(feature)
//     }
// }
// //importation depuis fiche xml
// fetch(url)
//     .then((response)=> response.json())
//     .then((json) => {
//         console.log(json);
//         L.geoJson(json, {
//             style: newStyle
//         }).addTo(geomap);
//     });

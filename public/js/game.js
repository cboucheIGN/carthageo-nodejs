
// var mymap = L.map('mapid').setView([51.505, -0.09], 13);
//
// L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
//     attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
//     maxZoom: 18,
//     id: 'mapbox/streets-v11',
//     tileSize: 512,
//     zoomOffset: -1,
//     accessToken: 'pk.eyJ1IjoiY2JvdWNoZWlnbiIsImEiOiJja2x1b3BsMTQwMmk1MnZvNmppdHF1NjUyIn0.KNq-KbSgCsLI2rJal-3xSw'
// }).addTo(mymap);
//
// var marker = L.marker([51.5, -0.09]).addTo(mymap);
//
// var circle = L.circle([51.508, -0.11], {
//     color: 'red',
//     fillColor: '#f03',
//     fillOpacity: 0.5,
//     radius: 500
// }).addTo(mymap);
//
//
// var polygon = L.polygon([
//     [51.509, -0.08],
//     [51.503, -0.06],
//     [51.51, -0.047]
// ]).addTo(mymap);
//
// marker.bindPopup("<b>Hello world!</b><br>I am a popup.").openPopup();
// circle.bindPopup("I am a circle.");
// polygon.bindPopup("I am a polygon.");
//
//
// var popup = L.popup();
//
// function onMapClick(e) {
//     popup
//         .setLatLng(e.latlng)
//         .setContent("You clicked the map at " + e.latlng.toString())
//         .openOn(mymap);
// }
//
//
// mymap.on('click', onMapClick);
//
// function createcanard(e){
//     var icone = L.icon({
//         iconUrl: 'canard.png',
//         iconSize: [30,30]
//     });
//     var marker = L.marker(e.latlng, {
//         icon: icone,
//         draggable: true
//     });
//     marker.on('click',function(){marker.remove()});
//     marker.addTo(mymap)
//
// }
//
// mymap.on('click', createcanard);
//

// CARTE JEUX

// function onMapClick(e) {
//     popup
//         .setLatLng(e.latlng)
//         .setContent("You clicked the map at " + e.latlng.toString())
//         .openOn(map);
// }
//
// function createcanard(e){
//     var icone = L.icon({
//         iconUrl: 'canard.png',
//         iconSize: [30,30]
//     });
//     var marker = L.marker(e.latlng, {
//         icon: icone,
//         draggable: true
//     });
//     marker.on('click',function(){marker.remove()});
//     marker.addTo(map)
//
// }
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


// function getState(statename) {
//     for(i=0; i<statesData.features.length; i++){
//         if (statesData.features[i].properties.name == statename) {
//             return statesData.features[i];
//         }
//     }
// }


var map = L.map('mapgame').setView([40, 0], 1.7);


L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
	maxZoom: 19,
	attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map)

const url = 'http://localhost:8080/geoserver/olympics/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=olympics%3Athebestathlete&outputFormat=application%2Fjson'


var elements = document.getElementsByClassName('button-game');
// reponse est declare globlament
var codePays = null;
var poly = null;


for (var i = 0; i < elements.length; i++) {
    elements[i].addEventListener('click', startGame);
    elements[i].addEventListener('mouseover', over);
}


/// Fonction Pop-up qui récupere les données du bouton appeler plus haut
function over(event) {
  if (event == null) {
    return;
  }
  var target = event.target;

//Pour appliquer les evenements du bouton sur les images
  if (target.classList.contains('image')) {
    target = target.parentNode;}

  madiv = document.getElementById("popupmedal");
  madiv.innerHTML = target.getAttribute("data-nom")+
    " a gagné "+
    target.getAttribute("data-medal")+
    " médailles dans la discipline "+
    target.getAttribute("data-sport")
  };

var oldTarget = null;




/// Fonction Jeux
function startGame(event) {
  console.log('envent', event);
  var target = event.target;


  //Pour appliquer les evenements du bouton sur les images
  if (target.classList.contains('image')) {
    target = target.parentNode;
  }

//Pour laisser un effet sur le bouton, on stocke les anciennes target
  if (oldTarget !== null) {
    oldTarget.classList.remove('clicked');
  }

  target.classList.add('clicked');
  codePays = target.value;
  sportIconName = target.getAttribute("data-sport");
  console.log("Réponse: l'utilisateur doit clicker sur le pays ", codePays);

// applique une valeur dans le url pour selectionner la bonne tile
  var newUrl = url + "&CQL_FILTER=id+=+" + codePays;
  fetch(newUrl)
      .then((r) => r.json())
      .then((data) => {
        console.log(data);
        if (poly !== null) {
            poly.remove();
        }
        poly = L.geoJson(data, {color: "#ffffff", opacity: 0, fillOpacity: 0}).addTo(map);
      });


// le nouveau c'est le prochain ancien
  oldTarget = target;
}


//
var sportIconName = "athl";


var LeafIcon = L.Icon.extend({
    options: {
        // shadowUrl: 'img/shadow.png',
        iconSize: [50,50],
        // shadowSize:   [50, 64],
        // // iconAnchor:   [22, 94],
        // shadowAnchor: [4, 62],
        // popupAnchor:  [-3, -76]
    }
});


/// Fonction qui créer les marqueurs
map.on('click',function(e){
  var lat = e.latlng.lat;
  var lon = e.latlng.lng;
  var theMarker = L.marker([lat,lon], {
    icon: new LeafIcon({iconUrl: "img/"+sportIconName+"_rouge-01.png"})
  })

  poly.eachLayer(function(layer) {
    var inside =
      turf.booleanPointInPolygon(
        theMarker.toGeoJSON(),
        layer.toGeoJSON()
      );
    if (inside) {
        theMarker.setIcon(new LeafIcon({iconUrl: "img/"+sportIconName+"_vert-01.png"}));
    }
  });
  theMarker.on('click', function(){theMarker.remove()});
  theMarker.addTo(map)
  });

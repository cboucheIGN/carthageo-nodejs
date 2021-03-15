// alert('Script exoleaflet.js est bien chargé!!!, Merci de votre dévéloppement. '
// setview = latitude, longitude, niv.zoom
var mapboxAccessToken = 'pk.eyJ1IjoidGFraWtvdiIsImEiOiJja2x1cTk0Y3AwOWhmMm9wbHk1cGlwbmdhIn0.4IZ_FJBkcBndgp2fdCWaIQ';
var carte = L.map('carte').setView([20, 0], 2);

// Je créé ma Mapbox du monde à partir d'OpenStreetMap
L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token=' + mapboxAccessToken, {
    id: 'mapbox/light-v9',
    attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
    tileSize: 512,
    zoomOffset: -1
}).addTo(carte);


// Je récupère la variable du menu déroulant pour sortir la liste des pays dans une
var form = document.getElementById("formdate");
form.elements["valuedate"].addEventListener("change", roulant);
var listpays = [];
var LayerGroup = new L.LayerGroup();
var bool = true;
var PaysJSON;
form.elements["valuedate"].value = 1896

// fonction qui va se déclancher au moment de la séléction de la date
function roulant(e){
  var listpays = [];
  console.log(form.elements["valuedate"].value);
  var datechoisi = form.elements["valuedate"].value;
  var choix = {c:datechoisi};

  // va afficher les données qu'il va chercher dans la base de données olympics
  // méthode post permet d'envoyer des requêtes sql
  fetch("/api/bdd/searchcountry",{
    method: 'post',
    body: JSON.stringify(choix),
    headers: {'Content-Type': 'application/json'}
  })
  // then désigne les réponses
  .then(req => req.json())
  .then((r) => {
    if (bool == false){
      // mise à jour
        LayerGroup.removeLayer(PaysJSON);
    }
    // Création des couches
    console.log(LayerGroup);
    PaysJSON = L.geoJSON(r, {
      onEachFeature: onEachFeature,
      style: style,
      mouseover: highlightFeature,
      mouseout: resetHighlight,
    });
    console.log(PaysJSON);
    LayerGroup.addLayer(PaysJSON);
    console.log(LayerGroup);
    LayerGroup.addTo(carte);
    console.log(r)
    for (var i = 0; i<r.features.length; i++){
      pays = r.features[i].properties.name;
      listpays.push(pays);
    }
    console.log(listpays);
    bool = false
  })
}
function onEachFeature(feature, layer) {
    layer.on({
        //Condition de position de souris
        click: displayInfos
    });
}

function getColor(first, last) {
  d = last - first;
    return d <= 4 ? '#ffffcc' :
           d <= 16 ? '#c2e699' :
           d <= 32 ? '#78c679' :
           d <= 64 ? '#31a354' :
          '#006837';
}
function highlightFeature(e) {
    var layer = e.target;
    layer.setStyle({
        weight: 5,
        color: 'blue',
        dashArray: '',
        fillOpacity: 0.7
    });
}

function resetHighlight(e) {
  geojson.resetStyle(e.target);
}

function style(feature) {
    return {
        fillColor: getColor(feature.properties.first_participation, form.elements["valuedate"].value),
        weight: 2,
        opacity: 1,
        color: 'white',
        dashArray: '3',
        fillOpacity: 0.7
    };
}

var popup = L.popup()
function displayInfos(event) {
  console.log(event);
  console.log("Tu as cliqué sur le pays : " + event.target.feature.properties.name + " qui a participé pour la première fois en " + event.target.feature.properties.first_participation + " et a participé pour la dernière fois en " + event.target.feature.properties.last_participation);
  popup
    .setLatLng(event.latlng)
    .setContent("<br>Pays : " + event.target.feature.properties.name + "</br><br>Première participation : " + event.target.feature.properties.first_participation + "</br><br>Dernière participation : " + event.target.feature.properties.last_participation + "</br><br>Durée : " + (event.target.feature.properties.last_participation - event.target.feature.properties.first_participation) + " années</br>" + "<br>En " + form.elements["valuedate"].value + "</br><br>Durée : " + (form.elements["valuedate"].value - event.target.feature.properties.first_participation) + " ans </br>").openOn(carte);
}

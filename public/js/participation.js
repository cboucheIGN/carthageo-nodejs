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

function roulant(e){
  var listpays = [];
  console.log(form.elements["valuedate"].value);
  var datechoisi = form.elements["valuedate"].value;
  var choix = {c:datechoisi};

  fetch("/api/bdd/searchcountry",{
    method: 'post',
    body: JSON.stringify(choix),
    headers: {'Content-Type': 'application/json'}
  })
  .then(req => req.json())
  .then((r) => {
    if (bool == false){
        LayerGroup.removeLayer(PaysJSON);
    }
    console.log(LayerGroup);
    PaysJSON = L.geoJSON(r);
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

//
//
// // Séléction des pays :
// // Ajout du fond de carte monde :
// form.elements["valuedate"].addEventListener("change", selectPays);
//
// function selectPays(e){
//   var PaysSelect = "";
//   console.log(e);
//   console.log(PaysSelect);
//   for (count=0; count<carteMonde.length; count++){
//     console.log(count);
//     console.log(carteMonde[count]);
//     if (carteMonde[count].features.propertie.NAME in listpays){
//       console.log(carteMonde[count]);
//       PaysSelect.push(carteMonde[count]);
//       console.log(PaysSelect);
//     }
//   }
// };
//
// L.geojson(PaysSelect).addTo(carte);

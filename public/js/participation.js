// alert('Script exoleaflet.js est bien chargé!!!, Merci de votre dévéloppement. '
// setview = latitude, longitude, niv.zoom
var mapboxAccessToken = 'pk.eyJ1IjoidGFraWtvdiIsImEiOiJja2x1cTk0Y3AwOWhmMm9wbHk1cGlwbmdhIn0.4IZ_FJBkcBndgp2fdCWaIQ';
var carte = L.map('carte').setView([20, 0], 2);

L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token=' + mapboxAccessToken, {
    id: 'mapbox/light-v9',
    attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
    tileSize: 512,
    zoomOffset: -1
}).addTo(carte);

var form = document.getElementById("formdate");
form.elements["valuedate"].addEventListener("change", roulant);

function roulant(e){
  console.log(form.elements["valuedate"].value);
  var datechoisi = form.elements["valuedate"].value;
  var choix = {c:datechoisi}
  fetch("/api/bdd/searchcountry",{
    method: 'post',
    body: JSON.stringify(choix),
    headers: {'Content-Type': 'application/json'}
  })
  .then(req => req.json())
  .then((r) => {
    const result = document.getElementById('result');
    var output = '<ul>'
    for (var i = 0; i<r.features.length; i++){
      output += '<li>'+ r.features[i].propertie.name + '</em></li>'
    }
    output += '</ul>';
    result.innerHTML = output;
  })
}

// fetch("/api/bdd/searchcountry",{
//   method: 'post',
//   body: JSON.stringify(date),
//   headers: {'Content-Type': 'application/json'}
// })
//     .then((response) => response.json())
//     .then((json) => {
//       console.log(date);
      // const result = document.getElementById('result');
      // var output = '<ul>'
      // for (var i = 0; i<json.features.length; i++){
      //   output += '<li>'+ json.features[i].propertie.name + '</em></li>'
      // }
      // output += '</ul>';
      // result.innerHTML = output;
    // })

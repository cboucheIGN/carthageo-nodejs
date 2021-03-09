// alert('Script exoleaflet.js est bien chargé!!!, Merci de votre dévéloppement. '
// setview = latitude, longitude, niv.zoom
var mymap = L.map('carte').setView([48, 2], 2);
var mapboxAccessToken = 'pk.eyJ1IjoidGFraWtvdiIsImEiOiJja2x1cTk0Y3AwOWhmMm9wbHk1cGlwbmdhIn0.4IZ_FJBkcBndgp2fdCWaIQ';

// importation des cartes leaflet(on doit changer notre propre Token créé sur mapbox)
L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
    attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
    maxZoom: 18,
    id: 'mapbox/streets-v11',
    tileSize: 512,
    zoomOffset: -1,
    // mon propre token // mapbox//username : Takikov
    accessToken:mapboxAccessToken
}).addTo(mymap);


geojson = L.geoJson(statesData, {
    style: style,
    onEachFeature: onEachFeature
}).addTo(map);

// Données geoserver via postgreGIS
var wmsLayer = L.tileLayer.wms(
    'http://localhost:8080/geoserver/infrastructure/wms?',
    {
        layers: 'countries'
    }
).addTo(geomap);

// construction de chemin de url
const url = "http://localhost:8080/geoserver/infrastructure/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=infrastructure%3Acountries&maxFeatures=50&outputFormat=application%2Fjson"


//importation depuis fiche xml
fetch(url)
    .then((response)=> response.json())
    .then((json) => {
        console.log(json);
        L.geoJson(json, {
            style: newStyle
        }).addTo(geomap);
    });

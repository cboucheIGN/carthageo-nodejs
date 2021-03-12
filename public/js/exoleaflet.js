alert('exoleaflet.js est bien chargé !!');
// ici on pourra commencer le tuto leaflet

var startMap = L.map('carte').setView([51.505, -0.09], 8);



L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
    attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
    maxZoom: 18,
    id: 'mapbox/streets-v11',
    tileSize: 512,
    zoomOffset: -1,
    accessToken: 'pk.eyJ1IjoiY2JvdWNoZWlnbiIsImEiOiJja2x1b3BsMTQwMmk1MnZvNmppdHF1NjUyIn0.KNq-KbSgCsLI2rJal-3xSw'
}).addTo(startMap);

var circle = L.circle([51.508, -0.11], {
    color: 'red',
    fillColor: '#f03',
    fillOpacity: 0.1,
    weight: 10,
    radius: 50000
}).addTo(startMap);

circle.bindPopup("<p style='color: red'>I am a circle.</p>");

const style = {
    color: 'red',
    fillColor: '#f03',
    fillOpacity: 0.5,
    weight: 0,
    radius: 5000
};
const coords = [51.508, -0.11];

for (var i=0; i < 10; i++) {
    let newCoords = [51.508 + i * 0.1, -0.11 + i * 0.1];
    L.circle(newCoords, style).addTo(startMap);
}

/* je prepare une nouvelle popup que j'appelle 'popup' */
var popup = L.popup();

// je définie une fonction que je veux joué au click sur la carte
function onMapClick(e) {
    popup
        .setLatLng(e.latlng)
        .setContent("You clicked the map at " + e.latlng.toString())
        .openOn(startMap);
}

// sur la map 'startMap' je lie l'action 'click' à la méthode 'onMapClick'
// startMap.on('click', onMapClick);

// je définie une fonction que je veux joué au click sur la carte
function createCanard(e) {
    console.log('create a canard there', e.latlng);
    var icone = L.icon({
        iconUrl: 'img/canard.png',
        iconSize: [49, 64]
    });
    var marker = L.marker(e.latlng, {
        icon: icone,
        draggable: true
    });
    marker.on('click', function() {marker.remove()});
    marker.addTo(startMap);
}

// sur la map 'startMap' je lie l'action 'click' à la méthode 'onMapClick'
startMap.on('click', createCanard);

///////////////////////////////////////
/// exo 2
///////////////////////////////////////

var mapboxAccessToken = 'pk.eyJ1IjoiY2JvdWNoZWlnbiIsImEiOiJja2x1b3BsMTQwMmk1MnZvNmppdHF1NjUyIn0.KNq-KbSgCsLI2rJal-3xSw';
var map = L.map('usMap').setView([37.8, -96], 4);

L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token=' + mapboxAccessToken, {
    id: 'mapbox/light-v9',
    attribution: 'blabla...',
    tileSize: 512,
    zoomOffset: -1
}).addTo(map);

function colorFunction(d) {
    if (d > 100) {
        return 'green';
    }
    if (d < 100) {
        return 'blue';
    }
}

function styleFunction(feature) {
    return {
        fillColor: colorFunction(feature.properties.density)
    };
}

function highlightFeature(e) {
    var layer = e.target;
    layer.setStyle({
        weight: 5,
        color: '#666',
        dashArray: '',
        fillOpacity: 0.7
    });

    info.update(e.target);
}
function onEachFeature(feature, layer) {
    layer.on({
        mouseover: highlightFeature
    });
}
geojson = L.geoJson(statesData, {
    style: styleFunction,
    onEachFeature: onEachFeature
}).addTo(map);


// nouveau control vierge
var info = L.control();
// initialise le nouveau control lors de l'ajout à la carte
info.onAdd = function(map) {
    this._div = L.DomUtil.create('div', 'info');
    this.update();
    return this._div;
}
info.update = function(target) {
    console.log(target);
    if (!target) {
        return this._div.innerHTML = `
            <h4>Mon nouveau control</h4>
        `;
    }
    this._div.innerHTML = `
        <h4>Mon nouveau control</h4>
        <p>Etat : ${target.feature.properties.name}</p>
    `;
}
// ajout du controle à la carte
info.addTo(map);


L.geoJson(top25data).addTo(map);


var geomap = L.map('geomap').setView([51.505, -0.09], 4);

/*
var wmsLayer = L.tileLayer.wms(
    'http://localhost:8080/geoserver/infrastructure/wms?',
    {
        layers: 'countries'
    }
).addTo(geomap);
*/

// j'enregistre l'adresse

const url = "http://localhost:8080/geoserver/infrastructure/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=infrastructure%3Acountries&outputFormat=application%2Fjson";

const newColorFunction = function(feature) {
    const name = feature.properties.name_fr;
    if (name === 'France') {
        return 'red';
    }
}

const newStyle = function(feature) {
    return {
        fillColor: newColorFunction(feature)
    }
}

fetch(url)
    .then((response) => response.json())
    .then((json) => {
        console.log(json);
        L.geoJson(json, {
            style: newStyle
        }).addTo(geomap);
    });


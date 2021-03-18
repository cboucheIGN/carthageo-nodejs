//alert('exo_leaflet.js est bien chargé!!')

/*
// LEAFLET // 

var mymap = L.map('mymap').setView([51.505, -0.09], 13);

L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
    attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
    maxZoom: 18,
    id: 'mapbox/streets-v11',
    tileSize: 512,
    zoomOffset: -1,
    accessToken: 'pk.eyJ1IjoidGFueWFnZW9tIiwiYSI6ImNrbHVweml0MDBreHkycG8zY2djMDN6dG0ifQ.dA-K7tKA6OZQ7gn6e-9wdQ'
}).addTo(mymap);



var marker = L.marker([51.5, -0.09]).addTo(mymap);
var circle = L.circle([51.508, -0.11], {
    color: 'black',
    fillColor: '#FC533D',
    fillOpacity: 0.5,
    radius: 700
}).addTo(mymap);
var polygon = L.polygon([
    [51.509, -0.08],
    [51.503, -0.06],
    [51.51, -0.047]
]).addTo(mymap);
var popup = L.popup()
    .setLatLng([51.5, -0.09])
    .setContent("I am a standalone popup.")
    .openOn(mymap);
marker.bindPopup("<b>Hello world!</b><br>I am a popup.").openPopup();
circle.bindPopup("I am a circle.");
polygon.bindPopup("I am a polygon.");


/* je prépare une nouvelle popup*/

/*

var popup = L.popup();

//Je définie une fonction que je veux jouer au click sur la carte

function onMapClick(e) {
    popup
        .setLatLng(e.latlng)
        .setContent("You clicked the map at " + e.latlng.toString())
        .openOn(mymap);
}

mymap.on('click', onMapClick);

//creation d'une fonction pour ajouter picto quand click

function createChat(e) {
    console.log('create a cat there', e.latlng);
    var icone = L.icon({
        iconUrl: 'img/cat.jpg',
        iconSize: [50,50]
    });
    var marker = L.marker(e.latlng, {
        icon: icone,
        draggable: true
    });
    marker.on('click', function() {marker.remove()});
    marker.addTo(mymap);
}
mymap.on('click', createChat);


// CARTE CHOROPLETE

var mapboxAccessToken = 'pk.eyJ1IjoidGFueWFnZW9tIiwiYSI6ImNrbHVweml0MDBreHkycG8zY2djMDN6dG0ifQ.dA-K7tKA6OZQ7gn6e-9wdQ';
var usmap = L.map('usmap').setView([37.8, -96], 4);


L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token=' + mapboxAccessToken, {
    id: 'mapbox/light-v9',
    attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
    tileSize: 512,
    zoomOffset: -1
}).addTo(usmap);

L.geoJson(statesData).addTo(usmap);

function getColor(d) {
    return d > 1000 ? '#0c2c84' :
           d > 500  ? '#225ea8' :
           d > 200  ? '#1d91c0' :
           d > 100  ? '#41b6c4' :
           d > 50   ? '#7fcdbb' :
           d > 20   ? '#c7e9b4' :
           d > 10   ? '#edf8b1' :
                      '#ffffd9';
}

function style(feature) {
    return {
        fillColor: getColor(feature.properties.density),
        weight: 2,
        opacity: 1,
        color: 'white',
        dashArray: '3',
        fillOpacity: 0.7
    };
}

L.geoJson(statesData, {style: style}).addTo(usmap);

function highlightFeature(e) {
    var layer = e.target;

    layer.setStyle({
        weight: 5,
        dashArray: '',
        fillOpacity: 0.7
    });
    info.update(e.target)
}
function onEachFeature(feature, layer) {
    layer.on({
        mouseover: highlightFeature,
        mouseout: resetHighlight,
        click: zoomToFeature
    });
}
var geojson = L.geoJson(statesData, {
    style: style,
    onEachFeature: onEachFeature
}).addTo(usmap);


function resetHighlight(e) {
    geojson.resetStyle(e.target);
}

function zoomToFeature(e) {
    usmap.fitBounds(e.target.getBounds());
}

// custom
var info = L.control();
info.onAdd = function (usmap) {
    this._div = L.DomUtil.create('div', 'info'); 
    this.update();
    return this._div;
}
info.update = function (target) {
    console.log(target);
    if (!target) {
        return this._div.innerHTML = `
        <h4>Mon nouveau control </h4>`
        ;
    }
    this._div.innerHTML = `
        <h4>Mon nouveau control </h4>
        <p> Etat: ${target.feature.properties.name}</p>`
        ;
}
info.addTo(usmap);

// custom legend

var legend = L.control({position: 'bottomright'});

legend.onAdd = function (usmap) {

    var div = L.DomUtil.create('div', 'info legend'),
        grades = [0, 10, 20, 50, 100, 200, 500, 1000],
        labels = [];

    for (var i = 0; i < grades.length; i++) {
        div.innerHTML +=
            '<i style="background:' + getColor(grades[i] + 1) + '"></i> ' +
            grades[i] + (grades[i + 1] ? '&ndash;' + grades[i + 1] + '<br>' : '+');
    }

    return div;
};

legend.addTo(usmap);

// L.geoJson(top25data).addTo(mymap);


var wmsLayer = L.tileLayer.wms(
    'http://localhost:8080/geoserver/wms?',
    {
        layers: 'data_infra'
    }
).addTo(mymap);
*/
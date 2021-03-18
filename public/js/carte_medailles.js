//const { json } = require("body-parser");

var mapboxAccessToken = 'pk.eyJ1IjoibWFnZ2llOTgiLCJhIjoiY2tsdW9tZ2dsMjhjMjJvcW05czd2eGhqayJ9.snbJ6nyFtDr7Pfl1zUjNEQ';
var map = L.map('carte_medailles').setView([37.8, -96], 2);

/*L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token=' + mapboxAccessToken, {
    id: 'mapbox/light-v9',
    attribution: '',
    tileSize: 512,
    zoomOffset: -1
}).addTo(map);*/ 

/*fetch('http://localhost:8080/geoserver/olympic_games/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=olympic_games%3Agold_1924&maxFeatures=50&outputFormat=application%2Fjson')
.then(function(response) {
  return console.log(response);
})*/

/*var wmsLayer = L.tileLayer.wms('http://localhost:8080/geoserver/olympic_games/ows?', 
{layers: 'olympic_games:gold_1924'}).addTo(map);*/

var OpenStreetMap_HOT = L.tileLayer('https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png', {
	maxZoom: 19,
	attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, Tiles style by <a href="https://www.hotosm.org/" target="_blank">Humanitarian OpenStreetMap Team</a> hosted by <a href="https://openstreetmap.fr/" target="_blank">OpenStreetMap France</a>'
}).addTo(map);

/*var geojson = L.geoJSON("http://localhost:8080/geoserver/olympic_games/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=olympic_games%3Agold_1924&maxFeatures=50&outputFormat=application%2Fjson").addTo(map);*/

/*function getCentroid (objet) {
    var listCentroids = []
    for (i=0; i<objet.features.length; i++) {
        listCentroids.push(turf.centroid(objet.features[i]))
        return console.log(listCentroids)
            }
}*/

/*function getRadius (objet) {

}*/

var bool = true;
var layerGroup = new L.LayerGroup();
fetch('/api/bdd/json')
    .then((r) => r.json())
    .then((r) => {
      
       function Medal(event) {
           
            if (bool==false) {
                console.log('4');
                layerGroup.clearLayers()}

            
            var jsonGeo = L.geoJson(r);
            layerGroup.addLayer(jsonGeo);
            
            
            var circles = L.geoJson(r,{onEachFeature:function(feature,layer){feature.geometry.type ==='MultiPolygon'; 
            var centroid = turf.centroid(feature); 
            var lon = centroid.geometry.coordinates[0]; 
            var lat = centroid.geometry.coordinates[1];
        
        
            layerGroup.addLayer(L.circleMarker([lat,lon], {color: 'red', radius : 0.5*feature.properties[event.target.id]}));
            
        }})

      
            layerGroup.addTo(map);
            
        bool=false
            }
    
    var bronze = document.getElementById("cnt_bronze")
    var gold = document.getElementById("cnt_gold")
    var silver = document.getElementById("cnt_silver")
    bronze.addEventListener("click", Medal)
    gold.addEventListener("click", Medal)
    silver.addEventListener("click", Medal)
    
    });

     // Je récupère mon formulaire, puis j'écoute l'event submit dessus. Lorsque j'entends l'event, je lance la fonction valide dans laquelle se trouve mon fetch
    /* var formu = document.getElementById('formu');
     formu.addEventListener('change', valide);
 
     function valide(e){
       //j'empêche le comportement par défaut du formulaire
       e.preventDefault();
       //Je récupère ce qu'a écrit l'utilisateur dans le formualaire
       var saisie = formu.elements[""].value;
       //j'insère dans un objet literal ce que je viens de récupérer (ici : la variable saisie)
       data = {hello: saisie}}
 
       //requete fetch qui permet d'envoyer la variable data à mon serveur
       fetch('/api/bdd/search',{
         method: 'post',
         body: JSON.stringify(data),
         headers: {'Content-Type': 'application/json'}
       })
       .then(r => r.json())
       .then((r) => {
         console.log(r);
       })
 
        /*let monElement = document.getElementById("b_gold"); // cible #toto
        monElement.addEventListener("click", getMedal)}


/*getColor(feature.properties.cnt_medal), radius : 0.2*feature.properties.cnt_medal}).addTo(map);
             //L.geoJSON(r).addTo(map);


L.geoJson(statesData).addTo(map);

function getColor(d) {
    return d > 1000 ? '#800026' :
           d > 500  ? '#BD0026' :
           d > 200  ? '#E31A1C' :
           d > 100  ? '#FC4E2A' :
           d > 50   ? '#FD8D3C' :
           d > 20   ? '#FEB24C' :
           d > 10   ? '#FED976' :
                      '#FFEDA0';
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

L.geoJson(statesData, {style: style}).addTo(map);

function highlightFeature(e) {
    var layer = e.target;

    layer.setStyle({
        weight: 5,
        color: '#666',
        dashArray: '',
        fillOpacity: 0.7
    });

    if (!L.Browser.ie && !L.Browser.opera && !L.Browser.edge) {
        layer.bringToFront();
    }
    info.update(layer.feature.properties);
};

function resetHighlight(e) {
    geojson.resetStyle(e.target);
    info.update();
}


function zoomToFeature(e) {
    map.fitBounds(e.target.getBounds());
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
}).addTo(map);

var info = L.control();

info.onAdd = function (map) {
    this._div = L.DomUtil.create('div', 'info'); // create a div with a class "info"
    this.update();
    return this._div;
};

// method that we will use to update the control based on feature properties passed

info.update = function (props) {
    this._div.innerHTML = '<h4>US Population Density</h4>' +  (props ?
    '<b>' + props.name + '</b><br />' + props.density + ' people / mi<sup>2</sup>'
    : 'Hover over a state');}

info.addTo(map);

var legend = L.control({position: 'bottomright'});

legend.onAdd = function (map) {

    var div = L.DomUtil.create('div', 'info legend'),
        grades = [0, 10, 20, 50, 100, 200, 500, 1000],
        labels = [];

    // loop through our density intervals and generate a label with a colored square for each interval
    for (var i = 0; i < grades.length; i++) {
        div.innerHTML +=
            '<i style="background:' + getColor(grades[i] + 1) + '"></i> ' +
            grades[i] + (grades[i + 1] ? '&ndash;' + grades[i + 1] + '<br>' : '+');
    }

    return div;
};

legend.addTo(map);*/



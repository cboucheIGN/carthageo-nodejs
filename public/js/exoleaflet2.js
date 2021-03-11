// alert('exLeaflet.js est bien chargé.')

   
var mapboxAccessToken = 'pk.eyJ1IjoiY2JvdWNoZWlnbiIsImEiOiJja2x1b3BsMTQwMmk1MnZvNmppdHF1NjUyIn0';
var mymap = L.map('mapid').setView([37.8, -96], 4);


L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
    id: 'mapbox/dark-v10',
    attribution: '...',
    tileSize: 512,
    zoomOffset: -1,
    accessToken: 'pk.eyJ1IjoiY2JvdWNoZWlnbiIsImEiOiJja2x1b3BsMTQwMmk1MnZvNmppdHF1NjUyIn0.KNq-KbSgCsLI2rJal-3xSw'

}).addTo(mymap);

var med = "ms"

function  colSoc (soc) {
    if (soc === 'true') {
        return '#ff0000';
    }
}

// function(feature) {
//     const soc = feature.properties.soc;
//     if (soc == 'true') {
//         return {color:'#ff0000'};
//     }
//     else {return {color: '#ffffff'}
// }


const newColorFunction = function(feature) {
    const soc = feature.properties.soc;
    if (soc === 'true') {
        return '#ff0000';
    }
}

const newStyle = function(feature) {
    const soc = feature.properties.soc;
    if (soc) {
        return {
            fillColor: '#ff0000',
            fillOpacity: 0.5,
            weight: 1
        };
    } 
    else {
        return {
            fillColor: '#0000ff',
            fillOpacity: 0.5,
            stroke: false
        }
    }
}


fetch('/api/bdd/jomedgeom')
    .then((r) => r.json())
    .then((r) => {
      L.geoJSON(r,{style: newStyle
      }).addTo(mymap);

      L.geoJson(r,{onEachFeature:function(feature,layer){feature.geometry.type ==='MultiPolygon'; 
        var centroid = turf.centroid(feature); 
        var lon = centroid.geometry.coordinates[0]; 
        var lat = centroid.geometry.coordinates[1];

        var cProp = L.circleMarker([lat,lon], {radius : 1*feature.properties[med]}).addTo(mymap);

        cProp.on({
            mouseover: highlightFeature,
            mouseout: function(e){;
                e.target.setStyle({fill: "red"})},
            click: zoomToFeature
        });
        }});
    });





tabMed = "gold"

fetch('/api/bdd/jomedgeom')
.then((r) => r.json())
.then((r) => {
    var medals = []
    for (i=0; i<r.features.length; i++) {
        medals.push(r.features[i].properties.mg)
    }
    var code = []
    for (i=0; i<r.features.length; i++) {
        code.push(r.features[i].properties.code)
    }
        
    var ctx = document.getElementById('myChart').getContext('2d');

    var myChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: code,
            datasets: [{
                label: 'Number of ' +tabMed+ ' medals',
                data: medals,
                backgroundColor: [
                    'rgba(255, 99, 132, 0.2)',
                    'rgba(54, 162, 235, 0.2)',
                    'rgba(255, 206, 86, 0.2)',
                    'rgba(75, 192, 192, 0.2)',
                    'rgba(153, 102, 255, 0.2)',
                    'rgba(255, 159, 64, 0.2)'
                ],
                borderColor: [
                    'rgba(255, 99, 132, 1)',
                    'rgba(54, 162, 235, 1)',
                    'rgba(255, 206, 86, 1)',
                    'rgba(75, 192, 192, 1)',
                    'rgba(153, 102, 255, 1)',
                    'rgba(255, 159, 64, 1)'
                ],
                borderWidth: 1
            }]
        },
        options: {
            scales: {
                yAxes: [{
                    ticks: {
                        beginAtZero: true
                    }
                }]
            }
        }
    });


});




// fetch('/api/bdd/json')
//     .then((r) => r.json())
//     .then((r) => {
//        function Medal(event) {
//        L.geoJson(r).addTo(map);
//        console.log(r)
//         L.geoJson(r,{onEachFeature:function(feature,layer){feature.geometry.type ==='MultiPolygon'; 
//         var centroid = turf.centroid(feature); 
//         var lon = centroid.geometry.coordinates[0]; 
//         var lat = centroid.geometry.coordinates[1];
//         L.circleMarker([lat,lon], {color: 'red', radius : 0.5*feature.properties[event.target.id]}).addTo(map);
//         }})
        
//     }
//     var bronze = document.getElementById("cnt_bronze")
//     bronze.addEventListener("click", Medal)
//     }
    

//     );


// const colMed = function(feature) {
//     const name = feature.properties.name_fr;
//     if (name === 'Finlande') {
//         return 'red';
//     }
// }


// L.geoJson(statesData).addTo(mymap);

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
//         fillOpacity: 0.2
//     };
// }

// L.geoJson(statesData, {style: style}).addTo(mymap);

function highlightFeature(e) {
    var layer = e.target;

    layer.setStyle({
        weight: 5,
        color: '#666',
        dashArray: '',
        fillOpacity: 0.7
    });

    // info.update(e.target);

    if (!L.Browser.ie && !L.Browser.opera && !L.Browser.edge) {
        layer.bringToFront();
    }
}

function resetHighlight(e) {
    geojson.resetStyle(e.target);
    // info.update();
}

function zoomToFeature(e) {
    mymap.fitBounds(e.target.getBounds());
}

// // var geojson;
// // // ... our listeners
// // geojson = L.geoJson(...);



// function onEachFeature(feature, layer) {
//     layer.on({
//         mouseover: highlightFeature,
//         mouseout: resetHighlight,
//         click: zoomToFeature
//     });
// }

// geojson = L.geoJson(statesData, {
//     style: style,
//     onEachFeature: onEachFeature
// }).addTo(mymap);

// var info = L.control();

// info.onAdd = function (map) {
//     this._div = L.DomUtil.create('div', 'info'); // create a div with a class "info"
//     this.update();
//     return this._div;
// };

// // method that we will use to update the control based on feature properties passed
// info.update = function (target) {
//     if(!target){
//         return; 
//     }
//     this._div.innerHTML = `
//         <h4>US States</h4>
//         State: <b>${target.feature.properties.name}</b><br />
//         Density: <b>${target.feature.properties.density} hab/sqkm</b>
//     `;
// };

// info.addTo(mymap);

// var legend = L.control({position: 'bottomright'});

// legend.onAdd = function (map) {

//     var div = L.DomUtil.create('div', 'info legend'),
//         grades = [0, 10, 20, 50, 100, 200, 500, 1000],
//         labels = [];

//     // loop through our density intervals and generate a label with a colored square for each interval
//     for (var i = 0; i < grades.length; i++) {
//         div.innerHTML +=
//             '<i style="background:' + getColor(grades[i] + 1) + '"></i> ' +
//             grades[i] + (grades[i + 1] ? '&ndash;' + grades[i + 1] + '<br>' : '+');
//     }

//     return div;
// };

// legend.addTo(mymap);



// // var wmsLayer = L.tileLayer.wms(
// //     'http://localhost:8080/geoserver/infra/wms?',
// //     {
// //         layers: 'ne_10m_railroads,ne_10m_rivers_lake_centerlines'
// //     }
// // ).addTo(mymap);


// const urlPays = 'http://localhost:8080/geoserver/infra/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=infra%3Ane_110m_admin_0_countries&maxFeatures=250&outputFormat=application%2Fjson'



// fetch(urlPays)
//     .then((response) => response.json())
//     .then((json) => {
//         console.log(json);
//         L.geoJson(json, {style: newStyle}).addTo(mymap);
//     })















// var mymap = L.map('mapid').setView([69, 33], 8);

// L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
//     attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
//     maxZoom: 18,
//     id: 'mapbox/dark-v10',
//     tileSize: 512,
//     zoomOffset: -1,
//     accessToken: 'pk.eyJ1IjoiY2JvdWNoZWlnbiIsImEiOiJja2x1b3BsMTQwMmk1MnZvNmppdHF1NjUyIn0.KNq-KbSgCsLI2rJal-3xSw'
// }).addTo(mymap);

// var marker = L.marker([69, 33]).addTo(mymap);

// var circle = L.circle([69.150, 33.11], {
//     color: 'red',
//     fillColor: '#f03',
//     fillOpacity: 0.5,
//     radius: 500
// }).addTo(mymap);

// const style = {
//     color: 'red',
//     fillColor: '#f03',
//     fillOpacity: 0.5,
//     radius: 500
// }
// const coords = [50, 50];

// for (var i=0; i < 10; i++) {
//     let newCoords = [50 + i*0.1, 50 + i*0.1]
//     L. circle(newCoords, style).addTo(mymap);
// }

// var popup = L.popup();

// function onMapClick(e) {
//     popup
//         .setLatLng(e.latlng)
//         .setContent("You clicked the map at " + e.latlng.toString())
//         .openOn(mymap);
// }

// mymap.on('click', onMapClick);

// function createCanard(e) {
//     var icone = L.icon({
//         iconUrl: 'img/canard.png',
//         iconSize: [XXXX]
//     });
//     var marker = L.marker(e.latlng, {
//         icon: icone,
//         draggable: true
//     });
//     marker.on('click', function() {marker.remove()});
//     marker.addTo(mymap);
// }
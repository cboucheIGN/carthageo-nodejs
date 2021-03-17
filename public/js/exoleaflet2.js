//récupération du WMS Mapbox
var mapboxAccessToken = 'pk.eyJ1IjoiY2JvdWNoZWlnbiIsImEiOiJja2x1b3BsMTQwMmk1MnZvNmppdHF1NjUyIn0';
var mymap = L.map('mapMed').setView([40, 10], 2);

L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
    id: 'mapbox/dark-v10',
    attribution: '...',
    tileSize: 512,
    zoomOffset: -1,
    accessToken: 'pk.eyJ1IjoiY2JvdWNoZWlnbiIsImEiOiJja2x1b3BsMTQwMmk1MnZvNmppdHF1NjUyIn0.KNq-KbSgCsLI2rJal-3xSw'

}).addTo(mymap);


var annee = document.getElementById("annee");
var saison = document.getElementById("season");
var medaille = document.getElementById("medal")
var jo = document.getElementById("jo");
console.log(annee)


//Colorisation pays socialistes
const styleSoc = function(feature) {
    const soc = feature.properties.soc;
    // const boy80 = feature.properies.boy80;
    if (soc) {
        return {
            fillColor: '#ff0000',
            color: '#ffffff',
            fillOpacity: 0.3,
            opacity: 0.1,
            weight: 1
        };
    } 
    return {
        fillColor: '#203354',
        fillOpacity: 0.3,
        opacity: 0.1,
        weight: 1
    }
}

//Colorisation cercles médailles
const styleMed = function(feature, med) {
    // console.log("hello")
    if (med === "ms") {
        return {
            color: '#C0C0C0',
            radius : 0.5*feature.properties.ms
        }
    } 
    else if (med === "mg") {
        return {
            color: '#FFD700',
            radius : 0.5*feature.properties.mg
        }
    }
    else if (med === "mb") {
        return {
            color: '#cd7f32',
            radius : 0.5*feature.properties.mb
        }
    }
    else if (med === "mall") {
        return {
            color: '#ffffff',
            radius : 0.5*feature.properties.mall
        }
    }
}

function highlightFeature(e, features) {
    var layer = e.target;
    layer.setStyle({
        weight: 2,
        opacity: 1,
        color: '#ffffff',
        dashArray: '4',
        fillOpacity: 0.7
    });
}

function resetHighlight(e) {
    paysMed.resetStyle(e.target);
    // info.update();
}

function zoomToFeature(e) {
    var paysClick = e.target.feature.properties.code
    console.log(e.target.feature.properties.code)
    mymap.fitBounds(e.target.getBounds());
}

function onEachFeature(feature, layer) {
    layer.on({
        mouseover: highlightFeature,
        mouseout: resetHighlight,
        click: zoomToFeature
    });
}

//Légende
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

legend.addTo(mymap);

//Initialisation couches
var couche = new L.layerGroup().addTo(mymap);

//Ecoute de soumission du formulaire année/saison/médaille
jo.addEventListener('submit', joMed);

// paysMed est declaré 'globale'
var paysMed;

function joMed (e){
    e.preventDefault();

    //récupération des éléments du formulaire
    var anneeSel = annee.options[annee.selectedIndex].text
    var saisSel = season.options[season.selectedIndex].text
    var medSel = medal.options[medal.selectedIndex].value

    var data = {
        anneeNouv: anneeSel, saisNouv: saisSel, medNouv: medSel
    }

    fetch('/api/bdd/joMedAll', {
        method: 'post', 
        body: JSON.stringify(data),
        headers: {'Content-Type': 'application/json'}
    })
    .then(r => r.json())
    .then((r) => {

    //création des polygones pays
    paysMed = L.geoJSON(r, {
        style: styleSoc,
        onEachFeature: paysOnEachFeature
    });

    function paysOnEachFeature(feature, layer) {
        layer.on({
            mouseover: highlightFeature,
            mouseout: resetHighlight,
            click: zoomToFeature
        })};

    //Suppression des couches précédentes
    couche.clearLayers();
    couche.addLayer(paysMed);//.addTo(mymap);

    //création des cercles prop
    
    L.geoJson(r, {
        onEachFeature: function(feature, layer) {
            var listArea = [];
            for (var i = 0; i < feature.geometry.coordinates.length; i++) {
                var polygon = turf.polygon(feature.geometry.coordinates[i]);
                var area = turf.area(polygon);
                listArea.push(area);
            }
        var index = listArea.findIndex((area) => area === Math.max(...listArea));
        var polygon = turf.polygon(feature.geometry.coordinates[index]);

        var centroid = turf.centroid(polygon);
        var lat = centroid.geometry.coordinates[1];
        var lon = centroid.geometry.coordinates[0];

        var colMed = styleMed(feature, medSel)
        var cProp = L.circleMarker([lat, lon], {
            color: colMed.color,
            fillOpacity: 0.5,
            radius : colMed.radius
        });







    // L.geoJson(r,{onEachFeature:function(feature,layer){feature.geometry.type ==='MultiPolygon'; 
    // var centroid = turf.centroid(feature); 
    // var lon = centroid.geometry.coordinates[0]; 
    // var lat = centroid.geometry.coordinates[1];

    // var colMed = styleMed(feature, medSel)
    // var cProp = L.circle([lat,lon], {color: colMed.color, fillOpacity: 0.5, stroke: true, weight: 0.8, radius: colMed.radius});

    // paysMed.on({
    //     mouseover: function (e){highlightFeature(e,feature)},
    //     // function() { onClick(param) })
    //     mouseout: function(e){console.log(e.target);
    //                         e.target.setStyle({color: colMed.color,
    //                         })},
    //     click: zoomToFeature
    // });

    cProp.addTo(couche);
    }});
    
    //Graphique: récupération des données de médailles
    var mall = []
    var mg = []
    var ms = []
    var mb = []
    for (i=0; i<r.features.length; i++) {
        mall.push(r.features[i].properties.mall),
        mg.push(r.features[i].properties.mg),
        ms.push(r.features[i].properties.ms),
        mb.push(r.features[i].properties.mb)
    }
    var code = []
    for (i=0; i<r.features.length; i++) {
        code.push(r.features[i].properties.name)
    }
        

    //Je sais pas à quoi ça sert mais ça marche pas sans...
    var numberWithCommas = function(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
     };

     // Réinitialiser le contenu de la div graphique pour éviter l'accumulation : 
    var pieChartContent = document.getElementById('graphMed');
    pieChartContent.innerHTML = '&nbsp;';
    $('#graphMed').append('<canvas id="my_chart" width="400" height="200"></canvas>');
    
    var ctx = $("#my_chart").get(0).getContext("2d");

     //(re)création du graphique
    var bar_chart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: code,
            datasets: [
            {
                label: 'Gold medals',
                data: mg,
                backgroundColor:'#FFD700'
            },
            {
                label: 'Silver medals',
                data: ms,
                backgroundColor: '#C0C0C0'
            },            
            {
                label: 'Bronze medals',
                data: mb,
                backgroundColor: '#cd7f32'
            },
            ]
        },
        options: {
            // maintainAspectRatio: false,
            responsive: true,
            scaleShowValues: true,
            scales: {
                xAxes: [{
                ticks: {
                    autoSkip: false
                }
                }]
            },
            animation: {
                duration: 100,
            },
            tooltips: {
                mode: 'label',
                callbacks: {
                label: function(tooltipItem, data) {
                    return data.datasets[tooltipItem.datasetIndex].label + ": " + numberWithCommas(tooltipItem.yLabel);
                }
                }
            },
            scales: {
                xAxes: [{
                stacked: true,
                gridLines: {
                    display: false
                },
                }],
                yAxes: [{
                stacked: true,
                ticks: {
                    callback: function(value) {
                    return numberWithCommas(value);
                    },
                },
                }],
            },
            legend: {
                display: true
            }
        },
    });
    })    
}



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
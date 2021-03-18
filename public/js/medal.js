//Creation de la carte sur leaflet
var mapboxAccessToken = 'pk.eyJ1IjoidGFueWFnZW9tIiwiYSI6ImNrbHVweml0MDBreHkycG8zY2djMDN6dG0ifQ.dA-K7tKA6OZQ7gn6e-9wdQ';
var medalmap = L.map('medal').setView([27.444586473380898, 2.955829199696631], 2);


L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token=' + mapboxAccessToken, {
    id: 'mapbox/dark-v9',
    attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
    tileSize: 512,
    zoomOffset: -1
}).addTo(medalmap);


// CARTE DES TYPES DE MEDAILLES GAGNEES PAR PAYS ET PAR SAISON

// Creation du style selon les medailles choisies 
const styleMed = function(maselection, feature) {
    console.log("hello")
    if (maselection === "sum_gold") {
        return {
            fillColor: '#FFD700',
            color : '#FCFFFF',
            radius : 0.07*feature.properties.gold,
            weight : 1
        }
    } 
    else if (maselection === "sum_silv") {
        return {
            fillColor: '#C0C0C0',
            color : '#FCFFFF',
            radius : 0.07*feature.properties.silver,
            weight : 1
        }
    }
    else if (maselection === "sum_bronz") {
        return {
            fillColor: '#cd7f32',
            color : '#FCFFFF',
            radius : 0.07*feature.properties.bronze,
            weight : 1
        }
    }
    else if (maselection === "wint_gold") {
        return {
            fillColor: '#FFD700',
            color : '#FCFFFF',
            radius : 0.07*feature.properties.gold,
            weight : 1
        }
    }
    else if (maselection === "wint_silv") {
        return {
            fillColor: '#C0C0C0',
            color : '#FCFFFF',
            radius : 0.07*feature.properties.silver,
            weight : 1
        }
    }
    else if (maselection === "wint_bronz") {
        return {
            fillColor: '#cd7f32',
            color : '#FCFFFF',
            radius : 0.07*feature.properties.bronze,
            weight : 1
        }
    }
}

// Liste des objets de la légendes (lien avec la fonction de style du choix de l'utilisateur) 

const listIdentifiantete = [
    { id: "sum_gold", name: " OR " },
    { id: "sum_silv", name: " ARGENT " },
    { id: "sum_bronz", name: " BRONZE " },
];

const listIdentifianthiver = [
    { id: "wint_gold", name: " OR " },
    { id: "wint_silv", name: " ARGENT " },
    { id: "wint_bronz", name: " BRONZE " }
];

listIdentifiantseason = [
    { id: "été", name: "JO d/'été"},
    { id: "hiver", name: "JO d/'hiver"}
]

// Creation du menu de la légende 
var command = L.control({position: 'bottomleft'});
command.onAdd = function(map) {
    var div = L.DomUtil.create('div', 'command');
    var innerHTML = 
        `<div id="accordion">
            <div class="card">
                <div class="card-header" id="headingOne">
                    <h5>
                        <button class="btn btn-link" data-toggle="collapse" data-target="#collapseOne" aria-expanded="true" aria-controls="collapseOne">
                            Jeux Olympiques d'été
                        </button>
                    </h5>
                </div>
                <div id="collapseOne" class="collapse show" aria-labelledby="headingOne" data-parent="#accordion">
                    <div class="card-body">`
    ;
    for (var i = 0; i < listIdentifiantete.length; i++) {
        var objetIdentifiantete = listIdentifiantete[i];
        innerHTML += `
            <input id="${objetIdentifiantete.id}" type="radio" name="filter">
            <label for="${objetIdentifiantete.id}">${objetIdentifiantete.name}</label>
        `;
    }
    innerHTML += `</div></div></div>`;
    innerHTML += `<div class="card">
        <div class="card-header" id="headingTwo">
            <h5>
                <button class="btn btn-link collapsed" data-toggle="collapse" data-target="#collapseTwo" aria-expanded="false" aria-controls="collapseTwo">
                    Jeux Olympiques d'hiver
                </button>
            </h5>
        </div>
        <div id="collapseTwo" class="collapse" aria-labelledby="headingTwo" data-parent="#accordion">
            <div class="card-body">`;
    for (var i = 0; i < listIdentifianthiver.length; i++) {
        var objetIdentifianthiver = listIdentifianthiver[i];
        innerHTML += `
            <input id="${objetIdentifianthiver.id}" type="radio" name="filter">
            <label for="${objetIdentifianthiver.id}">${objetIdentifianthiver.name}</label>
        `;
    }
    innerHTML += `</div>
        </div>
    </div></div>`;
    div.innerHTML = innerHTML;
    return div;
}
command.addTo(medalmap);

// Evenement du click sur le choix de l'utilisateur dans la légende 
for (var i = 0; i < listIdentifiantete.length; i++) {
    var objetIdentifiant = listIdentifiantete[i];
    document.getElementById(objetIdentifiant.id).addEventListener('click', updateStyle, false);
}

for (var i = 0; i < listIdentifianthiver.length; i++) {
    var objetIdentifiant = listIdentifianthiver[i];
    document.getElementById(objetIdentifiant.id).addEventListener('click', updateStyle, false);
}

// Groupe du choix de medailles 
var group = new L.LayerGroup().addTo(medalmap);
var filterLayer = '';

// Mise à jour de la fonction de style sur la carte 
function updateStyle(event) {
    filterLayer = event.target.id;
    console.log('maselection suite au click', filterLayer);

    group.clearLayers();
    var style = {
        opacity : 0,
        fillOpacity : 0,
        weight: 1
    }
    L.geoJson(jomedal, 
        { style: style, onEachFeature: createBulle}).addTo(group);
}

// Fonction des cercles proportionnels 
function createBulle(feature, layer) {
    
    layer.on({
        // mouseover: highlightFeature,
        // mouseout: resetHighlight,
        click: getcodepays
    });

    // Calcule de l'aire des multipolygones pour avoir des centroïdes plus centrés 
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
    // je filtre sur les saisons
    if (
        (filterLayer.startsWith('sum_') && feature.properties.season !== 'Summer') 
        ||
        (filterLayer.startsWith('wint_') && feature.properties.season !== 'Winter')
    ) {
        return;
    }
    const circle =  L.circleMarker([lat, lon],
        styleMed(filterLayer, feature)
    );
    circle.addTo(group);
}

// GRAPHIQUE MEDAILLES PAR SPORT
const urlMedalSport = '/api/sport';

function getcodepays (e) {
    console.log(e);
    var pays_id = e.target.feature.properties.pays_id;
    loadNewChart(pays_id)
}

function loadNewChart(codePays) {

    fetch(urlMedalSport, {
        method: 'POST',
        body: JSON.stringify({ code: codePays }),
        headers: { 'Content-type': 'application/json '}
    })
    .then((response) => response.json())
    .then((sportMedal) => {
        console.log(sportMedal);

        // creer une liste de sport
        var listsports = [];
        for (var i = 0; i< sportMedal.length; i ++){
            listsports.push(sportMedal[i].sport)
        }
        var listgold = [];
        for (var i = 0; i< sportMedal.length; i ++){
            listgold.push(sportMedal[i].gold)
        }
        var listsilver = [];
        for (var i = 0; i< sportMedal.length; i ++){
            listsilver.push(sportMedal[i].silver)
        }
        var listbronze = [];
        for (var i = 0; i< sportMedal.length; i ++){
            listbronze.push(sportMedal[i].bronze)
        }
        
        // parcourir sportMedal et push dans la liste sport

        var options = {
            title: {
                display: true,
                text: 'Médailles par disciplines olympiques'
            },
            tooltips: {
                mode: 'index',
                intersect: false
            },
            responsive: true,
            scales: {
                xAxes: [{
                    stacked: true,
                }],
                yAxes: [{
                    stacked: true
                }]
            }
        }

        $('#resultContainer').html(''); //remove canvas from container
        $('#resultContainer').html('<canvas id="myChart" height="5" width="6"></canvas>'); //add it back to the container
        var ctx = document.getElementById('myChart').getContext('2d');
        var barChartData = {
            labels : listsports,
            datasets: [{
                label : 'OR',
                backgroundColor: 'rgba(255,215,0,0.5)',
                stack: 'Stack 0',
                data : listgold
            },{
                label : 'SILVER',
                backgroundColor: 'rgba(192,192,192,0.8)',
                stack: 'Stack 0',
                data : listsilver 
            }, {
                label : 'BRONZE',
                backgroundColor: 'rgba(205,127,50,0.8)',
                stack: 'Stack 0',
                data : listbronze 
            }]
        };

        var ctx = document.getElementById('myChart').getContext('2d');
        window.myBar = new Chart(ctx, {
            type: 'horizontalBar',
            data: barChartData,
            options: options
        });
    });

}

// // Creation du style selon les medailles choisies 
// const styleMed = function(maselection, feature) {
//     console.log("hello")
//     if (maselection === "sum_gold") {
//         return {
//             fillColor: '#C0C0C0',
//             radius : 0.05*feature.properties.sum_gold
//         }
//     } 
//     else if (maselection === "sum_silv") {
//         return {
//             fillColor: '#FFD700',
//             radius : 0.05*feature.properties.sum_silv
//         }
//     }
//     else if (maselection === "sum_bronz") {
//         return {
//             fillColor: '#614E1A',
//             radius : 0.05*feature.properties.sum_bronz
//         }
//     }
//     else if (maselection === "wint_gold") {
//         return {
//             fillColor: '#0000ff',
//             radius : 0.05*feature.properties.wint_gold
//         }
//     }
//     else if (maselection === "wint_silv") {
//         return {
//             fillColor: '#0000ff',
//             radius : 0.05*feature.properties.wint_silv
//             }
//         }
//     else if (maselection === "wint_bronz") {
//         return {
//             fillColor: '#0000ff',
//             radius : 0.05*feature.properties.wint_bronz
//             }
//     }
// }


// // Création d'une liste d'identidiant pour chaque choix 
// const listIdentifiant = [
//     { id: "sum_gold", name: "Medailles jeux d'été OR" },
//     { id: "sum_silv", name: "Medailles jeux d'été ARGENT" },
//     { id: "sum_bronz", name: "Medailles jeux d'été BRONZE" },
//     { id: "wint_gold", name: "Medailles jeux d'hiver OR" },
//     { id: "wint_silv", name: "Medailles jeux d'hiver ARGENT" },
//     { id: "wint_bronz", name: "Medailles jeux d'hiver BRONZE" }
// ];

// const listIdentifiantete = [
//     { id: "sum_gold", name: " OR " },
//     { id: "sum_silv", name: " ARGENT " },
//     { id: "sum_bronz", name: " BRONZE " },
// ];

// const listIdentifianthiver = [
//     { id: "wint_gold", name: " OR " },
//     { id: "wint_silv", name: " ARGENT " },
//     { id: "wint_bronz", name: " BRONZE " }
// ];

// // Creation du menu 
// var command = L.control({position: 'bottomleft'});
// command.onAdd = function(map) {
//     var div = L.DomUtil.create('div', 'command');
//     div.innerHTML += '<div style="text-align:center;"> <br /><span style="font-size:18px;">Été</span><br /><span style="color:grey;font-size:14px;"></span></div>';
//     for (var i = 0; i < listIdentifiantete.length; i++) {
//         var objetIdentifiantete = listIdentifiantete[i];
//         div.innerHTML += `
//             <input id="${objetIdentifiantete.id}" type="radio" name="filter"> <br />
//             <label for="${objetIdentifiantete.id}">${objetIdentifiantete.name}</label> <br />
//         `;
//     }
//     div.innerHTML += '<div style="text-align:center;"><br /><span style="font-size:18px;">Hiver</span><br /><span style="color:grey;font-size:14px;"></span></div>';
//     for (var i = 0; i < listIdentifianthiver.length; i++) {
//         var objetIdentifianthiver = listIdentifianthiver[i];
//         div.innerHTML += `
//             <input id="${objetIdentifianthiver.id}" type="radio" name="filter"> <br />
//             <label for="${objetIdentifianthiver.id}">${objetIdentifianthiver.name}</label> <br />
//         `;
//     }
//     return div;
// }
// command.addTo(medalmap);

// // 
// for (var i = 0; i < listIdentifiant.length; i++) {
//     var objetIdentifiant = listIdentifiant[i];
//     document.getElementById(objetIdentifiant.id).addEventListener('click', updateStyle, false);
// }

// // Groupe du choix de medailles 
// var group = new L.LayerGroup().addTo(medalmap);
// var filterLayer = '';

// // Fonction de style 
// function updateStyle(event) {
//     console.log(event, event.target.id);
//     filterLayer = event.target.id;
//     // TODO 
//     // 1. supprimer les couches anciennes
//     group.clearLayers();
//     // 2. chercher les événements 'été' et les médailles 'or'
//     // 2.1 soit un on fait un fetch mais tu nous embete
//     // 2.2 soit on recupere toutes les données et on filtre
//     // filterData(paramedal, 'ete');
//     // 3. creer une nouvelle couche avec les données filter
//     L.geoJson(paramedal, { onEachFeature: createBulle });
// }

// function createBulle(feature, layer) {
//     var listArea = [];
//     for (var i = 0; i < feature.geometry.coordinates.length; i++) {
//         var polygon = turf.polygon(feature.geometry.coordinates[i]);
//         var area = turf.area(polygon);
//         listArea.push(area);
//     }
//     var index = listArea.findIndex((area) => area === Math.max(...listArea));
//     var polygon = turf.polygon(feature.geometry.coordinates[index]);
//     var centroid = turf.centroid(polygon);
//     var lat = centroid.geometry.coordinates[1];
//     var lon = centroid.geometry.coordinates[0];
//     const circle =  L.circleMarker([lat, lon],
//         styleMed(filterLayer, feature)
//     );
//     circle.addTo(group);
// }


// var couche = new L.layerGroup().addTo(medalmap);
// couche.clearLayers();

// L.geoJson(jomedal, {
//     onEachFeature: function(feature, layer) {
//         var listArea = [];
//         for (var i = 0; i < feature.geometry.coordinates.length; i++) {
//             var polygon = turf.polygon(feature.geometry.coordinates[i]);
//             var area = turf.area(polygon);
//             listArea.push(area);
//         }
//         var index = listArea.findIndex((area) => area === Math.max(...listArea));
//         var polygon = turf.polygon(feature.geometry.coordinates[index]);
//         var centroid = turf.centroid(polygon);
//         var lat = centroid.geometry.coordinates[1];
//         var lon = centroid.geometry.coordinates[0];
//         var circle = L.circleMarker([lat, lon], {
//             color: 'red',
//             fillColor: '#f03',
//             fillOpacity: 0.5,
//             radius : 0.05*feature.properties.gold
//         });
//         circle.addTo(couche);
//     }
// });

//creer le L.control = boite avec un innerHTML avec des buttons checkbox



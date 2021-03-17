//récupération du WMS Mapbox
var mapboxAccessToken = 'pk.eyJ1IjoiY2JvdWNoZWlnbiIsImEiOiJja2x1b3BsMTQwMmk1MnZvNmppdHF1NjUyIn0';
var mapBloc = L.map('mapBloc', {
        zoomControl: false,
        zoomSnap: 0.25})
    .setView([49, 50.2], 4.25)
mapBloc.touchZoom.disable();
mapBloc.doubleClickZoom.disable();
mapBloc.scrollWheelZoom.disable();
mapBloc.boxZoom.disable();
// mapBloc.dragging.disable();
mapBloc.keyboard.disable();

L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
    id: 'mapbox/dark-v10',
    attribution: '...',
    tileSize: 512,
    zoomOffset: -1,
    accessToken: 'pk.eyJ1IjoiY2JvdWNoZWlnbiIsImEiOiJja2x1b3BsMTQwMmk1MnZvNmppdHF1NjUyIn0.KNq-KbSgCsLI2rJal-3xSw'

}).addTo(mapBloc);


// var annee = document.getElementById("annee");
// var saison = document.getElementById("season");
// var medaille = document.getElementById("medal")
// var jo = document.getElementById("jo");
// console.log(annee)


//Colorisation pays socialistes
const styleBloc = function(feature) {
    const code = feature.properties.code;
    if (code == 'RUS') {
        return {
            fillColor: '#ff0000',
            color: '#ffffff',
            opacity: 0.3,
            fillOpacity: 0.3,
            weight: 1
        };
    }
    if (paysSel == 'exbloc') {
        return {
            fillColor: '#800053',
            color: '#ffffff',
            opacity: 0.3,
            fillOpacity: 0.3,
            weight: 1
        };
    }
    return {
        fillColor: '#ff0000',
        color: '#ffffff',
        opacity: 0.3,
        fillOpacity: 0.3,
        weight: 1
    };
}

var paysBloc;

//Légende
var info = L.control();

info.onAdd = function (map) {
    this._div = L.DomUtil.create('div', 'info'); // create a div with a class "info"
    // this._div = L.DomUtil.create('div', 'select'); // create a div with a class "info"
    this.update();
    return this._div;
};

info.update = function(feature) {
    console.log(feature)

    if (feature) {
        this._div.innerHTML = `
        <p><b>Country : ${feature.properties.name}</b></p>`;
    }
    else {
        this._div.innerHTML = `
        <p><b>Select a country.</b></p>`;
    }
}

info.addTo(mapBloc);

//Initialisation couches
var couche = new L.layerGroup().addTo(mapBloc);

var paysSel = 'soc';
const paysWFS = `http://localhost:8080/geoserver/jol/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=jol%3Acountrysocgeom&outputFormat=application%2Fjson&CQL_FILTER=${paysSel}=+TRUE`;

fetch(paysWFS)
    .then((response) => response.json())
    .then((json) => {
        console.log(json);

        paysBloc = L.geoJSON(json, {
            style: styleBloc,
            onEachFeature: paysOnEachFeature
        }).addTo(mapBloc);
    })


// era.addEventListener('')
    
// ============================================================== //
// ============== EVENEMENT couche paysBlock ==================== //
// ============================================================== //

function paysOnEachFeature(feature, layer) {
    layer.on({
        mouseover: highlightFeature,
        mouseout: resetHighlight,
        click: paysClickedFunction
    });
};

function highlightFeature(e, features) {
    var layer = e.target;

    info.update(e.target.feature);

    layer.setStyle({
        weight: 2,
        opacity: 1,
        color: '#ffffff',
        dashArray: '4',
        fillOpacity: 0.5
    });
}

function resetHighlight(e) {
    paysBloc.resetStyle(e.target);
    info.update();
}

function paysClickedFunction(e) {
    console.log(e.target.feature.properties.code)
    // 1. centrer sur le pays
    // mapBloc.fitBounds(e.target.getBounds());
    // 2. lancer l'appel au donnees sur ce pays pour creer les graphiques
    var paysClick = e.target.feature.properties.code;
    fetchAndDisplayChart(paysClick);
}

function graphClass(data) {

    //Graphique: récupération des données de médailles
    var mall = []
    for (i=0; i<data.length; i++) {
        mall.push(data[i].med)
    }

    var disc = []
    for (i=0; i<data.length; i++) {
        disc.push(data[i].sport)
    }
        

    //Je sais pas à quoi ça sert mais ça marche pas sans...
    var numberWithCommas = function(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
        };

    // Réinitialiser le contenu de la div graphique pour éviter l'accumulation : 
    var graphClass = document.getElementById('graphClass');
    graphClass.innerHTML = '&nbsp;';
    $('#graphClass').append('<canvas id="drawClass" width="400" height="200"></canvas>');
    
    var ctx = $("#drawClass").get(0).getContext("2d");

    //(re)création du graphique
    var gClass = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: disc,
            datasets: [
            {
                label: 'Medals won',
                data: mall,
                backgroundColor:'#FFD700'
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

}

function graphGenre(data) {

    //Graphique: récupération des données de médailles
    var genre = data[0].w_m.split(',');
    console.log('genre', genre)

    //Je sais pas à quoi ça sert mais ça marche pas sans...
    var numberWithCommas = function(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
        };

    // Réinitialiser le contenu de la div graphique pour éviter l'accumulation : 
    var graphClass = document.getElementById('graphGenre');
    graphClass.innerHTML = '&nbsp;';
    $('#graphGenre').append('<canvas id="drawGenre" width="400" height="200"></canvas>');
    
    var ctx = $("#drawGenre").get(0).getContext("2d");

    //(re)création du graphique

    var gGenre = new Chart(ctx, {
        type: 'doughnut', //doughnut polarArea
        data: {
          labels: ["Women", "Men"],
          datasets: [
            {
              label: "Athletes",
              backgroundColor: ["#3e95cd", "#8e5ea2"],
              data: genre
            }
          ]
        },
        options: {
          title: {
            display: true,
            text: 'Number of medallists, by genre'
          }
        }
    });

}

function fetchAndDisplayChart(countryCode) {
    const url = '.../';
    
    var data = {
        paysClick: countryCode
    }

    fetch('/api/bdd/paysTop', {
        method: 'post', 
        body: JSON.stringify(data),
        headers: {'Content-Type': 'application/json'}
    })
    
    .then(r => r.json())
    .then((r) => {
    graphClass(r);
    
    console.log('Requête palmares', r)
    });

    fetch('/api/bdd/paysGenre', {
        method: 'post', 
        body: JSON.stringify(data),
        headers: {'Content-Type': 'application/json'}
    })
    
    .then(r2 => r2.json())
    .then((r2) => {
    graphGenre(r2);
    
    console.log('Requête genre', r2)
    });

    fetch('/api/bdd/athTab', {
        method: 'post', 
        body: JSON.stringify(data),
        headers: {'Content-Type': 'application/json'}
    })
    
    .then(r3 => r3.json())
    .then((r3) => {
    tabAth(r3);
    
    console.log('Requête athlètes', r3)
    });

    // fetch('///', {
    //     method: 'post',
    //     body: JSON.stringify(data),
    //     headers: {'Content-Type': 'application/json'}
    // })
    // .then(r2 => r.json())
    // .then((r) => {
    //     displayChart(r2);
    // })
}

// function displayChart(data) {
//     // var ctx = ...
//     var chart = new Chart(ctx, {
//         type: 'bar',
//         ...
//     })
//     //

// }

// function displayTable(data) {
//     const table = document.createElement('table');
//     table.innerHTML = `
//         <thead>...</thead>
//     `;

//     document.getElementById('medalsByAthlete').appendChild(table);
// }

//URS return URS or EUN



function tabAth(data) {

    var divath = document.getElementById('divath')
    
    divath.innerHTML = '';

    if (data.length > 0) {
        console.log(data)
        for (i = 0; i < data.length; i++) {
            divath.innerHTML += "<tr>" +
            //"<th scope='row'>" + i + "</th>" +
            "<td>" + data[i].name + "</td>" +
            "<td>" + data[i].med + "</td>" +
            "<td>" + data[i].all_sport + "</td>" +
            "<td>" + data[i].all_country + "</td>" +
            "<td>" + data[i].year + "</td>" +
            "</tr>"

        }
    }
}



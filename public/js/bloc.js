//récupération du WMS Mapbox
var mapboxAccessToken = 'pk.eyJ1IjoiY2JvdWNoZWlnbiIsImEiOiJja2x1b3BsMTQwMmk1MnZvNmppdHF1NjUyIn0';
var mapBloc = L.map('mapBloc').setView([53.2, 50.2], 4);

L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
    id: 'mapbox/light-v10',
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
            color: '#ff0000',
            fillOpacity: 0.3,
            weight: 1
        };
    }
    if (paysSel == 'exbloc') {
        return {
            fillColor: '#800053',
            color: '#800053',
            fillOpacity: 0.3,
            weight: 1
        };
    }
    return {
        fillColor: '#ff0000',
        fillOpacity: 0.3,
        weight: 1
    };
}

var paysBloc;

//Légende


//Initialisation couches
// var couche = new L.layerGroup().addTo(mapBloc);
// const paysBloc = 'http://localhost:8080/geoserver/infra/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=infra%3Acountrysocgeom&outputFormat=application%2Fjson&CQL_FILTER=' +paysSel+ '+=+TRUE'

var paysSel = 'exbloc';
const paysWFS = `http://localhost:8080/geoserver/jol/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=jol%3Acountrysocgeom&outputFormat=application%2Fjson&CQL_FILTER=${paysSel}=+TRUE`;

console.log('paysWFS', paysWFS);

fetch(paysWFS)
    .then((response) => response.json())
    .then((json) => {
        console.log(json);

        paysBloc = L.geoJSON(json, {
            style: styleBloc,
            onEachFeature: paysOnEachFeature
        }).addTo(mapBloc);

        // L.geoJson(json, {style: styleBloc}).addTo(mapBloc);
    })

    
// ============================================================== //
// ============== EVENEMENT couche paysBlock ==================== //
// ============================================================== //

function paysOnEachFeature(feature, layer) {
    layer.on({
        mouseover: highlightFeature,
        mouseout: resetHighlight,
        click: payClickedFunction
    });
};

function highlightFeature(e, features) {
    var layer = e.target;
    layer.setStyle({
        weight: 2,
        opacity: 1,
        color: 'black',
        dashArray: '4',
        fillOpacity: 0.5
    });
}

function resetHighlight(e) {
    paysBloc.resetStyle(e.target);
    // info.update();
}

function payClickedFunction(e) {
    console.log(e.target.feature.properties.code)
    // 1. centrer sur le pays
    mapBloc.fitBounds(e.target.getBounds());
    // 2. lancer l'appel au donnees sur ce pays pour creer les graphiques
    var paysClick = e.target.feature.properties.code;
    fetchAndDisplayChart(paysClick);
}

function fetchAndDisplayChart(countryCode) {
    const url = '.../';
    
    
    fetch('/api/bdd/joMedAll', {
        method: 'post', 
        body: JSON.stringify(data),
        headers: {'Content-Type': 'application/json'}
    })
    .then(r => r.json())
    .then((r) => {
            displayChart(r);
            displayTable(r);
        });
}

// function displayChart(data) {
//     // var ctx = ...
//     var chart = new Chart(ctx, {
//         type: 'bar',
//         ...
//     })
//     //

// }

function displayTable(data) {
    const table = document.createElement('table');
    table.innerHTML = `
        <thead>...</thead>
    `;

    document.getElementById('medalsByAthlete').appendChild(table);
}

//URS return URS or EUN


var divath = document.getElementById('divath')

// if (r.length > 0) {
//     for (i=0; i< r.length; i++) {
//       divath.innerHTML += "<tr>" +
//       //"<th scope='row'>" + i + "</th>" +
//       "<td>" + r[i]['nom_athlete'] + "</td>" +
//       "<td>" + r[i]['gender'] + "</td>" +
//       "<td>" + r[i]['nom_epreuve'] + "</td>" +
//       "</tr>"
//     }

    
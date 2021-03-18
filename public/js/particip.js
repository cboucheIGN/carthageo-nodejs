
// SLIDER 
var mapboxAccessToken = 'pk.eyJ1IjoidGFueWFnZW9tIiwiYSI6ImNrbHVweml0MDBreHkycG8zY2djMDN6dG0ifQ.dA-K7tKA6OZQ7gn6e-9wdQ';
var participmap = L.map('participmap').setView([27.444586473380898, 2.955829199696631], 2);


L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token=' + mapboxAccessToken, {
    id: 'mapbox/light-v9',
    attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
    tileSize: 512,
    zoomOffset: -1
}).addTo(participmap);


var map2 = L.geoJSON(partpays, {
    style: styleByDate,
    onEachfeature : function(feature, layer) {
        layer.bindPopup(feature.properties.first_participation);
    }
})

// // CREATION DU SLIDER SUR LA CARTE

var sliderControl = L.control.sliderControl({position: "topright", layer: map2, timeAttribute : 'first_participation'});

participmap.addControl(sliderControl); 

sliderControl.options.markers.sort(function(a, b) {
    return (a.feature.properties.first_participation > b.feature.properties.first_participation);
});

sliderControl.startSlider(); 



// event


// function highlightFeature(e) {
//     var paysevent = e.target;
// }

// function resetHighlight(e) {
//     paysparticipation.resetStyle(e.target);
// }

// function onEachFeature(feature,paysevent) {
//     paysevent.on({
//         mouseover: highlightFeature,
//         mouseout: resetHighlight,
//     });
// }

// var paysparticipation = L.geoJson(partpays, {
//     onEachFeature: onEachFeature, 
// }).addTo(participmap);


// var info = L.control();
// info.onAdd = function (map) {
//     this._div = L.DomUtil.create('div', 'info'); // create a div with a class "info"
//     this.update();
//     return this._div;
// };

// // method that we will use to update the control based on feature properties passed
// info.update = function (props) {
//     this._div.innerHTML = '<h4>IFNO</h4>' +  (props ?
//         '<b> Le pays : ' + props.nom_pays + '</b><br /> participe pour al première fois aux jo en : ' + props.first_participation  + '</br>'
//         : 'Hover over a state');
// };

// info.addTo(participmap);


// style 

function coloryear(first_participation) {
    return first_participation > 2012 ? '#0D0D0D' :
        first_participation > 1978  ? '#F20505' :
        first_participation > 1958   ? '#F2D022' :
        first_participation > 1924   ? '#3FBF48' :
        first_participation > 1895   ? '#29A7D9' :
                      '#29A7D9';
}

function styleByDate(feature) {
    return {
        fillColor: coloryear(feature.properties.first_participation),
        weight: 0.5,
        color: 'white',
        dashArray: '3',
        fillOpacity: 1
    };
}


// Graphique du genre par athlete


var anneeBoite = document.getElementById("selectionner_annee");
var graphGender = document.getElementById("graphgender")
function generateChart (e) {
    graphGender.innerHTML = "";
anychart.onDocumentReady(function () {
    // create a bar chart
    var chart = anychart.bar();
        var gender = [];
        for (var i = 0; i < athgender.features.length; i++) {
        gender.push([athgender.features[i].properties.nom_pays,athgender.features[i].properties.ath_hommes,athgender.features[i].properties.ath_femmes,athgender.features[i].properties.year])};

        var createSeries = function (columnNumber, name, year) {
            var data = [];
            for (var i = 0; i < gender.length; i++) {
                var value = gender[i][columnNumber];
                var center = 0;
                if (name === "homme" && gender[i][3] == year) {
                    data.push({
                        x: gender[i][0],
                        low: center,
                        high: center + value,
                        value: value
                    });
                } else if (name === "femme" && gender[i][3] == year) {
                    data.push({
                        x: gender[i][0],
                        low: center,
                        high: center - value,
                        value: value
                    });
                }
        //   if (name === "homme" && year == '1960') {
        // //   parseInt(anneeBoite.options[anneeBoite.selectedIndex].text)) {
        //     console.log(anneeBoite.options[anneeBoite.selectedIndex].text)
        //     data.push({
        //       x: gender[i][0],
        //       low: center,
        //       high: center + value,
        //       value: value
        //     });
        //   } else if (name === "femme" && year == '1960') {
        // //   parseInt(anneeBoite.options[anneeBoite.selectedIndex].text)) {
        //     console.log(anneeBoite.options[anneeBoite.selectedIndex].text)
        //     data.push({
        //       x: gender[i][0],
        //       low: center,
        //       high: center - value,
        //       value: value
        //     });
        //   }
        }
          
        var series = chart.rangeBar(data);
        series.name(name);
      };
      
        createSeries(1, "homme", anneeBoite.options[anneeBoite.selectedIndex].text);
        createSeries(2, "femme", anneeBoite.options[anneeBoite.selectedIndex].text);

        chart
            .legend()
            .enabled(true);
        
        // create a stacked bar chart from the multi-series bar chart
        chart.yScale().stackMode("value");

// set a container id for the chart
        chart.container("graphgender");
  
// initiate chart drawing
        chart.draw();
    });
}
anneeBoite.addEventListener("change", generateChart)



// Creation de la carte et affichage de sa tuile
var mapboxAccessToken = 'pk.eyJ1IjoidGFueWFnZW9tIiwiYSI6ImNrbHVweml0MDBreHkycG8zY2djMDN6dG0ifQ.dA-K7tKA6OZQ7gn6e-9wdQ';
var participmap = L.map('participmap').setView([27.444586473380898, 2.955829199696631], 2);


L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token=' + mapboxAccessToken, {
    id: 'mapbox/light-v9',
    attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
    tileSize: 512,
    zoomOffset: -1
}).addTo(participmap);

// Appel du geojson et application des fonctions et du style
var map2 = L.geoJSON(partpays, {
    style: styleByDate,
    onEachfeature : function(feature, layer) {
        layer.bindPopup(feature.properties.first_participation);
    }
})

//Creation du slider

var sliderControl = L.control.sliderControl({position: "topright", layer: map2, timeAttribute : 'first_participation'});

participmap.addControl(sliderControl); 

sliderControl.options.markers.sort(function(a, b) {
    return (a.feature.properties.first_participation > b.feature.properties.first_participation);
});

sliderControl.startSlider(); 


//Fonction de style et attribution des couleurs

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

var legendannee = L.control({ position: "bottomleft" });

legendannee.onAdd = function(map) {
  var div = L.DomUtil.create("div", "legendannee");
  div.innerHTML += "<p id='ville'>Participation selon les années</p>";
  div.innerHTML += '<i class="carre" style="background : #F20505"></i><span>1979-2012</span><br>';
  div.innerHTML += '<i class="carre" style="background : #F2D022"></i><span>1959-1978</span><br>';
  div.innerHTML += '<i class="carre" style="background : #3FBF48"></i><span>1925-1958</span><br>';
  div.innerHTML += '<i class="carre" style="background : #29A7D9"></i><span>1896-1924</span><br>';
  return div;
};
legendannee.addTo(participmap);
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

//Get the button
var mybutton = document.getElementById("myBtn");

// When the user scrolls down 20px from the top of the document, show the button
window.onscroll = function() {scrollFunction()};

function scrollFunction() {
  if (document.body.scrollTop > 20 || document.documentElement.scrollTop > 20) {
    mybutton.style.display = "block";
  } else {
    mybutton.style.display = "none";
  }
}
// When the user clicks on the button, scroll to the top of the document
function topFunction() {
  document.body.scrollTop = 0;
  document.documentElement.scrollTop = 0;
}
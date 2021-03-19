
// Notre carte

// Affichage de la carte Leaflet
var mapboxAccessToken = 'pk.eyJ1IjoiZWNrbXVsIiwiYSI6ImNrbHVwdzZyZjJpazEybm4xaDBiNmZ3YXYifQ.lhJQN7_eVwozPh4cHA4UkQ';
var map_home = L.map('map_home').setView([40, 0], 2);

L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token=' + mapboxAccessToken, {
    id: 'mapbox/light-v9',
    attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
    tileSize: 512,
    zoomOffset: -1
}).addTo(map_home);


// Fonction renvoyant des couleurs (pour la carte choroplèthe)
function getColor(d) {
  if (d > 5){
      return '#993404';
  }
  if (d > 2){
      return '#d95f0e';
  }
  if (d > 1){
      return '#fe9929';
  }
  if (d > 0.5){
      return '#fec44f';
  }
  if (d > 0.25){
      return '#fee391';
  }
  else {
      return '#ffffd4';
  }
}

// Fonction style (pour les cercles)
function style(feature) {
    return {
    opacity: 1,
    fillOpacity: 0.8
}};


// Fonction pour les cercles lorsque la souris passe dessus
// Pour la petite div en haut à droite
function highlightFeature(e, features) {
    var layer = e.target;
        console.log(features)
    layer.setStyle({
        weight: 2,
        opacity: 1,
        color: 'white',
        dashArray: '3',
        fillOpacity: 0.7
    });

    if (!L.Browser.ie && !L.Browser.opera && !L.Browser.edge) {
        layer.bringToFront();
    }

    info.update = function (e) {
        this._div.innerHTML = `<h4> <b> ${features.properties.year}</b> </h4>
                                 <br> Nom du pays : <b>${features.properties.name}</b></br>
                                <br> Nombre de médailles d'or : <b> ${features.properties.or} </b></br>
                                <br> Nombre de médailles d'or (pour un million d'habitant)  : <b> ${features.properties.tot/1000} </b></br>`;
                            };

    info.update(e.target);
}

var info = L.control();
//  On appelle cette variable info
info.onAdd = function (map_home) {
    this._div = L.DomUtil.create('div', 'info'); // create a div with a class "info"
    // this.update();
    return this._div;
};


// Enlever la fonction hight light
function resetHighlight(e) {
    layer.resetStyle(e.target),
    info.update();
}

// Ajouter la légende de la densité
var legend = L.control({position: 'bottomright'});

legend.onAdd = function (map_home) {

    var div = L.DomUtil.create('div', 'info legend'),
        grades = [0, 0.25, 0.5, 1, 2, 5],
        labels = [];

    for (var i = 0; i < grades.length; i++) {
        div.innerHTML +=
            '<i style="background:' + getColor(grades[i] + 0.25) + '"></i> ' +
            grades[i] + (grades[i + 1] ? '&ndash;' + grades[i + 1] + '<br>' : '+');
    }
    return div;
};

legend.addTo(map_home);


// Fonction de style pour le fond des pays
var myStyle = {
    "color": "#fcbba1",
    "weight": 2.5,
    "opacity": 0.65,
    "stroke" : 100
};

// Liste des boutons années
// pour récupérer les id et créer l'événement
var listYears = ["mille48", "mille52",,"mille56","mille6","mille64","mille68","mille72","mille76","mille8","mille84","mille88", "mille92", "mille96","deuxmille","deuxmillequatre","deuxmillehuit","deuxmilledouze"];

for (var i in listYears) {
  console.log(i, listYears[i]);
  var element = document.getElementById(listYears[i]);
  if (element == null) {
    continue;
  }
  element.addEventListener("click", bouton, false);
};

var group = new L.layerGroup().addTo(map_home);
var test = 0
var oldTarget = null;


// Fonction englobant tous le fetch lancée pour une seule année (dpt de l'évenement listener)
//  on récupère l'année pour faire une requête sql (type post) sur pg admin
function bouton(event) {
    console.log(event);
    var target1 = event.target
    var year = target1.innerHTML;
    // var date = annee.innerHTML;
    var date_choisie = {c:year}

/// Effet button appuyer
target1.classList.add('clicked');
  if (oldTarget !== null) {
    oldTarget.classList.remove('clicked');
  }

// Fetch de la carte (un post pour récupérer l'année et lancer la bonne requête sql)
fetch('/api/bdd/toto', {
    method: 'post',
    body: JSON.stringify(date_choisie),
    headers: {'Content-Type': 'application/json'}
}
)
    .then((r) => r.json())
    .then((r) => {
        // ajout du contour des pays ayant au moins une médaille d'or pour l'année sélectionnée
        var jsonGeo = L.geoJson(r, {style: myStyle});
        group.clearLayers();
        // on supprime le fond déjà existant avant d'en rajouter un autre
        group.addLayer(jsonGeo);

        // ajout des cercles proportionnelles pour l'année sélectionée (par l'event listenner)
        L.geoJson(r,{onEachFeature:function(feature,layer){
          var listArea = [];
          // On choisi le polygone le plus important
          for (var i = 0; i < feature.geometry.coordinates.length; i++) {
            var polygon = turf.polygon(feature.geometry.coordinates[i]);
            var area = turf.area(polygon);
            listArea.push(area);
            }
            // On crée notre centroide (à partir du polygone sélectionné)
          var index = listArea.findIndex((area) => area === Math.max(...listArea));
          var polygon = turf.polygon(feature.geometry.coordinates[index]);
          var centroid = turf.centroid(polygon);
          var lat = centroid.geometry.coordinates[1];
          var lon = centroid.geometry.coordinates[0];
          //  On ajoute nos cercles proportionnelles avec leurs densités
        var circle = L.circleMarker([lat,lon], { color : getColor(feature.properties.tot/1000), radius : 0.5*feature.properties.or, style : style
        });
        // On appelle notre fonction highlightFeature
        circle.on({
            mouseover: function (e){highlightFeature(e,feature)},
            // function() { onClick(param) })
            mouseout: function(e){console.log(e.target);
                                e.target.setStyle({color: getColor(feature.properties.tot/1000),
                                })},
        });

        /// effet bouton appuyer
        oldTarget = target1;

        circle.addTo(group);
        info.addTo(map_home);
        }}
        );

    })

}

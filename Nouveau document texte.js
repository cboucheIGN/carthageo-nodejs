
// Notre carte

// Affichage de la carte Leaflet
var mapboxAccessToken = 'pk.eyJ1IjoiZWNrbXVsIiwiYSI6ImNrbHVwdzZyZjJpazEybm4xaDBiNmZ3YXYifQ.lhJQN7_eVwozPh4cHA4UkQ';

var map_home = L.map('map_home').setView([40, 0], 2);

L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token=' + mapboxAccessToken, {
    id: 'mapbox/light-v9',
    attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, Imagery � <a href="https://www.mapbox.com/">Mapbox</a>',
    tileSize: 512,
    zoomOffset: -1
}).addTo(map_home);


// Fonction renvoyant des couleurs (pour la carte choropl�the)
function getColor(d) {
  if (d > 100){
      return '#993404';
  }
  if (d > 50){
      return '#d95f0e';
  }
  if (d > 20){
      return '#fe9929';
  }
  if (d > 10){
      return '#fed98e';
  }
  if (d > 5){
      return '#ffffd4';
  }
  else {
      return '#ffffd4';
  }
}

// Fonction style (pour les cercle)
function style(feature) {
    return {
    opacity: 1,
    fillOpacity: 0.8
}};


// Fonction pour les cercles lorsque la souris passe dessus
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
        this._div.innerHTML = `<h4>Nom</h4>
                                <p> Nom du pays : ${features.properties.name}</p>
                                    <p> Nombre de m�dailles d'or  : ${features.properties.or}</p>`;
                            };

    info.update(e.target);
}

// function zoomToFeature(e) {
//     map.fitBounds(e.target.getBounds());
// }
function resetHighlight(e) {
    layer.resetStyle(e.target),
    info.update();
}

var info = L.control();

info.onAdd = function (map_home) {
    this._div = L.DomUtil.create('div', 'info'); // create a div with a class "info"
    // this.update();
    return this._div;
};


// Ajouter la l�gende de la densit�
var legend = L.control({position: 'bottomright'});

legend.onAdd = function (map_home) {

    var div = L.DomUtil.create('div', 'info legend'),
        grades = [0, 5, 10, 20, 50, 100],
        labels = [];

    // loop through our density intervals and generate a label with a colored square for each interval
    for (var i = 0; i < grades.length; i++) {
        div.innerHTML +=
            '<i style="background:' + getColor(grades[i] + 1) + '"></i> ' +
            grades[i] + (grades[i + 1] ? '&ndash;' + grades[i + 1] + '<br>' : '+');
    }
    
    return div;
};

legend.addTo(map_home);


// Fonction de style pour les pays
var myStyle = {
    "color": "#fcbba1",
    "weight": 2.5,
    "opacity": 0.65,
    "stroke" : 100
};


// if (document.getElementById("deuxmille").clicked == true){
// R�cuperer les identifiants de chaque bouton
var listYears = ["mille48", "mille52","mille56","mille6","mille64","mille68","mille72","mille76","mille8","mille84","mille88", "mille92", "mille96","deuxmille","deuxmillequatre","deuxmillehuit","deuxmilledouze","deuxmilleseize"];

for (var i in listYears) {
  console.log(i, listYears[i]);
  var element =  document.getElementById(listYears[i]);
  element.addEventListener("click", function(e){bouton(element.innerHTML)})
};



var group = new L.layerGroup().addTo(map_home);
var test = 0


// Fonction englobant tous le fetch lanc�e pour une seule ann�e (dpt du listener)
function bouton(a) {
    // var date = annee.innerHTML;
    var date_choisie = {c:a}

// Fetch de la carte (un post pour r�cup�rer l'ann�e et lancer la bonne requ�te sql)
fetch('/api/bdd/toto', {
    method: 'post',
    body: JSON.stringify(date_choisie),
    headers: {'Content-Type': 'application/json'}
}
)
    .then((r) => r.json())
    .then((r) => {
        // ajout du contour des pays ayant au moins une m�daille d'or pour l'ann�e s�lectionn�e
        // map_home.removeLayer(group);
        var jsonGeo = L.geoJson(r, {style: myStyle});
        group.clearLayers();
        group.addLayer(jsonGeo);

        // ajout des cercles proportionnelles pour l'ann�e s�lection�e
        L.geoJson(r,{onEachFeature:function(feature,layer){feature.geometry.type ==='MultiPolygon';
        var centroid = turf.centroid(feature);
        var lon = centroid.geometry.coordinates[0];
        var lat = centroid.geometry.coordinates[1];
        // var data = {c:datechoisi};
        var circle = L.circleMarker([lat,lon], {  color : getColor(feature.properties.or), radius : 0.5*feature.properties.or, style : style
        });
        circle.on({
            mouseover: function (e){highlightFeature(e,feature)},
            // function() { onClick(param) })
            mouseout: function(e){console.log(e.target);
                                e.target.setStyle({color: getColor(feature.properties.or),
                                })},
            // click: zoomToFeature
        });
        // map_home.addLayer(circle);

        circle.addTo(group);
        info.addTo(map_home);
        // L.geoJson(circle,{style: stylefunction, onEachFeature: onEachFeature}).addTo(map_home);
        }}
        );

    })

}

    resets.addEventListener('click', reset)



    // // Je r�cup�re mon formulaire, puis j'�coute l'event submit dessus. Lorsque j'entends l'event, je lance la fonction valide dans laquelle se trouve mon fetch
    // var formu = document.getElementById('formu');
    // formu.addEventListener('submit', valide);

    // function valide(e){
    //   //j'emp�che le comportement par d�faut du formulaire
    //   e.preventDefault();
    //   //Je r�cup�re ce qu'a �crit l'utilisateur dans le formualaire
    //   var saisie = formu.elements["ville"].value;
    //   //j'ins�re dans un objet literal ce que je viens de r�cup�rer (ici : la variable saisie)
    //   data = {saisie}

    //   //requete fetch qui permet d'envoyer la variable data � mon serveur
    //   fetch('/api/bdd/olympic',{
    //     method: 'post',
    //     body: JSON.stringify(data),
    //     headers: {'Content-Type': 'application/json'}
    //   })
    //   .then(r => r.json())
    //   .then((r) => {
    //     console.log(r);
    //   })












      // fetch(url)
      //   .then(r => r.json())
      //   .then(r2 => {
      //     console.log(r2.features[0].geometry.coordinates)
      //     //TO Cl�ment : insert code leaflet
      //   });
    // }
    // function roulant(e){
    //     var listpays = [];
    //     console.log(form.elements["valuedate"].value);
    //     var datechoisi = form.elements["valuedate"].value;
    //     var choix = {c:datechoisi};

    //     fetch("/api/bdd/searchcountry",{
    //       method: 'post',
    //       body: JSON.stringify(choix),
    //       headers: {'Content-Type': 'application/json'}
    //     })
    //     .then(req => req.json())
    //     .then((r) => {
    //       console.log(r)
    //       for (var i = 0; i<r.features.length; i++){
    //         pays = r.features[i].propertie.name;
    //         listpays.push(pays);
    //       }
    //       console.log(listpays);
    //       L.geoJSON(r).addTo(carte);
    //     })
    //   }

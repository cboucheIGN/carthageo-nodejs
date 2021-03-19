
// Création de la carte
var map = L.map('mapgame').setView([40, 0], 1.7);
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
	maxZoom: 19,
	attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map)
const url = 'http://localhost:8080/geoserver/olympics/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=olympics%3Athebestathlete&outputFormat=application%2Fjson'


// Appel du boutons et crétions variables pays
var elements = document.getElementsByClassName('button-game');
var codePays = null;
var poly = null;
var oldTarget = null;
var sportIconName = "athl";
var LeafIcon = L.Icon.extend({
    options: {
        iconSize: [50,50],
    }
});
var compte = 0

// Création de deux évenements pour chaque boutons
for (var i = 0; i < elements.length; i++) {
    elements[i].addEventListener('click', startGame);
    elements[i].addEventListener('mouseover', over);
}

/// Fonction Pop-up qui récupere les données du bouton appeler plus haut
// A partir d'un mouseover de l'utilisateur sur le boutton
function over(event) {
  if (event == null) {
    return;
  }
  var target = event.target;

//Pour appliquer les evenements du bouton sur les images
  if (target.classList.contains('image')) {
    target = target.parentNode;}

// Création de la div contenant les infos
  madiv = document.getElementById("popupmedal");
  madiv.innerHTML = target.getAttribute("data-nom")+
    " a gagné "+
    target.getAttribute("data-medal")+
    " médailles dans la discipline "+
    target.getAttribute("data-sport")
  };


/// Fonction Jeux ///
// A partir d'un clique de l'utilisateur sur le boutton
function startGame(event) {
  console.log('envent', event);
  var target = event.target;

  //Pour appliquer les evenements du bouton sur les images
  if (target.classList.contains('image')) {
    target = target.parentNode;
  }

//Pour laisser un effet sur le bouton, on stocke les anciennes target
  if (oldTarget !== null) {
    oldTarget.classList.remove('clicked');
  }
  target.classList.add('clicked');

	// Récupèrer les informations du bouttons
  codePays = target.value;
  sportIconName = target.getAttribute("data-sport");

// Applique une valeur dans lurl pour selectionner la bonne tile
  var newUrl = url + "&CQL_FILTER=id+=+" + codePays;
  fetch(newUrl)
      .then((r) => r.json())
      .then((data) => {
        console.log(data);
        if (poly !== null) {
            poly.remove();
        }
				// Mettre le pays de l'athlète avec un style de transparence
        poly = L.geoJson(data, {color: "#ffffff", opacity: 0, fillOpacity: 0}).addTo(map);
      });

  oldTarget = target;
}


/// Fonction qui créer les marqueurs
map.on('click',function(e){
  var lat = e.latlng.lat;
  var lon = e.latlng.lng;
  var theMarker = L.marker([lat,lon], {
    icon: new LeafIcon({iconUrl: "img/"+sportIconName+"_rouge-01.png"})
  })
  poly.eachLayer(function(layer) {
    var inside =
		// Turf nous permet de créer un booleen
      turf.booleanPointInPolygon(
        theMarker.toGeoJSON(),
        layer.toGeoJSON()
      );
// Si le marqueur est dans le polygone, tu m'affiche un marqueur vert
    if (inside) {
        theMarker.setIcon(new LeafIcon({iconUrl: "img/"+sportIconName+"_vert-01.png"}));
    }
// Sinon, tu m'affiche un marqueur rouge
		else{
			theMarker.setIcon(new LeafIcon({iconUrl: "img/"+sportIconName+"_rouge-01.png"}));
		}

  });
// Décompte
	compte = compte + 1;
	divCompteur = document.getElementById("compteur");
	divCompteur.innerHTML = "Vous avez joué "+compte+" fois. "

	// Application du marqueur
  theMarker.on('click', function(){theMarker.remove()});
  theMarker.addTo(map)
  });

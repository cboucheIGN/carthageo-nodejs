window.onload = function () {

//affiche dès l'entrée dans le serveur

//chart JS - 10 premiers pays vainqueur
fetch('/api/post/country_medal_type',{
  method: 'post',
  body: JSON.stringify(data),
  headers: {'Content-Type': 'application/json'}
    })
  .then((response) => response.json())
  .then((r) => {
    //liste des données sur année actuelle
    var outputpays = [];
    var outputdata = [];
    var outputor = [];
    var outputarg = [];
    var outputbrz = [];
    for (var i = 0; i<r.features.length; i++){
      outputpays.push(r.features[i].properties.pays)
      outputdata.push(r.features[i].properties.nb)
      outputor.push(r.features[i].properties.gold)
      outputarg.push(r.features[i].properties.silver)
      outputbrz.push(r.features[i].properties.bronze)
    };

    //construction du graphique
    var ctx = document.getElementById('myChart').getContext('2d');
    var myChart = new Chart(ctx, {
        type: 'horizontalBar',
        data: {
            labels: outputpays,
            datasets: [{
        label: "Nb médailles d'or",
        backgroundColor: window.chartColors.gold,
        data: outputor
      }, {
        label: "Nb médailles d'argent",
        backgroundColor: window.chartColors.silver,
        data: outputarg
      }, {
        label: "Nb médailles de bronze",
        backgroundColor: window.chartColors.bronze,
        data: outputbrz
      }]
        },
        options: {
          plugins:{
            legend:{
              labels:{
                font:{
                  family:'Helvetica',
                }
              }
            }
          },
          title: {
            display: true,
            text: 'Nombre de médailles accumulées par les pays en 1896'
          },
          tooltips: {
            mode: 'index',
            intersect: false
          },
          //site responsive
          responsive: true,
          scales: {
            xAxes: [{
              //barres sont emboitées les unes sur les autres
              stacked: true,
            }],
            yAxes: [{
              stacked: true
            }]
          }
        }
      });
    //destruction du Chart.Js si avance ou recule dans le temps
    buttonBefore.addEventListener('click', function(e){
      myChart.destroy();
    })
    buttonAfter.addEventListener('click', function(e){
      myChart.destroy();
    })
  });

//ajout lieu d'accueil des JO


  fetch('/api/post/host',{
    method: 'post',
    body: JSON.stringify(data),
    headers: {'Content-Type': 'application/json'}
      })
    .then((r) => r.json())
    .then((r) =>{
      //mise en place du marker, inversion des coordonnées selon standard
      var coordPoint = [r.features[0].geometry.coordinates[1],r.features[0].geometry.coordinates[0]]
      var layerGroup = new L.LayerGroup();
      var marker = L.marker(coordPoint, {icon: iconJO});
      marker.bindPopup("<b>Les jeux se sont déroulés à "+r.features[0].properties.hostcities).openPopup();
      layerGroup.addLayer(marker);
      layerGroup.addTo(map);


      //destruction marker si passage dans les années
      buttonAfter.addEventListener('click', function(e){
        layerGroup.removeLayer(marker);
      });

      buttonBefore.addEventListener('click', function(e){
        layerGroup.removeLayer(marker);
      });


    });


  //Création de la carte
  fetch('/api/post/carte',{
    method: 'post',
    body: JSON.stringify(data),
    headers: {'Content-Type': 'application/json'}
      })
    .then((r) => r.json())
    .then((r) =>{
      //création couleur selon 2 classes : première arrivé au JO ou depuis longtemps
      function getColor(d) {
        return d == anneeEnCours  ? "#F27405" :
         d != anneeEnCours  ? "#41A0F2" :
                      "#41A0F2";
      }

      //change style de la carte
      function style(feature) {
        return {
          fillColor: getColor(feature.properties.first),
          weight: 1,
          opacity: 1,
          color: 'white',
          dashArray: '3',
          fillOpacity: 0.7
        };
      }

      // ajouter de l'interaction
      function onEachFeature(feature, layer) {
          layer.on({
              mouseover: highlightFeature,
              mouseout: resetHighlight,
              click: zoomToFeature
          });
      }

      //envoie la couche sur la carte
      var layerGroup = new L.LayerGroup();
      var jsonGeo = L.geoJSON(r,{style: style, onEachFeature: onEachFeature});
      layerGroup.addLayer(jsonGeo);
      layerGroup.addTo(map);

      function resetHighlight(e) {
          jsonGeo.resetStyle(e.target);
          info.update();
      }

      //enleve la couche pour chaque année
      buttonAfter.addEventListener('click', function(e){
        layerGroup.removeLayer(jsonGeo);
      });

      buttonBefore.addEventListener('click', function(e){
        layerGroup.removeLayer(jsonGeo);
      });

    });

  //liste des nouvelles épreuves
  fetch('/api/post/epreuve',{
    method: 'post',
    body: JSON.stringify(data),
    headers: {'Content-Type': 'application/json'}
      })
    .then((response) => response.json())
    .then((r) => {
      const nouveaux = document.getElementById('nouveaux');
      //création d'une liste en HTML
      output = "<ul class='list-group list-group-flush'>";
      for (var i = 0; i<r.features.length; i++){
      output += "<li class='list-group-item'>" + r.features[i].propertie.discipline + '</li>'
      }
      output += '</ul>';
      //intégration dans notre HTML
      nouveaux.innerHTML = output;
    });

  //liste des épreuves disparues
  fetch('/api/post/epreuvedisparu',{
    method: 'post',
    body: JSON.stringify(data),
    headers: {'Content-Type': 'application/json'}
      })
    .then((response) => response.json())
    .then((r) => {
      const disparu = document.getElementById('disparu');
      //création d'une liste en HTML
      output = "<ul class='list-group list-group-flush'>";
      for (var i = 0; i<r.features.length; i++){
      output += "<li class='list-group-item'>" + r.features[i].propertie.discipline + '</li>'
      }
      output += '</ul>';
      //intégration dans notre HTML
      disparu.innerHTML = output;

    });


  //récupération d'un athlete célebre pour réaliser son portrait
  fetch('/api/post/athlete',{
    method: 'post',
    body: JSON.stringify(data),
    headers: {'Content-Type': 'application/json'}
      })
    .then((response) => response.json())
    .then((r) => {
      const portrait = document.getElementById('portrait');
      //recupere année en cours
      var annee = r.features[0].properties.annee
      //créer notre portrait constitué d'une image et d'un texte
      output = "<img style='float:up' src='img/portrait/"+annee+".jpg' width=350px><span class='portrait_text'>";
      var tabNom = r.features[0].properties.name.split(", ");

      if(r.features[0].properties.genre=='Men'){
        //si athlete Homme
        output += tabNom[1] +' '+tabNom[0]+' est un athlete des Jeux Olympiques de '+r.features[0].properties.annee+'. Il est connu pour avoir participé aux épreuves de '+r.features[0].properties.discipline+' où il a gagné '+r.features[0].properties.gold+' médailles d\'or, '+r.features[0].properties.silver+' médailles d\'argent et '+r.features[0].properties.bronze+' médailles de bronze.';
      }else{
        //si athlete Femme
        output += tabNom[1] +' '+tabNom[0]+' est un athlete des Jeux Olympiques de '+r.features[0].properties.annee+'. Il est connu pour avoir participé aux épreuves de '+r.features[0].properties.discipline+' où il a gagné '+r.features[0].properties.gold+' médailles d\'or, '+r.features[0].properties.silver+' médailles d\'argent et '+r.features[0].properties.bronze+' médailles de bronze.';
      }
      output += "</span>";
      portrait.innerHTML = output
    });

    //afficher texte introductif de l'année en cours
    fetch('/api/post/evenement',{
      method: 'post',
      body: JSON.stringify(data),
      headers: {'Content-Type': 'application/json'}
        })
      .then((response) => response.json())
      .then((r) => {
        const intro = document.getElementById('intro');
        output = '<div>';
        output += '<p>'+r.features[0].properties.evenement+'</p>'
        output += '</div>';
        intro.innerHTML = output
      });
}


//Fond de carte
var map = L.map('map').setView([51.50, -0.10], 1);
map.createPane('labels');
map.getPane('labels').style.zIndex = 650;

map.getPane('labels').style.pointerEvents = 'none';

var positron = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Light_Gray_Base/MapServer/tile/{z}/{y}/{x}', {
	attribution: 'Tiles &copy; Esri &mdash; Esri, DeLorme, NAVTEQ',
	maxZoom: 16
}).addTo(map);

//couleur
function getColor(d) {
  return d == 'Première'  ? "#F27405" :
   d == 'Depuis longtemps'  ? "#41A0F2" :
                "#000000";
}

// information en haut à droite de la carte
var info = L.control();
info.onAdd = function (map) {
    this._div = L.DomUtil.create('div', 'info'); // create a div with a class "info"
    this.update();
    return this._div;
};
// Ajout du texte
info.update = function (props,res) {
    this._div.innerHTML = '<h4>Pays participant</h4>' +  (props ?
        '<br/>Première participation en '+props.first+'</br>'
        + (res ?
        '<br> A obtenu un total de '+res.nb+' médailles.</br><br> Soit '+res.gold+' d\'or, '+res.silver+' d\'argent et '+res.bronze+' de bronze.</br>'
        : "N'a aucune médaille")
        : 'Mettre curseur sur un des pays');
};
//legende
var legend = L.control({position: 'bottomright'});

legend.onAdd = function (map) {

  var div = L.DomUtil.create('div', 'info legend'),
      labels = ['<strong>Participation</strong>'],
      categories = ['Première','Depuis longtemps'];

  // loop through our density intervals and generate a label with a colored square for each interval
  for (var i = 0; i < categories.length; i++) {
      div.innerHTML +=
      labels.push(
              '<i class="circle" style="background:' + getColor(categories[i]) + '"></i> ' +
    (categories[i] ? categories[i] : '+'));
}

  div.innerHTML = labels.join('<br>');

  return div;
};

//ajoute legende et information
info.addTo(map);
legend.addTo(map);

//création des boutons pour passer les années
var listAnnee = ['1948', '1952', '1956', '1960', '1964','1968','1972','1976','1980','1984','1988'];
const boiteAnnee = document.getElementById('annee');
const buttonBefore = document.getElementById('avant');
const buttonAfter = document.getElementById('apres');
var anneeEnCours = boiteAnnee.innerHTML;
data = {annee: anneeEnCours}



buttonAfter.addEventListener("click",after)
buttonBefore.addEventListener("click",before)

//bouton avance dans le temps
function after(e) {
  e.preventDefault();
  var anneeEnCours = boiteAnnee.innerHTML;
  var place = listAnnee.indexOf(anneeEnCours);
  var anneeEnCours = listAnnee[place+1]
  if(anneeEnCours==undefined){
    boiteAnnee.innerHTML = 1948
  }else{
    boiteAnnee.innerHTML = anneeEnCours
  }
}

//bouton recule dans le temps
function before(e) {
  e.preventDefault();
  var anneeEnCours = boiteAnnee.innerHTML;
  var place = listAnnee.indexOf(anneeEnCours);
  var anneeEnCours = listAnnee[place-1]
  if(anneeEnCours==undefined){
    boiteAnnee.innerHTML = 1988
  }else{
    boiteAnnee.innerHTML = anneeEnCours
  }
}


//Si avance ou recule dans le temps fonction pour lancer une nouvelle requete fetch
buttonAfter.addEventListener('click', valide);
buttonBefore.addEventListener('click', valide);

function valide(e){
//j'empêche le comportement par défaut du formulaire
  e.preventDefault();
  //Je récupère l'année en cours
  var anneeEnCours = boiteAnnee.innerHTML;
  //j'insère l'année dans un JSON
  data = {annee: anneeEnCours}


  //requete fetch qui permet d'envoyer la variable data à mon serveur. Change dynamiquement table et carte
  fetch('/api/post/country_medal_type',{
    method: 'post',
    body: JSON.stringify(data),
    headers: {'Content-Type': 'application/json'}
      })
      .then(r => r.json())
      .then((r) => {
        //création varibale à implanter
        var outputpays = [];
        var outputdata = [];
        var outputor = [];
        var outputarg = [];
        var outputbrz = [];
        for (var i = 0; i<r.features.length; i++){
          outputpays.push(r.features[i].properties.pays)
          outputdata.push(r.features[i].properties.nb)
          outputor.push(r.features[i].properties.gold)
          outputarg.push(r.features[i].properties.silver)
          outputbrz.push(r.features[i].properties.bronze)
        };

        //Charte JS : stacked bar
        var anneeEnCours = boiteAnnee.innerHTML;
        var ctx = document.getElementById('myChart').getContext('2d');
        var myChart = new Chart(ctx, {
            type: 'horizontalBar',
            data: {
                labels: outputpays,
                datasets: [{
    				label: "Nb médailles d'or",
    				backgroundColor: window.chartColors.gold,
    				data: outputor
    			}, {
    				label: "Nb médailles d'argent",
    				backgroundColor: window.chartColors.silver,
    				data: outputarg
    			}, {
    				label: "Nb médailles de bronze",
    				backgroundColor: window.chartColors.bronze,
    				data: outputbrz
    			}]
            },
            options: {
    					title: {
    						display: true,
    						text: 'Nombre de médailles accumulées par les pays en '+anneeEnCours
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
    			});
        //suppresion si passe des années
        buttonBefore.addEventListener('click', function(e){
          myChart.destroy();
        })
        buttonAfter.addEventListener('click', function(e){
          myChart.destroy();
        })

        fetch('/api/post/host',{
          method: 'post',
          body: JSON.stringify(data),
          headers: {'Content-Type': 'application/json'}
            })
          .then((r) => r.json())
          .then((r) =>{
            //mise en place du marker, inversion des coordonnées selon standard
            var coordPoint = [r.features[0].geometry.coordinates[1],r.features[0].geometry.coordinates[0]]
            var layerGroup = new L.LayerGroup();
            var marker = L.marker(coordPoint, {icon: iconJO});
            marker.bindPopup("<b>Les jeux se sont déroulés à "+r.features[0].properties.hostcities).openPopup();
            layerGroup.addLayer(marker);
            layerGroup.addTo(map);


            //destruction marker si passage dans les années
            buttonAfter.addEventListener('click', function(e){
              layerGroup.removeLayer(marker);
            });

            buttonBefore.addEventListener('click', function(e){
              layerGroup.removeLayer(marker);
            });
            });


        //carte des participants
        fetch('/api/post/carte',{
          method: 'post',
          body: JSON.stringify(data),
          headers: {'Content-Type': 'application/json'}
            })
          .then((r) => r.json())
          .then((r) =>{
            function getColor(d) {
              return d == anneeEnCours  ? "#F27405" :
               d != anneeEnCours  ? "#41A0F2" :
                            "#41A0F2";
            }

            function style(feature) {
              return {
                fillColor: getColor(feature.properties.first),
                weight: 1,
                opacity: 1,
                color: 'white',
                dashArray: '3',
                fillOpacity: 0.7
              };
            }

            // ajouter de l'interaction
            function onEachFeature(feature, layer) {
                layer.on({
                    mouseover: highlightFeature,
                    mouseout: resetHighlight,
                    click: zoomToFeature
                });
            }




            var geojson;
            // ... our listeners
            geojson = L.geoJSON(r);


            var layerGroup = new L.LayerGroup();
            var jsonGeo = L.geoJSON(r,{style: style, onEachFeature: onEachFeature});
            layerGroup.addLayer(jsonGeo);
            layerGroup.addTo(map);

            function resetHighlight(e) {
                jsonGeo.resetStyle(e.target);
                info.update();
            }


            buttonAfter.addEventListener('click', function(e){
              layerGroup.removeLayer(jsonGeo);
              layerGroup.removeLayer(geojson);
            });

            buttonBefore.addEventListener('click', function(e){
              layerGroup.removeLayer(jsonGeo);
              layerGroup.removeLayer(geojson);
            });

          });

          //liste des epreuve
          fetch('/api/post/epreuve',{
            method: 'post',
            body: JSON.stringify(data),
            headers: {'Content-Type': 'application/json'}
              })
            .then((response) => response.json())
            .then((r) => {
              const nouveaux = document.getElementById('nouveaux');
              output = "<ul class='list-group list-group-flush'>";
              for (var i = 0; i<r.features.length; i++){
              output += "<li class='list-group-item'>" + r.features[i].propertie.discipline + '</li>'
              }
              output += '</ul>';
              nouveaux.innerHTML = output;
            });

          fetch('/api/post/epreuvedisparu',{
            method: 'post',
            body: JSON.stringify(data),
            headers: {'Content-Type': 'application/json'}
              })
            .then((response) => response.json())
            .then((r) => {
              const disparu = document.getElementById('disparu');
              output = "<ul class='list-group list-group-flush'>";
              for (var i = 0; i<r.features.length; i++){
              output += "<li class='list-group-item'>" + r.features[i].propertie.discipline + '</li>'
              }
              output += '</ul>';
              disparu.innerHTML = output;
            });

          //athletes
          fetch('/api/post/athlete',{
            method: 'post',
            body: JSON.stringify(data),
            headers: {'Content-Type': 'application/json'}
              })
            .then((response) => response.json())
            .then((r) => {
              console.log(r.features);
              const portrait = document.getElementById('portrait');

              var annee = r.features[0].properties.annee
              console.log(annee)
              output = "<img style='float:up' src='img/portrait/"+annee+".jpg' width=350px><span class='portrait_text'>";
              var tabNom = r.features[0].properties.name.split(", ");
              if(r.features[0].properties.genre=='Men'){
                output += tabNom[1] +' '+tabNom[0]+' est un athlete des Jeux Olympiques de '+r.features[0].properties.annee+'. Il est connu pour avoir participé aux épreuves de '+r.features[0].properties.discipline+' où il a gagné '+r.features[0].properties.gold+' médailles d\'or, '+r.features[0].properties.silver+' médailles d\'argent et '+r.features[0].properties.bronze+' médailles de bronze.';
              }else{
                output += '<p>' + tabNom[1] +' '+tabNom[0]+' est un athlete des Jeux Olympiques de '+r.features[0].properties.annee+'. Il est connu pour avoir participé aux épreuves de '+r.features[0].properties.discipline+' où il a gagné '+r.features[0].properties.gold+' médailles d\'or, '+r.features[0].properties.silver+' médailles d\'argent et '+r.features[0].properties.bronze+' médailles de bronze.</p>';
              }
              output += "</span>";
              portrait.innerHTML = output
            });

            //evenement
            fetch('/api/post/evenement',{
              method: 'post',
              body: JSON.stringify(data),
              headers: {'Content-Type': 'application/json'}
                })
              .then((response) => response.json())
              .then((r) => {
                const intro = document.getElementById('intro');
                output = '<div>';
                output += '<p>'+r.features[0].properties.evenement+'</p>'
                output += '</div>';
                intro.innerHTML = output
              });
    })
  }






function highlightFeature(e) {
    var layer = e.target;

    layer.setStyle({
        weight: 5,
        color: '#666',
        dashArray: '',
        fillOpacity: 0.7
    });

    if (!L.Browser.ie && !L.Browser.opera && !L.Browser.edge) {
        layer.bringToFront();
    }
    var dataMedal = {annee: anneeEnCours, pays: layer.feature.properties.name}
    //recuperer information deuxieme table
    fetch('/api/post/medal_pays',{
      method: 'post',
      body: JSON.stringify(dataMedal),
      headers: {'Content-Type': 'application/json'}
        })
      .then((response) => response.json())
      .then((r) => {
        if(r.features.length == 0){
          info.update(layer.feature.properties, null)
        }else{
          info.update(layer.feature.properties, r.features[0].properties)
        }

      });

}

function zoomToFeature(e) {
    map.fitBounds(e.target.getBounds());
}

window.chartColors = {
red: 'rgb(255, 99, 132)',
orange: 'rgb(255, 159, 64)',
yellow: 'rgb(255, 205, 86)',
green: 'rgb(75, 192, 192)',
blue: 'rgb(54, 162, 235)',
purple: 'rgb(153, 102, 255)',
grey: 'rgb(201, 203, 207)',
gold: 'rgba(242, 202, 80, 1)',
silver: 'rgba(217, 217, 217, 1)',
bronze: 'rgba(242, 187, 155, 1)'
};

var iconJO = L.icon({
    iconUrl: 'img/torche.png',
    iconSize:     [28, 39], // size of the icon
});

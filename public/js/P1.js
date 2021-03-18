window.onload = function () {

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
}



//Année variation
/*
var listAnnee = ['1896', '1900', '1904', '1908', '1912'];
const boiteAnnee = document.getElementById('annee');
const buttonBefore = document.getElementById('avant');
const buttonAfter = document.getElementById('apres');
var compteur = 0

function after(e) {
  e.preventDefault();
  compteur++
  var anneeEnCours = boiteAnnee.innerHTML;
  var place = listAnnee.indexOf(anneeEnCours);
  var anneeEnCours = listAnnee[place+1]
  boiteAnnee.innerHTML = anneeEnCours
  anneeEnCours = boiteAnnee.innerHTML
  console.log(compteur)
  }



buttonAfter.addEventListener("click",after)


if(anneeEnCours = listAnnee[0]){
  anneeEnCours = boiteAnnee.innerHTML
  data = {annee: anneeEnCours}
}else{
  // Je récupère mon formulaire, puis j'écoute l'event submit dessus. Lorsque j'entends l'event, je lance la fonction valide dans laquelle se trouve mon fetch
  buttonAfter.addEventListener('click', valide);

  function valide(e){
  //j'empêche le comportement par défaut du formulaire
    e.preventDefault();
  //Je récupère ce qu'a écrit l'utilisateur dans le formualaire
    anneeEnCours = boiteAnnee.innerHTML
    var place = listAnnee.indexOf(anneeEnCours);
    var anneeEnCours = listAnnee[place+1];
  //j'insère dans un objet literal ce que je viens de récupérer (ici : la variable saisie)
    data = {annee: anneeEnCours}
    console.log(data)
}
}
fetch('/api/annee/search',{
  method: 'post',
  body: JSON.stringify(data),
  headers: {'Content-Type': 'application/json'}
    })
    .then(r => r.json())
    .then((r) => {
      console.log(r)
    });

*/

//Carte
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
  return d === 'Première'  ? "#FF0000" :
   d === 'Depuis longtemps'  ? "#0000FF" :
                "#ff7f00";
}

// custom control
var info = L.control();
info.onAdd = function (map) {
    this._div = L.DomUtil.create('div', 'info'); // create a div with a class "info"
    this.update();
    return this._div;
};
// method that we will use to update the control based on feature properties passed
info.update = function (props,res) {
    this._div.innerHTML = '<h4>Pays participant</h4>' +  (props ?
        '<b>' + props.name + '</b><br />' + props.pop + ' people</br><br/>'+props.first+'</br>'
        : 'Hover over a state')
        + (res ?
        '<br> A obtenu un total de '+res.nb+' médailles.</br><br> Soit '+res.gold+' d\'or, '+res.silver+' d\'argent et '+res.bronze+' de bronze.</br>'
        : "N'a aucune médaille");
};
//ajoute legende
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

info.addTo(map);
legend.addTo(map);


var listAnnee = ['1896', '1900', '1904', '1908', '1912'];
const boiteAnnee = document.getElementById('annee');
const buttonBefore = document.getElementById('avant');
const buttonAfter = document.getElementById('apres');
var anneeEnCours = boiteAnnee.innerHTML;
data = {annee: anneeEnCours}



buttonAfter.addEventListener("click",after)
buttonBefore.addEventListener("click",before)

function after(e) {
  e.preventDefault();
  var anneeEnCours = boiteAnnee.innerHTML;
  var place = listAnnee.indexOf(anneeEnCours);
  var anneeEnCours = listAnnee[place+1]
    if(anneeEnCours==undefined){
      boiteAnnee.innerHTML = 1896
    }else{
      boiteAnnee.innerHTML = anneeEnCours
    }
  }

function before(e) {
  e.preventDefault();
  var anneeEnCours = boiteAnnee.innerHTML;
  var place = listAnnee.indexOf(anneeEnCours);
  var anneeEnCours = listAnnee[place-1]
  if(anneeEnCours==undefined){
    boiteAnnee.innerHTML = 1912
  }else{
    boiteAnnee.innerHTML = anneeEnCours
  }
}


// Je récupère mon formulaire, puis j'écoute l'event submit dessus. Lorsque j'entends l'event, je lance la fonction valide dans laquelle se trouve mon fetch
buttonAfter.addEventListener('click', valide);
buttonBefore.addEventListener('click', valide);

function valide(e){
//j'empêche le comportement par défaut du formulaire
  e.preventDefault();
  //Je récupère ce qu'a écrit l'utilisateur dans le formualaire
  var anneeEnCours = boiteAnnee.innerHTML;
  //j'insère dans un objet literal ce que je viens de récupérer (ici : la variable saisie)
  data = {annee: anneeEnCours}


  //requete fetch qui permet d'envoyer la variable data à mon serveur. Change dynamiquement table et carte
  fetch('/api/post/country_medal_type',{
    method: 'post',
    body: JSON.stringify(data),
    headers: {'Content-Type': 'application/json'}
      })
      .then(r => r.json())
      .then((r) => {
        console.log(r);
        console.log(annee)
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

        //ajout lieu des JO
          fetch('/api/post/host',{
            method: 'post',
            body: JSON.stringify(data),
            headers: {'Content-Type': 'application/json'}
              })
            .then((r) => r.json())
            .then((r) =>{
              console.log(r)
              var coordPoint = [r.features[0].geometry.coordinates[1],r.features[0].geometry.coordinates[0]]
              console.log(coordPoint)
              var layerGroup = new L.LayerGroup();
              var marker = L.marker(coordPoint);
              layerGroup.addLayer(marker);
              layerGroup.addTo(map);

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
            console.log(r)
            var layerGroup = new L.LayerGroup();
            var jsonGeo = L.geoJSON(r)
            layerGroup.addLayer(jsonGeo);

            layerGroup.addTo(map);

            // ajouter de l'interaction (zzom sur les états)

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
                info.update(layer.feature.properties);
            }

            function resetHighlight(e) {
                geojson.resetStyle(e.target);
                info.update();
            }

            var geojson;
            // ... our listeners
            geojson = L.geoJSON(r);



            function onEachFeature(feature, layer) {
                layer.on({
                    mouseover: highlightFeature,
                    mouseout: resetHighlight,
                    click: zoomToFeature
                });
            }


            //afficher si première participation
            var anneeBase = 1896
            var anneeEnCours = boiteAnnee.innerHTML;
            const newColorFunction = function(feature) {
              var name = feature.properties.first;
              if(name == anneeEnCours){
                return 'red';
              }
            }

            const newStyle = function(feature) {
              return{
                  fillColor: newColorFunction(feature)
              }
            }

            geojson = L.geoJSON(r, {
                style: newStyle,
                onEachFeature: onEachFeature
            });
            layerGroup.addLayer(geojson);
            layerGroup.addTo(map);

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


            buttonAfter.addEventListener('click', function(e){
              layerGroup.removeLayer(jsonGeo);
              layerGroup.removeLayer(geojson);
            });

            buttonBefore.addEventListener('click', function(e){
              layerGroup.removeLayer(jsonGeo);
              layerGroup.removeLayer(geojson);
            // L.geoJson(response).addTo(map);
            // console.log(response)
          });

      });
        fetch('/api/post/epreuve',{
          method: 'post',
          body: JSON.stringify(data),
          headers: {'Content-Type': 'application/json'}
            })
          .then((response) => response.json())
          .then((r) => {
            console.log('réponse', r.features);
            const result = document.getElementById('result');
            output = '<ul>';
            for (var i = 0; i<r.features.length; i++){
            output += '<li>' + r.features[i].propertie.discipline + '</li>'
            }
            output += '</ul>';
            result.innerHTML = output;

          });
          fetch('/api/post/athlete',{
            method: 'post',
            body: JSON.stringify(data),
            headers: {'Content-Type': 'application/json'}
              })
            .then((response) => response.json())
            .then((r) => {
              console.log(r.features);
              const portrait = document.getElementById('portrait');
              output = '<div>';

              for (var i = 0; i<r.features.length; i++){
                var annee = r.features[i].properties.annee
                output += "<img src=../img/portrait/"+annee+".jpg width = 200px >";
                var tabNom = r.features[i].properties.name.split(", ")
                if(r.features[i].properties.genre=='Men'){
                  output += '<p>' + tabNom[1] +' '+tabNom[0]+' est un athlete des Jeux Olympiques de '+r.features[i].properties.annee+'.</p>'
                }else{
                  output += '<p>' + tabNom[1] +' '+tabNom[0]+' est une athlete des Jeux Olympiques de '+r.features[i].properties.annee+'</p>'
                }
              }
              output += '</div>';
              portrait.innerHTML = output
            });
    })
  }






//affiche dès l'entrée dans le serveur
fetch('/api/post/country_medal_type',{
  method: 'post',
  body: JSON.stringify(data),
  headers: {'Content-Type': 'application/json'}
    })
  .then((response) => response.json())
  .then((r) => {
    console.log(r);
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

    //Charte JS
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
						text: 'Nombre de médailles accumulées par les pays en 1896'
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
    buttonBefore.addEventListener('click', function(e){
      myChart.destroy();
    })
    buttonAfter.addEventListener('click', function(e){
      myChart.destroy();
    })
  });

//ajout lieu des JO
  fetch('/api/post/host',{
    method: 'post',
    body: JSON.stringify(data),
    headers: {'Content-Type': 'application/json'}
      })
    .then((r) => r.json())
    .then((r) =>{
      console.log(r)
      var coordPoint = [r.features[0].geometry.coordinates[1],r.features[0].geometry.coordinates[0]]
      console.log(coordPoint)
      var layerGroup = new L.LayerGroup();
      var marker = L.marker(coordPoint);
      layerGroup.addLayer(marker);
      layerGroup.addTo(map);

      buttonAfter.addEventListener('click', function(e){
        layerGroup.removeLayer(marker);
      });

      buttonBefore.addEventListener('click', function(e){
        layerGroup.removeLayer(marker);
      });


    });



  fetch('/api/post/carte',{
    method: 'post',
    body: JSON.stringify(data),
    headers: {'Content-Type': 'application/json'}
      })
    .then((r) => r.json())
    .then((r) =>{
      function getColor(d) {
        return d == anneeEnCours  ? "#FF0000" :
         d == anneeEnCours  ? "#0000FF" :
                      "#ff7f00";
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
      console.log('réponse', r.features);
      const result = document.getElementById('nouveaux');
      output = '<ul>';
      for (var i = 0; i<r.features.length; i++){
      output += '<li>' + r.features[i].propertie.discipline + '</li>'
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
      console.log('réponse', r.features);
      const result = document.getElementById('disparu');
      output = '<ul>';
      for (var i = 0; i<r.features.length; i++){
      output += '<li>' + r.features[i].propertie.discipline + '</li>'
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

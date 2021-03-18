var map = L.map('carte_medailles').setView([37.8, -96], 2);
var OpenStreetMap_HOT = L.tileLayer('https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png', {
	maxZoom: 19,
	attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, Tiles style by <a href="https://www.hotosm.org/" target="_blank">Humanitarian OpenStreetMap Team</a> hosted by <a href="https://openstreetmap.fr/" target="_blank">OpenStreetMap France</a>'
}).addTo(map);
var layerGroup = new L.LayerGroup();

var bool = true;

var formu = document.getElementById('formu');
var okey = document.getElementById('Okey');
okey.addEventListener("click", getMedal);

function couleur(medaille) {
  if(medaille=="gold") {
    return 'orange'
  }
  else if(medaille == "silver") {
    return 'grey'
  }
  else {return 'brown'}

}

function getMedal(event) {
  event.preventDefault();
    var medal_type = formu.options[formu.selectedIndex].text.toLowerCase();
    var annee = parseInt(document.getElementById("annee").value);

    var parametres = {
        year: annee,
        medal: medal_type
    };

    fetch('/api/medals/carto', {
            method: 'POST',
            body: JSON.stringify(parametres),
            headers: {
              'Content-Type': 'application/json'
            }

          })

            .then((r) => r.json())
            .then((r) => {
                
                    if (bool==false) {
                        
                        layerGroup.clearLayers()
                        
                      }
                        var info = L.control();

                        function highlightFeature(e, feature) {
                          var layer = e.target;
                      
                          layer.setStyle({
                              weight: 5,
                              color: '#666',
                              dashArray: '',
                              fillOpacity: 0.7
                          });

                          console.log(feature);

                          info.update(feature.properties);
                      
                          if (!L.Browser.ie && !L.Browser.opera && !L.Browser.edge) {
                              layer.bringToFront();
                          }}

                    function returnTheStyle(e) {
                      var couche = e.target;
                      couche.setStyle({color: couleur(medal_type), stroke: true, opacity: 0.2, fill:true, fillOpacity:0.6})
                      info.update();
                    }
                    
                    var jsonGeo = L.geoJSON(r, {
                      fillColor:"#fdebd0 ", weight: 1.5, stroke: true, fill:true, color: couleur(medal_type), opacity:1, fillOpacity:1}
 
                      )
                    //layerGroup.addLayer(jsonGeo);
                    var geojson;
                    
                    geojson = L.geoJson(r,{onEachFeature:function createBulle(feature, layer) {
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
                      var lon = centroid.geometry.coordinates[0]
                      var circles = L.circleMarker([lat,lon], {color: couleur(medal_type), stroke: true, opacity: 0.2, fill:true, fillOpacity:0.6, radius : 0.7*feature.properties.medal});
                      circles.on({
                        mouseover: function (e){highlightFeature (e, feature)}, 
                        mouseout: returnTheStyle
                        
                    });
                      
                      
                      layerGroup.addLayer(jsonGeo); 
                      layerGroup.addLayer(circles); 

                      //var info = L.control();

                      info.onAdd = function (map) {
                        if (bool==false){
                          var controle = document.getElementsByClassName('leaflet-top leaflet-right')[0]
                          controle.innerHTML = "";
                          
                        }
                        this._div = L.DomUtil.create('div', 'info'); // create a div with a class "info"

                         
                          this.update();
                          return this._div;
                      };

                      // method that we will use to update the control based on feature properties passed

                      info.update = function (props) {
                       
                          
                          this._div.innerHTML = '<h4>Number of '+ medal_type +' medals</h4>' +  (props ?
                              '<b>' + props.name + '</b><br />' + props.medal + " medals"
                              : 'Hover over a country');
                      };

                      info.addTo(map);
  
                }
              }
            )
                
                layerGroup.addTo(map);
                bool=false

          }
  
        )
      };    




 
   







//LEAFLET//


var jomap = L.map('jomap').setView([27.444586473380898, 2.955829199696631], 2);
L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Light_Gray_Base/MapServer/tile/{z}/{y}/{x}', {
	attribution: 'Tiles &copy; Esri &mdash; Esri, DeLorme, NAVTEQ',
	maxZoom: 16
}).addTo(jomap);


//Creation de la carte 1 sur leaflet
// var mapboxAccessToken = 'pk.eyJ1IjoidGFueWFnZW9tIiwiYSI6ImNrbHVweml0MDBreHkycG8zY2djMDN6dG0ifQ.dA-K7tKA6OZQ7gn6e-9wdQ';



// L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token=' + mapboxAccessToken, {
//     id: 'mapbox/light-v9',
//     attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
//     tileSize: 512,
//     zoomOffset: -1
// }).addTo(jomap);


// Creation des icons flammes pour identifier quels types de JO pour chaque points


var fireIcon = L.icon({
    iconUrl: 'img/summer.png',
    iconSize:     [25, 25]
});
// Incertion des autres icons
var winterIcon = L.icon({
    iconUrl: 'img/winter.png',
    iconSize:     [20, 25]
});
var canceledIcon = L.icon({
    iconUrl: 'img/canceled.png',
    iconSize:     [20, 25]
});
var reportedIcon = L.icon({
    iconUrl: 'img/reported.png',
    iconSize:     [20, 25]
});
var futurIcon = L.icon({
    iconUrl: 'img/future.png',
    iconSize:     [20, 25]
});
var interIcon = L.icon({
    iconUrl: 'img/inter.png',
    iconSize:     [20, 25]
});



function iconfirejo (feature){
    var icon; 
    if (feature.properties.type === "Summer") icon = fireIcon;
    else if (feature.properties.type === "Winter") icon = winterIcon;
    else if (feature.properties.type === "Canceled") icon = canceledIcon;
    else if (feature.properties.type === "Reported") icon = reportedIcon;
    else if (feature.properties.type === "Future") icon = futurIcon;
    else icon = interIcon;

    return icon;
}

function whenclick(e) {
    console.log(e.target)
    var info = '';
    if (e.target.feature.properties.hostcities) {
        info += '<p> Ville : ' + e.target.feature.properties.hostcities + '</p>'; 
    }
    if (e.target.feature.properties.year) {
        info += '<p> Date : ' + e.target.feature.properties.year + '</p>';
    }
    if (e.target.feature.properties.funfact) {
        info += '<p> Fact : ' + e.target.feature.properties.funfact + '</p></br>';
    }
    if (e.target.feature.properties.img) {
        info += '<div style = "display : flex; justify-content = end"> <img class="rounded mx-auto d-block" style = "width : 100px;" src = "' + e.target.feature.properties.img + '"></div></br>';
    }
    var carton = document.getElementById("infoville");
    console.log(carton);
    carton.innerHTML = info;
}

function highlightFeature(e) {
    var markerevent = e.target;
}

function resetHighlight(e) {
    jsville.resetStyle(e.target);
}

function onEachFeature(feature,markerevent) {
    markerevent.on({
        mouseover: highlightFeature,
        mouseout: resetHighlight,
        click : whenclick 
    });
}


var jsville = L.geoJson(ville, {
    pointToLayer : function(feature, latlng) { 
        return L.marker(latlng, {icon : iconfirejo(feature)})
    },
    style : iconfirejo,
    onEachFeature: onEachFeature, 
}).addTo(jomap);

//Legende carte1

var legend = L.control({ position: "bottomleft" });

legend.onAdd = function(jomap) {
  var div = L.DomUtil.create("div", "legend");
  div.innerHTML += "<h4>Villes hôtes des JO</h4>";
  div.innerHTML += '<i class="icon" style="background : #ff7f2aff"></i><span>Eté</span><br>';
  div.innerHTML += '<i class="icon" style="background : #5f8dd3ff"></i><span>Hiver</span><br>';
  div.innerHTML += '<i class="icon" style="background : #ffe680ff"></i><span>Intercalés</span><br>';
  div.innerHTML += '<i class="icon" style="background : #ff8080ff"></i><span>Reportés</span><br>';
  div.innerHTML += '<i class="icon" style="background : #916f6fff"></i><span>Annulés</span><br>';
  div.innerHTML += '<i class="icon" style="background : #8dd35fff"></i><span>Futurs</span><br>';
//   div.innerHTML += '<i class="icon" style="background-image: url(https://d30y9cdsu7xlg0.cloudfront.net/png/194515-200.png);background-repeat: no-repeat;"></i><span>Grænse</span><br>';
  
  

  return div;
};

legend.addTo(jomap);


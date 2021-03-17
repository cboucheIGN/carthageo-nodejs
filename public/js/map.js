// alert('Script map.js chargé');

window.onload = function () {

  var mape = document.getElementById('map');
  var mymap = L.map('map').setView([51.505, -0.09], 2);

  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
  }).addTo(mymap);

  fetch('/api/bdd/json')
    .then((r) => r.json())
    .then((r) => {
      var layerGroup = new L.LayerGroup();
      var jsonGeo = L.geoJSON(r)
      layerGroup.addLayer(jsonGeo);

      layerGroup.addTo(mymap);

      var logo = document.getElementById('logo');
      logo.addEventListener('click', function(e){
        // layerGroup.removeLayer(jsonGeo);
        layerGroup.clearLayers()
      })
    })

    var logo = document.getElementById('logo');
    var date = "logo";
    logo.innerHTML = "<img src='img/" + date + ".png'>"

    // Je récupère mon formulaire, puis j'écoute l'event submit dessus. Lorsque j'entends l'event, je lance la fonction valide dans laquelle se trouve mon fetch
    var formu = document.getElementById('formu');
    formu.addEventListener('submit', valide);

    formu.elements["age"].addEventListener('change', test);
    function test(e){
      console.log(e);
    }

    function valide(e){
      //j'empêche le comportement par défaut du formulaire
      e.preventDefault();
      //Je récupère ce qu'a écrit l'utilisateur dans le formualaire
      var saisie = formu.elements["ville"].value;
      //j'insère dans un objet literal ce que je viens de récupérer (ici : la variable saisie)
      data = {hello: saisie}

      //requete fetch qui permet d'envoyer la variable data à mon serveur
      fetch('/api/bdd/search',{
        method: 'post',
        body: JSON.stringify(data),
        headers: {'Content-Type': 'application/json'}
      })
      .then(r => r.json())
      .then((r) => {
        console.log(r);
      })

    }

}

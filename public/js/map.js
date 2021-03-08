// alert('Script map.js chargé');

window.onload = function () {

  fetch('/api/bdd/olympiad')
    .then((response) => response.json())
    .then((json) => {
      console.log('réponse', json.features);
      const result = document.getElementById('result');
      var output = '<ul>';
      for (var i = 0; i<json.features.length; i++){
        output += '<li>'+ json.features[i].propertie.ville + ' : <em>' + json.features[i].propertie.annee + ', ' + json.features[i].propertie.saison + '</em></li>'
      }
      output += '</ul>';
      result.innerHTML = output;
    });
    

    var formu = document.getElementById('formu');
    formu.addEventListener('submit', valide);

    function valide(e){
      e.preventDefault();
      var saisie = formu.elements["ville"].value;
      url = 'http://api-adresse.data.gouv.fr/search/?q=' + saisie;
      // console.log(url);

      fetch(url)
        .then(r => r.json())
        .then(r2 => {
          console.log(r2.features[0].geometry.coordinates)
          //TO Clément : insert code leaflet
        });

      // fetch(url)
      //   .then(r => r.json())
      //   .then(rep2 => {
      //     console.log(rep2);
      //   })

    }

    // fetch('http://api-adresse.data.gouv.fr/search/?q=' + 'Paris')
    //   .then()









}

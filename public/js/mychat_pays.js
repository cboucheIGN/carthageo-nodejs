function pays(){
  var formepays = document.getElementById('forme_pays').elements["olym_pays"];
  var countrys = [];
  fetch('/api/bdd/track',{
    method : 'post',
    body: JSON.stringify({ hello: "9"}),
    headers: {'Content-Type': 'application/json'}
  })
    .then(req => req.json())
    .then((req) => {
      console.log(req);
      for (var i =0; i < req.features.length;i++){
        countrys += req.features[i].propertie.country;
        var option = document.createElement('option');
        option.innerHTML = req.features[i].propertie.country;
        formepays.appendChild(option);
      }
    console.log(countrys);
  })
}
pays();


//selection de date(en utilisant le olympiad_id)
var select_date = document.getElementById('year');
//year.addEventListener('submit', valide);
select_date.onchange = function(){
  alert(this.value)
}
//selection de date(en utilisant le olympiad_id)
var select_type = document.getElementById('type')

select_type.onchange = function(){
  alert(this.value)
}

document.getElementById('year').addEventListener('change',valide)

function valide(e){
  //j'empêche le comportement par défaut du formulaire
  e.preventDefault();
  //Je récupère ce qu'a écrit l'utilisateur dans le formualaire
  var select = document.getElementById('year').value;

  //j'insère dans un objet literal ce que je viens de récupérer (ici : la variable saisie)
  data = {hello: select}
  // data_medal = {Hola: saisie_type}
  //requete fetch qui permet d'envoyer la variable data à mon serveur
  fetch('/api/bdd/track',{
    method: 'post',
    body: JSON.stringify(data),
    headers: {'Content-Type': 'application/json'}
  })
  .then(r => r.json())
  .then((r) => {
    console.log(r);


  var ctx = document.getElementById('myChart').getContext('2d');

  // var labels = jsonfile.r.map(function(e){
  //   return e.country;
  // });
  // var golds = jsonfile.r.map(function(e){
  //   return e.golds;4
  //


  var myChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels:[r.features[0].propertie.country,r.features[1].propertie.country,r.features[2].propertie.country,r.features[3].propertie.country,r.features[4].propertie.country,r.features[5].propertie.country,r.features[6].propertie.country,r.features[7].propertie.country,r.features[8].propertie.country,r.features[9].propertie.country,r.features[10].propertie.country,r.features[11].propertie.country,r.features[12].propertie.country,r.features[13].propertie.country],
            datasets: [{
                label: "Nombre de médaillles d'or",
                data:[r.features[0].propertie.gold,r.features[1].propertie.gold,r.features[2].propertie.gold,r.features[3].propertie.gold,r.features[4].propertie.gold,r.features[5].propertie.gold,r.features[6].propertie.gold,r.features[7].propertie.gold,r.features[8].propertie.gold,r.features[9].propertie.gold,r.features[10].propertie.gold,r.features[11].propertie.gold,r.features[12].propertie.gold,r.features[13].propertie.gold],
                borderWidth: 1
            }]
        },
        options: {
            scales: {
                yAxes: [{
                    ticks: {
                        beginAtZero: true
                    }
                }]
            }
        }
    });
    // console.log(r.features.propertie.country);
    // console.log(r.features.propertie.gold);
  })

}










// var ctx = document.getElementById('myChart').getContext('2d');
// var myChart = new Chart(ctx, {
//     type: 'bar',
//     data: {r.features.propertie.country,
//         datasets: [{
//             label: 'Type de médailles',
//             data: r.features.propertie.gold,
//             backgroundColor: [
//                 'rgba(255, 99, 132, 0.2)',
//                 'rgba(54, 162, 235, 0.2)',
//                 'rgba(255, 206, 86, 0.2)',
//
//             ],
//             borderColor: [
//                 'rgba(255, 99, 132, 1)',
//                 'rgba(54, 162, 235, 1)',
//                 'rgba(255, 206, 86, 1)',
//
//             ],
//             borderWidth: 1
//         }]
//     },
//     options: {
//         scales: {
//             yAxes: [{
//                 ticks: {
//                     beginAtZero: true
//                 }
//             }]
//         }
//     }
// });
//





// var forme = document.getElementById("forme_date");
//
//
//
//
// var jsonfile =
//
// var labels = jsonfile.medaller_country.map(function(e) {
//    return e.;
// });
//
// var data = jsonfile.medaller_country.map(function(e) {
//    return e.;
// });;
//
// var ctx = canvas.getContext('2d');
// var config = {
//    type: 'line',
//    data: {
//       labels: labels,
//       datasets: [{
//          label: 'Graph Line',
//          data: data,
//          backgroundColor: 'rgba(0, 119, 204, 0.3)'
//       }]
//    }
// };
//
// var chart = new Chart(ctx, config);
//
//
//
//

//
//
//
//
// //commende cmenu selection
// var forme = document.getElementById("forme_date");
//
// var date = forme.elements["olym_date"].value;
// forme.elements["olym_date"].addEventListener("change",date_selected);
//
//
// date_selected = function(e) {
//   console.log(forme.elements["olym_date"].value)
// }
//
//
//
// // forme.elements["olym_date"].addEventListener("change", medaller);
//
// function medaller(e){
//   console.log(forme.elements["olym_date"].value);
//   var olym_date = forme.elements["olym_date"].value;
//   var choix = {c:olym_date}
//   fetch("/api/bdd/medal_track",{
//     method: 'post',
//     body: JSON.stringify(choix),
//     headers: {'Content-Type': 'application/json'}
//   })
//   .then(req => req.json())
//   .then((r) => {
//     const result = document.getElementById('result');
//     var output = '<ul>'
//     for (var i = 0; i<r.features.length; i++){
//       output += '<li>'+ r.features[i].propertie.name + '</em></li>'
//     }
//     output += '</ul>';
//     result.innerHTML = output;
//   })
// }

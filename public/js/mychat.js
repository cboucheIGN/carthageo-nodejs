




var forme = document.getElementById("forme_date");




var jsonfile =

var labels = jsonfile.medaller_country.map(function(e) {
   return e.;
});

var data = jsonfile.medaller_country.map(function(e) {
   return e.;
});;

var ctx = canvas.getContext('2d');
var config = {
   type: 'line',
   data: {
      labels: labels,
      datasets: [{
         label: 'Graph Line',
         data: data,
         backgroundColor: 'rgba(0, 119, 204, 0.3)'
      }]
   }
};

var chart = new Chart(ctx, config);




var myChart = new Chart(ctx, {
    type: 'bar',
    data: {
        labels: [],
        datasets: [{
            label: 'Type de médailles',
            data: [],
            backgroundColor: [
                'rgba(255, 99, 132, 0.2)',
                'rgba(54, 162, 235, 0.2)',
                'rgba(255, 206, 86, 0.2)',

            ],
            borderColor: [
                'rgba(255, 99, 132, 1)',
                'rgba(54, 162, 235, 1)',
                'rgba(255, 206, 86, 1)',

            ],
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








// forme.elements["olym_date"].addEventListener("change", medaller);

function medaller(e){
  console.log(forme.elements["olym_date"].value);
  var olym_date = forme.elements["olym_date"].value;
  var choix = {c:olym_date}
  fetch("/api/bdd/medal_track",{
    method: 'post',
    body: JSON.stringify(choix),
    headers: {'Content-Type': 'application/json'}
  })
  .then(req => req.json())
  .then((r) => {
    const result = document.getElementById('result');
    var output = '<ul>'
    for (var i = 0; i<r.features.length; i++){
      output += '<li>'+ r.features[i].propertie.name + '</em></li>'
    }
    output += '</ul>';
    result.innerHTML = output;
  })
}

var formu = document.getElementById('formu');
var okey = document.getElementById('Okey');
okey.addEventListener("click", chart);

var canv = document.getElementById("my_chart");
canv.addEventListener('click', handleClick, false);

var divgoback;

var buttonGoBack;

var myChart;
var myChartConfig;


function chart(e) { 
    e.preventDefault();
    var medal_type = formu.options[formu.selectedIndex].text.toLowerCase();
    var annee = parseInt(document.getElementById("annee").value);
    var parametres = {
        year: annee,
        medal: medal_type
    };
    function couleur(medaille) {
        if(medaille=="gold") {
          return 'orange'
        }
        else if(medaille == "silver") {
          return 'grey'
        }
        else {return 'brown'}
      
      }

    fetch('/api/medals/carto', {
        method: 'POST',
        body: JSON.stringify(parametres),
        headers: {
          'Content-Type': 'application/json'
        }
      })
        .then((r) => r.json())
        .then((r) => {
    
        var medals = []
        for (i=0; i<r.features.length; i++) {
            medals.push(r.features[i].properties.medal)
        } 
        var pays = []
        for (i=0; i<r.features.length; i++) {
            pays.push(r.features[i].properties.name)
        }
      // Réinitialiser le contenu de la div du graphique pour éviter l'accumulation : 
        var pieChartContent = document.getElementById('chart_container');
        pieChartContent.innerHTML = '&nbsp;';
        $('#chart_container').append('<canvas id="my_chart" width="400" height="400"></canvas>');
        
        var ctx = $("#my_chart").get(0).getContext("2d");

        myChartConfig = {
            type: 'bar',
            data: {
                labels: pays,
                datasets: [{
                    label: 'Number of ' + medal_type +  ' medals',
                    data: medals,
                    backgroundColor: couleur(medal_type),
                    borderColor: 'grey',
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
                },
                onClick: handleClick

            }
        }
        myChart = new Chart(ctx, myChartConfig);
    
   
    });
    
}

function handleClick(e) {
    var activeElement = myChart.getElementAtEvent(e);
    //console.log(activeElement);
    var label_pays = activeElement[0]._model.label
    //console.log(label_pays)

    var parametres2 = {
        pays: label_pays
        
    };
    fetch('/api/medals/chart', {
        method: 'POST',
        body: JSON.stringify(parametres2),
        headers: {
          'Content-Type': 'application/json'
        }
      })
        .then((r) => r.json())
        .then((r) => {
            console.log(r)
            var annees = [];
            var gold = [];
            var silver = []; 
            var bronze = []; 
            for (i=0; i<r.length; i++) {
                annees.push(r[i].properties.year)
                gold.push(r[i].properties.gold)
                silver.push(r[i].properties.silver)
                bronze.push(r[i].properties.bronze)
                }
                var pieChartContent = document.getElementById('chart_container');
                pieChartContent.innerHTML = '&nbsp;';
                $('#chart_container').append('<canvas id="my_chart" width="400" height="400"></canvas>');
                
                var ctx = $("#my_chart").get(0).getContext("2d");
            
                var chart = new Chart(ctx, {
                    type: 'line',
                    data: {
                      labels: annees,
                      datasets: [{ 
                          data: bronze,
                          label: "Bronze",
                          borderColor: "brown",
                          fill: false
                        }, { 
                          data: silver,
                          label: "Silver",
                          borderColor: "grey",
                          fill: false
                        }, { 
                          data: gold,
                          label: "Gold",
                          borderColor: "orange",
                          fill: false
                        }
                      ]
                    },
                    options: {
                      title: {
                        display: true,
                        text: 'World population per region (in millions)'
                      }
                    }
                  });
                  divgoback = document.getElementById("goback");
                
                  console.log('156: je suis exescuteé ');
                  divgoback.innerHTML = "<button id='reviens' type='button' class='btn btn-outline-primary' name='envoi' value='Go back'>Go back to the bar chart</button>";      
                                
                  buttonGoBack = document.getElementById("reviens");
                  buttonGoBack.addEventListener('click', goBackToChartFunction)



                  
        })
        
}
console.log('164: je suis exescuteé ');

function goBackToChartFunction() {
    var ctx = $("#my_chart").get(0).getContext("2d");
    myChart = new Chart(ctx, myChartConfig);
}
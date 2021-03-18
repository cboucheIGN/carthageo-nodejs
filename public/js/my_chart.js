/*var ctx = document.getElementById('my_chart').getContext('2d');
var myChart = new Chart(ctx, {
    type: 'doughnut',
    data: {
        labels: ['Red', 'Blue', 'Yellow', 'Green', 'Purple', 'Orange'],
        datasets: [{
            label: '# of Votes',
            data: [12, 19, 3, 5, 2, 3],
            backgroundColor: [
                'rgba(255, 99, 132, 0.2)',
                'rgba(54, 162, 235, 0.2)',
                'rgba(255, 206, 86, 0.2)',
                'rgba(75, 192, 192, 0.2)',
                'rgba(153, 102, 255, 0.2)',
                'rgba(255, 159, 64, 0.2)'
            ],
            borderColor: [
                'rgba(255, 99, 132, 1)',
                'rgba(54, 162, 235, 1)',
                'rgba(255, 206, 86, 1)',
                'rgba(75, 192, 192, 1)',
                'rgba(153, 102, 255, 1)',
                'rgba(255, 159, 64, 1)'
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
});*/
//var ctx = document.getElementById('my_chart').getContext('2d');
var formu = document.getElementById('formu');
console.log(formu.options[formu.selectedIndex].text)


function chart(e) { 
    

    fetch('/api/bdd/json')
    .then((r) => r.json())
    .then((r) => {
        var medal_type = formu.options[formu.selectedIndex].text;
        var medals = []
        for (i=0; i<r.features.length; i++) {
            medals.push(r.features[i].properties[e.target.value])
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
    
    var myChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: pays,
            datasets: [{
                label: 'Number of ' + medal_type +  ' medals',
                data: medals,
                backgroundColor: [
                    'rgba(255, 99, 132, 0.2)',
                    'rgba(54, 162, 235, 0.2)',
                    'rgba(255, 206, 86, 0.2)',
                    'rgba(75, 192, 192, 0.2)',
                    'rgba(153, 102, 255, 0.2)',
                    'rgba(255, 159, 64, 0.2)'
                ],
                borderColor: [
                    'rgba(255, 99, 132, 1)',
                    'rgba(54, 162, 235, 1)',
                    'rgba(255, 206, 86, 1)',
                    'rgba(75, 192, 192, 1)',
                    'rgba(153, 102, 255, 1)',
                    'rgba(255, 159, 64, 1)'
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
    
   
    });
    
}

formu.addEventListener('change', chart);
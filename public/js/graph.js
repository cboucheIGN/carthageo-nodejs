var ctx2 = document.getElementById('myChartFR').getContext('2d');
var ctx3 = document.getElementById('chart_sport').getContext('2d');


/////Graphique 1 //////

fetch('/api/bdd/charto')
    .then((r) => r.json())
    .then((r) =>  {
        var russia = []
        var france = []
        var usa = []
        var uk = []
        var germany = []
        var annee = []
        for (i=0; i<r.features.length ; i++) {
                 russia.push(r.features[i].properties.russia);
                 france.push(r.features[i].properties.france);
                 uk.push(r.features[i].properties.uk);
                 germany.push(r.features[i].properties.germany);
                 usa.push(r.features[i].properties.usa);
                 annee.push(r.features[i].properties.year);
            }
        var myChart = new Chart(ctx2, {
            type: 'line',
            data: {
                labels: annee,
                datasets: [{
                    label: '# of russia',
                    data: russia,
                    backgroundColor:  'rgba(0, 0, 0, 0)',
                    borderWidth: 3,
                    lineTension: 0,
                    borderColor : 'red'
                },
                {
                    label: '# of france',
                    data: france,
                    backgroundColor:  'rgba(0, 0, 0, 0)',
                    borderWidth: 3,
                    lineTension: 0,
                    borderColor : 'blue'
                },
                {
                    label: '# of germany',
                    data: germany,
                    backgroundColor:  'rgba(0, 0, 0, 0)',
                    borderWidth: 3,
                    lineTension: 0,
                    borderColor : 'yellow'
                },
                {
                    label: '# of usa',
                    data: usa,
                    backgroundColor:  'rgba(0, 0, 0, 0)',
                    borderWidth: 3,
                    lineTension: 0,
                    borderColor : 'green'
                },
                {
                    label: '# of uk',
                    data: uk,
                    backgroundColor: 'rgba(0, 0, 0, 0)',
                    borderWidth: 3,
                    lineTension: 0,
                    borderColor : 'black'
                }]
            },
            options: {
                scales: {
                    yAxes: [{
                        ticks: {
                            beginAtZero: false
                        }
                    }]
                }
            }
        });
    })

/////Graphique 2 //////


    fetch('/api/bdd/sport_country')
    .then((r) => r.json())
    .then((r) =>  {
        var russia = []
        var france = []
        var usa = []
        var uk = []
        var germany = []
        var sport = [];
        console.log('result', r);
        for (i=0; i<r.length ; i++) {
                    russia.push(r[i].russia);
                    france.push(r[i].france);
                    uk.push(r[i].uk);
                    germany.push(r[i].germany);
                    usa.push(r[i].usa);
                    sport.push(r[i].sport);
            }

    var chart_sport = new Chart(ctx3, {
        type: 'radar',
        data: {
            labels: sport,
            datasets: [{
                label: '# of russia',
                data: russia,
                backgroundColor:  'rgba(238, 51, 78, 0.2)',
                borderWidth: 2.5,
                lineTension: 0,
                borderColor : 'rgba(238, 51, 78, 0.9',
                pointRadius :0
            },
            {
                label: '# of france',
                data: france,
                backgroundColor:  'rgba(0, 129, 200, 0.2)',
                borderWidth: 2.5,
                lineTension: 0,
                borderColor : 'rgba(0, 129, 200, 0.9)',
                pointRadius :2
            },
            {
                label: '# of germany',
                data: germany,
                backgroundColor:  'rgba(252, 177, 49, 0.2)',
                borderWidth: 2.5,
                lineTension: 0,
                borderColor : 'rgba(252, 177, 49, 0.9)',
                pointRadius :2
            },
            {
                label: '# of usa',
                data: usa,
                backgroundColor:  'rgba(0, 166, 81, 0.2)',
                borderWidth: 2.5,
                lineTension: 0,
                borderColor : 'rgba(0, 166, 81, 0.9)',
                pointRadius :2
            },
            {
                label: '# of uk',
                data: uk,
                backgroundColor: 'rgba(0, 0, 0, 0.2)',
                borderWidth: 2.5,
                lineTension: 0,
                borderColor : 'rgba(0, 0, 0, 0.9)',
                pointRadius :2
            }]
        },
        options: {
            scales: {
                ticks: {
                    callback: function() {return ""},
                    backdropColor: "rgba(0, 0, 0, 0)"
                }
            }
        }
    });
    })

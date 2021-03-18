
var bool=true;
var barreAnnee = document.getElementById("annee");
var barreNationalite = document.getElementById("nationalite");
var selec_medaille = document.getElementById("medaille");
var divath = document.getElementById("affiche_athlete");
var okey = document.getElementById("Okey");

//var list = []

//list.push()

function valider (event) {
  if (bool==false) {
    
    divath.innerHTML = "";
  }
  var year = parseInt(barreAnnee.value);
  var nation = barreNationalite.value;
  var medal = selec_medaille.options[selec_medaille.selectedIndex].text;

  var parametre = {
    year: year,
    nation: nation,
    medal: medal
  };

  fetch('/api/athelete/search', {
    method: 'POST',
    body: JSON.stringify(parametre),
    headers: {
      'Content-Type': 'application/json'
    }
  })
  .then((r) => r.json())
  .then(r => {
    console.log('reponse', r);
    if (r.length > 0) {
    for (i=0; i< r.length; i++) {
      divath.innerHTML += "<tr>" +
      //"<th scope='row'>" + i + "</th>" +
      "<td>" + r[i]['nom_athlete'] + "</td>" +
      "<td>" + r[i]['gender'] + "</td>" +
      "<td>" + r[i]['nom_epreuve'] + "</td>" +
      "</tr>"
    }
    bool=false
  }
  else {
    alert("Oops! No result")
  }}
  );






  //var champ_nom = ath.elements["nom"]
  // fetch('api/bdd/json_ath')
  // .then((r) => r.json())
  // .then((r) => {
  //     var selectionAthletes = [];
  //     var year = parseInt(barreAnnee.value);
  //     var nation = barreNationalite.value;
  //     var medal = selec_medaille.options[selec_medaille.selectedIndex].text;
  //     for (i=0; i< r.features.length; i++) {
  //       var properties = r.features[i].properties; 
  //       //console.log(properties);
  //         if (properties.year == year && properties.country == nation && properties.medal == medal) {
  //             selectionAthletes.push(r.features[i].properties)
              
  //             divath.innerHTML += '<div>' + r.features[i].properties.name + '</div>'
  //             //var newDiv = document.createElement("div");
  //           // et lui donne un peu de contenu
  //            //var newContent = document.createTextNode([r.features[i].properties.name]);
  //           // ajoute le nœud texte au nouveau div créé
  //           //newDiv.appendChild(newContent);
           
  //           //document.body.insertBefore(newDiv, divath);
  //         }
          
  //     }
      
    // console.log(r);
    // console.log(parseInt(barreAnnee.value))
    // console.log(barreNationalite.value)
    // console.log(selec_medaille.options[selec_medaille.selectedIndex].text)
    // console.log(selectionAthletes);
  // })}
//}
}


okey.addEventListener('click', valider);



/*<tbody>
            <% for (const i of model) { %>
              <tr>
                <td><%= i.name %></td>
                <td><%= i.gender %></td>
                <td><%= i.medal %></td>
                <td><%= i.city%></td>
                <td class="d-print-none">
                </td>
              </tr>
            <% } %>
          </tbody>*/
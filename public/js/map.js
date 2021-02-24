alert('Script map.js chargé');

window.onload = function () {

  fetch('/api/medal/1')
    .then((response) => response.json())
    .then((json) => {
      console.log('réponse', json);
      const result = document.getElementById('result');
      result.innerHTML = `
        <ul>
          <li>Identifiant: ${json.id}</li>
          <li>Nom: ${json.athlete.name}</li>
          <li>Sport: ${json.epreuve.name}</li>
        </ul>
      `
    });
}

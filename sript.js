/*Initiation des variables*/

let cp = document.getElementById('codePostal');
let select = document.getElementById('commune');
let meteo = document.getElementById('meteoDisplay');
let checkboxes = document.querySelectorAll('input[type="checkbox"]');
let jourRange = document.getElementById('jourRange');
let jourValue = document.getElementById('jourValue');
let scalerContainer = document.getElementById('scalerContainer'); 
let imgmeteo = document.createElement('img');
let communes = []; 
let openModalBtn = document.getElementById('openModalBtn');
let closeModalBtn = document.getElementById('closeModalBtn');
let optionsModal = document.getElementById('optionsModal');

/* affichage off */

select.style.display = 'none';
meteo.style.display = 'none';
scalerContainer.style.display = 'none'; 



// Écouteur d'événement pour le champ de code postal
cp.addEventListener('input', function() {
    const codePostal = this.value;

    if (/^\d{5}$/.test(codePostal)) {
        rechercherCommune(codePostal);
    } else {
        select.innerHTML = ''; // Réinitialise le select
        select.style.display = 'none'; // Cache le select
        meteo.style.display= 'none'
        meteo.innerHTML = ''; // Réinitialise l'affichage météo
        scalerContainer.style.display = 'none'; // Cache le scaler si le code postal est invalide
    }
});

// Fonction pour rechercher la commune par code postal
function rechercherCommune(codePostal) {
    fetch(`https://geo.api.gouv.fr/communes?codePostal=${codePostal}`)
        .then(response => {
            if (!response.ok) {
                throw new Error('Erreur réseau');
            }
            return response.json();
        })
        .then(data => {
            communes = data; // Stocke les communes récupérées
            select.innerHTML = ''; // Réinitialise le contenu du select

            // Ajoute une option par défaut
            const defaultOption = document.createElement('option');
            defaultOption.textContent = 'Choisir une commune';
            defaultOption.disabled = true;
            defaultOption.selected = true;
            select.appendChild(defaultOption);

            // Remplit le select avec les résultats
            data.forEach(commune => {
                const option = document.createElement('option');
                option.value = commune.code; // Utilise le code INSEE
                option.textContent = commune.nom;
                select.appendChild(option);
            });

            // Affiche le select s'il y a des résultats
            select.style.display = data.length > 0 ? 'block' : 'none';
            scalerContainer.style.display = data.length > 0 ? 'flex' : 'none'; // Affiche le scaler si des communes sont trouvées

            // Ajoute un écouteur d'événements pour la sélection d'une commune
            select.addEventListener('change', function() {
                if (select.value !== defaultOption.textContent) {
                    afficherMeteo(select.value, data); // Passe les données pour obtenir les coordonnées
                }
            });

            // Si un seul choix est disponible, sélectionnez-le automatiquement
            if (data.length === 1) {
                select.value = data[0].code; // Sélectionne automatiquement la seule option
                afficherMeteo(data[0].code, data); // Appelle la fonction météo immédiatement
            }
        })
        .catch(error => {
            console.error('Erreur:', error);
            select.style.display = 'none'; // Cache le select en cas d'erreur
            scalerContainer.style.display = 'none'; // Cache le scaler en cas d'erreur
        });
}

// Affiche la valeur du scaler (nombre de jours) dynamiquement
jourRange.addEventListener('input', function() {
    
    jourValue.textContent = this.value;

    // Relance la fonction afficherMeteo avec la commune sélectionnée

    const selectedCommune = select.value;

    if (selectedCommune) {
        afficherMeteo(selectedCommune, communes); // Passe les communes récupérées
    }

    //change l'affichage en fonction du nombre de jours

    if(jourValue.textContent == '1'){
        meteo.style.gridTemplateColumns='1fr'
    }
    if(jourValue.textContent == '2' || jourValue.textContent == '4'){
        meteo.style.gridTemplateColumns='1fr 1fr'
    }
    if(jourValue.textContent == '3' || jourValue.textContent == '5' || jourValue.textContent == '6' || jourValue.textContent == '7'){
        meteo.style.gridTemplateColumns='1fr 1fr 1fr'
    }
    
});

// Fonction pour afficher la météo pour la commune sélectionnée
function afficherMeteo(insee, communes) {
    const commune = communes.find(commune => commune.code === insee); // Trouve la commune
    if (!commune) return;

    const nombreDeJours = parseInt(jourValue.textContent, 10); // Récupère le nombre de jours sélectionné
    let meteoPromises = [];

    // Boucle pour chaque jour
    for (let i = 0; i < nombreDeJours; i++) {
        meteoPromises.push(
            fetch(`https://api.meteo-concept.com/api/forecast/daily/${i}?token=52e23be25c02c8f295940d471a11baa52d1eb824735d77339cd7fe4dc9577aab&insee=${insee}`)
                .then(response => {
                    if (!response.ok) throw new Error('Erreur réseau');
                    return response.json();
                })
                .then(data => {
                    const forecast = data.forecast;
                    let meteoInfo = '';
                    meteoInfo += '<div class=" div'+i+' ">';

                    if (forecast) {

                      // Ajouter le pictogramme correspondant
                      let icone = forecast.weather;
                      let imgSrc = ''; 

                      if (icone === 0) {
                          imgSrc = 'https://www.amcharts.com/wp-content/themes/amcharts4/css/img/icons/weather/animated/day.svg';
                      } else if (icone >= 1 && icone <= 8) {
                          imgSrc = 'https://www.amcharts.com/wp-content/themes/amcharts4/css/img/icons/weather/animated/cloudy.svg';
                      } else if ((icone >= 10 && icone <= 16) || (icone >= 40 && icone <= 48) || (icone >= 210 && icone <= 212)) {
                          imgSrc = 'https://www.amcharts.com/wp-content/themes/amcharts4/css/img/icons/weather/animated/rainy-6.svg';
                      } else if ((icone >= 20 && icone <= 32) || (icone >= 60 && icone <= 78) || (icone >= 220 && icone <= 232)) {
                          imgSrc = 'https://www.amcharts.com/wp-content/themes/amcharts4/css/img/icons/weather/animated/snowy-6.svg';
                      } else if (icone >= 100 && icone <= 142) {
                          imgSrc = 'https://www.amcharts.com/wp-content/themes/amcharts4/css/img/icons/weather/animated/thunder.svg';
                      } else if (icone === 235) {
                          imgSrc = 'https://www.amcharts.com/wp-content/themes/amcharts4/css/img/icons/weather/animated/rainy-7.svg';
                      } else {
                          imgSrc = 'https://www.amcharts.com/wp-content/themes/amcharts4/css/img/icons/weather/animated/rainy-2.svg';
                      }

                      meteoInfo += ` <figure class="fig"> <img src="${imgSrc}" alt="Météo"> </figure>`;

                        const date = new Date(forecast.datetime); // Récupérer la date
                        const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
                        const formattedDate = date.toLocaleDateString('fr-FR', options);
                        const capitalizedDate = formattedDate.charAt(0).toUpperCase() + formattedDate.slice(1); 

                        meteoInfo += `<strong>${capitalizedDate}</strong><br> 🌡 Température Min : ${forecast.tmin}°C<br> 🌡 Température Max : ${forecast.tmax}°C<br> ☔ Probabilité de Pluie : ${forecast.probarain}%<br> 🌅 Heures d'Ensoleillement : ${forecast.sun_hours}h<br>`;

                        // Récupérer les informations basées sur les cases à cocher
                        checkboxes.forEach(checkbox => {
                            if (checkbox.checked) {
                                switch (checkbox.nextSibling.textContent.trim()) {
                                    case 'Latitude décimale de la commune':
                                        meteoInfo += ` 🧭 Latitude décimale de la commune : ${data.city.latitude}°<br>`;
                                        break;
                                    case 'Longitude décimale de la commune':
                                        meteoInfo += ` 🧭 Longitude décimale de la commune : ${data.city.longitude}°<br>`;
                                        break;
                                    case 'Cumul de pluie sur la journée':
                                        meteoInfo += ` 💧 Cumul de pluie sur la journée en mm : ${forecast.rr1}mm<br>`;
                                        break;
                                    case 'Vent moyen':
                                        meteoInfo += ` 💨 Vent moyen à 10 mètres en km/h : ${forecast.wind10m} km/h<br>`;
                                        break;
                                    case 'Direction du vent':
                                        meteoInfo += ` 🌬 Direction du vent en degrés : ${forecast.dirwind10m}°<br>`;
                                        break;
                                }
                            }
                        });

                      
                  }
                  
                  meteoInfo += '</div>'
                  return meteoInfo 
              })
                .catch(error => {
                    console.error('Erreur:', error);
                    return 'Erreur lors de la récupération des données.';
                })
        );
    }

    // Attendre que toutes les promesses soient résolues
    Promise.all(meteoPromises)
        .then(results => {
            meteo.innerHTML = results.join('') 
            meteo.style.display = "grid"; 
        });
}

// Faire apparaitre la fenêtre modale lorsqu'on appuie sur le bouton
openModalBtn.addEventListener('click', function() {
    optionsModal.classList.add('active');
});

// Ferme la fenêtre modale si on clique sur le bouton fermer
closeModalBtn.addEventListener('click', function() {
    optionsModal.classList.remove('active');

    // Relance la recherche d'informations météo
    const selectedCommune = select.value;
    if (selectedCommune) {
        afficherMeteo(selectedCommune, communes); // Passe les communes récupérées
    }
});

// Ferme la fenêtre modale si on clique en dehors de la fenêtre
window.addEventListener('click', function(event) {
    if (event.target === optionsModal) {
        optionsModal.classList.remove('active');

        // Relance la recherche d'informations météo
        const selectedCommune = select.value;
        if (selectedCommune) {
            afficherMeteo(selectedCommune, communes); // Passe les communes récupérées
        }
    }
});
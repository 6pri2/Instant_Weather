let cp = document.getElementById('codePostal');
let select = document.getElementById('commune');
let meteo = document.getElementById('meteoDisplay');
let checkboxes = document.querySelectorAll('input[type="checkbox"]');
let jourRange = document.getElementById('jourRange');
let jourValue = document.getElementById('jourValue');
let scalerContainer = document.getElementById('scalerContainer'); // Le scaler de 1 à 7 jours
let imgmeteo = document.createElement('img');

select.style.display = 'none';
meteo.style.display = 'none';
scalerContainer.style.display = 'none'; // Masquer le scaler par défaut

let communes = []; // Variable pour stocker les communes récupérées

// Écouteur d'événement pour le champ de code postal
cp.addEventListener('input', function() {
    const codePostal = this.value;

    if (/^\d{5}$/.test(codePostal)) {
        rechercherCommune(codePostal);
    } else {
        select.innerHTML = ''; // Réinitialise le select
        select.style.display = 'none'; // Cache le select
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
            scalerContainer.style.display = data.length > 0 ? 'block' : 'none'; // Affiche le scaler si des communes sont trouvées

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
});

// Fonction pour afficher la météo pour la commune sélectionnée
function afficherMeteo(insee, communes) {
    const commune = communes.find(commune => commune.code === insee); // Trouve la commune
    if (!commune) return;

    fetch(`https://api.meteo-concept.com/api/forecast/daily/0?token=4bba169b3e3365061d39563419ab23e5016c0f838ba282498439c41a00ef1091&insee=${insee}`)
        .then(response => {
            if (!response.ok) throw new Error('Erreur réseau');
            return response.json();
        })
        .then(data => {
            const forecast = data.forecast;
            const city = data.city; // Récupère les données de la ville

            if (forecast) {
                const date = new Date(forecast.datetime); // Récupérer la date
                const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
                const formattedDate = date.toLocaleDateString('fr-FR', options);
                const capitalizedDate = formattedDate.charAt(0).toUpperCase() + formattedDate.slice(1); // Met la première lettre en majuscule

                let meteoInfo = `<strong>${capitalizedDate}</strong><br>Température Min : ${forecast.tmin}°C<br>Température Max : ${forecast.tmax}°C<br>Probabilité de Pluie : ${forecast.probarain}%<br>Heures d'Ensoleillement : ${forecast.sun_hours}h<br>`;

                // Récupérer les informations basées sur les cases à cocher
                checkboxes.forEach(checkbox => {
                    if (checkbox.checked) {
                        switch (checkbox.nextSibling.textContent.trim()) {
                            case 'Latitude décimale de la commune':
                                meteoInfo += `Latitude décimale de la commune : ${city.latitude}°<br>`;
                                break;
                            case 'Longitude décimale de la commune':
                                meteoInfo += `Longitude décimale de la commune : ${city.longitude}°<br>`;
                                break;
                            case 'Cumul de pluie sur la journée':
                                meteoInfo += `Cumul de pluie sur la journée en mm : ${forecast.rr1}mm<br>`;
                                break;
                            case 'Vent moyen':
                                meteoInfo += `Vent moyen à 10 mètres en km/h : ${forecast.wind10m} km/h<br>`;
                                break;
                            case 'Direction du vent':
                                meteoInfo += `Direction du vent en degrés : ${forecast.dirwind10m}°<br>`;
                                break;
                        }
                    }
                });

                let icone = forecast.weather;
                if (icone === 0) {
                    imgmeteo.src = 'https://www.amcharts.com/wp-content/themes/amcharts4/css/img/icons/weather/animated/day.svg';
                } else if (icone >= 1 && icone <= 8) {
                    imgmeteo.src = 'https://www.amcharts.com/wp-content/themes/amcharts4/css/img/icons/weather/animated/cloudy.svg';
                } else if ((icone >= 10 && icone <= 16) || (icone >= 40 && icone <= 48) || (icone >= 210 && icone <= 212)) {
                    imgmeteo.src = 'https://www.amcharts.com/wp-content/themes/amcharts4/css/img/icons/weather/animated/rainy-6.svg';
                } else if ((icone >= 20 && icone <= 32) || (icone >= 60 && icone <= 78) || (icone >= 220 && icone <= 232)) {
                    imgmeteo.src = 'https://www.amcharts.com/wp-content/themes/amcharts4/css/img/icons/weather/animated/snowy-6.svg';
                } else if (icone >= 100 && icone <= 142) {
                    imgmeteo.src = 'https://www.amcharts.com/wp-content/themes/amcharts4/css/img/icons/weather/animated/thunder.svg';
                } else if (icone === 235) {
                    imgmeteo.src = 'https://www.amcharts.com/wp-content/themes/amcharts4/css/img/icons/weather/animated/rainy-7.svg';
                } else {
                    imgmeteo.src = 'https://www.amcharts.com/wp-content/themes/amcharts4/css/img/icons/weather/animated/rainy-2.svg';
                }

                meteo.innerHTML = meteoInfo || 'Aucune information sélectionnée.';
                meteo.appendChild(imgmeteo);
                meteo.style.display = "flex"; // Affiche les informations météo
            } else {
                meteo.innerHTML = 'Aucune donnée météo disponible.';
                meteo.style.display = "none";
            }
        })
        .catch(error => console.error('Erreur:', error));
}

// Get elements
let openModalBtn = document.getElementById('openModalBtn');
let closeModalBtn = document.getElementById('closeModalBtn');
let optionsModal = document.getElementById('optionsModal');

// Open modal when clicking the button
openModalBtn.addEventListener('click', function() {
    optionsModal.classList.add('active');
});

// Close modal when clicking the close button
closeModalBtn.addEventListener('click', function() {
    optionsModal.classList.remove('active');

    // Relance la recherche d'informations météo
    const selectedCommune = select.value;
    if (selectedCommune) {
        afficherMeteo(selectedCommune, communes); // Passe les communes récupérées
    }
});

// Optionally close the modal when clicking outside of the modal content
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

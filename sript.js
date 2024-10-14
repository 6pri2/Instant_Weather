let cp = document.getElementById('codePostal');
let select = document.getElementById('commune');
let meteo = document.getElementById('meteoDisplay');
let checkboxes = document.querySelectorAll('input[type="checkbox"]');

select.style.display = 'none';
meteo.style.display = 'none';

// Écouteur d'événement pour le champ de code postal
cp.addEventListener('input', function() {
    const codePostal = this.value;

    if (/^\d{5}$/.test(codePostal)) {
        rechercherCommune(codePostal);
    } else {
        select.innerHTML = ''; // Réinitialise le select
        select.style.display = 'none'; // Cache le select
        meteo.innerHTML = ''; // Réinitialise l'affichage météo
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
            select.innerHTML = ''; // Réinitialise le contenu du select

            // Ajoute une option par défaut
            const defaultOption = document.createElement('option');
            defaultOption.textContent = 'Choisir une commune';
            defaultOption.disabled = true; // Désactive l'option
            defaultOption.selected = true; // Sélectionne par défaut
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
        });
}

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
                let meteoInfo = '';

                // Récupérer les informations basées sur les cases à cocher
                checkboxes.forEach(checkbox => {
                    if (checkbox.checked) {
                        switch (checkbox.nextSibling.textContent.trim()) {
                            case 'Température minimum':
                                meteoInfo += `Température Min : ${forecast.tmin}°C<br>`;
                                break;
                            case 'Température maximale':
                                meteoInfo += `Température Max : ${forecast.tmax}°C<br>`;
                                break;
                            case 'Probabilité de pluie':
                                meteoInfo += `Probabilité de Pluie : ${forecast.probarain}%<br>`;
                                break;
                            case 'Nombre d\'heures d\'ensoleillement':
                                meteoInfo += `Heures d'Ensoleillement : ${forecast.sun_hours}h<br>`;
                                break;
                            case 'Latitude décimale de la commune':
                                meteoInfo += `Latitude décimale de la commune : ${city.latitude}°<br>`;
                                break;
                            case 'Longitude décimale de la commune':
                                meteoInfo += `Longitude décimale de la commune : ${city.longitude}°<br>`;
                                break;
                            case 'Cumul de pluie sur la journée en mm':
                                meteoInfo += `Cumul de pluie sur la journée en mm : ${forecast.rr1}mm<br>`;
                                break;
                            case 'Vent moyen à 10 mètres en km/h':
                                meteoInfo += `Vent moyen à 10 mètres en km/h : ${forecast.wind10m} km/h<br>`;
                                break;
                            case 'Direction du vent en degrés':
                                meteoInfo += `Direction du vent en degrés : ${forecast.dirwind10m}°<br>`;
                                break;
                        }
                    }
                });

                meteo.innerHTML = meteoInfo || 'Aucune information sélectionnée.';
                meteo.style.display = "block"; // Affiche les informations météo
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
});

// Optionally close the modal when clicking outside of the modal content
window.addEventListener('click', function(event) {
    if (event.target === optionsModal) {
        optionsModal.classList.remove('active');
    }
});
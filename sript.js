let cp = document.getElementById('codePostal');
let select = document.getElementById('commune');

// Écouteur d'événement pour le champ de code postal
cp.addEventListener('input', function() {
    const codePostal = this.value;

    if (/^\d{5}$/.test(codePostal)) {
        rechercherCommune(codePostal);
    } else {
        select.innerHTML = ''; // Réinitialise le select
        document.getElementById('meteoDisplay').innerHTML = ''; // Réinitialise l'affichage météo
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

            // Remplit le select avec les résultats
            data.forEach(commune => {
                const option = document.createElement('option');
                option.value = commune.code; // Utilisez le code INSEE
                option.textContent = commune.nom;
                select.appendChild(option);
            });

            // Ajoute un écouteur d'événements pour la sélection d'une commune
            select.addEventListener('change', function() {
                afficherMeteo(select.value);
            });

            // Si un seul choix est disponible, sélectionnez-le automatiquement
            if (data.length === 1) {
                select.value = data[0].code; // Sélectionne automatiquement la seule option
                afficherMeteo(data[0].code); // Appelle la fonction météo immédiatement
            }
        })
        .catch(error => {
            console.error('Erreur:', error);
        });
}

// Fonction pour afficher la météo pour la commune sélectionnée
function afficherMeteo(insee) {
    fetch(`https://api.meteo-concept.com/api/forecast/daily/0?token=4bba169b3e3365061d39563419ab23e5016c0f838ba282498439c41a00ef1091&insee=${insee}`)
        .then(response => {
            if (!response.ok) throw new Error('Erreur réseau');
            return response.json();
        })
        .then(data => {
            const forecast = data.forecast;
            if (forecast) {
                const meteoInfo = `
                    Température Min : ${forecast.tmin}°C<br>
                    Température Max : ${forecast.tmax}°C<br>
                    Probabilité de Pluie : ${forecast.probarain}%<br>
                    Heures d'Ensoleillement : ${forecast.sun_hours}h
                `;
                document.getElementById('meteoDisplay').innerHTML = meteoInfo;
            } else {
                document.getElementById('meteoDisplay').innerHTML = 'Aucune donnée météo disponible.';
            }
        })
        .catch(error => console.error('Erreur:', error));
}

let cp = document.getElementById('codePostal');
let select = document.getElementById('commune');
let meteo = document.getElementById('meteoDisplay');

select.style.display = 'none';
meteo.style.display = 'none';

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

            // Affiche le select s'il y a des résultats
            if (data.length > 0) {
                select.style.display = 'block'; // Affiche le select
            } else {
                select.style.display = 'none'; // Cache le select s'il n'y a pas de résultats
            }

            // Ajoute un écouteur d'événements pour la sélection d'une commune
            select.addEventListener('change', function() {
                const communeSelectionnee = select.value;
                afficherMeteo(communeSelectionnee);
            });
        })
        .catch(error => {
            console.error('Erreur:', error);
            select.style.display = 'none'; // Cache le select en cas d'erreur
        });
}

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
                meteo.innerHTML = meteoInfo;
                meteo.style.display="contents";
            } else {
                meteo.innerHTML = 'Aucune donnée météo disponible.';
                meteo.style.display="none";
            }
        })
        .catch(error => console.error('Erreur:', error));
}

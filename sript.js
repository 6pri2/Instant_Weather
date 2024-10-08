let cp = document.getElementById('codePostal')
let select = document.getElementById('commune');

cp.addEventListener('input', function() {
    const codePostal = this.value;

    // Vérifie que le code postal est composé de 5 chiffres
    if (/^\d{5}$/.test(codePostal)) {
        rechercherCommune(codePostal);
    } else {
        document.getElementById('commune').innerHTML = ''; // Réinitialise le select
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
                option.value = commune.code;
                option.textContent = commune.nom;
                select.appendChild(option);
            });
        })
        .catch(error => {
            console.error('Erreur:', error);
        });
}

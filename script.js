/**
 * Fonction principale asynchrone pour récupérer et afficher le flux RSS
 */
async function loadRSS() {
    // 1. Définition de la source (Ici le tag 'javascript' sur Dev.to)
    const RSS_URL = `https://dev.to/feed/tag/javascript`;
    
    // 2. Utilisation d'un convertisseur RSS-to-JSON
    // Le RSS est en XML. Le JS préfère le JSON. Cet outil fait la conversion pour nous.
    const API_URL = `https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(RSS_URL)}`;

    try {
        // ÉTAPE A : Envoyer la requête HTTP
        const response = await fetch(API_URL);
        
        // ÉTAPE B : Vérifier si la réponse est correcte (Statut 200)
        if (!response.ok) throw new Error("Erreur réseau");

        // ÉTAPE C : Convertir le corps de la réponse en objet JavaScript manipulable
        const data = await response.json();
        
        // Sélection de la zone d'affichage
        const container = document.getElementById('news-container');
        container.innerHTML = ''; // On efface le message "Chargement..."

        // ÉTAPE D : Boucle sur les articles (le tableau 'items' renvoyé par l'API)
        data.items.forEach(item => {
            // Création d'un élément 'article' en mémoire
            const articleElement = document.createElement('div');
            articleElement.className = 'article';
            
            // Construction du contenu HTML avec les "Template Literals" (les accents graves ``)
            // item.link, item.title, etc. sont des propriétés standard fournies par le flux
            articleElement.innerHTML = `
                <h3><a href="${item.link}" target="_blank">${item.title}</a></h3>
                <p><small>Publié le : ${new Date(item.pubDate).toLocaleDateString('fr-FR')}</small></p>
                <p>${item.description.substring(0, 180)}...</p> 
            `;

            // Injection de l'élément créé dans le DOM (la page web)
            container.appendChild(articleElement);
        });

    } catch (error) {
        // Gestion des erreurs (ex: pas d'internet, URL cassée)
        console.error("Détails de l'erreur:", error);
        document.getElementById('news-container').innerHTML = 
            `<p style="color:red">Erreur lors de la récupération : ${error.message}</p>`;
    }
}

// Lancement de la fonction au chargement du script
loadRSS();
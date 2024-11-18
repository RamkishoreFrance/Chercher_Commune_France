🗺️ Recherche de Communes en France
Une application interactive permettant de rechercher des communes en France par région et département, avec des fonctionnalités avancées telles que la géolocalisation, l'affichage sur une carte, et l'exportation des données en CSV.

🔗 Lien vers l'application : Recherche de Communes sur GitHub Pages

🎯 Fonctionnalités
Recherche par région et département : Sélectionnez une région et un département pour afficher la liste des communes.
Tri des communes : Les communes sont triées par population de manière décroissante par défaut. Vous pouvez trier par nom ou population en cliquant sur l'en-tête du tableau.
Affichage des données des communes : Affichez le nom et la population des communes sélectionnées dans un tableau dynamique.
Géolocalisation : Géolocalisez l'utilisateur et affichez les informations de la commune la plus proche, incluant le nom, la population, et la surface.
Carte interactive : Affichez la commune géolocalisée sur une carte OpenStreetMap avec un marqueur et une popup.
Exportation en CSV : Téléchargez la liste des communes affichées sous forme de fichier CSV.
Navigation facile : Boutons pour faire défiler la page vers le haut ou vers le bas.
Interface intuitive : Une interface simple et conviviale, adaptée à une utilisation facile.

🛠️ Technologies utilisées
HTML5 : Pour la structure et le contenu de la page.
CSS3 : Pour le style et la mise en page.
JavaScript : Pour la logique et les fonctionnalités interactives.
Leaflet : Pour l'affichage de la carte interactive.
API GeoGouv : Pour récupérer les données des régions, départements et communes.

📋 Fonctionnement de l'application
Sélection d'une région et d'un département :

Choisissez une région dans la liste déroulante.
Une fois la région sélectionnée, la liste des départements s'active.
Sélectionnez un département et cliquez sur "Afficher les communes".
Affichage des communes :

La liste des communes s'affiche dans un tableau trié par population.
Cliquez sur les en-têtes de colonne pour trier par nom ou population.
Géolocalisation et affichage sur la carte :

Cliquez sur "Géolocaliser et afficher ma ville" pour obtenir des informations sur la commune la plus proche et l'afficher sur la carte.
La carte affiche un marqueur sur la commune géolocalisée.
Exportation des données :

Cliquez sur "Exporter en CSV" pour télécharger la liste des communes sous forme de fichier CSV.
Navigation haut/bas :

Utilisez les boutons ▲ et ▼ pour naviguer facilement vers le haut ou le bas de la page.


🗃️ Structure du projet
Copier le code
Chercher_Commune_France/
├── index.html
├── style.css
├── app.js
├── france.png
├── carte_France.png
└── README.md


index.html : Contient la structure et l'interface utilisateur.
style.css : Styles pour l'apparence de l'application.
app.js : Logique et fonctionnalités interactives.
france.png et carte_France.png : Images utilisées dans l'interface.


🛡️ Problèmes connus
L'affichage des données peut être lent si la connexion à l'API GeoGouv est instable.
La géolocalisation peut ne pas fonctionner correctement si l'utilisateur n'autorise pas l'accès à sa position.


🌟 Améliorations possibles
Ajouter une fonctionnalité de filtrage des communes par population.
Permettre de rechercher une commune par nom.
Afficher des statistiques supplémentaires sur les communes (densité de population, superficie).
Ajouter un mode sombre pour une meilleure expérience utilisateur.


👨‍💻 Auteur
Ramkishore France - GitHub

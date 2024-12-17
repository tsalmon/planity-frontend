# Planity Frontend

## Technologies utilisées

La partie frontend utilise Vite, React et ShadCN pour l'interface (theme _dark_ )

Toute la mécanique se fait sans bibliothèque tierce.

## Fonctionnement

Le serveur écoute sur le port 5173 et s'attend à appeler un serveur en local sur le port 8000

1. Choisissez un fichier à envoyer (possible depuis un drag & drop).
2. Cliquez sur **Upload file**.
3. Le fichier est envoyé par morceau de 5MB au serveur, une barre de progression apparaitre tout du long en dessous puis disparaitra à la fin
4. Si une erreur survient, une modale d'erreur apparaitra sur l'écran.
5. Quand l'importation est finalisée, il devient alors possible de cliquer sur **Download Zip**. 

Voir le **Readme** du projet backend pour en savoir plus sur le fonctionnement du serveur

### Temps de développement

Une journée puis une autre pour les tests
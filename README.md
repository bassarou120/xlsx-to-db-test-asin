
**a) Présentation du projet**
Une application CLI pour importer un fichier XLSX dans une base de données en moins de 20 minutes.

b) Technologies utilisées
Node.js avec xlsx, pg, dotenv, commander
PostgreSQL pour la base de données
Jest pour les tests
Docker pour exécuter facilement

c) Instructions d’installation

git clone https://github.com/ton-repo/xlsx-to-db.git
cd xlsx-to-db
npm install
cp .env.example .env  # Modifier les paramètres de la DB

🚀 Pour lancer le projet :
docker-compose --env-file .env up --build

docker-compose run --rm -v /chemin/vers/votre-fichier.xlsx:/data/people.xlsx app /data/people.xlsx

Explication :
✅ -v /chemin/vers/votre-fichier.xlsx:/data/people.xlsx → Monte votre fichier local dans le conteneur
✅ app /data/people.xlsx → Fournit le chemin du fichier en argument à l'application
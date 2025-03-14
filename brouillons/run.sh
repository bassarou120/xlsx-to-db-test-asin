# run.sh
#!/bin/bash

if [ -z "$1" ]; then
  echo "Usage: ./run.sh <chemin_du_fichier_xlsx>"
  exit 1
fi

export FILE_PATH=$1

set -a
source .env
set +a

echo "Démarrage des services..."
docker-compose up --build -d

echo "Attente du démarrage de la base de données..."
sleep 10

echo "Exécution de l'application avec le fichier: $FILE_PATH"
docker exec xlsx-to-db-test-asin node index.js "$FILE_PATH"

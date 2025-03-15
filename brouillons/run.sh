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









#!/bin/bash

# Charger les variables d'environnement depuis .env
if [ -f .env ]; then
    export $(grep -v '^#' .env | xargs)
else
    echo "Fichier .env introuvable. Veuillez en créer un."
    exit 1
fi

# Vérifier si Docker Compose est installé
if ! command -v docker-compose &> /dev/null; then
    echo "Docker Compose n'est pas installé. Veuillez l'installer et réessayer."
    exit 1
fi

# Vérifier si un fichier XLSX est fourni en argument
if [ -z "$1" ]; then
    echo "❌ Aucun fichier XLSX fourni."
    echo "Usage: $0 fichier.xlsx"
    exit 1
fi

# Récupérer le chemin absolu du fichier fourni
#FICHIER_XLSX="$(realpath "$1")"

FICHIER_XLSX="$(cd "$(dirname "$1")" && pwd)/$(basename "$1")"



# Vérifier si on utilise la base de données du conteneur
if [ "$USE_CONTAINER_DB" = "true" ]; then
    echo "Utilisation de la base de données du conteneur."

       # Vérifier si les conteneurs existent déjà
    if docker ps -a --format '{{.Names}}' | grep -q '^xlsx-to-db-test-asin-app$' && docker ps -a --format '{{.Names}}' | grep -q '^postgres_db$'; then
        echo "Les services existent déjà."

        # Vérifier si les services sont en cours d'exécution
        if docker ps --format '{{.Names}}' | grep -q '^xlsx-to-db-test-asin-app$' && docker ps --format '{{.Names}}' | grep -q '^postgres_db$'; then
            echo "Les services sont déjà en cours d'exécution."
        else
            echo "Les services existent mais ne sont pas en cours d'exécution. Redémarrage..."
            docker-compose start
            sleep 5  # Attente pour s'assurer que PostgreSQL démarre correctement
        fi
    else
        echo "Les services n'existent pas encore. Construction et démarrage..."
        docker-compose up  -d  --build
        sleep 5  # Attente pour PostgreSQL
    fi

#    # Vérifier si le conteneur existe et est actif
#    if ! docker inspect xlsx-to-db-test-asin-app &> /dev/null; then
#        echo "Le conteneur n'existe pas. Lancement..."
#        docker-compose up -d --build
#        sleep 5
#    elif ! docker ps --format '{{.Names}}' | grep -q '^xlsx-to-db-test-asin-app$'; then
#        echo "Le conteneur est arrêté. Redémarrage..."
#        docker-compose start
#        sleep 5
#    else
#        echo "Le conteneur est déjà en cours d'exécution."
#    fi

    # Exécuter la commande dans le conteneur existant
#    docker exec xlsx-to-db-test-asin-app node src/index.js "/app/data/$(basename "$FICHIER_XLSX")"

  # Copier le fichier XLSX dans le conteneur
#    docker cp "$FICHIER_XLSX" xlsx-to-db-test-asin-app:/app/data/
#
#    # Exécuter l'application dans le conteneur
#    echo "Traitement du fichier dans le conteneur..."
#    docker exec xlsx-to-db-test-asin-app node src/index.js "/app/data/$(basename "$FICHIER_XLSX")"

echo "Chemin du fichier XLSX : $FICHIER_XLSX"
ls -l "$FICHIER_XLSX"


docker cp "$FICHIER_XLSX" xlsx-to-db-test-asin-app:/app/data/

# Vérifier si le fichier est bien copié
docker exec xlsx-to-db-test-asin-app ls /app/data/$(basename "$FICHIER_XLSX") &>/dev/null
if [ $? -ne 0 ]; then
    echo "❌ Le fichier n'a pas été copié correctement."
    exit 1
fi

echo "Traitement du fichier dans le conteneur..."
#docker exec xlsx-to-db-test-asin-app node src/index.js "/app/data/$(basename "$FICHIER_XLSX")"
#docker exec -it xlsx-to-db-test-asin-app /bin/sh


#docker exec xlsx-to-db-test-asin-app node src/index.js "/app/data/$(basename "$FICHIER_XLSX")" > app.log 2>&1

# Exécuter le conteneur Node.js avec le fichier XLSX en argument
docker run --rm \
  --network=xlsx-to-db-test_default \
  -v "$(pwd)/data:/app/data" \
  my_app "/app/data/$FICHIER_XLSX"


else
    echo "Utilisation d'une base de données externe : $DB_HOST"

    # Exécuter l'application directement sans Docker
    node src/index.js "$FICHIER_XLSX"
fi
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
  echo "Usage: $0 fichier.xlsx"
  exit 1
fi

FICHIER_XLSX=$1

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
        docker-compose up -d --build
        sleep 5  # Attente pour PostgreSQL
    fi

    # Exécuter l'application avec le fichier fourni
    echo "Exécution de l'application avec le fichier : $FICHIER_XLSX"
    docker exec -i xlsx-to-db-test-asin-app node src/index.js "$FICHIER_XLSX"
else
    echo "Utilisation d'une base de données externe : $DB_HOST"

    # Exécuter l'application directement sans Docker
    node src/index.js "$FICHIER_XLSX"
fi

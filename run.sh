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
FICHIER_XLSX="$(cd "$(dirname "$1")" && pwd)/$(basename "$1")"

# Vérifier si le fichier XLSX existe
if [ ! -f "$FICHIER_XLSX" ]; then
    echo "❌ Le fichier XLSX spécifié n'existe pas : $FICHIER_XLSX"
    exit 1
fi

# Vérifier si on utilise la base de données du conteneur
if [ "$USE_CONTAINER_DB" = "true" ]; then
    echo "Utilisation de la base de données du conteneur."

    # Vérifier si le dossier `data/` existe
    if [ ! -d "./data" ]; then
        mkdir -p "./data"
    fi

    chmod -R 777 ./data


    # Copier le fichier dans `./data/` si nécessaire
    if [[ "$FICHIER_XLSX" != ./data/* ]]; then
        echo "📂 Copie du fichier dans le dossier ./data/"
        cp "$FICHIER_XLSX" ./data/
            sleep 5
    fi

    # Vérifier si les conteneurs existent déjà
    if docker ps -a --format '{{.Names}}' | grep -q '^xlsx-to-db-test-asin-app$' && docker ps -a --format '{{.Names}}' | grep -q '^postgres_db$'; then
        echo "✅ Les services existent déjà."

        # Vérifier si les services sont en cours d'exécution
        if docker ps --format '{{.Names}}' | grep -q '^xlsx-to-db-test-asin-app$' && docker ps --format '{{.Names}}' | grep -q '^postgres_db$'; then
            echo "✅ Les services sont déjà en cours d'exécution."
        else
            echo "🔄 Redémarrage des services..."
            docker-compose start
            sleep 5
        fi
    else
        echo "🚀 Démarrage des services..."
        docker-compose up -d --build
        sleep 5
    fi

   sleep 10


    if [ $? -ne 0 ]; then
        echo "❌ Le fichier n'est pas visible dans le conteneur !"
        exit 1
    fi

    # Exécuter l'application dans le conteneur
    echo "▶️ Traitement du fichier dans le conteneur..."
    docker exec xlsx-to-db-test-asin-app node src/index.js "/app/data/$(basename "$FICHIER_XLSX")"

else
    echo "Utilisation d'une base de données externe : $DB_HOST"
    node src/index.js "$FICHIER_XLSX"
fi



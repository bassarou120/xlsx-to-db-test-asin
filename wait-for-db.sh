#!/bin/sh
echo "Attente de la base de données..."

until nc -z $DB_HOST $DB_PORT; do
  sleep 1
done

echo "Base de données disponible !"
exec "$@"

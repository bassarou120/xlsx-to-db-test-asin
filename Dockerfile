# Utiliser l'image officielle de Node.js
FROM node:18-alpine

# Définir le dossier de travail dans le conteneur
WORKDIR /app

# Copier les fichiers package.json et package-lock.json (pour optimiser le cache Docker)
COPY package*.json ./

# Installer les dépendances
RUN npm install

# Copier tout le projet dans le conteneur
COPY . .



# Commande de démarrage
#CMD ["node", "src/index.js"]




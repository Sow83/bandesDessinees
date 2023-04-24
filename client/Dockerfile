# Spécifie l'image de base
FROM node:latest

# Définit le répertoire de travail
WORKDIR /app

# Copie les fichiers package.json et package-lock.json dans le conteneur
COPY package.json ./

# Installe les dépendances
RUN npm install

# Copie le reste du code de l'application dans le conteneur
COPY ./ .

# Définit la variable d'environnement pour la production
# ENV NODE_ENV=production

# Expose le port 3000 pour le conteneur
EXPOSE 3000

# Définit un volume pour le répertoire /app/public dans le conteneur, qui sera utilisé pour stocker les fichiers uploadés par l'application.
# VOLUME [ "/app/public" ]

# Démarre l'application
CMD [ "npm", "start" ]
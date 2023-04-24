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

# Expose le port 8000 pour le conteneur
EXPOSE 8000

# Définit un volume pour le répertoire /app/uploads dans le conteneur, qui sera utilisé pour stocker les fichiers uploadés par l'application.
# VOLUME [ "/app/uploads" ]

# Démarre l'application
CMD [ "npm", "start" ]

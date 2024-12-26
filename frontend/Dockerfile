# Utiliser une image Node.js officielle pour construire l'application
FROM node:18 AS builder

# Définir le répertoire de travail
WORKDIR /app

# Copier les fichiers nécessaires dans le conteneur
COPY package.json package-lock.json ./

# Installer les dépendances
RUN npm install

# Copier tout le projet frontend
COPY . .

# Construire l'application Angular
RUN npm run build --prod

# Utiliser une image NGINX pour servir les fichiers Angular
FROM nginx:alpine

# Copier les fichiers construits dans le répertoire NGINX
COPY --from=builder /app/dist/mentor_me /usr/share/nginx/html

# Exposer le port sur lequel NGINX écoute
EXPOSE 80

# Commande pour démarrer NGINX
CMD ["nginx", "-g", "daemon off;"]

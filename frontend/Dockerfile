# Utiliser une image Node.js officielle pour construire l'application
FROM node:18 AS builder

WORKDIR /app

# Copier les fichiers nécessaires pour installer les dépendances
COPY package.json package-lock.json ./
RUN npm install

# Copier le reste du projet frontend et construire l'application
COPY . .
RUN npm run build --prod

# Utiliser une image NGINX pour servir les fichiers Angular
FROM nginx:alpine

# Copier les fichiers construits dans NGINX
COPY --from=builder /app/dist/mentor_me /usr/share/nginx/html

# Copier le certificat SSL et la clé privée dans le conteneur Nginx
COPY /etc/letsencrypt/live/mboaspeak.com/fullchain.pem /etc/ssl/certs/fullchain.pem
COPY /etc/letsencrypt/live/mboaspeak.com/privkey.pem /etc/ssl/private/privkey.pem

# Exposer le port 80 et 443 pour Nginx
EXPOSE 80
EXPOSE 443

# Copier le fichier de configuration Nginx avec support HTTPS
COPY ./nginx/ssl.conf /etc/nginx/conf.d/default.conf

# Commande pour démarrer NGINX
CMD ["nginx", "-g", "daemon off;"]

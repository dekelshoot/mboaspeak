# Étape 1: Construction de l'application Angular
FROM node:18 AS builder

# Répertoire de travail
WORKDIR /app

# Installer les dépendances
COPY package.json package-lock.json ./
RUN npm install

# Construire le projet Angular
COPY . .
RUN npm run build --prod

# Étape 2: Serveur Nginx
FROM nginx:alpine

# Copier les fichiers de build Angular vers le répertoire de Nginx
# Remplacez "mentor_me" par le nom correct du répertoire de build dans dist/
COPY --from=builder /app/dist/mentor_me /usr/share/nginx/html

# Exposer le port 80
EXPOSE 80

# Démarrer Nginx
CMD ["nginx", "-g", "daemon off;"]

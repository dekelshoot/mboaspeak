FROM node:18 AS build

# Répertoire de travail
WORKDIR /app

# Installer les dépendances
COPY package.json package-lock.json ./
RUN npm install

# Construire le projet Angular
COPY . .
RUN npm run build --prod

# Serveur Nginx
FROM nginx:alpine
COPY --from=build /app/dist/nom_de_votre_projet /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]

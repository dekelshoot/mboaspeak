# Utiliser une image Python officielle
FROM python:3.11-slim

# Définir le répertoire de travail
WORKDIR /app

# Copier les fichiers nécessaires dans le conteneur
COPY requirements.txt .

# Installer les dépendances
RUN pip install --no-cache-dir -r requirements.txt

# Copier tout le projet backend dans le conteneur
COPY . .

# Exposer le port sur lequel le backend écoute
EXPOSE 8000

# Commande pour démarrer le serveur
RUN openssl genrsa -out key.pem 2048
RUN openssl req -new -key key.pem -out csr.pem
RUN openssl x509 -req -in csr.pem -signkey key.pem -out cert.pem
CMD ["python", "manage.py", "runsslserver", "0.0.0.0:8000", "--certificate", "/app/cert.pem", "--key", "/app/key.pem"]

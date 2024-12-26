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
CMD ["python", "manage.py", "runsslserver", "0.0.0.0:8000", "--certificate", "/app/cert.pem", "--key", "/app/key.pem"]

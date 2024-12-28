FROM python:3.11-slim

# Installer les dépendances système
RUN apt-get update && apt-get install -y libpq-dev gcc

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

# Démarrer le serveur
CMD ["gunicorn", "--bind", "0.0.0.0:8000", "mboaspeak.wsgi:application"]




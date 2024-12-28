FROM python:3.10-slim

# Installer les dépendances système
RUN apt-get update && apt-get install -y libpq-dev gcc

# Configurer le répertoire de travail
WORKDIR /app

# Copier les fichiers
COPY requirements.txt .
RUN pip install -r requirements.txt

COPY . .

# Démarrer le serveur
CMD ["gunicorn", "--bind", "0.0.0.0:8000", "mboaspeak.wsgi:application"]

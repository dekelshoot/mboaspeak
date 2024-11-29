from django.db import models

# Create your models here.
from django.db import models
from django.conf import settings

# Modèle Component
class Component(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="components")
    date_submitted = models.DateTimeField(auto_now_add=True)
    votes = models.IntegerField(default=0)
    language = models.CharField(max_length=50)
    meaning_fr = models.TextField(blank=True, null=True)
    meaning_en = models.TextField(blank=True, null=True)

    def vote(self):
        # Obtenez l'utilisateur actuel
        user = self.user
        
        # Déterminez le poids du vote en fonction du type d'utilisateur
        if hasattr(user, 'admin'):  # Vérifie si l'utilisateur est un admin
            vote_weight = user.admin.vote_weight
        elif hasattr(user, 'linguist'):  # Vérifie si l'utilisateur est un linguist
            vote_weight = user.linguist.vote_weight
        elif hasattr(user, 'contributor'):  # Vérifie si l'utilisateur est un contributor
            vote_weight = user.contributor.vote_weight
        else:
            vote_weight = 1  # Valeur par défaut si l'utilisateur n'a pas de rôle spécifique
        
        # Ajoute le poids du vote à la valeur des votes
        self.votes += vote_weight
        self.save()

    def show(self):
        return f"{self.meaning_en} ({self.language}) - Submitted by: {self.user.username}"

# Modèle Word
class Word(Component):  # Hérite de Component
    word_name = models.CharField(max_length=100)  # Défini uniquement ici
    definition = models.TextField()
    lang_definition = models.CharField(max_length=50)

    def show(self):
        return f"Word: {self.word_name} - Definition: {self.definition} ({self.lang_definition})"

# Modèle Expression
class Expression(Component):  # Hérite de Component
    exp = models.CharField(max_length=255)  # Défini uniquement ici
    words = models.ManyToManyField(Word, related_name="expressions")

    # Ajouter un mot à une expression
    def add_word(self, word):
        self.words.add(word)
        self.save()

    # Supprimer un mot d'une expression
    def remove_word(self, word):
        self.words.remove(word)
        self.save()

    # Récupérer tous les mots liés à l'expression
    def get_words(self):
        return self.words.all()

    # Compter le nombre de mots liés à l'expression
    def get_count_words(self):
        return self.words.count()

    def show(self):
        words_list = ", ".join([word.word for word in self.get_words()])
        return f"Expression: {self.expression} ({self.language}) - Words: {words_list}"

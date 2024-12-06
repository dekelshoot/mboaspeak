from django.db import models

# Create your models here.
from django.db import models
from django.conf import settings

# Modèle Component
class Component(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="components")
    date_submitted = models.DateTimeField(auto_now_add=True)
    votes = models.IntegerField(default=0)
    dislikes = models.IntegerField(default=0)
    star = models.IntegerField(default=0)
    language = models.CharField(max_length=50)
    meaning_fr = models.TextField(blank=True, null=True)
    meaning_en = models.TextField(blank=True, null=True)

    def vote(self,user):
        # Obtenez l'utilisateur actuel
        print(user)
        # Déterminez le poids du vote en fonction du type d'utilisateur
        if user.user_type == 'admin':  # Vérifie si l'utilisateur est un admin
            vote_weight = user.vote_weight
            print("admin",vote_weight)
        elif hasattr(user, 'linguist'):  # Vérifie si l'utilisateur est un linguist
            vote_weight = user.vote_weight
            print("linguist")
        elif hasattr(user, 'contributor'):  # Vérifie si l'utilisateur est un contributor
            vote_weight = user.vote_weight
            print("contributor")
            print(user)
        else:
            vote_weight = 1  # Valeur par défaut si l'utilisateur n'a pas de rôle spécifique
        
        # Ajoute le poids du vote à la valeur des votes
        self.votes += vote_weight
        
        self.save()
        
    def dislike(self):
        dislikes_weight = 1  
        # Ajoute le poids du vote à la valeur des votes
        self.dislikes += dislikes_weight
        
        self.save()
        
    def add_star(self):
        star_weight = 1  
        # Ajoute le poids du vote à la valeur des votes
        self.star+= star_weight
        
        self.save()

    def show(self):
        return f"{self.meaning_en} ({self.language}) - Submitted by: {self.user.username}"

# Modèle Word
class Word(Component):  # Hérite de Component
    word_name = models.CharField(max_length=100)  # Défini uniquement ici
    definition = models.TextField()
    example = models.TextField()
    lang_definition = models.CharField(max_length=50)

    def show(self):
        return f"Word: {self.word_name} - Definition: {self.definition} ({self.lang_definition})"



class Vote(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    word = models.ForeignKey(Word, on_delete=models.CASCADE, related_name='user_votes')  # Change related_name
    timestamp = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('user', 'word')  # Empêche un utilisateur de voter deux fois pour le même mot
        
class DisLike(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    word = models.ForeignKey(Word, on_delete=models.CASCADE, related_name='user_dislike')  # Change related_name
    timestamp = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('user', 'word')  # Empêche un utilisateur de voter deux fois pour le même mot

class Star(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    word = models.ForeignKey(Word, on_delete=models.CASCADE, related_name='user_star')  # Change related_name
    timestamp = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('user', 'word')  # Empêche un utilisateur de voter deux fois pour le même mot
from django.db import models

# Create your models here.
from django.db import models
from django.conf import settings

from django.db import models
from django.conf import settings

class Post(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="posts")
    title = models.CharField(max_length=255)
    language = models.CharField(max_length=50)
    content = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    votes = models.IntegerField(default=0)
    dislikes = models.IntegerField(default=0)
    star = models.IntegerField(default=0)

    def vote(self, user):
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
        self.dislikes += 1
        self.save()

    def add_star(self, user):
        if user.user_type == 'linguist':
            self.star += 1
            self.save()

class Comment(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="comments")
    post = models.ForeignKey(Post, on_delete=models.CASCADE, related_name="comments")
    content = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

class VotePost(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    post = models.ForeignKey(Post, on_delete=models.CASCADE, related_name="votes_post")
    timestamp = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ("user", "post")

class DislikePost(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    post = models.ForeignKey(Post, on_delete=models.CASCADE, related_name="dislike_post")
    timestamp = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ("user", "post")
        
class StarPost(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    post = models.ForeignKey(Post, on_delete=models.CASCADE, related_name="star_post")
    timestamp = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ("user", "post")

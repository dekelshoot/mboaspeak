from django.contrib.auth.models import AbstractUser
from django.db import models

LANGUAGE_CHOICES = [
    ('english', 'English'),
    ('french', 'French'),
    ('francanglais', 'Francanglais'),
    ('pidgin', 'Pidgin'),
]

class User(AbstractUser):
    email = models.EmailField(unique=True)
    primary_language = models.CharField(max_length=50, choices=LANGUAGE_CHOICES)
    user_type = models.CharField(
        max_length=50,
        choices=[('admin', 'Admin'), ('contributor', 'Contributor'), ('linguist', 'Linguist')],
        default='contributor',
    )

    # Les relations groups et user_permissions pour éviter les conflits
    groups = models.ManyToManyField(
        'auth.Group',
        related_name='custom_user_groups',  # Nom unique
        blank=True
    )
    user_permissions = models.ManyToManyField(
        'auth.Permission',
        related_name='custom_user_permissions',  # Nom unique
        blank=True
    )

    def __str__(self):
        return self.username




class Admin(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='admin')
    vote_weight = models.PositiveIntegerField(default=5)

    def __str__(self):
        return f"Admin: {self.user.username}"
    
    def add_star(self, word):
        # Exemple d'une méthode spécifique aux linguistes
        word.is_starred = True
        word.save()


class Contributor(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='contributor')
    vote_weight = models.PositiveIntegerField(default=1)

    def __str__(self):
        return f"Contributor: {self.user.username}"



class Linguist(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='linguist')
    vote_weight = models.PositiveIntegerField(default=3)

    def add_star(self, word):
        # Exemple d'une méthode spécifique aux linguistes
        word.is_starred = True
        word.save()

    def __str__(self):
        return f"Linguist: {self.user.username}"

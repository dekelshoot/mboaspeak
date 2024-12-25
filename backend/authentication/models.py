from django.contrib.auth.models import AbstractUser
from django.db import models

LANGUAGE_CHOICES = [
    ('english', 'English'),
    ('french', 'French'),
    ('camfranglais', 'Camfranglais'),
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
    vote_weight = models.PositiveIntegerField(default=1)  # Champ déplacé ici

    #  groups and user_permissions relation to avoid conflits
    groups = models.ManyToManyField(
        'auth.Group',
        related_name='custom_user_groups',  # unique name
        blank=True
    )
    user_permissions = models.ManyToManyField(
        'auth.Permission',
        related_name='custom_user_permissions',  # unique name
        blank=True
    )

    def __str__(self):
        return self.username


class Admin(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='admin')

    def save(self, *args, **kwargs):
        # Admin vote weigt
        self.user.vote_weight = 5
        self.user.save()
        super().save(*args, **kwargs)

    def __str__(self):
        return f"Admin: {self.user.username}"


class Contributor(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='contributor')

    def save(self, *args, **kwargs):
        # Contributor's vote weight
        self.user.vote_weight = 1
        self.user.save()
        super().save(*args, **kwargs)

    def __str__(self):
        return f"Contributor: {self.user.username}"


class Linguist(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='linguist')

    def save(self, *args, **kwargs):
        # Linguist vote weight
        self.user.vote_weight = 5
        self.user.save()
        super().save(*args, **kwargs)

    def __str__(self):
        return f"Linguist: {self.user.username}"

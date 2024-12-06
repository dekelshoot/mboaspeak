from django.db import models
# Create your models here.
from django.db import models
from django.conf import settings
from dictionary.models import Component,Word
# Create your models here.


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


class VoteExpression(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    expression = models.ForeignKey(Expression, on_delete=models.CASCADE, related_name='user_votes_expression')  # Change related_name
    timestamp = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('user', 'expression')  # Empêche un utilisateur de voter deux fois pour le même mot
        
class DisLikeExpression(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    expression = models.ForeignKey(Expression, on_delete=models.CASCADE, related_name='user_dislike_expression')  # Change related_name
    timestamp = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('user', 'expression')  # Empêche un utilisateur de voter deux fois pour le même mot

class StarExpression(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    expression = models.ForeignKey(Expression, on_delete=models.CASCADE, related_name='user_star_expression')  # Change related_name
    timestamp = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('user', 'expression')  # Empêche un utilisateur de voter deux fois pour le même mot
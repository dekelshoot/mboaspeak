from django.db import models
# Create your models here.
from django.db import models
from django.conf import settings
from dictionary.models import Component,Word
# Create your models here.


# Expression model
class Expression(Component):  # inherite form component class
    exp = models.CharField(max_length=255)  
    words = models.ManyToManyField(Word, related_name="expressions")

    # Adds a word to an expression 
    def add_word(self, word):
        self.words.add(word)
        self.save()

    # delates word from expression 
    def remove_word(self, word):
        self.words.remove(word)
        self.save()

    # Collects all the words linked to te expression 
    def get_words(self):
        return self.words.all()

    #Counts the number of words in the expression 
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
        unique_together = ('user', 'expression')  # Stops users from voting twice for the same word
class DisLikeExpression(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    expression = models.ForeignKey(Expression, on_delete=models.CASCADE, related_name='user_dislike_expression')  # Change related_name
    timestamp = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('user', 'expression')  # Stops users from voting twice for the same word

class StarExpression(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    expression = models.ForeignKey(Expression, on_delete=models.CASCADE, related_name='user_star_expression')  # Change related_name
    timestamp = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('user', 'expression')  # Stops users from voting twice for the same word
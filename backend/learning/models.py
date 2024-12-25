from django.db import models
from django.conf import settings

class Lesson(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="lesson")
    title = models.CharField(max_length=255)
    video_url = models.URLField()
    content = models.TextField()
    language = models.CharField(max_length=50)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.title

class Quiz(models.Model):
    title = models.CharField(max_length=255)
    lesson = models.OneToOneField(Lesson, on_delete=models.CASCADE, related_name="quiz")

    def __str__(self):
        return self.title

class Question(models.Model):
    text = models.CharField(max_length=255)
    quiz = models.ForeignKey(Quiz, on_delete=models.CASCADE, related_name="questions")

    def __str__(self):
        return self.text

class Choice(models.Model):
    text = models.CharField(max_length=255)
    is_correct = models.BooleanField(default=False)
    question = models.ForeignKey(Question, on_delete=models.CASCADE, related_name="choices")

    def __str__(self):
        return f"{self.text} (Correct: {self.is_correct})"

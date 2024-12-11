from django.contrib import admin
from .models import Lesson, Quiz, Question, Choice

# Inline pour les choix dans les questions
class ChoiceInline(admin.TabularInline):
    model = Choice
    extra = 2  # Nombre de champs de choix supplémentaires affichés par défaut

# Inline pour les questions dans les quizz
class QuestionInline(admin.TabularInline):
    model = Question
    extra = 1  # Nombre de questions supplémentaires affichées par défaut

# Inline pour les quiz dans les leçons
class QuizInline(admin.TabularInline):
    model = Quiz
    extra = 1  # Un seul quiz par leçon, donc extra à 1

# Modèle de Quiz dans l'administration
class QuizAdmin(admin.ModelAdmin):
    list_display = ('title', 'lesson')
    inlines = [QuestionInline]  # Ajouter les questions sous chaque quiz

# Modèle de Question dans l'administration
class QuestionAdmin(admin.ModelAdmin):
    list_display = ('text', 'quiz')
    inlines = [ChoiceInline]  # Ajouter les choix sous chaque question

# Modèle de Choice dans l'administration
class ChoiceAdmin(admin.ModelAdmin):
    list_display = ('text', 'is_correct', 'question')

# Modèle de Lesson dans l'administration
class LessonAdmin(admin.ModelAdmin):
    list_display = ('title', 'user', 'language', 'created_at', 'updated_at')
    search_fields = ('title', 'content', 'language')
    list_filter = ('language', 'created_at')
    ordering = ('-created_at',)  # Trier par date de création
    inlines = [QuizInline]  # Ajouter un quiz sous chaque leçon

# Enregistrement des modèles dans l'administration
admin.site.register(Lesson, LessonAdmin)
admin.site.register(Quiz, QuizAdmin)
admin.site.register(Question, QuestionAdmin)
admin.site.register(Choice, ChoiceAdmin)

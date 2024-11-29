from django.contrib import admin
from .models import Word, Expression, Component

# Enregistrer les modèles dans l'admin de Django

@admin.register(Word)
class WordAdmin(admin.ModelAdmin):
    list_display = ('word', 'definition', 'lang_definition', 'language', 'votes', 'date_submitted')  # Afficher ces champs dans la liste
    search_fields = ('word', 'definition')  # Permettre la recherche par mot et définition
    list_filter = ('language',)  # Permettre de filtrer les mots par langue
    ordering = ('-date_submitted',)  # Trier les mots par date de soumission décroissante


@admin.register(Expression)
class ExpressionAdmin(admin.ModelAdmin):
    list_display = ('expression', 'language', 'votes', 'date_submitted')  # Afficher ces champs dans la liste
    search_fields = ('expression',)  # Permettre la recherche par expression
    list_filter = ('language',)  # Permettre de filtrer les expressions par langue
    ordering = ('-date_submitted',)  # Trier les expressions par date de soumission décroissante

# Vous pouvez également enregistrer le modèle Component si nécessaire
admin.site.register(Component)

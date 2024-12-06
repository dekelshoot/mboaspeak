from django.contrib import admin
from .models import  Expression, Component

# Enregistrer les modèles dans l'admin de Django



@admin.register(Expression)
class ExpressionAdmin(admin.ModelAdmin):
    list_display = ('expression', 'language', 'votes', 'date_submitted')  # Afficher ces champs dans la liste
    search_fields = ('expression',)  # Permettre la recherche par expression
    list_filter = ('language',)  # Permettre de filtrer les expressions par langue
    ordering = ('-date_submitted',)  # Trier les expressions par date de soumission décroissante


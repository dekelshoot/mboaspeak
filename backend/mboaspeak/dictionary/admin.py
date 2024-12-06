from django.contrib import admin
from .models import Word,  Component

# Enregistrer les modèles dans l'admin de Django

@admin.register(Word)
class WordAdmin(admin.ModelAdmin):
    list_display = ('word_name', 'definition', 'lang_definition', 'language', 'votes', 'date_submitted')  # Afficher ces champs dans la liste
    search_fields = ('word', 'definition')  # Permettre la recherche par mot et définition
    list_filter = ('language',)  # Permettre de filtrer les mots par langue
    ordering = ('-date_submitted',)  # Trier les mots par date de soumission décroissante



# Vous pouvez également enregistrer le modèle Component si nécessaire
admin.site.register(Component)

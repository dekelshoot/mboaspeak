
from django import forms
from django.contrib import admin
from .models import User

# Personnalisation du formulaire d'édition d'utilisateur
class UserAdminForm(forms.ModelForm):
    class Meta:
        model = User
        fields = '__all__'

# Personnalisation de l'affichage dans l'admin
class UserAdmin(admin.ModelAdmin):
    form = UserAdminForm
    list_display = ('username', 'email', 'first_name', 'last_name', 'is_active', 'date_joined')
    search_fields = ('username', 'email')
    list_filter = ('is_active', 'date_joined')
    ordering = ('date_joined',)

# Enregistrer le modèle personnalisé dans l'admin
admin.site.register(User, UserAdmin)

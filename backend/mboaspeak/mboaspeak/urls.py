from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    path('admin/', admin.site.urls),
    # Inclure les URLs de l'application 'authentication'
    path('api/auth/', include('authentication.urls')),  # Redirige vers l'authentification
    # Autres routes de votre projet
]

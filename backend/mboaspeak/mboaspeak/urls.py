from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    path('admin/', admin.site.urls),
    # Inclure les URLs de l'application 'authentication'
    path('api/auth/', include('authentication.urls')),  # Redirige vers l'authentification
    path('api/dico/', include('dictionary.urls')),
    path('api/expression/', include('expressions.urls')),
    path('api/admin/', include('Mboa_admin.urls')),
    path('api/post/', include('forum.urls')),
]

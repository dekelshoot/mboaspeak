from django.urls import path
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
    TokenVerifyView,
)
from .views import RegisterView,LoginView, UpdateUserView, UserDetailView,LanguageView  # Assurez-vous que RegisterView est bien importé

urlpatterns = [
    # Route pour obtenir un access token et un refresh token
    path('token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('token/verify/', TokenVerifyView.as_view(), name='token_verify'),

    # Route pour l'inscription d'un utilisateur
    path('register/', RegisterView.as_view(), name='register'),
    
    # Route pour l'inscription d'un utilisateur
    path('login/', LoginView.as_view(), name='login'),
    path('user/', UserDetailView.as_view(), name='user_detail'),  # Nouvelle route pour afficher les détails de l'utilisateur
    # Route pour la mise à jour du profil utilisateur
    path('update/', UpdateUserView.as_view(), name='update_user'),
    path('language/', LanguageView.as_view(), name='language'),
]
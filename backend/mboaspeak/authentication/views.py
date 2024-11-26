from django.shortcuts import render

# Create your views here.
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .models import User, Admin, Contributor, Linguist
from .serializers import UserSerializer

from rest_framework.permissions import IsAuthenticated
from rest_framework.authtoken.models import Token

from .serializers import UserSerializer
from django.contrib.auth import authenticate
from .serializers import RegisterSerializer
from rest_framework_simplejwt.tokens import RefreshToken


class RegisterView(APIView):
    """
    Vue pour l'inscription d'un nouvel utilisateur.
    Après l'inscription, un access token et un refresh token sont générés.
    """

    def post(self, request):
        # Sérialisation des données
        serializer = RegisterSerializer(data=request.data)

        if serializer.is_valid():
            # Créer l'utilisateur et associer son type (Admin, Linguist, Contributor)
            user = serializer.save()

            # Générer les tokens
            refresh = RefreshToken.for_user(user)
            access_token = refresh.access_token

            return Response(
                {
                    "refresh": str(refresh),
                    "access": str(access_token),
                },
                status=status.HTTP_201_CREATED,
            )
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    



class LoginView(APIView):
    """
    Vue personnalisée pour la connexion d'un utilisateur.
    Renvoie un access token et un refresh token en cas de succès.
    """

    def post(self, request):
        # Récupérer les informations d'authentification
        username = request.data.get("username")
        password = request.data.get("password")

        if not username or not password:
            return Response({"error": "Username and password are required."}, status=status.HTTP_400_BAD_REQUEST)

        # Authentifier l'utilisateur
        user = authenticate(username=username, password=password)

        if user is not None:
            # Créer le refresh token et l'access token
            refresh = RefreshToken.for_user(user)
            access_token = refresh.access_token

            return Response(
                {
                    "refresh": str(refresh),
                    "access": str(access_token),
                },
                status=status.HTTP_200_OK,
            )
        else:
            return Response(
                {"error": "Invalid credentials."},
                status=status.HTTP_400_BAD_REQUEST,
            )


class UpdateUserView(APIView):
    """
    Permet à un utilisateur authentifié de mettre à jour ses informations.
    """
    permission_classes = [IsAuthenticated]

    def put(self, request):
        # L'utilisateur connecté est récupéré via `request.user`
        user = request.user
        serializer = UserSerializer(user, data=request.data, partial=True)

        if serializer.is_valid():
            # Enregistrer les modifications
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

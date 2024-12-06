
from authentication.models import User

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework import status
from django.http import JsonResponse

from rest_framework.exceptions import NotFound
from authentication.models import User,Admin,Linguist,Contributor


class UpdateUserTypeView(APIView):
    # Autoriser uniquement les administrateurs
    permission_classes = [IsAuthenticated]

    def patch(self, request, username):
      
        try:
            if request.user.user_type!= "admin":
                return Response(
                    {'error': 'user no authorized.'},
                    status=status.HTTP_400_BAD_REQUEST
                )
                
            # Récupérer l'utilisateur avec l'ID fourni
            user = User.objects.get(username=username)

            # Récupérer le nouveau type d'utilisateur depuis la requête
            new_user_type = request.data.get('user_type')
            if new_user_type not in ['admin', 'contributor', 'linguist']:
                return Response(
                    {'error': 'Invalid user type. Valid options: admin, contributor, linguist.'},
                    status=status.HTTP_400_BAD_REQUEST
                )
            
            # Mettre à jour le champ user_type
             # Mettre à jour le champ user_type et vote_weight
            user.user_type = new_user_type

            if new_user_type == 'admin':
                user.vote_weight = 5  # Poids pour Admin
            elif new_user_type == 'linguist':
                user.vote_weight = 5  # Poids pour Linguist
            elif new_user_type == 'contributor':
                user.vote_weight = 1  # Poids pour Contributor
                
            user.save()

            return Response(
                {'message': f"User type updated successfully to '{new_user_type}' for user {user.username}."},
                status=status.HTTP_200_OK
            )

        except User.DoesNotExist:
            return Response(
                {'error': 'User not found.'},
                status=status.HTTP_404_NOT_FOUND
            )
        except Exception as e:
            return Response(
                {'error': f"An error occurred: {str(e)}"},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )



class UserListView(APIView):
    permission_classes = [IsAuthenticated]  # Restriction d'accès : uniquement les utilisateurs authentifiés

    def get(self, request):
        # Vérifier si un filtre est passé en paramètre
        user_type = request.query_params.get('user_type', None)  # Ex : ?user_type=admin

        if user_type == "admin":
            users = User.objects.filter(user_type='admin')
        elif user_type == "linguist":
            users = User.objects.filter(user_type='linguist')
        elif user_type == "contributor":
            users = User.objects.filter(user_type='contributor')
        else:
            users = User.objects.all()  # Retourne tous les utilisateurs si aucun filtre n'est fourni

        # Construire une liste de dictionnaires avec les informations des utilisateurs
        user_data = [
            {
                "username": user.username,
                "email": user.email,
                "primary_language": user.primary_language,
                "user_type": user.user_type,
            }
            for user in users
        ]

        return JsonResponse({"users": user_data}, safe=False, status=200)
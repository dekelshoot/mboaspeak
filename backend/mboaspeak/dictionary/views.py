from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework import status
from .models import Word, Expression
from .serializers import WordSerializer, ExpressionSerializer
from django.contrib.auth.decorators import login_required
from django.http import JsonResponse
from .models import Word
from rest_framework.exceptions import NotFound
from authentication.models import User

class CreateWordView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        # Sérialiser les données du mot envoyées par le client
        serializer = WordSerializer(data=request.data)
        
        # Vérifier si les données sont valides
        if serializer.is_valid():
            # Sauvegarder le mot dans la base de données
            word = serializer.save(user=request.user)

            # Retourner la réponse avec les données sérialisées
            return Response(serializer.data, status=status.HTTP_201_CREATED)

        # Retourner une erreur si la validation échoue
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
# Vue pour créer une expression
class CreateExpressionView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        serializer = ExpressionSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save(user=request.user)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

# Vue pour ajouter un mot à une expression
class AddWordToExpressionView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, expression_id, word_id):
        try:
            expression = Expression.objects.get(pk=expression_id)
            word = Word.objects.get(pk=word_id)
            expression.add_word(word)
            return Response({"message": "Word added to expression successfully"}, status=status.HTTP_200_OK)
        except (Expression.DoesNotExist, Word.DoesNotExist):
            return Response({"error": "Expression or Word not found"}, status=status.HTTP_404_NOT_FOUND)

# Vue pour voter pour une expression
class VoteExpressionView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, pk):
        try:
            expression = Expression.objects.get(pk=pk)
            expression.vote()
            return Response({"message": "Vote added successfully"}, status=status.HTTP_200_OK)
        except Expression.DoesNotExist:
            return Response({"error": "Expression not found"}, status=status.HTTP_404_NOT_FOUND)

# Vue pour voter pour un mot
class VoteWordView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, pk):
        try:
            word = Word.objects.get(pk=pk)
            word.vote()
            return Response({"message": "Vote added successfully"}, status=status.HTTP_200_OK)
        except Word.DoesNotExist:
            return Response({"error": "Word not found"}, status=status.HTTP_404_NOT_FOUND)


class UpdateWordView(APIView):
    permission_classes = [IsAuthenticated]

    def put(self, request, pk):
        try:
            # Récupérer le mot à mettre à jour
            word = Word.objects.get(pk=pk)

            # Vérifier si l'utilisateur a la permission de modifier ce mot
            if word.user != request.user:
                return Response({"error": "You do not have permission to edit this word."}, status=status.HTTP_403_FORBIDDEN)

            # Sérialiser les nouvelles données envoyées par l'utilisateur
            serializer = WordSerializer(word, data=request.data, partial=True)

            # Vérifier la validité des données
            if serializer.is_valid():
                serializer.save()  # Sauvegarder les modifications dans la base de données
                return Response(serializer.data, status=status.HTTP_200_OK)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        
        except Word.DoesNotExist:
            return Response({"error": "Word not found."}, status=status.HTTP_404_NOT_FOUND)



class user_added_words(APIView):
    permission_classes = [IsAuthenticated]
    
    def get(self,request):
        try:
            # Récupérer l'utilisateur connecté
            user = request.user
            
            # Récupérer tous les mots ajoutés par cet utilisateur
            words = Word.objects.filter(user=user)
            
            # Préparer les données pour les retourner au format JSON
            words_data = [{"id": word.id, "word_name": word.word_name, "definition": word.definition, "lang_definition":word.lang_definition,"meaning_fr":word.meaning_fr, "meaning_en":word.meaning_en, "language":word.language,"votes":word.votes,"date_submitted":word.date_submitted} for word in words]
            
            return JsonResponse({"words": words_data})

        except Word.DoesNotExist:
            return Response({"error": "Word not found."}, status=status.HTTP_404_NOT_FOUND)
        
        
class WordDetailView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, id):
        print("hello")
        try:
            word = Word.objects.get(id=id)  # Récupère le mot via son ID
        except Word.DoesNotExist:
            return Response({"error": "Word not found."}, status=status.HTTP_404_NOT_FOUND)

        # Retourne les détails du mot sous forme de dictionnaire
        return Response({
            "id": word.id, "word_name": word.word_name, "definition": word.definition, "lang_definition":word.lang_definition,"meaning_fr":word.meaning_fr, "meaning_en":word.meaning_en, "language":word.language,"votes":word.votes,"date_submitted":word.date_submitted
        })
        

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
            user.user_type = new_user_type
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

from rest_framework.views import APIView
from rest_framework.generics import ListAPIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework import status
from .models import Word
from .serializers import WordSerializer
from django.contrib.auth.decorators import login_required
from django.http import JsonResponse
from .models import Word,Vote, Star,DisLike
from rest_framework.exceptions import NotFound
from authentication.models import User
from rest_framework.pagination import PageNumberPagination

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




# Vue pour voter pour un mot
class VoteWordView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, pk):
        try:
            word = Word.objects.get(pk=pk)
            word.vote(request.user)
            # Vérifier si l'utilisateur a déjà voté pour ce mot
            if Vote.objects.filter(user=request.user, word=word).exists():
                return Response({"error": "You have already voted for this word."}, status=status.HTTP_400_BAD_REQUEST)
            # Enregistrer le vote
            Vote.objects.create(user=request.user, word=word)
            return Response({"message": "Vote added successfully."}, status=status.HTTP_201_CREATED)
        
        except Word.DoesNotExist:
            return Response({"error": "Word not found"}, status=status.HTTP_404_NOT_FOUND)


# Vue pour dislikes  un mot
class DislikesWordView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, pk):
        try:
            word = Word.objects.get(pk=pk)
            word.dislike()
            if DisLike.objects.filter(user=request.user, word=word).exists():
                return Response({"error": "You have already disliked for this word."}, status=status.HTTP_400_BAD_REQUEST)
            # Enregistrer le vote
            DisLike.objects.create(user=request.user, word=word)
            return Response({"message": "dislikes added successfully"}, status=status.HTTP_200_OK)
        except Word.DoesNotExist:
            return Response({"error": "Word not found"}, status=status.HTTP_404_NOT_FOUND)


# Vue pour dislikes  un mot
class starWordView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, pk):
        if request.user.user_type != 'linguist':
                return Response({"error": "You do not have permission to add star."}, status=status.HTTP_403_FORBIDDEN)

        try:
            word = Word.objects.get(pk=pk)
            word.add_star()
            if Star.objects.filter(user=request.user, word=word).exists():
                return Response({"error": "You have already Stard for this word."}, status=status.HTTP_400_BAD_REQUEST)
            # Enregistrer le vote
            Star.objects.create(user=request.user, word=word)
            return Response({"message": "star added successfully"}, status=status.HTTP_200_OK)
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
            words_data = [{"id": word.id, "word_name": word.word_name, "definition": word.definition, "example":word.example, "lang_definition":word.lang_definition,"meaning_fr":word.meaning_fr, "meaning_en":word.meaning_en, "language":word.language,"votes":word.votes,"dislikes":word.dislikes,"star":word.star,"date_submitted":word.date_submitted} for word in words]
            
            return JsonResponse({"words": words_data})

        except Word.DoesNotExist:
            return Response({"error": "Word not found."}, status=status.HTTP_404_NOT_FOUND)
        
        
class WordDetailView(APIView):
    
    def get(self, request, id):
        print("hello")
        try:
            word = Word.objects.get(id=id)  # Récupère le mot via son ID
        except Word.DoesNotExist:
            return Response({"error": "Word not found."}, status=status.HTTP_404_NOT_FOUND)
        liked = False
        stared = False
        disliked = False

        return Response({
            "id": word.id,
            "liked": liked,
            "stared": stared,
            "disliked": disliked,
            "word_name": word.word_name,
            "definition": word.definition,
            "lang_definition": word.lang_definition,
            "meaning_fr": word.meaning_fr,
            "meaning_en": word.meaning_en,
            "example": word.example,
            "language": word.language,
            "votes": word.votes,
            "dislikes": word.dislikes,
            "star": word.star,
            "date_submitted": word.date_submitted,
            "added_by": word.user.username if word.user else None,
        })
        
class WordDetailViewWithaccess(APIView):
    permission_classes = [IsAuthenticated]
    def get(self, request, id):
        print("hello")
        try:
            word = Word.objects.get(id=id)  # Récupère le mot via son ID
        except Word.DoesNotExist:
            return Response({"error": "Word not found."}, status=status.HTTP_404_NOT_FOUND)
        liked = False
        print(request.user.id)

        liked = Vote.objects.filter(user=request.user, word=word).exists()
        stared = Star.objects.filter(user=request.user, word=word).exists()
        disliked = DisLike.objects.filter(user=request.user, word=word).exists()

        return Response({
            "id": word.id,
            "liked": liked,
            "stared": stared,
            "disliked": disliked,
            "word_name": word.word_name,
            "definition": word.definition,
            "lang_definition": word.lang_definition,
            "meaning_fr": word.meaning_fr,
            "meaning_en": word.meaning_en,
            "example": word.example,
            "language": word.language,
            "votes": word.votes,
            "dislikes": word.dislikes,
            "star": word.star,
            "date_submitted": word.date_submitted,
            "added_by": word.user.username if word.user else None,
        }, status=200)
   
        

    

class CustomWordPagination(PageNumberPagination):
    page_size = 2  # Nombre de mots par page
    page_size_query_param = 'page_size'
    max_page_size = 50

class PaginatedWordListView(ListAPIView):
    queryset = Word.objects.all().order_by('-date_submitted')
    pagination_class = CustomWordPagination

    def list(self, request, *args, **kwargs):
        page = self.paginate_queryset(self.get_queryset())
        if page is not None:
            # Construire une réponse avec le nom de l'utilisateur
            custom_data = [
                {
                    "id": word.id,
                    "word_name": word.word_name,
                    "definition": word.definition,  
                    "lang": word.language,
                    "example":word.example,
                    "votes": word.votes,
                    "dislikes":word.dislikes,"star":word.star,
                    "submitted_at": word.date_submitted.strftime('%Y-%m-%d %H:%M:%S'),
                    "added_by": word.user.username,  # Ajout du nom de l'utilisateur
                }
                for word in page
            ]

            return self.get_paginated_response({
                "count": self.paginator.page.paginator.count,
                "page": self.paginator.page.number,
                "next_page_url": self.paginator.get_next_link(),
                "previous_page_url": self.paginator.get_previous_link(),
                "results": custom_data,
            })
        
        return Response({"error": "No words available"}, status=404)


class WordSearchView(APIView):

    def get(self, request):
        # Récupérer la query passée en paramètre ?query=<mot>
        search_query = request.query_params.get('query', None)

        if not search_query:
            return Response({"error": "Query parameter 'query' is required."}, status=400)

        # Effectuer la recherche (case insensitive)
        words = Word.objects.filter(word_name__icontains=search_query).order_by('-date_submitted')

        # Construire les résultats de la recherche
        word_data = [
            {
                "id": word.id,
                "word_name": word.word_name,
                "definition": word.definition,
                "language": word.language,
                "votes": word.votes,
                "dislikes":word.dislikes,"star":word.star,
                "example":word.example,
                "submitted_at": word.date_submitted.strftime('%Y-%m-%d %H:%M:%S'),
                "added_by": word.user.username,
            }
            for word in words
        ]

        return Response({"results": word_data}, status=200)
    

class TopVotedWordsView(APIView):
    

    def get(self, request):
        # Récupérer les 4 mots avec le plus grand nombre de votes
        top_words = Word.objects.order_by('-votes')[:4]

        # Construire la réponse JSON avec les détails des mots
        word_data = [
            {
                "id": word.id,
                "word_name": word.word_name,
                "definition": word.definition,
                "votes": word.votes,
                "dislikes":word.dislikes,"star":word.star,
                "example":word.example,
                "language":word.language,
                "submitted_at": word.date_submitted.strftime('%Y-%m-%d %H:%M:%S'),
                "added_by": word.user.username,
            }
            for word in top_words
        ]

        return Response({"top_words": word_data}, status=200)
    
class recentWordsView(APIView):
    

    def get(self, request):
        # Récupérer les 4 mots avec le plus grand nombre de votes
        top_words = Word.objects.order_by('-date_submitted')[:4]

        # Construire la réponse JSON avec les détails des mots
        word_data = [
            {
                "id": word.id,
                "word_name": word.word_name,
                "definition": word.definition,
                "votes": word.votes,
                "dislikes":word.dislikes,"star":word.star,
                "example":word.example,
                "language":word.language,
                "submitted_at": word.date_submitted.strftime('%Y-%m-%d %H:%M:%S'),
                "added_by": word.user.username,
            }
            for word in top_words
        ]

        return Response({"recent_words": word_data}, status=200)
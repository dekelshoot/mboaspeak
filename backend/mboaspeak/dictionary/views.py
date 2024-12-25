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
        # Serializes the data of the word sent by the user
        serializer = WordSerializer(data=request.data)
        
        # Verifies if the data are valid 
        if serializer.is_valid():
            # saves the word in the data base 
            word = serializer.save(user=request.user)

            # Returns a response with the serialised datas
            return Response(serializer.data, status=status.HTTP_201_CREATED)

        # Returns a response with the errors if the data are not valid
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)




# View to vote for a word
class VoteWordView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, pk):
        try:
            word = Word.objects.get(pk=pk)
            word.vote(request.user)
            # Verifies if the user has already voted for the word 
            if Vote.objects.filter(user=request.user, word=word).exists():
                return Response({"error": "You have already voted for this word."}, status=status.HTTP_400_BAD_REQUEST)
            # Save vote
            Vote.objects.create(user=request.user, word=word)
            return Response({"message": "Vote added successfully."}, status=status.HTTP_201_CREATED)
        
        except Word.DoesNotExist:
            return Response({"error": "Word not found"}, status=status.HTTP_404_NOT_FOUND)


# View to dislike
class DislikesWordView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, pk):
        try:
            word = Word.objects.get(pk=pk)
            word.dislike()
            if DisLike.objects.filter(user=request.user, word=word).exists():
                return Response({"error": "You have already disliked for this word."}, status=status.HTTP_400_BAD_REQUEST)
            # save vote
            DisLike.objects.create(user=request.user, word=word)
            return Response({"message": "dislikes added successfully"}, status=status.HTTP_200_OK)
        except Word.DoesNotExist:
            return Response({"error": "Word not found"}, status=status.HTTP_404_NOT_FOUND)


# View to star a word 
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
            # collects word to update
            word = Word.objects.get(pk=pk)

            # verify user's permission to update
            if word.user != request.user:
                return Response({"error": "You do not have permission to edit this word."}, status=status.HTTP_403_FORBIDDEN)

            # Serializes new data sent by user
            serializer = WordSerializer(word, data=request.data, partial=True)

            # Checks validity of data sent 
            if serializer.is_valid():
                serializer.save()  # saves the modification in the database
                return Response(serializer.data, status=status.HTTP_200_OK)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        
        except Word.DoesNotExist:
            return Response({"error": "Word not found."}, status=status.HTTP_404_NOT_FOUND)



class user_added_words(APIView):
    permission_classes = [IsAuthenticated]
    
    def get(self,request):
        try:
            # collects online user 
            user = request.user
            
            # Collects all the words added by the user
            words = Word.objects.filter(user=user)
            
            # List of datas to be returned in JSON format 
            words_data = [{"id": word.id, "word_name": word.word_name, "definition": word.definition, "example":word.example, "lang_definition":word.lang_definition,"meaning_fr":word.meaning_fr, "meaning_en":word.meaning_en, "language":word.language,"votes":word.votes,"dislikes":word.dislikes,"star":word.star,"date_submitted":word.date_submitted} for word in words]
            
            return JsonResponse({"words": words_data})

        except Word.DoesNotExist:
            return Response({"error": "Word not found."}, status=status.HTTP_404_NOT_FOUND)
        
        
class WordDetailView(APIView):
    
    def get(self, request, id):
        print("hello")
        try:
            word = Word.objects.get(id=id)  # Collects word through its ID
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
            word = Word.objects.get(id=id)  # collect word through id
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
    page_size = 2  # Number of word per page
    page_size_query_param = 'page_size'
    max_page_size = 50

class PaginatedWordListView(ListAPIView):
    queryset = Word.objects.all().order_by('-date_submitted')
    pagination_class = CustomWordPagination

    def list(self, request, *args, **kwargs):
        page = self.paginate_queryset(self.get_queryset())
        if page is not None:
            # make a response with username
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
        # Collects query in parameter ?query=<mot>
        search_query = request.query_params.get('query', None)

        if not search_query:
            return Response({"error": "Query parameter 'query' is required."}, status=400)

        # makes search
        words = Word.objects.filter(word_name__icontains=search_query).order_by('-date_submitted')

        # builds the result of the search 
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
        # Collects 4 most voted words
        top_words = Word.objects.order_by('-votes')[:4]

        # builds a JSON response with the word details 
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
        # Collects 4 recently addedwords
        top_words = Word.objects.order_by('-date_submitted')[:4]

        # Builds a json response with de word details 
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
from rest_framework.views import APIView
from rest_framework.generics import ListAPIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework import status
from .models import Word, Expression,VoteExpression,StarExpression,DisLikeExpression
from .serializers import WordSerializer, ExpressionSerializer


from .models import Word,VoteExpression, StarExpression,DisLikeExpression
from rest_framework.exceptions import NotFound
from authentication.models import User
from rest_framework.pagination import PageNumberPagination

class ExpressionView(APIView):
    permission_classes = [IsAuthenticated]
    
    def get(self, request):
        expressions = Expression.objects.filter(user=request.user)
        serializer = ExpressionSerializer(expressions, many=True)
        return Response({"expressions": serializer.data})

    def post(self, request):
        serializer = ExpressionSerializer(data=request.data)
        if serializer.is_valid():
            expression = serializer.save(user=request.user)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    

class UpdateExpressionView(APIView):
    permission_classes = [IsAuthenticated]
    def put(self, request, pk):
        try:
            # Collects expression to update
            expression = Expression.objects.get(pk=pk)

            # Check is user is authorized to make modification 
            if expression.user != request.user:
                return Response({"error": "You do not have permission to edit this expression."}, status=status.HTTP_403_FORBIDDEN)

            # Sérialises the new data sent by the user 
            serializer = ExpressionSerializer(expression, data=request.data, partial=True)

            # Checks the validity of the data 
            if serializer.is_valid():
                serializer.save()  # Saves the modification in the Database
                return Response(serializer.data, status=status.HTTP_200_OK)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        
        except Word.DoesNotExist:
            return Response({"error": "expression not found."}, status=status.HTTP_404_NOT_FOUND)


class VoteExpressionView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, pk):
        try:
            expression = Expression.objects.get(pk=pk)
            if VoteExpression.objects.filter(user=request.user, expression=expression).exists():
                return Response({"error": "You have already voted for this expression."}, status=status.HTTP_400_BAD_REQUEST)
            VoteExpression.objects.create(user=request.user, expression=expression)
            expression.vote(request.user)
            return Response({"message": "Vote added successfully."}, status=status.HTTP_201_CREATED)
        except Expression.DoesNotExist:
            return Response({"error": "Expression not found"}, status=status.HTTP_404_NOT_FOUND)

class DislikeExpressionView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, pk):
        try:
            expression = Expression.objects.get(pk=pk)
            if DisLikeExpression.objects.filter(user=request.user, expression=expression).exists():
                return Response({"error": "You have already disliked this expression."}, status=status.HTTP_400_BAD_REQUEST)
            DisLikeExpression.objects.create(user=request.user, expression=expression)
            expression.dislike()
            return Response({"message": "Dislike added successfully"}, status=status.HTTP_200_OK)
        except Expression.DoesNotExist:
            return Response({"error": "Expression not found"}, status=status.HTTP_404_NOT_FOUND)


class StarExpressionView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, pk):
        if request.user.user_type != 'linguist':
            return Response({"error": "You do not have permission to add a star."}, status=status.HTTP_403_FORBIDDEN)
        try:
            expression = Expression.objects.get(pk=pk)
            if StarExpression.objects.filter(user=request.user, expression=expression).exists():
                return Response({"error": "You have already starred this expression."}, status=status.HTTP_400_BAD_REQUEST)
            StarExpression.objects.create(user=request.user, expression=expression)
            expression.add_star()
            return Response({"message": "Star added successfully"}, status=status.HTTP_200_OK)
        except Expression.DoesNotExist:
            return Response({"error": "Expression not found"}, status=status.HTTP_404_NOT_FOUND)




class ExpressionDetailView(APIView):


    def get(self, request, id):
        try:
            expression = Expression.objects.get(id=id)
            liked = False
            stared = False
            disliked = False
            return Response({
                "id": expression.id,
                "exp": expression.exp,
                "meaning_fr": expression.meaning_fr,
                "meaning_fr": expression.meaning_fr,
                "meaning_en": expression.meaning_en,
                "language": expression.language,
                "votes": expression.votes,
                "dislikes": expression.dislikes,
                "star": expression.star,
                "date_submitted": expression.date_submitted,
                "liked": liked,
                "stared": stared,
                "disliked": disliked,
                "added_by": expression.user.username,
            }, status=200)
        except Expression.DoesNotExist:
            return Response({"error": "Expression not found"}, status=status.HTTP_404_NOT_FOUND)

class ExpressionSearchView(APIView):
    def get(self, request):
        query = request.query_params.get('query', None)
        if not query:
            return Response({"error": "Query parameter 'query' is required."}, status=400)
        expressions = Expression.objects.filter(exp__icontains=query)
        serializer = ExpressionSerializer(expressions, many=True)
        return Response({"results": serializer.data})


class TopVotedExpressionsView(APIView):
    

    def get(self, request):
        # Collects the 4 most voted expression 
        top_expressions = Expression.objects.order_by('-votes')[:4]

        # builds a Json response with the details of the expression
        expression_data = [
            {
                "id": expression.id,
                "exp": expression.exp,
                "meaning_fr": expression.meaning_fr,
                "meaning_fr": expression.meaning_fr,
                "meaning_en": expression.meaning_en,
                "language": expression.language,
                "votes": expression.votes,
                "dislikes": expression.dislikes,
                "star": expression.star,
                "date_submitted": expression.date_submitted,
                "added_by": expression.user.username,
            }
            for expression in top_expressions
        ]

        return Response({"top_expressions": expression_data}, status=200)

class recentExpressionsView(APIView):
    

    def get(self, request):
        # Collects the 4 most recent expressions submitted
        top_expressions = Expression.objects.order_by('-date_submitted')[:4]

        # builds a Json response with the details of the expression 
        expression_data = [
            {
                "id": expression.id,
                "exp": expression.exp,
                "meaning_fr": expression.meaning_fr,
                "meaning_fr": expression.meaning_fr,
                "meaning_en": expression.meaning_en,
                "language": expression.language,
                "votes": expression.votes,
                "dislikes": expression.dislikes,
                "star": expression.star,
                "date_submitted": expression.date_submitted,
                "added_by": expression.user.username,
            }
            for expression in top_expressions
        ]

        return Response({"recent_expressions": expression_data}, status=200)
    
class ExpressionDetailViewWithaccess(APIView):
    permission_classes = [IsAuthenticated]
    def get(self, request, id):
        try:
            expression = Expression.objects.get(id=id)  # Collects expression through Id
        except Expression.DoesNotExist:
            return Response({"error": "Expression not found."}, status=status.HTTP_404_NOT_FOUND)
        liked = False
        print(request.user.id)

        liked = VoteExpression.objects.filter(user=request.user, expression=expression).exists()
        stared = StarExpression.objects.filter(user=request.user, expression=expression).exists()
        disliked = DisLikeExpression.objects.filter(user=request.user, expression=expression).exists()

        return Response({
            "id": expression.id,
            "liked": liked,
            "stared": stared,
            "disliked": disliked,
            "exp": expression.exp,
            "meaning_fr": expression.meaning_fr,
            "meaning_en": expression.meaning_en,
            "language": expression.language,
            "votes": expression.votes,
            "dislikes": expression.dislikes,
            "star": expression.star,
            "date_submitted": expression.date_submitted,
            "added_by": expression.user.username if expression.user else None,
        }, status=200)
   
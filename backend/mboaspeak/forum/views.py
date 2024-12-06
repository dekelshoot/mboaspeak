from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework import status
from .models import Post, VotePost,DislikePost,StarPost,Comment
from .serializers import PostSerializer,CommentSerializer
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.filters import OrderingFilter
from rest_framework.pagination import PageNumberPagination
from rest_framework.generics import ListAPIView
from django.db.models import Count
from authentication.models import User

class PostView(APIView):
    permission_classes = [IsAuthenticated]
    
    def get(self, request):
        posts = Post.objects.filter(user=request.user)
        post_data = [
            {
                "id": post.id,
                "title": post.title,
                "content": post.content,
                "language":post.language,
                "created_at": post.created_at,
                "updated_at": post.updated_at,
                "votes": post.votes,
                "dislikes": post.dislikes,
                "star": post.star,
                "added_by": post.user.username,
            }
            for post in posts
        ]

        return Response({"posts": post_data}, status=200)


    def post(self, request):
        serializer = PostSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save(user=request.user)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


# Pagination personnalisée
class PostPagination(PageNumberPagination):
    page_size = 1  # Nombre d'éléments par page
    page_size_query_param = 'page_size'  # Permet de personnaliser le nombre par page via URL
    max_page_size = 100  # Taille maximale par page

class PostListView(ListAPIView):
    queryset = Post.objects.all().order_by('-created_at')
    pagination_class = PostPagination
    filter_backends = [DjangoFilterBackend, OrderingFilter]
    filterset_fields = ['language']
    ordering_fields = ['votes', 'stars', 'created_at']
    ordering = ['-created_at']

    def get(self, request, *args, **kwargs):
        # Annoter les posts avec le nombre de commentaires
        queryset = self.filter_queryset(
            self.get_queryset().annotate(comment_count=Count('comments'))
        )
        
        # Paginer le queryset annoté
        page = self.paginate_queryset(queryset)
        if page is not None:
            # Construire les données pour la page courante
            post_data = [
                {
                    "id": post.id,
                    "title": post.title,
                    "content": post.content,
                    "language": post.language,
                    "created_at": post.created_at,
                    "updated_at": post.updated_at,
                    "votes": post.votes,
                    "dislikes": post.dislikes,
                    "star": post.star,
                    "comment_count": post.comment_count,
                    "added_by": post.user.username,
                }
                for post in page
            ]
            # Retourner les données paginées
            return self.get_paginated_response(post_data)

        # Si aucune pagination, retourner toutes les données (cas limite)
        return Response(queryset)
    


class UpdatePostView(APIView):
    permission_classes = [IsAuthenticated]
    def put(self, request, pk):
        try:
            # Récupérer le post à mettre à jour
            post = Post.objects.get(pk=pk)

            # Vérifier si l'utilisateur a la permission de modifier ce mot
            if post.user != request.user:
                return Response({"error": "You do not have permission to edit this post."}, status=status.HTTP_403_FORBIDDEN)

            # Sérialiser les nouvelles données envoyées par l'utilisateur
            serializer = PostSerializer(post, data=request.data, partial=True)

            # Vérifier la validité des données
            if serializer.is_valid():
                serializer.save()  # Sauvegarder les modifications dans la base de données
                return Response(serializer.data, status=status.HTTP_200_OK)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        
        except Post.DoesNotExist:
            return Response({"error": "post not found."}, status=status.HTTP_404_NOT_FOUND)



class VotePostView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, pk):
        try:
            post = Post.objects.get(pk=pk)
            if VotePost.objects.filter(user=request.user, post=post).exists():
                return Response({"error": "You have already voted for this post."}, status=status.HTTP_400_BAD_REQUEST)
            VotePost.objects.create(user=request.user, post=post)
            post.vote(request.user)
            return Response({"message": "Vote added successfully."}, status=status.HTTP_201_CREATED)
        except Post.DoesNotExist:
            return Response({"error": "Expression not found"}, status=status.HTTP_404_NOT_FOUND)

class DislikePostView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, pk):
        try:
            post = Post.objects.get(pk=pk)
            if DislikePost.objects.filter(user=request.user, post=post).exists():
                return Response({"error": "You have already disliked this post."}, status=status.HTTP_400_BAD_REQUEST)
            DislikePost.objects.create(user=request.user, post=post)
            post.dislike()
            return Response({"message": "Dislike added successfully"}, status=status.HTTP_200_OK)
        except Post.DoesNotExist:
            return Response({"error": "Post not found"}, status=status.HTTP_404_NOT_FOUND)


class StarPostView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, pk):
        if request.user.user_type != 'linguist':
            return Response({"error": "You do not have permission to add a star."}, status=status.HTTP_403_FORBIDDEN)
        try:
            post = Post.objects.get(pk=pk)
            if StarPost.objects.filter(user=request.user, post=post).exists():
                return Response({"error": "You have already starred this post."}, status=status.HTTP_400_BAD_REQUEST)
            StarPost.objects.create(user=request.user, post=post)
            post.add_star(request.user)
            return Response({"message": "Star added successfully"}, status=status.HTTP_200_OK)
        except Post.DoesNotExist:
            return Response({"error": "Post not found"}, status=status.HTTP_404_NOT_FOUND)


class CommentPostView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, id):
        try:
            post = Post.objects.get(id=id)
            content = request.data.get("content")
            if not content:
                return Response({"error": "Content is required."}, status=status.HTTP_400_BAD_REQUEST)
            Comment.objects.create(user=request.user, post=post, content=content)
            return Response({"message": "Comment added successfully."}, status=status.HTTP_201_CREATED)
        except Post.DoesNotExist:
            return Response({"error": "Post not found."}, status=status.HTTP_404_NOT_FOUND)

class PostDetailView(APIView):


    def get(self, request, id):
        try:
            post = Post.objects.get(id=id)
            
            # Récupérer et sérialiser les commentaires associés au post
            comments = Comment.objects.filter(post=post).order_by('created_at')
            comment_serializer = CommentSerializer(comments, many=True)
            
            liked = False
            stared = False
            disliked = False
            return Response({"post":{
                "id": post.id,
                "title": post.title,
                "content": post.content,
                "language":post.language,
                "created_at": post.created_at,
                "updated_at": post.updated_at,
                "votes": post.votes,
                "dislikes": post.dislikes,
                "star": post.star,
                "liked": liked,
                "stared": stared,
                "disliked": disliked,
                "added_by": post.user.username,
            },"comments": [{
                "id": comment.id,
                "content": comment.content,
                "created_at":comment.created_at,
                "updated_at": comment.updated_at,
                "updated_at": post.updated_at,
                "added_by": comment.user.username,
            }
            for comment in comments]}, status=200)
        except Post.DoesNotExist:
            return Response({"error": "Post not found"}, status=status.HTTP_404_NOT_FOUND)




class PostSearchView(APIView):
    def get(self, request):
        query = request.query_params.get('query', None)
        if not query:
            return Response({"error": "Query parameter 'query' is required."}, status=400)
        post = Post.objects.filter(title__icontains=query)
        serializer = PostSerializer(post, many=True)
        # Récupérer et sérialiser les commentaires associés au post
        comments = Comment.objects.filter(post=post)
        comment_serializer = CommentSerializer(comments, many=True)
        return Response({
                "post": serializer.data,
                "comments": comment_serializer.data,
            },)


class TopCommentedPostsView(APIView):
    """
    Vue qui retourne les 4 premiers posts ayant le plus de commentaires.
    """
    def get(self, request):
        # Annoter les posts avec le nombre de commentaires
        posts = Post.objects.annotate(comment_count=Count('comments')).order_by('-comment_count')[:4]

        # Construire la réponse JSON avec les détails des mots
        post_data = [
            {
                "id": post.id,
                "title": post.title,
                "content": post.content,
                "language":post.language,
                "created_at": post.created_at,
                "updated_at": post.updated_at,
                "votes": post.votes,
                "dislikes": post.dislikes,
                "star": post.star,
                "added_by": post.user.username,
            }
            for post in posts
        ]

        return Response({"top_commented_posts": post_data}, status=200)
    
    
class Posts2View(APIView):
    

    def get(self, request):
        # Récupérer les paramètres de tri
        order_by = request.query_params.get('order_by', None)  # Exemples : 'votes', 'replies', 'stars'
        language = request.query_params.get('language', None)
        # Annoter les posts avec le nombre de commentaires
        posts = Post.objects.annotate(
            comment_count=Count('comments')
        )

        if language:
            posts = posts.filter(language=language)
        # Appliquer le tri
        elif order_by == 'votes':
            posts = posts.order_by('-votes')  # Les posts avec le plus de votes en premier
        elif order_by == 'comment_count':
            posts = posts.order_by('-comment_count')  # Les posts avec le plus de réponses en premier
        elif order_by == 'stars':
            posts = posts.order_by('-star')  # Les posts avec le plus d'étoiles en premier
        else:
            posts = posts.order_by('-created_at')  # Ordre par défaut : les plus récents

        # Construire la réponse JSON
        post_data = [
            {
                "id": post.id,
                "title": post.title,
                "content": post.content,
                "language": post.language,
                "created_at": post.created_at,
                "updated_at": post.updated_at,
                "votes": post.votes,
                "dislikes": post.dislikes,
                "star": post.star,
                "comment_count": post.comment_count,
                "added_by": post.user.username,
            }
            for post in posts
        ]
        return Response({"results": post_data}, status=200)
    
    
class TopVotedPostView(APIView):
    

    def get(self, request):
        # Récupérer les 4 mots avec le plus grand nombre de votes
        top_posts = Post.objects.order_by('-votes')[:4]

        # Construire la réponse JSON avec les détails des mots
        post_data = [
            {
                "id": post.id,
                "title": post.title,
                "content": post.content,
                "language":post.language,
                "created_at": post.created_at,
                "updated_at": post.updated_at,
                "votes": post.votes,
                "dislikes": post.dislikes,
                "star": post.star,
                "added_by": post.user.username,
            }
            for post in top_posts
        ]

        return Response({"tope_posts": post_data}, status=200)

class recentPostView(APIView):
    

    def get(self, request):
        # Récupérer les 4 mots avec le plus grand nombre de votes
        recent_posts = Post.objects.order_by('-created_at')[:4]

        # Construire la réponse JSON avec les détails des mots
        post_data = [
            {
                "id": post.id,
                "title": post.title,
                "content": post.content,
                "language":post.language,
                "created_at": post.created_at,
                "updated_at": post.updated_at,
                "votes": post.votes,
                "dislikes": post.dislikes,
                "star": post.star,
                "added_by": post.user.username,
            }
            for post in recent_posts
        ]

        return Response({"recent_posts": post_data}, status=200)
    
    
class PostDetailViewWithaccess(APIView):
    permission_classes = [IsAuthenticated]
    def get(self, request, id):
        try:
            post = Post.objects.get(id=id)  # Récupère le post via son ID
        except Post.DoesNotExist:
            return Response({"error": "Post not found."}, status=status.HTTP_404_NOT_FOUND)
        liked = False
        print(request.user.id)
        # Récupérer et sérialiser les commentaires associés au post
        comments = Comment.objects.filter(post=post)
        comment_serializer = CommentSerializer(comments, many=True)

        liked = VotePost.objects.filter(user=request.user, post=post).exists()
        stared = StarPost.objects.filter(user=request.user, post=post).exists()
        disliked = DislikePost.objects.filter(user=request.user, post=post).exists()

        return Response({"post":{
                "id": post.id,
                "title": post.title,
                "content": post.content,
                "language":post.language,
                "created_at": post.created_at,
                "updated_at": post.updated_at,
                "votes": post.votes,
                "dislikes": post.dislikes,
                "star": post.star,
                "liked": liked,
                "stared": stared,
                "disliked": disliked,
                "added_by": post.user.username,
            },"comments": [{
                "id": comment.id,
                "content": comment.content,
                "created_at":comment.created_at,
                "updated_at": comment.updated_at,
                "updated_at": post.updated_at,
                "added_by": comment.user.username,
            }
            for comment in comments]}, status=200)
   
class StatisticsView(APIView):
    def get(self, request):
        # Nombre total de posts
        total_posts = Post.objects.count()

        # Nombre total d'utilisateurs
        total_users = User.objects.count()

        # Nombre total d'expressions (assumant qu'il y a un modèle "Expression")
        # total_expressions = Expression.objects.count()  # Si applicable

        # Nombre total de commentaires
        total_comments = Comment.objects.count()


        # Construire la réponse
        statistics = {
            "total_posts": total_posts,
            "total_users": total_users,
            "total_comments": total_comments,
            # "total_expressions": total_expressions,  # Si applicable
  
        }

        return Response(statistics, status=200)
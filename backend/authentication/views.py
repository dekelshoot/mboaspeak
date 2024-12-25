

# Create your views here.
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .models import User, Admin, Contributor, Linguist
from .serializers import UserSerializer

from rest_framework.permissions import IsAuthenticated
from rest_framework.authtoken.models import Token
from django.http import JsonResponse
from .serializers import UserSerializer
from django.contrib.auth import authenticate
from .serializers import RegisterSerializer
from rest_framework_simplejwt.tokens import RefreshToken
from .models import LANGUAGE_CHOICES

class RegisterView(APIView):
    """
    View for the registration of new users 
    after registration two tokens are genrated , acces and refresh tokens 
    """

    def post(self, request):
        # Data sterialization
        serializer = RegisterSerializer(data=request.data)
        print(request.data)
        if serializer.is_valid():
            # Create a new user and associate it with a type (Admin, Linguist, Contributor)
            user = serializer.save()

            # Generate tokens
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
    personalised view for user login
    send access and refresh token apres success.
    """

    def post(self, request):
        # Collect authentication informations
        username = request.data.get("username")
        password = request.data.get("password")

        if not username or not password:
            return Response({"error": "Username and password are required."}, status=status.HTTP_400_BAD_REQUEST)

        # Authentify user
        user = authenticate(username=username, password=password)

        if user is not None:
            # Creates access and refresh tokens
            refresh = RefreshToken.for_user(user)
            access_token = refresh.access_token

            return Response(
                {
                    "refresh": str(refresh),
                    "access": str(access_token),
                    "username": user.username,
                    "email": user.email,
                    "primary_language": user.primary_language,
                    "user_type": user.user_type
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
    Enable authenticated user to modify his informations 
    """
    permission_classes = [IsAuthenticated]

    def put(self, request):
        # The online user is collected through `request.user`
        user = request.user
        serializer = UserSerializer(user, data=request.data, partial=True)

        if serializer.is_valid():
            # saves modofiations
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


from django.contrib.auth import get_user_model

User = get_user_model()

class UserDetailView(APIView):
    """
    View to show authenticated user's details
    """
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user  # Collects online user

        # Serialize user details 
        user_data = {
            "username": user.username,
            "email": user.email,
            "primary_language": user.primary_language,
            "user_type": user.user_type
        }

        return Response(user_data, status=status.HTTP_200_OK)
    
class LanguageView(APIView):
    def get(self, request):
        language = [x[0] for x in LANGUAGE_CHOICES] 

        return Response(language, status=status.HTTP_200_OK)
    
class UserListView(APIView):
    permission_classes = [IsAuthenticated]  # Access restriction : Only authenticated users 
    def get(self, request):
        # Verifies if there is a filter parameter
        user_type = request.query_params.get('user_type', None)  # Ex : ?user_type=admin

        if user_type == "admin":
            users = User.objects.filter(user_type='admin')
        elif user_type == "linguist":
            users = User.objects.filter(user_type='linguist')
        else:
            users = User.objects.all()  # returns all the users if no filter in parameter 

        # makes a list of dictionaries with the user's information
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
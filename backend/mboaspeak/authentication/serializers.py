from rest_framework import serializers
from .models import User, Admin, Contributor, Linguist

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'primary_language', 'user_type']
        read_only_fields = ['id']  # Assurez-vous que l'identifiant est en lecture seule


from django.contrib.auth import get_user_model
from django.contrib.auth.hashers import make_password

User = get_user_model()

class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)  # Ne pas exposer le mot de passe

    class Meta:
        model = User
        fields = ['username', 'email', 'password', 'first_name', 'last_name', 'primary_language', 'user_type']

    def create(self, validated_data):
        # Hacher le mot de passe avant de le sauvegarder
        validated_data['password'] = make_password(validated_data['password'])
        user = super().create(validated_data)

        # Créer les instances de roles (Admin, Contributor, Linguist) si nécessaire
        user_type = validated_data.get('user_type', 'contributor')

        if user_type == 'admin':
            Admin.objects.create(user=user)
        elif user_type == 'linguist':
            Linguist.objects.create(user=user)
        else:
            Contributor.objects.create(user=user)

        return user

from rest_framework import serializers
from .models import User, Admin, Contributor, Linguist

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'primary_language', 'user_type']
        read_only_fields = ['id'] 


from django.contrib.auth import get_user_model
from django.contrib.auth.hashers import make_password

User = get_user_model()

class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)  

    class Meta:
        model = User
        fields = ['username', 'email', 'password',  'primary_language', 'user_type']

    def create(self, validated_data):
        # hash password before saving
        validated_data['password'] = make_password(validated_data['password'])
        user = super().create(validated_data)

        # Create roles instances (Admin, Contributor, Linguist) if necessary 
        user_type = validated_data.get('user_type', 'contributor')

        if user_type == 'admin':
            Admin.objects.create(user=user)
        elif user_type == 'linguist':
            Linguist.objects.create(user=user)
        else:
            Contributor.objects.create(user=user)

        return user

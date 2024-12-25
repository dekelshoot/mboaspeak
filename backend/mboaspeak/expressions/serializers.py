
from rest_framework import serializers
from .models import Word, Expression
from dictionary.serializers import WordSerializer

class ExpressionSerializer(serializers.ModelSerializer):
    words = WordSerializer(many=True, read_only=True)

    class Meta:
        model = Expression
        fields = ['id', 'exp', 'language', 'meaning_fr', 'meaning_en', 'words', 'votes', 'date_submitted']

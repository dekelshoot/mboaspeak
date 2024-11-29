from rest_framework import serializers
from .models import Word, Expression

class WordSerializer(serializers.ModelSerializer):
    class Meta:
        model = Word
        fields = ['id', 'word_name', 'definition', 'lang_definition', 'meaning_fr', 'meaning_en', 'language', 'votes']

class ExpressionSerializer(serializers.ModelSerializer):
    words = WordSerializer(many=True, read_only=True)

    class Meta:
        model = Expression
        fields = ['id', 'exp', 'language', 'meaning_fr', 'meaning_en', 'words', 'votes', 'date_submitted']

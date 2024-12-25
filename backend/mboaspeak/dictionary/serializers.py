from rest_framework import serializers
from .models import Word

class WordSerializer(serializers.ModelSerializer):
    class Meta:
        model = Word
        fields = ['id', 'word_name','example' ,'definition', 'lang_definition', 'meaning_fr', 'meaning_en', 'language', 'votes','dislikes','star']


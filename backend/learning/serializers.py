from rest_framework import serializers
from .models import Lesson, Quiz, Question, Choice

class ChoiceSerializer(serializers.ModelSerializer):
    class Meta:
        model = Choice
        fields = ['id', 'text', 'is_correct']

class QuestionSerializer(serializers.ModelSerializer):
    choices = ChoiceSerializer(many=True)

    class Meta:
        model = Question
        fields = ['id', 'text', 'choices']

class QuizSerializer(serializers.ModelSerializer):
    questions = QuestionSerializer(many=True)

    class Meta:
        model = Quiz
        fields = ['id', 'title', 'questions']

class LessonSerializer(serializers.ModelSerializer):
    quiz = QuizSerializer()

    class Meta:
        model = Lesson
        fields = ['id', 'title', 'video_url', 'content', 'language', 'quiz']


class LessonDetailSerializer(serializers.ModelSerializer):
    quiz = QuizSerializer(read_only=True)

    class Meta:
        model = Lesson
        fields = ['id','title', 'video_url', 'content', 'language', 'created_at', 'updated_at', 'quiz']
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .models import Lesson, Quiz, Question, Choice
from .serializers import LessonSerializer,LessonDetailSerializer
from rest_framework.permissions import IsAuthenticated

class CreateLessonWithQuizView(APIView):
    permission_classes = [IsAuthenticated]
    def post(self, request):
        data = request.data

        # Extraire les informations de la leçon
        title = data.get('title')
        video_url = data.get('video_url')
        content = data.get('content')
        language = data.get('language')
        quiz_data = data.get('quiz')

        # Validation de base
        if not all([title, video_url, content, language, quiz_data]):
            return Response({"error": "All fields are required, including quiz."}, status=status.HTTP_400_BAD_REQUEST)

        try:
            # Créer la leçon
            lesson = Lesson.objects.create(
                user=request.user,
                title=title,
                video_url=video_url,
                content=content,
                language=language
            )

            # Créer le quiz associé
            quiz = Quiz.objects.create(title=quiz_data['title'], lesson=lesson)

            for question_data in quiz_data['questions']:
                question = Question.objects.create(text=question_data['text'], quiz=quiz)

                for choice_data in question_data['choices']:
                    Choice.objects.create(
                        text=choice_data['text'],
                        is_correct=choice_data['is_correct'],
                        question=question
                    )

            # Retourner la réponse avec les détails de la leçon et du quiz
            serializer = LessonSerializer(lesson)
            return Response(serializer.data, status=status.HTTP_201_CREATED)

        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)

    def put(self, request, id):
        try:
            # Récupérer la leçon par son ID
            lesson = Lesson.objects.get(pk=id, user=request.user)

        except Lesson.DoesNotExist:
            return Response({"error": "Lesson not found or you don't have permission to update this lesson."}, 
                            status=status.HTTP_404_NOT_FOUND)

        data = request.data

        # Mettre à jour les champs de la leçon
        lesson.title = data.get('title', lesson.title)
        lesson.video_url = data.get('video_url', lesson.video_url)
        lesson.content = data.get('content', lesson.content)
        lesson.language = data.get('language', lesson.language)
        lesson.save()

        # Mettre à jour le quiz associé
        quiz_data = data.get('quiz', None)
        if quiz_data:
            quiz = lesson.quiz
            quiz.title = quiz_data.get('title', quiz.title)
            quiz.save()

            # Mettre à jour les questions associées
            questions_data = quiz_data.get('questions', [])
            existing_questions = {q.id: q for q in quiz.questions.all()}

            for question_data in questions_data:
                question_id = question_data.get('id')

                if question_id and question_id in existing_questions:
                    # Mettre à jour la question existante
                    question = existing_questions[question_id]
                    question.text = question_data.get('text', question.text)
                    question.save()

                    # Mettre à jour les choix associés
                    choices_data = question_data.get('choices', [])
                    existing_choices = {c.id: c for c in question.choices.all()}

                    for choice_data in choices_data:
                        choice_id = choice_data.get('id')

                        if choice_id and choice_id in existing_choices:
                            # Mettre à jour le choix existant
                            choice = existing_choices[choice_id]
                            choice.text = choice_data.get('text', choice.text)
                            choice.is_correct = choice_data.get('is_correct', choice.is_correct)
                            choice.save()
                        elif not choice_id:
                            # Créer un nouveau choix
                            Choice.objects.create(
                                text=choice_data['text'],
                                is_correct=choice_data['is_correct'],
                                question=question
                            )

                elif not question_id:
                    # Créer une nouvelle question
                    new_question = Question.objects.create(
                        text=question_data['text'],
                        quiz=quiz
                    )

                    for choice_data in question_data.get('choices', []):
                        Choice.objects.create(
                            text=choice_data['text'],
                            is_correct=choice_data['is_correct'],
                            question=new_question
                        )

        # Sérialiser et retourner les données mises à jour
        serializer = LessonDetailSerializer(lesson)
        return Response(serializer.data, status=status.HTTP_200_OK)


class LessonDetailView(APIView):
    """
    Vue pour récupérer les détails d'une leçon, incluant le quiz associé et ses questions.
    """

    def get(self, request, id):
        try:
            # Récupérer la leçon par son ID
            lesson = Lesson.objects.get(pk=id)
            
            # Utiliser un serializer détaillé pour retourner la structure complète
            serializer = LessonDetailSerializer(lesson)
            data = serializer.data
            data["added_by"] = lesson.user.username
            return Response(data, status=status.HTTP_200_OK)

        except Lesson.DoesNotExist:
            return Response({"error": "Lesson not found."}, status=status.HTTP_404_NOT_FOUND)
        
class RecentLessonView(APIView):
    

    def get(self, request):
        # Récupérer les 4 mots avec le plus grand nombre de votes
        recent_lessons = Lesson.objects.order_by('-created_at')[:4]

        return Response([{
                "id": lesson.id,
                "title": lesson.title,
                "content": lesson.content,
                "language": lesson.language,
                "video_url": lesson.video_url,
                "created_at":lesson.created_at,
                "updated_at": lesson.updated_at,
                "added_by": lesson.user.username,
            }
            for lesson in recent_lessons], status=200)
 
class UserLessonsView(APIView):
    """
    Vue pour récupérer toutes les leçons d'un utilisateur authentifié.
    """
    permission_classes = [IsAuthenticated]

    def get(self, request):
        # Filtrer les leçons par l'utilisateur connecté
        lessons = Lesson.objects.filter(user=request.user)

        # Sérialiser les données
        serializer = LessonSerializer(lessons, many=True)

        return Response(serializer.data, status=status.HTTP_200_OK)
    
class LessonsView(APIView):
    """
    Vue pour récupérer toutes les leçons d'un utilisateur authentifié.
    """

    def get(self, request):
        # Filtrer les leçons par l'utilisateur connecté
        lessons = Lesson.objects.all()

        # Sérialiser les données
        serializer = LessonSerializer(lessons, many=True)
        
        return Response([{
                "id": lesson.id,
                "title": lesson.title,
                "content": lesson.content,
                "language": lesson.language,
                "video_url": lesson.video_url,
                "created_at":lesson.created_at,
                "updated_at": lesson.updated_at,
                "added_by": lesson.user.username,
            }
            for lesson in lessons], status=200)

        return Response(serializer.data, status=status.HTTP_200_OK)
    
class UpdateLessonView(APIView):
    """
    Vue pour mettre à jour une leçon et son quiz associé.
    """
    permission_classes = [IsAuthenticated]

    def put(self, request, id):
        try:
            # Récupérer la leçon par son ID
            lesson = Lesson.objects.get(pk=id, user=request.user)

        except Lesson.DoesNotExist:
            return Response({"error": "Lesson not found or you don't have permission to update this lesson."}, 
                            status=status.HTTP_404_NOT_FOUND)

        data = request.data

        # Mettre à jour les champs de la leçon
        lesson.title = data.get('title', lesson.title)
        lesson.video_url = data.get('video_url', lesson.video_url)
        lesson.content = data.get('content', lesson.content)
        lesson.language = data.get('language', lesson.language)
        lesson.save()

        # Mettre à jour le quiz associé
        quiz_data = data.get('quiz', None)
        if quiz_data:
            quiz = lesson.quiz
            quiz.title = quiz_data.get('title', quiz.title)
            quiz.save()

            # Mettre à jour les questions associées
            questions_data = quiz_data.get('questions', [])
            existing_questions = {q.id: q for q in quiz.questions.all()}

            for question_data in questions_data:
                question_id = question_data.get('id')

                if question_id and question_id in existing_questions:
                    # Mettre à jour la question existante
                    question = existing_questions[question_id]
                    question.text = question_data.get('text', question.text)
                    question.save()

                    # Mettre à jour les choix associés
                    choices_data = question_data.get('choices', [])
                    existing_choices = {c.id: c for c in question.choices.all()}

                    for choice_data in choices_data:
                        choice_id = choice_data.get('id')

                        if choice_id and choice_id in existing_choices:
                            # Mettre à jour le choix existant
                            choice = existing_choices[choice_id]
                            choice.text = choice_data.get('text', choice.text)
                            choice.is_correct = choice_data.get('is_correct', choice.is_correct)
                            choice.save()
                        elif not choice_id:
                            # Créer un nouveau choix
                            Choice.objects.create(
                                text=choice_data['text'],
                                is_correct=choice_data['is_correct'],
                                question=question
                            )

                elif not question_id:
                    # Créer une nouvelle question
                    new_question = Question.objects.create(
                        text=question_data['text'],
                        quiz=quiz
                    )

                    for choice_data in question_data.get('choices', []):
                        Choice.objects.create(
                            text=choice_data['text'],
                            is_correct=choice_data['is_correct'],
                            question=new_question
                        )

        # Sérialiser et retourner les données mises à jour
        serializer = LessonDetailSerializer(lesson)
        return Response(serializer.data, status=status.HTTP_200_OK)

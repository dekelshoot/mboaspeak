from django.urls import path
from .views import *

urlpatterns = [
    path('<int:id>/', LessonDetailView.as_view(), name='lesson-detail'),
    path('', CreateLessonWithQuizView.as_view(), name='lesson-with-quiz'),
    path('user-lessons/', UserLessonsView.as_view(), name='user-lessons'),
    path('all/', LessonsView.as_view(), name='lesson-with-quiz'),
    path('recent/', RecentLessonView.as_view(), name='recent-lesson-'),
]

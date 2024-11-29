from django.urls import path
from .views import CreateWordView, CreateExpressionView, AddWordToExpressionView, VoteExpressionView, VoteWordView,UpdateWordView,user_added_words,WordDetailView,UpdateUserTypeView

urlpatterns = [
    path('word/create/', CreateWordView.as_view(), name='create-word'),
    path('expressions/create/', CreateExpressionView.as_view(), name='create-expression'),
    path('expressions/add-word/<int:expression_id>/<int:word_id>/', AddWordToExpressionView.as_view(), name='add-word-to-expression'),
    path('expressions/vote/<int:pk>/', VoteExpressionView.as_view(), name='vote-expression'),
    path('word/vote/<int:pk>/', VoteWordView.as_view(), name='vote-word'),
    path('word/update/<int:pk>/', UpdateWordView.as_view(), name='update-word'),
    
    path('word/my-words/', user_added_words.as_view(), name='user-added-words'),
    path('word/<int:id>/', WordDetailView.as_view(), name='word-detail'),
    
    path('update-user-type/<str:username>/', UpdateUserTypeView.as_view(), name='update-user-type'),
]

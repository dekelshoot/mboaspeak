from django.urls import path
from .views import *

urlpatterns = [
    path('', ExpressionView.as_view(), name='create-expression'),
    path('vote/<int:pk>/', VoteExpressionView.as_view(), name='vote-expression'),
    path('dislike/<int:pk>/', DislikeExpressionView.as_view(), name='dislike-expression'),
    path('star/<int:pk>/', StarExpressionView.as_view(), name='star-expression'),
    path('<int:id>/', ExpressionDetailView.as_view(), name='expression-detail'),
    path('search/', ExpressionSearchView.as_view(), name='expression-search'),
    path('update/<int:pk>/', UpdateExpressionView.as_view(), name='expression-update'),
    path('top-voted/', TopVotedExpressionsView.as_view(), name='top-voted-expressions'),
    path('recent-expression/', recentExpressionsView.as_view(), name='recent-expressions'),
    path('with-access/<int:id>/', ExpressionDetailViewWithaccess.as_view(), name='word-detail-with-access'),
]

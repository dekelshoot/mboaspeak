from django.urls import path
from .views import CreateWordView,   VoteWordView,UpdateWordView,user_added_words,WordDetailView,PaginatedWordListView,WordSearchView,TopVotedWordsView,recentWordsView,DislikesWordView,starWordView,WordDetailViewWithaccess

urlpatterns = [
    path('word/create/', CreateWordView.as_view(), name='create-word'),

    path('word/vote/<int:pk>/', VoteWordView.as_view(), name='vote-word'),
    path('word/dislike/<int:pk>/', DislikesWordView.as_view(), name='dislike-word'),
    path('word/star/<int:pk>/', starWordView.as_view(), name='star-word'),
    path('word/update/<int:pk>/', UpdateWordView.as_view(), name='update-word'),
    
    path('word/my-words/', user_added_words.as_view(), name='user-added-words'),
    path('word/<int:id>/', WordDetailView.as_view(), name='word-detail'),
    path('word-with-access/<int:id>/', WordDetailViewWithaccess.as_view(), name='word-detail-with-access'),
    path('word/', PaginatedWordListView.as_view(), name='paginated-word-list'),
    path('word/search/', WordSearchView.as_view(), name='word-search'),
    path('word/top-voted/', TopVotedWordsView.as_view(), name='top-voted-words'),
    path('word/recentWord/', recentWordsView.as_view(), name='recent-words'),
]

from django.urls import path
from .views import *

urlpatterns = [
    path('', PostView.as_view(), name='create-posts'),
    path('vote/<int:pk>/', VotePostView.as_view(), name='vote-posts'),
    path('dislike/<int:pk>/', DislikePostView.as_view(), name='dislike-posts'),
    path('star/<int:pk>/', StarPostView.as_view(), name='star-posts'),
    path('<int:id>/', PostDetailView.as_view(), name='posts-detail'),
    path('search/', PostSearchView.as_view(), name='posts-search'),
    path('update/<int:pk>/', UpdatePostView.as_view(), name='Post-update'),
    path('top-voted/', TopVotedPostView.as_view(), name='top-voted-posts'),
    path('recent-post/', recentPostView.as_view(), name='recent-posts'),
    path('with-access/<int:id>/', PostDetailViewWithaccess.as_view(), name='posts-detail'),
    path('comment/<int:id>/', CommentPostView.as_view(), name='comment-post'),
    path('page/', Posts2View.as_view(), name='post-list'),
    path('top-commented/', TopCommentedPostsView.as_view(), name='top-commented-posts'),
    path('stat/', StatisticsView.as_view(), name='stat-posts'),
]

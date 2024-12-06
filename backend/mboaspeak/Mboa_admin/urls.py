from django.urls import path
from .views import UpdateUserTypeView,UserListView

urlpatterns = [
    path('users/', UserListView.as_view(), name='user-list'),
    path('update-user-type/<str:username>/', UpdateUserTypeView.as_view(), name='update-user-type'),
]

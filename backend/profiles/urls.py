from django.urls import path
from . import views
urlpatterns = [
    path('<int:user>/profiles/<int:profile>/',
         views.ProfileView.as_view(), name='profile_view'),
    path('me/', views.MyProfileView.as_view(), name='my_profile_view'),
    path('<int:user>/profiles/<int:profile>/everytime',
         views.EverytimeCalendarView.as_view(), name='profile_create_view'),
]

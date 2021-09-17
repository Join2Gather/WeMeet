from django.urls import path
from . import views
urlpatterns = [
    path('<int:user>/profiles/<int:profile>/', views.ProfileView.as_view(), name='profile'),
]
from django.urls import path
from . import views
urlpatterns = [
    path('<int:user>/profiles/<int:profile>/clubs',
         views.ClubView.as_view(), name='clubs_view'),
    path('<int:user>/profiles/<int:profile>/clubs/<str:uri>',
         views.ClubDateView.as_view(), name='clubs_date_view'),
    path('<int:user>/profiles/<int:profile>/clubs/<str:uri>/group',
         views.ClubGroupView.as_view(), name='clubs_group_view'),
    path('<int:user>/profiles/<int:profile>/clubs/<str:uri>/individual',
         views.ClubIndividualView.as_view(), name='clubs_individual_view'),
    path('<int:user>/profiles/<int:profile>/clubs/<str:uri>/join',
         views.ClubJoinView.as_view(), name='clubs_join_view'),
]

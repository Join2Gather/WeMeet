from django.urls import path
from . import views
urlpatterns = [
    path('<int:user>/profiles/<int:profile>/clubs',
         views.ClubView.as_view(), name='club_view'),
    path('<int:user>/profiles/<int:profile>/clubs/<str:uri>',
         views.ClubDateView.as_view(), name='club_date_view'),
    path('<int:user>/profiles/<int:profile>/clubs/<str:uri>/group',
         views.ClubGroupView.as_view(), name='club_group_view'),
    path('<int:user>/profiles/<int:profile>/clubs/<str:uri>/individual',
         views.ClubIndividualView.as_view(), name='club_individual_view'),
    path('<int:user>/profiles/<int:profile>/clubs/<str:uri>/join',
         views.ClubJoinView.as_view(), name='club_join_view'),
    path('<int:user>/profiles/<int:profile>/clubs/<str:uri>/leave',
         views.ClubLeaveView.as_view(), name='club_leave_view'),
    path('<int:user>/profiles/<int:profile>/clubs/<str:uri>/share',
         views.ClubShareView.as_view(), name='club_share_view'),
    path('<int:user>/profiles/<int:profile>/clubs/<str:uri>/confirm',
         views.ClubConfirmView.as_view(), name='club_confirm_view'),
    path('<int:user>/profiles/<int:profile>/clubs/<str:uri>/confirm/ok',
         views.ClubConfirmOKView.as_view(), name='club_confirm_ok_view'),
]

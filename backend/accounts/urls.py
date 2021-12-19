from django.urls import path
from . import views
from allauth.socialaccount.providers.apple.views import oauth2_callback, oauth2_finish_login

urlpatterns = [
    path('kakao/login/', views.KakaoLoginView.as_view(), name='kakao_login'),
    path('kakao/callback/', views.KakaoCallbackView.as_view(), name='kakao_callback'),
    path('kakao/login/finish/', views.KakaoLoginToDjango.as_view(),
         name='kakao_login_to_django'),
    path('apple/login/callback/', oauth2_callback, name='apple_callback'),
    path('apple/login/finish/', oauth2_finish_login, name='apple_callback'),
]

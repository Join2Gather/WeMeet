from django.urls import path
from . import views

urlpatterns = [
    path('kakao/login/', views.KakaoLoginView.as_view(), name='kakao_login'),
    path('kakao/callback/', views.KakaoCallbackView.as_view(), name='kakao_callback'),
    path('kakao/login/finish/', views.KakaoLoginToDjango.as_view(),
         name='kakao_login_to_django'),
    path('apple/login/callback/',
         views.AppleCallbackView.as_view(), name='apple_callback'),
    path('apple/login/token/',
         views.AppleTokenLoginView.as_view(), name='apple_token_login')
]

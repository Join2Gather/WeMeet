from django.urls import path
from . import views
urlpatterns = [
    path('accounts/kakao/login/', views.KakaoLogin, name='kakao_login'),
    path('accounts/kakao/callback/', views.KakaoCallback.as_view, name='kakao_callback'),
    path('accounts/kakao/login/finish/', views.KakaoLoginToDjango.as_view(), name='kakao_login_todjango'),
    
]
# Create your views here.

from django.conf import settings
from config.models import Users as User
from allauth.socialaccount.models import SocialAccount
from django.conf import settings
from dj_rest_auth.registration.views import SocialLoginView
from allauth.socialaccount.providers.kakao import views as kakao_view
from allauth.socialaccount.providers.oauth2.client import OAuth2Client
from rest_framework.views import APIView
from django.http import JsonResponse
import requests
from rest_framework import status
from json.decoder import JSONDecodeError
from django.shortcuts import redirect
from django.http import HttpRequest, HttpResponse
from config.environment import get_secret

# Data class for shorthand notation
class Constants:
    KAKAO_CALLBACK_URI: str = get_secret('KAKAO_CALLBACK_URI')
    REST_API_KEY: str = get_secret('KAKAO_REST_API_KEY')
    BASE_URL: str = get_secret('BASE_URL')


# original code from @Chanjongp (https://github.com/Chanjongp/Django_Social_Login)
# https://medium.com/chanjongs-programming-diary/django-rest-framework%EB%A1%9C-%EC%86%8C%EC%85%9C-%EB%A1%9C%EA%B7%B8%EC%9D%B8-api-%EA%B5%AC%ED%98%84%ED%95%B4%EB%B3%B4%EA%B8%B0-google-kakao-github-2ccc4d49a781
# 로그인 성공 시, Callback 함수로 Code 값 전달받음
class KakaoLoginView(APIView):
    def get(self, request):
        return redirect(
            f"https://kauth.kakao.com/oauth/authorize?client_id={Constants.REST_API_KEY}&redirect_uri={Constants.KAKAO_CALLBACK_URI}&response_type=code"
        )


# 받은 Code로 Kakao에 access token request
# access token으로 Kakao에 email 값을 request 
# 전달받은 Email, Access Token, Code를 바탕으로 회원가입/로그인 진행
class KakaoCallbackView(APIView):
    def get(self, request):
        code = request.GET.get("code")
        REST_API_KEY = Constants.REST_API_KEY
        redirect_uri = Constants.KAKAO_CALLBACK_URI
        BASE_URL = Constants.BASE_URL
        """
        Access Token Request
        """
        token_req = requests.get(
            f"https://kauth.kakao.com/oauth/token?grant_type=authorization_code&client_id={REST_API_KEY}&redirect_uri={redirect_uri}&code={code}")
        token_req_json = token_req.json()
        error = token_req_json.get("error")
        if error is not None:
            raise JSONDecodeError(error)
        access_token = token_req_json.get("access_token")
        """
        Email Request
        """
        profile_request = requests.get(
            "https://kapi.kakao.com/v2/user/me", headers={"Authorization": f"Bearer {access_token}"})
        profile_json = profile_request.json()
        kakao_account = profile_json.get('kakao_account')
        """
        kakao_account에서 이메일 외에
        카카오톡 프로필 이미지, 배경 이미지 url 가져올 수 있음
        print(kakao_account) 참고
        """
        # print(kakao_account)
        email = kakao_account.get('email')
        """
        Signup or Signin Request
        """
        try:
            user = User.objects.get(email=email)
            # 기존에 가입된 유저의 Provider가 kakao가 아니면 에러 발생, 맞으면 로그인
            # 다른 SNS로 가입된 유저
            social_user = SocialAccount.objects.get(user=user)
            if social_user is None:
                return JsonResponse({'err_msg': 'email exists but not social user'}, status=status.HTTP_400_BAD_REQUEST)
            if social_user.provider != 'kakao':
                return JsonResponse({'err_msg': 'no matching social type'}, status=status.HTTP_400_BAD_REQUEST)
            # 기존에 Google로 가입된 유저
            data = {'access_token': access_token, 'code': code}
            accept = requests.post(
                f"{BASE_URL}accounts/kakao/login/finish/", data=data)
            accept_status = accept.status_code
            if accept_status != 200:
                return JsonResponse({'err_msg': 'failed to signin'}, status=accept_status)
            accept_json = accept.json()
            accept_json.pop('user', None)
            return JsonResponse(accept_json)
        except User.DoesNotExist:
            # 기존에 가입된 유저가 없으면 새로 가입
            data = {'access_token': access_token, 'code': code}
            accept = requests.post(
                f"{BASE_URL}accounts/kakao/login/finish/", data=data)
            accept_status = accept.status_code
            if accept_status != 200:
                return JsonResponse({'err_msg': 'failed to signup'}, status=accept_status)
            # user의 pk, email, first name, last name과 Access Token, Refresh token 가져옴
            accept_json = accept.json()
            accept_json.pop('user', None)
            return JsonResponse(accept_json)


class KakaoLoginToDjango(SocialLoginView):
    adapter_class = kakao_view.KakaoOAuth2Adapter
    client_class = OAuth2Client
    callback_url = Constants.KAKAO_CALLBACK_URI
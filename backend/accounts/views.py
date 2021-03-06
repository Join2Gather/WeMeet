import base64
from drf_yasg import openapi
from rest_framework.request import Request
from config.settings import DEBUG
from typing import Optional
from django.contrib.auth.models import User
from allauth.socialaccount.models import SocialAccount
from dj_rest_auth.registration.views import SocialLoginView
from allauth.socialaccount.providers.kakao import views as kakao_view
from allauth.socialaccount.providers.oauth2.client import OAuth2Client
from rest_framework.views import APIView
from django.http import JsonResponse
import requests
from rest_framework import status
from django.shortcuts import redirect
from rest_framework.authtoken.models import Token
from config.environment import get_secret
from config.models import Profiles
from config.serializers import AuthSerializer, ErrorSerializer, ProfilesSerializer
from drf_yasg.utils import swagger_auto_schema
import jwt
import uuid
import datetime
# Data class for shorthand notation


class Constants:
    KAKAO_CALLBACK_URI: str = get_secret('KAKAO_CALLBACK_URI')
    APPLE_CALLBACK_URI: str = get_secret('APPLE_CALLBACK_URI')
    REST_API_KEY: str = get_secret('KAKAO_REST_API_KEY')
    BASE_URL: str = get_secret('BASE_URL')


# original code from @Chanjongp (https://github.com/Chanjongp/Django_Social_Login)
# https://medium.com/chanjongs-programming-diary/django-rest-framework%EB%A1%9C-%EC%86%8C%EC%85%9C-%EB%A1%9C%EA%B7%B8%EC%9D%B8-api-%EA%B5%AC%ED%98%84%ED%95%B4%EB%B3%B4%EA%B8%B0-google-kakao-github-2ccc4d49a781
# 로그인 성공 시, Callback 함수로 Code 값 전달받음
class KakaoLoginView(APIView):
    @swagger_auto_schema(operation_id="카카오 로그인")
    def get(self, request):
        return redirect(
            f"https://kauth.kakao.com/oauth/authorize?client_id={Constants.REST_API_KEY}&redirect_uri={Constants.KAKAO_CALLBACK_URI}&response_type=code"
        )


# 받은 Code로 Kakao에 access token request
# access token으로 Kakao에 email 값을 request
# 전달받은 Email, Access Token, Code를 바탕으로 회원가입/로그인 진행
class KakaoCallbackView(APIView):
    @swagger_auto_schema(operation_id="카카오 로그인 콜백")
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
            if token_req_json.get('error_code') == 'KOE320':
                # KOE320: Invalid grant면 code값이 만료되었음을 의미함.
                # 간단하게 다시 login endpoint 호출해서 code 재발급 받도록 수정하였음.
                return redirect(f"{BASE_URL}accounts/kakao/login")
            if DEBUG:
                return JsonResponse({'error': token_req_json}, status=status.HTTP_400_BAD_REQUEST)
            else:
                return JsonResponse({'success': False}, status=status.HTTP_400_BAD_REQUEST)
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
        email = kakao_account.get('email')
        """
            Signup or Signin Request
        """
        is_sign_in = False
        try:
            user: User = User.objects.get(email=email)
            # 기존에 가입된 유저의 Provider가 kakao가 아니면 에러 발생, 맞으면 로그인
            # 다른 SNS로 가입된 유저
            try:
                social_user: SocialAccount = SocialAccount.objects.get(
                    user=user)
            except SocialAccount.DoesNotExist:
                return JsonResponse({'error': 'no matching social type'}, status=status.HTTP_400_BAD_REQUEST)
            if social_user is None:
                return JsonResponse({'error': 'email exists but not social user'}, status=status.HTTP_400_BAD_REQUEST)
            if social_user.provider != 'kakao':
                return JsonResponse({'error': 'no matching social type'}, status=status.HTTP_400_BAD_REQUEST)
            is_sign_in = True
        except User.DoesNotExist:
            is_sign_in = False
        # 로그인 / 가입 로직
        data = {'access_token': access_token, 'code': code}
        accept = requests.post(
            f"{BASE_URL}accounts/kakao/login/finish/", data=data)
        accept_status = accept.status_code
        sign_type = 'signin' if is_sign_in else 'signup'
        if accept_status != 200:
            return JsonResponse({'error': f'failed to {sign_type}'}, status=accept_status)

        # accept의 Response body는 DRF 미들웨어 authtoken 값을 담고 있다.
        # DB에 자동으로 저장되는 변수이고, Request에서 Authorization 헤더에 Token으로 보내면 되는 값임.
        # 다만 'key' 라는 키값은 이해하기 힘드므로 access_token으로 이름을 변경함.
        accept_json = accept.json()
        permanent_token = accept_json.get('key')

        # profile 값 찾기

        token_object: Token = Token.objects.get(key=permanent_token)

        if not is_sign_in:
            # 회원가입 되었으므로 다시 Find
            user: User = token_object.user
            social_user: SocialAccount = SocialAccount.objects.get(user=user)

        profiles = Profiles.objects.filter(user=user)

        if not profiles.exists():
            username = social_user.extra_data.get(
                'properties', {}).get('nickname', '')
            Profiles.objects.create(name=username, user=user)
            profiles = Profiles.objects.filter(user=user)

        profiles = [ProfilesSerializer(profile).data for profile in profiles]
        return JsonResponse({'access_token': permanent_token, 'profiles': profiles})


class KakaoLoginToDjango(SocialLoginView):
    adapter_class = kakao_view.KakaoOAuth2Adapter
    client_class = OAuth2Client
    callback_url = Constants.KAKAO_CALLBACK_URI


class BadRequestError(Exception):
    pass


class AppleCallbackView(APIView):
    @staticmethod
    def check_user_signed_in(email):
        """
            Signup or Signin Request
        """
        is_sign_in = False
        try:
            user: User = User.objects.get(email=email)
            # 기존에 가입된 유저의 Provider가 kakao가 아니면 에러 발생, 맞으면 로그인
            # 다른 SNS로 가입된 유저
            try:
                social_user: SocialAccount = SocialAccount.objects.get(
                    user=user)
            except SocialAccount.DoesNotExist:
                uid = str(uuid.uuid4())
                social_user: SocialAccount = SocialAccount.objects.create(
                    user=user, uid=uid, provider='apple')
                social_user.save()
            if social_user is None:
                raise BadRequestError({'data': {
                    'err_msg': 'email exists but not social user'}, 'status': status.HTTP_400_BAD_REQUEST})
            if social_user.provider != 'apple':
                raise BadRequestError({'data': {
                    'err_msg': 'no matching social type'}, 'status': status.HTTP_400_BAD_REQUEST})
            is_sign_in = True
        except User.DoesNotExist:
            is_sign_in = False

        return is_sign_in

    @ staticmethod
    def generate_client_secret(key, team_key, cert, client_id):
        """Create a JWT signed with an apple provided private key"""
        now = datetime.datetime.utcnow()
        claims = {
            "iss": team_key,
            "aud": "https://appleid.apple.com",
            "sub": client_id,
            "iat": now,
            "exp": now + datetime.timedelta(hours=1),
        }
        headers = {"kid": key, "alg": "ES256"}
        client_secret = jwt.encode(
            claims, key=cert, algorithm="ES256", headers=headers
        )
        return client_secret

    @ staticmethod
    def manage_token_information(code, email, is_sign_in):
        key = get_secret('APPLE_KEY_ID')
        team_key = get_secret('APPLE_KEY')
        cert = base64.b64decode(get_secret('APPLE_CERTIFICATE_KEY_BASE64'))
        client_id = get_secret('CLIENT_ID')
        APPLE_CALLBACK_URI = Constants.APPLE_CALLBACK_URI

        client_secret = AppleCallbackView.generate_client_secret(
            key, team_key, cert, client_id)

        # 로그인 / 가입 로직
        data = {'client_id': client_id, 'client_secret': client_secret, 'code': code,
                'grant_type': 'authorization_code', 'redirect_uri': APPLE_CALLBACK_URI}

        token_url = "https://appleid.apple.com/auth/token"
        token_response = requests.post(
            token_url, data=data, headers={'content-type': 'application/x-www-form-urlencoded'})

        accept_status = token_response.status_code
        sign_type = 'signin' if is_sign_in else 'signup'
        if accept_status != 200:
            raise BadRequestError(
                {'data': {'error': f'failed to {sign_type}', 'comment': token_response.text}, 'status': accept_status})

        token_json = token_response.json()
        refresh_token = token_json.get('refresh_token')

        # name scope를 주어도 id_token에서 이름이 발급되지 않아 임시로 이메일로 대체함.
        username = email

        if is_sign_in:
            user: User = User.objects.get(email=email)
        else:
            password = str(uuid.uuid4())
            user: User = User.objects.create_user(username, email, password)
            uid = str(uuid.uuid4())
            social_user: SocialAccount = SocialAccount.objects.create(
                user=user, uid=uid, provider='apple')
            social_user.save()

        if token_object := Token.objects.filter(user=user):
            token_object = token_object.get()
        else:
            token_object: Token = Token.objects.get_or_create(
                key=refresh_token, user=user)[0]
            token_object.save()

        return token_object, user, username

    @ staticmethod
    def get_or_create_profiles(user, username):
        profiles = Profiles.objects.filter(user=user)

        if not profiles.exists():
            nickname = username
            Profiles.objects.create(name=nickname, user=user)
            profiles = Profiles.objects.filter(user=user)

        return profiles

    @ staticmethod
    def generate_return_json(token_object, profiles):
        profiles = [ProfilesSerializer(profile).data for profile in profiles]
        return {'access_token': token_object.key, 'profiles': profiles}

    @ staticmethod
    def get_decoded_token(id_token):
        client_id = get_secret('CLIENT_ID')

        return jwt.decode(id_token, audience=client_id, options={
            "verify_signature": False})

    @staticmethod
    def request_callback_process(code, id_token=None, email=None):
        self = AppleCallbackView

        if id_token:
            decoded_token = self.get_decoded_token(id_token)

            email = decoded_token.get('email')
        if not email:
            raise ValueError('email not given')

        try:
            is_sign_in = self.check_user_signed_in(email)
        except BadRequestError as e:
            return JsonResponse(**e.args[0])

        try:
            token_object, user, username = self.manage_token_information(
                code, email, is_sign_in)
        except BadRequestError as e:
            return JsonResponse(**e.args[0])

        profiles = self.get_or_create_profiles(user, username)
        payload = self.generate_return_json(token_object, profiles)

        return JsonResponse(payload, status=status.HTTP_200_OK)

    @ swagger_auto_schema(
        operation_id="애플 로그인 콜백",
        request_body=openapi.Schema(
            type=openapi.TYPE_OBJECT,
            properties={
                'code': openapi.Schema(type=openapi.TYPE_STRING),
                'id_token': openapi.Schema(type=openapi.TYPE_STRING),
            }
        ),
        responses={
            status.HTTP_200_OK: AuthSerializer,
            status.HTTP_400_BAD_REQUEST: ErrorSerializer
        },
    )
    def post(self, request: Request):

        keys = ['code', 'id_token']

        code, id_token = map(
            lambda key: request.data.get(key, None), keys)

        return self.request_callback_process(code, id_token)


class AppleTokenLoginView(APIView):
    @ staticmethod
    def get_decoded_token(id_token):
        return jwt.decode(id_token, options={
            "verify_signature": False})

    @ swagger_auto_schema(
        operation_id="애플 토큰 로그인",
        request_body=openapi.Schema(
            type=openapi.TYPE_OBJECT,
            properties={
                'code': openapi.Schema(type=openapi.TYPE_STRING),
                'email': openapi.Schema(type=openapi.TYPE_STRING),
            }
        ),
        responses={
            status.HTTP_200_OK: AuthSerializer,
            status.HTTP_400_BAD_REQUEST: ErrorSerializer
        },
    )
    def post(self, request: Request):
        that = AppleCallbackView

        keys = ['code', 'email']
        code, email = map(
            lambda key: request.data.get(key, None), keys)

        if not code or not email:
            name = 'code' if not code else 'email'
            return JsonResponse(data={'error': f'{name} not given'}, status=status.HTTP_400_BAD_REQUEST)

        return that.request_callback_process(code, email=email)

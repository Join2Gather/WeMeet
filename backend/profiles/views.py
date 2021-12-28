from typing import Any
from clubs.views import profile_guard
from config.serializers import ProfilesSerializer, ErrorSerializer
from config.constants import week
from django.http.response import JsonResponse
from rest_framework.views import APIView
from rest_framework.request import Request
from rest_framework import status
from config.models import ProfileDatesToSnapshot, Profiles
from config.models import ProfileDates
from config.models import Dates
from drf_yasg.utils import swagger_auto_schema
from drf_yasg import openapi
from rest_framework.permissions import IsAuthenticated

# Create your views here.


class ProfileView(APIView):
    permission_classes = [IsAuthenticated]

    @profile_guard
    @swagger_auto_schema(
        operation_id="개별 프로필 조회",
        responses={
            status.HTTP_200_OK: ProfilesSerializer
        })
    def get(self, request: Request, user: int, profile: Any):
        return JsonResponse(ProfilesSerializer(profile).data)

    @profile_guard
    @swagger_auto_schema(
        operation_id="프로필 닉네임 변경",
        responses={
            status.HTTP_200_OK: ProfilesSerializer,
            status.HTTP_400_BAD_REQUEST: ErrorSerializer,
        },
        request_body=openapi.Schema(
            type=openapi.TYPE_OBJECT,
            properties={
                'nickname': openapi.Schema(type=openapi.TYPE_STRING)
            }
        ))
    def put(self, request: Request, user: int, profile: Any):
        if not (nickname := request.data.get('nickname', None)):
            return JsonResponse({'error': 'nickname not provided'}, status=status.HTTP_400_BAD_REQUEST)
        elif len(nickname) > 100:
            return JsonResponse({'error': 'nickname too long. max length is 100'}, status=status.HTTP_400_BAD_REQUEST)

        profile.name = nickname
        profile.save()

        return JsonResponse(ProfilesSerializer(profile).data)


class MyProfileView(APIView):
    permission_classes = [IsAuthenticated]

    @swagger_auto_schema(
        operation_id="자신의 프로필 조회",
        responses={
            status.HTTP_200_OK: ProfilesSerializer
        })
    def get(self, request: Request):
        user = request.user.id
        return self.get_profile(user=user)

    def get_profile(self, **kwargs):
        profile = Profiles.objects.get(**kwargs)
        result = ProfilesSerializer(profile).data
        return JsonResponse(result)


class EverytimeCalendarView(APIView):
    permission_classes = [IsAuthenticated]

    @swagger_auto_schema(
        operation_id="에브리타임 시간표 입력",
        request_body=openapi.Schema(
            type=openapi.TYPE_OBJECT,
            properties={
                key: openapi.Schema(type=openapi.TYPE_ARRAY,
                                    items=openapi.Items(type=openapi.TYPE_OBJECT, properties={
                                        key: openapi.Schema(
                                            type=openapi.TYPE_INTEGER)
                                        for key in ['starting_hours',
                                                    'starting_minutes', 'end_hours', 'end_minutes']
                                    }))
                for key in week
            }
        ))
    @profile_guard
    def post(self, request: Request, profile: Any, user: Any):

        # club은 None!

        # 기존에 생성된 튜플은 지워주는게 사용에 용이
        ProfileDates.objects.filter(
            profile=profile, club=None, is_temporary_reserved=False).delete() 

        for idx, day in enumerate(week):
            times = request.data.get(day) or []
            for time in times:
                starting_hours = time.get('starting_hours')
                starting_minutes = time.get('starting_minutes')
                end_hours = time.get('end_hours')
                end_minutes = time.get('end_minutes')

                date = Dates.objects.get_or_create(
                    day=idx, starting_hours=starting_hours,
                    starting_minutes=starting_minutes, end_hours=end_hours, end_minutes=end_minutes)[0]
                profile_date = ProfileDates.objects.get_or_create(
                    profile=profile, date=date, club=None, is_temporary_reserved=False)[0]
                ProfileDatesToSnapshot.objects.get_or_create(snapshot=None, profile_date=profile_date)

        profile = Profiles.objects.get(id=profile.id)
        result = ProfilesSerializer(profile).data

        return JsonResponse(result)

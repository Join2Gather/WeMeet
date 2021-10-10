from typing import Any
from clubs.views import profile_guard
from config.serializers import ProfilesSerializer
from config.constants import week
from django.http.response import JsonResponse
from rest_framework.views import APIView
from rest_framework.request import Request
from rest_framework import status
from config.models import Profiles
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

    # Create는 TODO
    # 최초 소셜 로그인시 자동으로 Profile 생성 하므로 지금은 필요 없어보임


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
                                    items=openapi.Items(type=openapi.TYPE_NUMBER))
                for key in week
            }
        ))
    @profile_guard
    def post(self, request: Request, profile: Any):

        # club은 None!

        # 기존에 생성된 튜플은 지워주는게 사용에 용이
        ProfileDates.objects.filter(
            profile=profile, club=None, is_temporary_reserved=False).delete()

        for idx, day in enumerate(week):
            starting_times = request.data.get(day) or []
            for time in starting_times:
                hour = int(time)
                minute = int((time - hour) * 100)
                date = Dates.objects.get_or_create(
                    day=idx, hour=hour, minute=minute)[0]
                ProfileDates.objects.get_or_create(
                    profile=profile, date=date, club=None, is_temporary_reserved=False)

        profile = Profiles.objects.get(id=profile.id)
        result = ProfilesSerializer(profile).data

        return JsonResponse(result)

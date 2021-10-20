from config.serializers import ClubsWithDatePageSerializer
from django.contrib.auth.models import User as Users
from typing import Any
from config.serializers import ErrorSerializer, SuccessSerializer, DateCalculatorChildType, ShareSerializer
from config.serializers import ProfilesSerializer
from config.serializers import ClubAvailableTimeSerializer
from config.models import Dates, ProfileDates
from config import constants
from config.serializers import ClubsWithDateSerializer
from config.models import Clubs, Profiles
from django.http.response import JsonResponse
from config.models import ClubEntries
from rest_framework.views import APIView
from rest_framework.request import Request
from rest_framework import status
import uuid
from drf_yasg.utils import swagger_auto_schema
from drf_yasg import openapi
from functools import wraps
from rest_framework.permissions import IsAuthenticated
from rest_framework.pagination import LimitOffsetPagination

# Create your views here.


def profile_guard(method):
    @wraps(method)
    def wrapped(*args, **kwargs):
        user = kwargs['user']
        profile_id = kwargs['profile']

        current_user = args[1].user

        if not current_user.is_authenticated:
            return JsonResponse(ErrorSerializer({'error': 'Authentication credentials were not provided.'}).data, status=status.HTTP_401_UNAUTHORIZED)

        # '파이썬 클린 코드' 책에 나온 대로, Easier to Ask Forgiveness than Permission 원칙을 지켜서 try / except 문을 사용함.
        try:
            user = Users.objects.get(id=user)
            profile = Profiles.objects.get(id=profile_id, user=user.id)
        except Users.DoesNotExist:
            return JsonResponse(ErrorSerializer({'error': 'user not found'}).data, status=status.HTTP_404_NOT_FOUND)
        except Profiles.DoesNotExist:
            return JsonResponse(ErrorSerializer({'error': 'profile not found'}).data, status=status.HTTP_404_NOT_FOUND)

        if current_user != user:
            return JsonResponse(ErrorSerializer({'error': 'user of token and user of argument does not match'}).data, status=status.HTTP_400_BAD_REQUEST)

        return method(*args, **{**kwargs, 'profile': profile})

    return wrapped


def club_guard(method):
    @wraps(method)
    def wrapped(*args, **kwargs):
        uri = kwargs['uri']

        try:
            club = Clubs.objects.get(uri=uri)
        except Clubs.DoesNotExist:
            return JsonResponse(ErrorSerializer({'error': 'club not found'}).data, status=status.HTTP_404_NOT_FOUND)

        return method(*args, **{**kwargs, 'club': club})

    return wrapped


class ClubView(APIView):
    permission_classes = [IsAuthenticated]

    @swagger_auto_schema(
        operation_id="모임 목록 조회",
        manual_parameters=[openapi.Parameter('limit', openapi.IN_QUERY, type=openapi.TYPE_INTEGER),
                           openapi.Parameter('offset', openapi.IN_QUERY, type=openapi.TYPE_INTEGER)], responses={
            status.HTTP_200_OK: ClubsWithDatePageSerializer,
            status.HTTP_404_NOT_FOUND: ErrorSerializer
        })
    @profile_guard
    def get(self, request: Request, user: int, profile: Any):

        clubs = Clubs.objects.filter(clubentries__profile=profile.id)

        if not request.query_params.get('limit'):
            return JsonResponse({"count": len(clubs),
                                 "next": None,
                                 "previous": None, 'results': ClubsWithDateSerializer(clubs, many=True).data})

        paginator = LimitOffsetPagination()
        result_page = paginator.paginate_queryset(clubs, request)
        serializer = ClubsWithDateSerializer(result_page, many=True)

        return paginator.get_paginated_response(serializer.data)

    @swagger_auto_schema(
        operation_id="모임 목록 생성",
        request_body=openapi.Schema(
            type=openapi.TYPE_OBJECT,
            properties={
                'name': openapi.Schema(type=openapi.TYPE_STRING, description='name of club'),
            }
        ),
        responses={
            status.HTTP_200_OK: ClubsWithDateSerializer,
            status.HTTP_404_NOT_FOUND: ErrorSerializer
        })
    @profile_guard
    def post(self, request: Request, user: int, profile: Any):
        name = request.data.get('name')

        if not name:
            return JsonResponse(ErrorSerializer({'error': 'name not found'}).data, status=status.HTTP_404_NOT_FOUND)
        uri = uuid.uuid4()
        club = Clubs.objects.create(name=name, uri=uri)

        # 자신의 Profile과 Club 사이의 Entry는 기본적으로 생성

        ClubEntries.objects.create(profile=profile, club=club)

        serialized_club = ClubsWithDateSerializer(club).data
        return JsonResponse(serialized_club)


class ClubDateView(APIView):
    permission_classes = [IsAuthenticated]

    @swagger_auto_schema(
        operation_id="개별 모임 - 일정 예약",
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
                for key in constants.week
            }
        ),
        responses={
            status.HTTP_200_OK: ClubAvailableTimeSerializer.InterSectionSerializer,
            status.HTTP_404_NOT_FOUND: ErrorSerializer
        },
    )
    @profile_guard
    @club_guard
    def post(self, request: Request, user: int, profile: Any, uri: str, club: Any):

        days = {day: request.data.get(day) or [] for day in constants.week}

        # 기존에 있던 시간표는 delete
        ProfileDates.objects.filter(profile=profile.id, club=club.id).delete()

        for day, times in days.items():
            day_idx = constants.week.index(day)

            for time in times:
                starting_hours = time.get('starting_hours')
                starting_minutes = time.get('starting_minutes')
                end_hours = time.get('end_hours')
                end_minutes = time.get('end_minutes')

                date = Dates.objects.get_or_create(
                    day=day_idx, starting_hours=starting_hours,
                    starting_minutes=starting_minutes, end_hours=end_hours, end_minutes=end_minutes)[0]

                # 임시 시간표이므로 True로 둔다.
                ProfileDates.objects.create(
                    profile=profile, date=date, club=club, is_temporary_reserved=True)

        serializer = ClubAvailableTimeSerializer(club)
        result = ClubAvailableTimeSerializer.InterSectionSerializer(
            serializer.data['intersection']).data

        return JsonResponse(result)


class ClubGroupView(APIView):
    permission_classes = [IsAuthenticated]

    @swagger_auto_schema(
        operation_id="그룹 일정 조회 - 그룹 교집합",
        responses={
            status.HTTP_200_OK: ClubAvailableTimeSerializer.InterSectionSerializer,
            status.HTTP_404_NOT_FOUND: ErrorSerializer
        },
    )
    @profile_guard
    @club_guard
    def get(self, request: Request, user: int, profile: Any, uri: str, club: Any):

        serializer = ClubAvailableTimeSerializer(club)
        result = ClubAvailableTimeSerializer.InterSectionSerializer(
            serializer.data['intersection']).data

        return JsonResponse(result)


class ClubIndividualView(APIView):
    permission_classes = [IsAuthenticated]

    @swagger_auto_schema(
        operation_id="그룹 일정 조회 - 개별",
        responses={
            status.HTTP_200_OK: DateCalculatorChildType,
            status.HTTP_404_NOT_FOUND: ErrorSerializer
        },
    )
    @profile_guard
    @club_guard
    def get(self, request: Request, user: int, profile: Any, uri: str, club: Any):

        serializer = ProfilesSerializer(profile)
        result = [selected_club for selected_club in serializer.data['dates']
                  if selected_club['club']['id'] == club.id]
        if result == []:
            result = {
                day: [] for day in constants.week
            }
            result['club'] = {}
            result['club']['id'] = club.id
            result['club']['name'] = club.name
            result['is_temporary_reserved'] = False
        else:
            result = result[0]

        result = DateCalculatorChildType(result).data

        return JsonResponse(result, safe=False)


class ClubJoinView(APIView):
    @swagger_auto_schema(
        operation_id="그룹 참여",
        responses={
            status.HTTP_200_OK: SuccessSerializer,
            status.HTTP_404_NOT_FOUND: ErrorSerializer
        },
    )
    @profile_guard
    @club_guard
    def post(self, request: Request, user: int, profile: Any, uri: str, club: Any):
        ClubEntries.objects.get_or_create(
            profile=profile, club=club)

        return JsonResponse(SuccessSerializer({'success': True}).data)


class ClubShareView(APIView):
    permission_classes = [IsAuthenticated]

    @swagger_auto_schema(
        operation_id="그룹 초대 코드 공유",
        responses={
            status.HTTP_200_OK: ShareSerializer,
            status.HTTP_404_NOT_FOUND: ErrorSerializer
        },
    )
    @profile_guard
    @club_guard
    def post(self, request: Request, user: int, profile: Any, uri: str, club: Any):

        return JsonResponse(ShareSerializer({'uri': club.uri}).data)


class ClubConfirmView(APIView):
    permission_classes = [IsAuthenticated]

    @swagger_auto_schema(
        operation_id="그룹 일정 개별 확정",
        responses={
            status.HTTP_200_OK: SuccessSerializer,
            status.HTTP_404_NOT_FOUND: ErrorSerializer
        },
    )
    @profile_guard
    @club_guard
    def post(self, request: Request, user: int, profile: Any, uri: str, club: Any):

        return JsonResponse(SuccessSerializer({'success': True}).data)


class ClubConfirmOKView(APIView):
    permission_classes = [IsAuthenticated]

    @swagger_auto_schema(
        operation_id="그룹 일정 개별 확정 - OK",
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
                for key in constants.week
            }
        ),
        responses={
            status.HTTP_200_OK: ProfilesSerializer,
            status.HTTP_404_NOT_FOUND: ErrorSerializer
        },
    )
    @profile_guard
    @club_guard
    def post(self, request: Request, user: int, profile: Any, uri: str, club: Any):
        # 기존에 생성된 튜플은 지워줌
        ProfileDates.objects.filter(
            profile=profile, club=club).delete()

        for idx, day in enumerate(constants.week):
            times = request.data.get(day) or []
            for time in times:
                starting_hours = time.get('starting_hours')
                starting_minutes = time.get('starting_minutes')
                end_hours = time.get('end_hours')
                end_minutes = time.get('end_minutes')

                date = Dates.objects.get_or_create(
                    day=idx, starting_hours=starting_hours,
                    starting_minutes=starting_minutes, end_hours=end_hours, end_minutes=end_minutes)[0]
                ProfileDates.objects.get_or_create(
                    profile=profile, date=date, club=club, is_temporary_reserved=False)

        profile = Profiles.objects.get(id=profile.id)
        result = ProfilesSerializer(profile).data

        return JsonResponse(result)

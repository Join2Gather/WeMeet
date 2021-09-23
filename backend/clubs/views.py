from config.serializers import ErrorSerializer, ProfilesDateCalculatorType, SuccessSerializer, DateCalculatorChildType
from config.serializers import ProfilesSerializer
from config.serializers import ClubAvailableTimeSerializer
from config.models import Dates, ProfileDates
from config import constants
from config.serializers import ClubsWithDateSerializer
from config.models import Clubs, Profiles
from django.http.response import JsonResponse
from config.serializers import ClubsSerializer
from config.models import ClubEntries
from rest_framework.views import APIView
from rest_framework.request import Request
from rest_framework import status
import uuid
from drf_yasg.utils import swagger_auto_schema
from drf_yasg import openapi

# Create your views here.


class ClubView(APIView):
    @swagger_auto_schema(responses={
        status.HTTP_200_OK: ClubsWithDateSerializer(many=True),
        status.HTTP_404_NOT_FOUND: ErrorSerializer
    })
    def get(self, request: Request, user: int, profile: int):
        profile_object = Profiles.objects.filter(id=profile, user=user)
        if not profile_object.exists():
            return JsonResponse(ErrorSerializer({'error': 'profile not found'}).data, status=status.HTTP_400_BAD_REQUEST)

        club_entries = ClubEntries.objects.select_related(
            'club').filter(profile=profile)
        clubs = [ClubsWithDateSerializer(
            entry.club).data for entry in club_entries]
        return JsonResponse(clubs, safe=False)

    @swagger_auto_schema(request_body=openapi.Schema(
        type=openapi.TYPE_OBJECT,
        properties={
            'name': openapi.Schema(type=openapi.TYPE_STRING, description='name of club'),
        }
    ),
        responses={
        status.HTTP_200_OK: ClubsWithDateSerializer,
        status.HTTP_404_NOT_FOUND: ErrorSerializer
    })
    def post(self, request: Request, user: int, profile: int):
        profile_object = Profiles.objects.filter(id=profile, user=user)
        if not profile_object.exists():
            return JsonResponse(ErrorSerializer({'error': 'profile not found'}).data, status=status.HTTP_404_NOT_FOUND)
        profile_object = profile_object.first()
        name = request.data.get('name')

        if not name:
            return JsonResponse(ErrorSerializer({'error': 'name not found'}).data, status=status.HTTP_404_NOT_FOUND)
        uri = uuid.uuid4()
        club = Clubs.objects.create(name=name, uri=uri)

        # 자신의 Profile과 Club 사이의 Entry는 기본적으로 생성

        ClubEntries.objects.create(profile=profile_object, club=club)

        serialized_club = ClubsWithDateSerializer(club).data
        return JsonResponse(serialized_club)


class ClubDateView(APIView):
    @swagger_auto_schema(request_body=openapi.Schema(
        type=openapi.TYPE_OBJECT,
        properties={
            key: openapi.Schema(type=openapi.TYPE_ARRAY,
                                items=openapi.Items(type=openapi.TYPE_NUMBER))
            for key in constants.week
        }
    ),
        operation_id="users_profiles_clubs_dates"
    )
    def post(self, request: Request, user: int, profile: int, uri: str):
        profile = Profiles.objects.filter(id=profile, user=user)
        if not profile.exists():
            return JsonResponse(ErrorSerializer({'error': 'profile not found'}).data, status=status.HTTP_404_NOT_FOUND)
        profile = profile.get()

        days = {day: request.data.get(day) or [] for day in constants.week}

        club = Clubs.objects.filter(uri=uri)

        if not club.exists():
            return JsonResponse(ErrorSerializer({'error': 'club not exists'}).data, status=status.HTTP_404_NOT_FOUND)
        club = club.get()

        # 기존에 있던 시간표는 delete
        ProfileDates.objects.filter(profile=profile.id, club=club.id).delete()

        for day, times in days.items():
            day_idx = constants.week.index(day)

            for time in times:
                hour = int(time)
                minute = int(str(time).split('.')[1])

                date = Dates.objects.get_or_create(
                    day=day_idx, hour=hour, minute=minute)[0]

                # 임시 시간표이므로 True로 둔다.
                ProfileDates.objects.create(
                    profile=profile, date=date, club=club, is_temporary_reserved=True)

        serializer = ClubAvailableTimeSerializer(club)

        return JsonResponse(serializer.data['intersection'])


class ClubGroupView(APIView):
    @swagger_auto_schema(
        responses={
            status.HTTP_200_OK: ClubAvailableTimeSerializer.InterSectionSerializer,
            status.HTTP_404_NOT_FOUND: ErrorSerializer
        },
    )
    def get(self, request: Request, user: int, profile: int, uri: str):
        profile = Profiles.objects.filter(id=profile, user=user)
        if not profile.exists():
            return JsonResponse(ErrorSerializer({'error': 'profile not found'}).data, status=status.HTTP_404_NOT_FOUND)
        profile = profile.get()

        club = Clubs.objects.filter(uri=uri)

        if not club.exists():
            return JsonResponse(ErrorSerializer({'error': 'club not exists'}).data, status=status.HTTP_404_NOT_FOUND)
        club = club.get()

        serializer = ClubAvailableTimeSerializer(club)
        result = ClubAvailableTimeSerializer.InterSectionSerializer(
            serializer.data['intersection']).data

        return JsonResponse(result)


class ClubIndividualView(APIView):
    @swagger_auto_schema(
        responses={
            status.HTTP_200_OK: DateCalculatorChildType,
            status.HTTP_404_NOT_FOUND: ErrorSerializer
        },
    )
    def get(self, request: Request, user: int, profile: int, uri: str):
        profile = Profiles.objects.filter(id=profile, user=user)
        if not profile.exists():
            return JsonResponse(ErrorSerializer({'error': 'profile not found'}).data, status=status.HTTP_404_NOT_FOUND)
        profile = profile.get()

        club = Clubs.objects.filter(uri=uri)

        if not club.exists():
            return JsonResponse(ErrorSerializer({'error': 'club not exists'}).data, status=status.HTTP_404_NOT_FOUND)
        club = club.get()

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
        responses={
            status.HTTP_200_OK: SuccessSerializer,
            status.HTTP_404_NOT_FOUND: ErrorSerializer
        },
    )
    def post(self, request: Request, user: int, profile: int, uri: str):
        profile = Profiles.objects.filter(id=profile, user=user)
        if not profile.exists():
            return JsonResponse(ErrorSerializer({'error': 'profile not found'}).data, status=status.HTTP_404_NOT_FOUND)
        profile = profile.get()

        club = Clubs.objects.filter(uri=uri)

        if not club.exists():
            return JsonResponse(ErrorSerializer({'error': 'club not exists'}).data, status=status.HTTP_404_NOT_FOUND)
        club = club.get()

        ClubEntries.objects.get_or_create(
            profile=profile, club=club)

        return JsonResponse(SuccessSerializer({'success': True}).data)

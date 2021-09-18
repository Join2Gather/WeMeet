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
        status.HTTP_200_OK: ClubsWithDateSerializer(many=True)
    })
    def get(self, request: Request, user: int, profile: int):
        profile_object = Profiles.objects.filter(id=profile, user=user)
        if not profile_object.exists():
            return JsonResponse({'error': 'profile not found'}, status=status.HTTP_400_BAD_REQUEST)

        club_entries = ClubEntries.objects.select_related('club').filter(profile=profile)
        clubs = [ClubsWithDateSerializer(entry.club).data for entry in club_entries]
        return JsonResponse(clubs, safe=False)
    

    @swagger_auto_schema(request_body=openapi.Schema(
        type=openapi.TYPE_OBJECT, 
        properties={
            'name': openapi.Schema(type=openapi.TYPE_STRING, description='name of club'),
        }
    ),
    responses={
        status.HTTP_200_OK: ClubsWithDateSerializer
    })
    def post(self, request: Request, user: int, profile: int):
        profile_object = Profiles.objects.filter(id=profile, user=user)
        if not profile_object.exists():
            return JsonResponse({'error': 'profile not found'}, status=status.HTTP_400_BAD_REQUEST)
        profile_object = profile_object.first()

        name = request.data.get('name')
        if not name:
            return JsonResponse({'error': 'name not found'}, status=status.HTTP_400_BAD_REQUEST)
        uri = uuid.uuid4()
        club = Clubs.objects.create(name=name, uri=uri)

        # 자신의 Profile과 Club 사이의 Entry는 기본적으로 생성

        ClubEntries.objects.create(profile=profile_object, club=club)

        serialized_club = ClubsWithDateSerializer(club).data
        return JsonResponse(serialized_club)
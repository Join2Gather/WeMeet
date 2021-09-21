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

# Create your views here.
class ProfileView(APIView):
    @swagger_auto_schema(responses={
        status.HTTP_200_OK: ProfilesSerializer
    })
    def get(self, request: Request, user: int, profile: int):
        return self.get_profile(id=profile, user=user)
    
    def get_profile(self, **kwargs):
        profile = Profiles.objects.filter(**kwargs)
        if not profile.exists():
            return JsonResponse({})
        profile = profile.first()
        result = ProfilesSerializer(profile).data
        return JsonResponse(result)

    # Create는 TODO
    # 최초 소셜 로그인시 자동으로 Profile 생성 하므로 지금은 필요 없어보임

class MyProfileView(APIView):
    @swagger_auto_schema(responses={
        status.HTTP_200_OK: ProfilesSerializer
    })
    def get(self, request: Request):
        profile_view = ProfileView()
        user = request.user.id
        return profile_view.get_profile(user=user)


class EverytimeCalendarView(APIView):

    @swagger_auto_schema(request_body=openapi.Schema(
        type=openapi.TYPE_OBJECT, 
        properties={
            key: openapi.Schema(type=openapi.TYPE_ARRAY, items=openapi.Items(type=openapi.TYPE_NUMBER))
            for key in week
        }
    ))
    def post(self, request: Request, user: int, profile: int):
        profile = Profiles.objects.filter(id=profile, user=user)
        if not profile.exists():
            return JsonResponse({'error': 'profile not found'}, status=status.HTTP_400_BAD_REQUEST)
        profile = profile.first()
                
        # club은 None!

        # 기존에 생성된 튜플은 지워주는게 사용에 용이
        ProfileDates.objects.filter(profile=profile, club=None, is_temporary_reserved=False).delete()

        for idx, day in enumerate(week):
            starting_times = request.data.get(day) or []
            for time in starting_times:
                hour = int(time)
                minute = int((time - hour) * 100)
                date = Dates.objects.filter(day=idx, hour=hour, minute=minute)
                if not date.exists():
                    date = Dates.objects.create(day=idx, hour=hour, minute=minute)
                else:
                    date = date.first()
                profile_dates = ProfileDates.objects.filter(profile=profile, date=date, club=None, is_temporary_reserved=False)
                if not profile_dates.exists():
                    ProfileDates.objects.create(profile=profile, date=date, club=None, is_temporary_reserved=False)
        
        profile = Profiles.objects.get(id=profile.id)
        result = ProfilesSerializer(profile).data

        return JsonResponse(result)
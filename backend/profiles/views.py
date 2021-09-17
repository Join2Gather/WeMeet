from config.serializers import ProfilesSerializer
from django.http.response import JsonResponse
from rest_framework.views import APIView
from rest_framework.request import Request
from rest_framework import status
from config.models import Profiles
from config.models import ClubEntries
from config.models import ProfileDates
from config.models import Dates
# Create your views here.
class ProfileView(APIView):
    def get(self, request: Request, user: int, profile: int):
        profile = Profiles.objects.filter(id=profile, user=user)
        if not profile.exists():
            return JsonResponse({})
        profile = profile.first()
        result = ProfilesSerializer(profile).data
        return JsonResponse(result)

    # Create는 TODO
    # 최초 소셜 로그인시 자동으로 Profile 생성 하므로 지금은 필요 없어보임

class EverytimeCalendarView(APIView):
    def post(self, request: Request, user: int, profile: int):


        profile = Profiles.objects.filter(id=profile, user=user)
        if not profile.exists():
            return JsonResponse({'error': 'profile not found'}, status=status.HTTP_400_BAD_REQUEST)
        profile = profile.first()
                
        # club은 None!

        # 기존에 생성된 튜플은 지워주는게 사용에 용이
        ProfileDates.objects.filter(profile=profile, club=None, is_temporary_reserved=False).delete()

        week = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat']
        for idx, day in enumerate(week):
            starting_times = request.data.get(day) or []
            print(starting_times)
            for time in starting_times:
                hour = int(time)
                minute = int((time - hour) * 60)
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
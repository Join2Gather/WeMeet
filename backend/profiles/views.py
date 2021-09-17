from django.http.response import JsonResponse
from rest_framework.views import APIView
from rest_framework.request import Request
from config.models import Profiles
from config.models import ClubEntries
from config.models import ProfileDates
# Create your views here.
class ProfileView(APIView):
    def get(self, request: Request, user: int, profile: int):
        profile = Profiles.objects.filter(id=profile, user=user)
        if not profile.exists():
            return JsonResponse({})
        profile = profile.values()[0]
        profile['clubs'] = [entry.club_id for entry in ClubEntries.objects.filter(profile=profile.get('id'))]
        profile['dates'] = [profile_date for profile_date in ProfileDates.objects.filter(profile=profile.get('id'))]
        return JsonResponse(profile)
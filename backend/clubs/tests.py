from hypothesis.extra.django import TestCase, from_model
from hypothesis import given
from hypothesis.strategies import text
from django.http.response import JsonResponse
from rest_framework.views import APIView
from clubs.views import ClubView, ClubJoinView, ClubLeaveView
from config.models import Profiles, Clubs, ClubEntries, UserModel
from rest_framework.authtoken.models import Token
from rest_framework.test import APIRequestFactory, force_authenticate
from django.urls import reverse
import uuid
import json
# Create your tests here.


class ClubTestCase(TestCase):
    def setUp(self) -> None:
        self.factory = APIRequestFactory()

    def get_token(self, profile, key: str):
        user = profile.user
        key = key[:40]

        return Token.objects.create(key=key, user=user)

    def request(self, user: UserModel, token: Token, params: dict = {}, data: dict = {}, view_name: str = 'club_view', view: APIView = ClubView, mode: str = 'post'):
        url = reverse(view_name, kwargs=params)

        request = self.factory.__getattribute__(mode)(
            url, data=data, format='json')

        force_authenticate(request, user=user, token=token)

        response = view.as_view()(
            request, **params)

        return response

    @given(from_model(UserModel), from_model(Clubs), text(min_size=40))
    def test_join_leave(self, user: UserModel, club: Clubs, key: str):
        profile = Profiles.objects.create(name=user.username, user=user)
        token = self.get_token(profile, key)

        club.uri = uuid.uuid4()

        user.save()
        club.save()

        self.assertFalse(ClubEntries.objects.filter(
            profile=profile.id, club=club.id).exists())

        join_response: JsonResponse = self.request(user, token, params={'profile': profile.id,
                                                                        'user': profile.user.id, 'uri': club.uri}, view_name='club_join_view', view=ClubJoinView)

        self.assertEquals(join_response.status_code, 200)

        self.assertEquals(ClubEntries.objects.filter(
            profile=profile.id, club=club.id).count(), 1)

        leave_response = self.request(user, token, params={'profile': profile.id,
                                                           'user': profile.user.id, 'uri': club.uri}, view_name='club_leave_view', view=ClubLeaveView)

        self.assertEquals(leave_response.status_code, 200)

        self.assertFalse(ClubEntries.objects.filter(
            profile=profile.id, club=club.id).exists())

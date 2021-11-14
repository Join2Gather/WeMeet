from hypothesis.extra.django import TestCase, from_model
from hypothesis import given
from hypothesis.strategies import text
from django.http.response import JsonResponse
from config.tests import mock_request
from clubs.views import ClubJoinView, ClubLeaveView, ClubColorView
from config.models import Profiles, Clubs, ClubEntries, UserModel
from rest_framework.authtoken.models import Token
import uuid
import random
from config.serializers import ClubsSerializer
# Create your tests here.


def is_color(color: str):
    return color.startswith('#') and len(color) == 7 and False not in ['0' <= e <= 'F' for e in color[1:]]


def generate_color():
    yield '#'
    for i in range(6):
        choice = random.randint(0, 15)
        if choice < 10:
            result = str(choice)
        else:
            result = chr(choice - 10 + ord('A'))
        yield result


class ClubTestCase(TestCase):

    def get_token(self, profile, key: str):
        user = profile.user
        key = key[:40]

        return Token.objects.create(key=key, user=user)

    @given(from_model(UserModel), from_model(Clubs), text(min_size=40))
    def test_join_leave(self, user: UserModel, club: Clubs, key: str):
        profile = Profiles.objects.create(name=user.username, user=user)
        token = self.get_token(profile, key)

        club.uri = uuid.uuid4()

        user.save()
        club.save()

        self.assertFalse(ClubEntries.objects.filter(
            profile=profile.id, club=club.id).exists())

        join_response: JsonResponse = mock_request(user, token, params={'profile': profile.id,
                                                                        'user': profile.user.id, 'uri': club.uri}, view_name='club_join_view', view=ClubJoinView)

        self.assertEquals(join_response.status_code, 200)

        self.assertEquals(ClubEntries.objects.filter(
            profile=profile.id, club=club.id).count(), 1)

        leave_response = mock_request(user, token, params={'profile': profile.id,
                                                           'user': profile.user.id, 'uri': club.uri}, view_name='club_leave_view', view=ClubLeaveView)

        self.assertEquals(leave_response.status_code, 200)

        self.assertFalse(ClubEntries.objects.filter(
            profile=profile.id, club=club.id).exists())

    @given(text(min_size=1, max_size=100), text(min_size=1, max_size=100))
    def test_default_club_color(self, name: str, uri: str):
        club: Clubs = Clubs.objects.create(name=name, uri=uri)

        self.assertTrue(club.color)
        self.assertTrue(is_color(club.color))

    @given(from_model(UserModel), from_model(Clubs), text(min_size=40))
    def test_club_color(self, user: UserModel, club: Clubs, key: str):
        color = ''.join(generate_color())

        self.assertTrue(is_color(color))

        profile = Profiles.objects.create(name=user.username, user=user)
        token = self.get_token(profile, key)

        club.uri = uuid.uuid4()

        user.save()
        club.save()

        change_color_response: JsonResponse = mock_request(user, token, params={'profile': profile.id,
                                                                                'user': profile.user.id, 'uri': club.uri}, data={'color': color}, view_name='club_color_view', view=ClubColorView, mode='put')

        self.assertEquals(change_color_response.status_code, 200)

        club = Clubs.objects.get(id=club.id)
        self.assertEquals(club.color, color)

        serialized: dict = ClubsSerializer(club).data
        self.assertEquals(serialized.get('color'), color)

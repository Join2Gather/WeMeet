from typing import List
from hypothesis.extra.django import TestCase, from_model
from hypothesis import given
from hypothesis.strategies import text, lists, integers
from django.http.response import JsonResponse
from clubs.views import ClubView, ClubDateView
from django.contrib.auth.models import User as Users
from config.tests import MockRequestBaseTestCase, mock_request
from clubs.views import ClubJoinView, ClubLeaveView, ClubColorView, ClubConfirmView, ClubSnapshotView
from config.models import Profiles, Clubs, ClubEntries, UserModel, ProfileDates, ClubSnapshots, Dates
from rest_framework.authtoken.models import Token
from rest_framework import status
import uuid
import random
import json
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


def get_token(profile, key: str) -> Token:
    user = profile.user
    key = key[:40]

    return Token.objects.create(key=key, user=user)


class ClubTestCase(TestCase):

    @given(from_model(UserModel), from_model(Clubs), text(min_size=40))
    def test_join_leave(self, user: UserModel, club: Clubs, key: str):
        profile = Profiles.objects.create(name=user.username, user=user)
        token = get_token(profile, key)

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
        token = get_token(profile, key)

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


id_one = integers(min_value=1, max_value=1)


class SnapshotTestCase(TestCase):
    @given(from_model(Profiles, id=id_one, user=from_model(UserModel, id=id_one)), text(min_size=40),
           lists(from_model(ProfileDates, profile=from_model(Profiles, id=id_one, user=from_model(UserModel, id=id_one)),
                            date=from_model(Dates), club=from_model(Clubs, id=id_one, uri=text().filter(lambda x: x and '/' not in x))), min_size=1, max_size=5))
    def test_confirm_snapshot_create(self, profile: Profiles, key: str, profile_dates: List[ProfileDates]):
        profile.save()
        for profile_date in profile_dates:
            profile_date.save()

        user = profile.user
        token = get_token(profile, key)

        token.save()

        club = Clubs.objects.get(id=1)

        def confirm_request():
            return mock_request(
                user, token, params={'profile': profile.id,
                                     'user': profile.user.id, 'uri': club.uri}, view_name='club_confirm_view', view=ClubConfirmView, mode='post')

        def snapshot_request():
            return mock_request(
                user, token, params={'profile': profile.id,
                                     'user': profile.user.id, 'uri': club.uri}, view_name='club_snapshot_view', view=ClubSnapshotView, mode='get')

        def delete_request():
            return mock_request(
                user, token, params={'profile': profile.id,
                                     'user': profile.user.id, 'uri': club.uri}, view_name='club_snapshot_view', view=ClubSnapshotView, mode='delete')

        confirm_response: JsonResponse = confirm_request()
        snapshots = ClubSnapshots.objects.filter(club=club.id)

        self.assertEquals(confirm_response.status_code, 200)
        self.assertEquals(snapshots.count(), 1)

        confirm_response: JsonResponse = confirm_request()
        snapshots = ClubSnapshots.objects.filter(club=club.id)

        self.assertEquals(confirm_response.status_code, 200)
        self.assertEquals(snapshots.count(), 1)

        snapshot = snapshots.get()

        snapshot_profile_dates = ProfileDates.objects.filter(
            snapshot=snapshot.id)

        clubs_profile_dates = ProfileDates.objects.filter(club=club.id)

        snapshot_dates = list(
            snapshot_profile_dates.values_list('date', flat=True))
        clubs_dates = list(
            clubs_profile_dates.values_list('date', flat=True))

        snapshot_dates.sort()
        clubs_dates.sort()

        self.assertEquals(snapshot_dates, clubs_dates)

        snapshot_response: JsonResponse = snapshot_request()
        self.assertEquals(snapshot_response.status_code, 200)

        res: dict = json.loads(snapshot_response.content)
        self.assertNotEquals(res, {})

        delete_respose: JsonResponse = delete_request()
        self.assertEquals(delete_respose.status_code, 200)

        snapshot_profile_dates = ProfileDates.objects.filter(
            snapshot=snapshot.id)

        self.assertFalse(snapshot_profile_dates.exists())

        snapshots = ClubSnapshots.objects.filter(club=club.id)
        self.assertFalse(snapshots.exists())


class ClubHoursTestCase(MockRequestBaseTestCase):

    @given(from_model(Profiles, user=from_model(Users)), text(),
           integers(), integers(), integers(), integers(), integers(), integers())
    def test_club_starting_end_hours(self, profile: Profiles, name: str,
                                     starting_hours: int, end_hours: int, date_starting_hours: int, date_starting_minutes: int, date_end_hours: int, date_end_minutes: int):
        user = profile.user
        color = ''.join(generate_color())

        profile.save()
        user.save()

        token = self.get_token(user)

        def OOB_hour(x):
            return not (0 <= x <= 24)

        def OOB_min(x):
            return not (0 <= x <= 60)

        res = self.mock_request(user, token, params={'user': user.id, 'profile': profile.id}, data={
            'name': name,
            'color': color,
            'starting_hours': starting_hours,
            'end_hours': end_hours
        }, view_name='club_view', view=ClubView, mode='post')

        response_status = status.HTTP_200_OK
        if not name or OOB_hour(starting_hours) or OOB_hour(end_hours) or starting_hours >= end_hours:
            response_status = status.HTTP_400_BAD_REQUEST

        self.check_match_serializer_type(
            res, ClubView.post, status=response_status)

        expected_count = int(response_status != status.HTTP_200_OK)

        clubs = Clubs.objects.filter(name=name, color=color,
                                     starting_hour=starting_hours, end_hour=end_hours).count()

        self.assertEquals(clubs, expected_count)

        if expected_count == 0:
            return

        club = clubs.get()

        res = self.mock_request(user, token, params={'user': user.id, 'profile': profile.id, 'uri': club.uri}, data={
            'starting_hours': date_starting_hours,
            'starting_minutes': date_starting_minutes,
            'end_hours': date_end_hours,
            'end_minutes': date_end_minutes
        }, view_name='club_date_view', view=ClubDateView, mode='post')

        response_status = status.HTTP_200_OK
        if OOB_hour(date_starting_hours) or OOB_hour(date_end_hours) or OOB_min(date_starting_minutes) or OOB_min(date_end_minutes) \
                or date_starting_hours * 60 + date_starting_minutes >= date_end_hours * 60 + date_end_minutes \
                or starting_hours > date_starting_hours or end_hours < date_end_hours:
            response_status = status.HTTP_400_BAD_REQUEST

        self.check_match_serializer_type(
            res, ClubView.post, status=response_status)

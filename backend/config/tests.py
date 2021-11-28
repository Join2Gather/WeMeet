from typing import Callable, Optional, Type
import uuid
from rest_framework.serializers import Serializer
from rest_framework import status
from config.models import UserModel
from hypothesis.core import given
from django.test.testcases import TransactionTestCase
from django.http.response import JsonResponse
from hypothesis.extra.django import TestCase, from_model
from hypothesis import given
from hypothesis.strategies import lists
from config.serializers import ClubsSerializer, ClubsWithDateSerializer, ProfilesSerializer, ClubAvailableTimeSerializer
from config.models import Profiles, Clubs, Dates, ProfileDates, ClubEntries, UserModel, ClubEntries
from config.constants import week
from django.contrib.auth.models import User as Users
from rest_framework.views import APIView
from clubs.views import ClubView
from rest_framework.authtoken.models import Token
from rest_framework.test import APIRequestFactory, force_authenticate
from django.urls import reverse
import json


def mock_request(user: UserModel, token: Token, params: dict = {}, data: dict = {}, view_name: str = 'club_view', view: APIView = ClubView, mode: str = 'post'):
    url = reverse(view_name, kwargs=params)
    factory = APIRequestFactory()

    request = factory.__getattribute__(mode)(
        url, data=data, format='json')

    force_authenticate(request, user=user, token=token)

    response = view.as_view()(
        request, **params)

    return response


class InterSectionTestCase(TestCase):
    def setUp(self):
        self.users = [

        ]
        self.profiles = [

        ]

        for i in range(1, 5):
            user = Users.objects.create_user(
                username=f'user {i}', password='testUser')
            profile = Profiles.objects.create(
                name=f'user {i}', user=user)
            self.users.append(user)
            self.profiles.append(profile)
        self.club = Clubs.objects.create(name='testClub', uri='testClub')

        times = [
            {
                'starting_hours': 1,
                'starting_minutes': 0,
                'end_hours': 2,
                'end_minutes': 0,
            },
            {
                'starting_hours': 1,
                'starting_minutes': 30,
                'end_hours': 2,
                'end_minutes': 0,
            },
            {
                'starting_hours': 1,
                'starting_minutes': 0,
                'end_hours': 1,
                'end_minutes': 30,
            },
            {
                'starting_hours': 1,
                'starting_minutes': 0,
                'end_hours': 2,
                'end_minutes': 0,
            },
        ]

        for idx, time in enumerate(times):
            day = time.get('day', 0)
            starting_hours = time.get('starting_hours')
            starting_minutes = time.get('starting_minutes')
            end_hours = time.get('end_hours')
            end_minutes = time.get('end_minutes')

            date = Dates.objects.get_or_create(
                day=day, starting_hours=starting_hours,
                starting_minutes=starting_minutes, end_hours=end_hours, end_minutes=end_minutes)[0]

            ProfileDates.objects.get_or_create(
                profile=self.profiles[idx], date=date, club=self.club, is_temporary_reserved=True)

    def test_intersection(self):
        """시간 교집합 테스트"""
        serializer = ClubAvailableTimeSerializer(self.club)
        result = ClubAvailableTimeSerializer.InterSectionSerializer(
            serializer.data['intersection']).data

        print(json.dumps(result, indent=4))

        avail_time = [tuple(elem.values())
                      for elem in result['sun']['avail_time']]

        self.assertTrue(avail_time,
                        'avail_time in sunday exists')
        self.assertEquals(sorted(avail_time), sorted(set(avail_time)),
                          "there's no duplicate elements in avail_time")
        return result


class ClubPeopleCountTestCase(TestCase):
    def setUp(self) -> None:
        self.club = Clubs.objects.create(name="example", uri="example-uri")

        self.users = [
            Users.objects.create_user(
                username=f'user {i}', password='testUser') for i in range(1, 5)
        ]

        self.profiles = [
            Profiles.objects.create(
                name=user.username, user=user) for user in self.users
        ]

        self.clubEntries = [
            ClubEntries.objects.create(club=self.club, profile=profile) for profile in self.profiles
        ]

    def test_people_count_matches(self):
        serialized_club = ClubsSerializer(self.club).data

        self.assertTrue('people_count' in serialized_club,
                        'people_count key is exists on ClubsSerializer')

        self.assertEquals(serialized_club.get('people_count'),
                          len(self.clubEntries),
                          'people_count must matches with matching club entries length')


class ClubCalculatorTestCase(TestCase):

    def check_time_included(self, serialized_dates, date, club=None):
        time = {
            'starting_hours': date.starting_hours,
            'starting_minutes': date.starting_minutes,
            'end_hours': date.end_hours,
            'end_minutes': date.end_minutes,
        }

        if isinstance(serialized_dates, list):
            if serialized_dates and isinstance(serialized_dates[0], dict):
                matching_elems = [elem for elem in serialized_dates if elem.get(
                    'club', {}).get('id', None) == club.id]

                self.assertEquals(len(matching_elems), 1)
                self.assertIn(time, matching_elems[0].get(week[date.day], []))
            else:
                self.assertIn(time, serialized_dates)
        else:
            self.assertIn(time, serialized_dates.get(week[date.day], []))

    @given(from_model(Profiles, user=from_model(UserModel)), lists(from_model(Dates)), lists(from_model(Clubs)))
    def test_date_calculate(self, profile: Profiles, dates: list[Dates], clubs: list[Clubs]):
        for club in clubs:
            for date in dates:
                ProfileDates.objects.create(
                    is_temporary_reserved=True, profile=profile, date=date, club=club)

            serialized_dates = ClubsWithDateSerializer(
                club).data.get('dates', {})

            for date in dates:
                self.check_time_included(serialized_dates, date)

        serialized_dates = ProfilesSerializer(profile).data.get('dates', [])

        for club in clubs:
            for date in dates:
                self.check_time_included(serialized_dates, date, club)

        for club in clubs:
            intersection = ClubAvailableTimeSerializer(
                club).data.get('intersection', {})

            for day in week:
                self.assertIn(day, intersection)
                day_data = intersection.get(day)

                for key in ['avail_time', 'count', 'avail_people']:
                    self.assertIn(key, day_data)


class MockRequestMixin():
    def mock_request(self, user: UserModel, token: Token, *, params: dict = {}, data: dict = {}, view_name: str = 'users_info_view', view: Type[APIView] = None, mode: str = 'post'):
        url = reverse(view_name, kwargs=params)
        factory = APIRequestFactory()

        request = factory.__getattribute__(mode)(
            url, data=data, format='json')

        force_authenticate(request, user=user, token=token)

        response = view.as_view()(
            request, **params)

        return response

    def get_token(self, user: UserModel, key: Optional[str] = None) -> Token:
        if not key:
            key = str(uuid.uuid4())

        key = key[:40]

        return Token.objects.create(key=key, user=user)

    def check_match_serializer_type(self: TestCase, res: JsonResponse, method: Callable, *, status=status.HTTP_200_OK):
        self.assertEquals(res.status_code, status)

        parsed_res = json.loads(res.content)

        schema: dict = method._swagger_auto_schema
        srl: Optional[Type[Serializer]] = schema.get(
            'responses', {}).get(status, None)

        self.assertNotEquals(srl, None)

        serialized_res = srl(data=parsed_res)
        self.assertTrue(serialized_res.is_valid())


class MockRequestBaseTestCase(TestCase, MockRequestMixin):
    pass


class MockRequestBaseTransactionTestCase(TransactionTestCase, MockRequestMixin):
    pass

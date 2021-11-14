from django.test import TestCase
from config.models import ClubEntries
from config.serializers import ClubsSerializer
from config.models import Profiles, Clubs, Dates, ProfileDates, ClubEntries, UserModel
from django.contrib.auth.models import User as Users
from config.serializers import ClubAvailableTimeSerializer
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

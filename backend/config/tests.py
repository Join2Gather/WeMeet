from django.test import TestCase
from config.models import Profiles, Clubs, Dates, ProfileDates
from django.contrib.auth.models import User as Users
from config.serializers import ClubAvailableTimeSerializer
import json


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

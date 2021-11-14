from django.db import models
from django.contrib.auth.models import User as UserModel
from . import settings
from config.constants import week

Users = settings.AUTH_USER_MODEL


# 프로필 테이블
class Profiles(models.Model):

    name = models.CharField(max_length=100)
    user = models.ForeignKey(Users, on_delete=models.CASCADE)

    class Meta:
        db_table = 'profiles'
        verbose_name = 'Profile'

    def __str__(self):
        return self.name


# 모임 테이블
class Clubs(models.Model):

    name = models.CharField(max_length=100)
    uri = models.CharField(max_length=100)
    color = models.CharField(max_length=100, default="#FFFFFF")

    class Meta:
        db_table = 'clubs'
        verbose_name = 'Club'

    def __str__(self):
        return self.name


# 내 일정과 모임 간의 관계 테이블
class ClubEntries(models.Model):

    profile = models.ForeignKey(Profiles, on_delete=models.CASCADE)
    club = models.ForeignKey(Clubs, on_delete=models.CASCADE)

    class Meta:
        db_table = 'club_entries'
        verbose_name = 'Club entrie'

    def __str__(self):
        return f"{self.profile} -> {self.club}"

# 읽기 전용 시간 테이블


class Dates(models.Model):

    day = models.IntegerField(default=0)
    starting_hours = models.IntegerField(default=0)
    starting_minutes = models.IntegerField(default=0)
    end_hours = models.IntegerField(default=0)
    end_minutes = models.IntegerField(default=0)

    class Meta:
        db_table = 'dates'
        verbose_name = 'Date'

    def __str__(self):
        week_day = week[self.day]
        return f"{week_day} {self.hour}:{self.minute}"


# 프로필, 날짜, 모임관의 연관 테이블
class ProfileDates(models.Model):

    is_temporary_reserved = models.BooleanField()
    profile = models.ForeignKey(Profiles, on_delete=models.CASCADE)
    date = models.ForeignKey(Dates, on_delete=models.CASCADE)
    club = models.ForeignKey(Clubs, on_delete=models.CASCADE, null=True)

    class Meta:
        db_table = 'profile_dates'
        verbose_name = 'Profile date'

    def __str__(self):
        return f"{self.profile} -> {self.club} ({self.date})"

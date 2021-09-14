from django.db import models
from django.contrib.auth.models import User as UserModel
from . import settings

Users = settings.AUTH_USER_MODEL


class Profiles(models.Model):

    name = models.CharField(max_length=100)
    user = models.ForeignKey(Users, on_delete=models.CASCADE)

    class Meta:
        db_table = 'profiles'
        verbose_name = '내 일정 테이블'


class Clubs(models.Model):

    name = models.CharField(max_length=100)
    uri = models.CharField(max_length=100)

    class Meta:
        db_table = 'clubs'
        verbose_name = '내 일정과 모임 간의 관계 테이블'



class ClubEntries(models.Model):

    profile = models.ForeignKey(Profiles, on_delete=models.CASCADE)
    club = models.ForeignKey(Clubs, on_delete=models.CASCADE)

    class Meta:
        db_table = 'club_entries'
        verbose_name = '내 일정과 모임 간의 관계 테이블'

# 읽기 전용 일자 테이블
class Dates(models.Model):

    day = models.CharField(max_length=100)
    hour = models.CharField(max_length=100)
    minute = models.CharField(max_length=100)

    class Meta:
        db_table = 'dates'
        verbose_name = '일자 테이블'


class ProfileDates(models.Model):

    is_temporary_reserved = models.BooleanField()
    profile = models.ForeignKey(Profiles, on_delete=models.CASCADE)
    date = models.ForeignKey(Dates, on_delete=models.CASCADE)
    club = models.ForeignKey(Clubs, on_delete=models.CASCADE)

    class Meta:
        db_table = 'profile_dates'
        verbose_name = '내 일정과 모임 간의 관계 테이블'

from config.models import ClubEntries, Clubs, Dates, ProfileDates, Profiles
from config import constants
from rest_framework import serializers
from abc import ABC, abstractmethod


# 파일 분리 TODO

"""
    문제 정의: Date를 계산하는 로직이 여러 클래스에 있어 일부 비슷한 반면, 여러 코드가 반복되는 문제가 있다. 

    비즈니스 로직이 비슷한 여러 서브루틴들의 복잡성을 줄이고, 하나의 함수와 파생된 로직들로 통일하는 방법으로는 여러가지가 있다.
    정확히는 프로그래밍 방법론에 따라 다른데, 크게 얘기하자면 네 가지가 있다.

    객체 지향
    1. AOP
    2. 다형성 (상속 포함)
    
    함수 - 불변 자료구조 지향
    3. 고차 함수
    4. 커링

    여기서는 다형성 방법론을 사용해 Date를 계산해서 반환하도록 작성했다.
"""
class DateCalculator(ABC):
    obj = None
    week = constants.week
    dates = {}

    def __init__(self, obj) -> None:
        super().__init__()
        self.obj = obj

    @property
    def result(self):
        return self.dates

    # 반드시 @property decorator를 붙여서 override 할 것.    
    @property
    def filter_expression(self):
        return {'profile': self.obj.id}

    def calculate(self):
        """
            왜 select_related를 사용하였는가?
            N + 1 문제를 피하기 위해. Django ORM은 기본적으로 Foreign key에 대해서는 id값만 가져온다.
            실제로 FK 객체가 가져와지는 시점은 attribute를 사용할 때에 쿼리가 실행된다.
            이런 반복 작업을 예방하기 위해 select_related를 사용하였다.
            비슷한 메소드로 prefetch_related가 있는데 이것은 쿼리를 원래 테이블과 외래 키 테이블로 나눠서 실행시키고 장고에서 합쳐주는 방식이다.
            상황마다 성능 비교가 다르다고 하는데 우리의 요구사항 기준으로는 지금은 select_related만 써도 충분한 것 같다.
        """
        for pd in ProfileDates.objects \
                    .filter(**self.filter_expression) \
                    .select_related('date', 'club'):
            date = pd.date
            club = pd.club
            is_temporary_reserved = pd.is_temporary_reserved

            self.append_date(date, club, is_temporary_reserved)

        self.sort_date()

        return self.result

    @abstractmethod
    def append_date(self, date, club, is_temporary_reserved):
        pass

    @abstractmethod
    def sort_date(self):
        pass

class ProfilesDateCalculator(DateCalculator):

    @property
    def result(self):
        return list(self.dates.values())

    def append_date(self, date, club, is_temporary_reserved):
        dates = self.dates
        week = self.week
        if not dates.get(club):
            dates[club] = {}
            for day in week:
                dates[club][day] = []
            dates[club]['club'] = {}
            dates[club]['club']['id'] = club.id
            dates[club]['club']['name'] = club.name
            dates[club]['is_temporary_reserved'] = is_temporary_reserved
        time = date.hour + date.minute / 100
        dates[club][week[date.day]].append(time)

    def sort_date(self):
        dates = self.dates
        week = self.week
        for club in dates.keys():
            for day in week:
                dates[club][day].sort()

class ClubsWithDateCalculator(DateCalculator):
    def __init__(self, obj) -> None:
        super().__init__(obj)
        self.dates = {day: [] for day in self.week}

    @property
    def filter_expression(self):
        return {'club': self.obj.id}

    def append_date(self, date, club, is_temporary_reserved):
        dates = self.dates
        week = self.week
        dates['is_temporary_reserved'] = is_temporary_reserved
        time = date.hour + date.minute / 100    
        dates[week[date.day]].append(time)

    def sort_date(self):
        dates = self.dates
        week = self.week
        for day in week:
            dates[day].sort()

class ClubAvailableTimeSerializer(serializers.ModelSerializer):
    intersection = serializers.SerializerMethodField()

    class Meta:
        model = Clubs
        fields = ('intersection', )
    
    def get_intersection(self, obj):
        result = {day: {
            'avail_time': [],
            'count': [],
            'avail_people': []
        } for day in constants.week}

        profile_dates = ProfileDates.objects.filter(club=obj.id).select_related('date', 'profile')
        dates = profile_dates.values_list('date__id', 'date__day', 'date__hour', 'date__minute').distinct()
        for date in dates:
            date_id, date_day, hour, minute = date
            day = constants.week[date_day]
            time = float(f"{hour}.{minute}")

            result[day]['avail_time'].append(time)

            profiles = profile_dates.filter(date=date_id).values_list('profile__name')
            result[day]['count'].append(len(profiles))

            avail_people = [profile[0] for profile in profiles]

            result[day]['avail_people'].append(avail_people)
        
        return result




class ProfilesSerializer(serializers.ModelSerializer):
    clubs = serializers.SerializerMethodField()
    dates = serializers.SerializerMethodField()

    class Meta:
        model = Profiles
        fields = '__all__'
    
    def get_clubs(self, obj):
        entries = ClubEntries.objects.filter(profile=obj.id).select_related('club')
        return [ClubsSerializer(entry.club).data for entry in entries]

    def get_dates(self, obj):
        calculator = ProfilesDateCalculator(obj)
        return calculator.calculate()

class ClubsWithDateSerializer(serializers.ModelSerializer):
    dates = serializers.SerializerMethodField()

    class Meta:
        model = Clubs
        fields = '__all__'

    def get_dates(self, obj):
        calculator = ClubsWithDateCalculator(obj)
        return calculator.calculate()


class ClubsSerializer(serializers.ModelSerializer):
    class Meta:
        model = Clubs
        fields = '__all__'


class DatesSerializer(serializers.ModelSerializer):
    class Meta:
        model = Dates
        fields = '__all__'

class ProfileDatesSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProfileDates
        fields = '__all__'
from config.models import ClubEntries, Clubs, Dates, ProfileDates, Profiles
from rest_framework import serializers
from abc import ABC, abstractmethod


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
    week = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat']
    dates = {}

    def __init__(self, obj) -> None:
        super().__init__()
        self.obj = obj

    @property
    def result(self):
        return self.dates

    def calculate(self):
        for pd in ProfileDates.objects \
                    .filter(profile=self.obj.id) \
                    .prefetch_related('date', 'club'):
            date = pd.date
            club = pd.club
            is_temporary_reserved = pd.is_temporary_reserved

            self.append_date(date, club, is_temporary_reserved)

        self.sort_date()

        return self.dates

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
            dates[club]['club'] = club
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
        self.dates = {key: [] for key in self.week}

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

class ProfilesSerializer(serializers.ModelSerializer):
    clubs = serializers.SerializerMethodField()
    dates = serializers.SerializerMethodField()

    class Meta:
        model = Profiles
        fields = '__all__'
    
    def get_clubs(self, obj):
        entries = ClubEntries.objects.filter(profile=obj.id).select_related('club')
        print(entries.query.__str__())
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
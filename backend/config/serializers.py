from logging import error
from config.parse import intersect_time
from config.models import ClubEntries, Clubs, Dates, ProfileDates, Profiles
from config import constants
from rest_framework import serializers
from abc import ABC, abstractmethod
from drf_yasg.utils import swagger_serializer_method

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


class DaySerializer(serializers.Serializer):
    class AvailableTimeSerializer(serializers.Serializer):
        starting_hours = serializers.IntegerField()
        starting_minutes = serializers.IntegerField()

        end_hours = serializers.IntegerField()
        end_minutes = serializers.IntegerField()
    avail_time = serializers.ListField(
        child=AvailableTimeSerializer())
    count = serializers.ListField(child=serializers.IntegerField())
    avail_people = serializers.ListField(
        child=serializers.ListField(child=serializers.CharField()))

# property method등으로 decorator를 처리할 방법이 딱히 보이지 않아 class 외부에 선언해둠.


class ClubType(serializers.Serializer):
    id = serializers.IntegerField()
    name = serializers.CharField()


class DateCalculatorChildType(serializers.Serializer):
    exec(
        '\n'.join([f'{day} = serializers.ListField(child=DaySerializer.AvailableTimeSerializer())' for day in constants.week]))
    club = ClubType()
    is_temporary_reserved = serializers.BooleanField()


class ProfilesDateCalculatorType(serializers.ListField):
    child = DateCalculatorChildType()


class ClubsWithDateCalculatorType(serializers.Serializer):
    exec(
        '\n'.join([f'{day} = serializers.FloatField()' for day in constants.week]))
    is_temporary_reserved = serializers.BooleanField()


class DateCalculator(ABC):
    obj = None
    week = constants.week
    dates = {}

    def __init__(self, obj) -> None:
        super().__init__()
        self.obj = obj

    @ property
    def result(self):
        return self.dates

    # 반드시 @property decorator를 붙여서 override 할 것.
    @ property
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

    @ abstractmethod
    def append_date(self, date, club, is_temporary_reserved):
        pass

    @ abstractmethod
    def sort_date(self):
        pass


class ProfilesDateCalculator(DateCalculator):

    @ property
    def result(self):
        return list(self.dates.values())

    def append_date(self, date, club, is_temporary_reserved):
        dates = self.dates
        week = self.week
        if not dates.get(club):
            dates[club] = {}
            for day in week:
                dates[club][day] = []
            if club is None:
                dates[club]['club'] = None
            else:
                dates[club]['club'] = {}
                dates[club]['club']['id'] = club.id
                dates[club]['club']['name'] = club.name
            dates[club]['is_temporary_reserved'] = is_temporary_reserved
        time = {
            'starting_hours': date.starting_hours,
            'starting_minutes': date.starting_minutes,
            'end_hours': date.end_hours,
            'end_minutes': date.end_minutes,
        }
        dates[club][week[date.day]].append(time)

    def sort_date(self):
        dates = self.dates
        week = self.week
        for club in dates.keys():
            for day in week:
                dates[club][day].sort(key=lambda x: list(x.values()))


class ClubsWithDateCalculator(DateCalculator):
    def __init__(self, obj) -> None:
        super().__init__(obj)
        self.dates = {day: [] for day in self.week}

    @ property
    def filter_expression(self):
        return {'club': self.obj.id}

    def append_date(self, date, club, is_temporary_reserved):
        dates = self.dates
        week = self.week
        dates['is_temporary_reserved'] = is_temporary_reserved
        time = {
            'starting_hours': date.starting_hours,
            'starting_minutes': date.starting_minutes,
            'end_hours': date.end_hours,
            'end_minutes': date.end_minutes,
        }
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

    class InterSectionSerializer(serializers.Serializer):
        exec(
            '\n'.join([f'{day} = DaySerializer()' for day in constants.week]))

    @ swagger_serializer_method(serializer_or_field=InterSectionSerializer)
    def get_intersection(self, obj):
        result = {day: {
            'avail_time': [],
            'count': [],
            'avail_people': []
        } for day in constants.week}

        profile_dates = ProfileDates.objects.filter(
            club=obj.id).select_related('date', 'profile')
        profile_dates = profile_dates.distinct()

        for profile_date in profile_dates:
            date = profile_date.date
            day = constants.week[date.day]

            avail_time = {
                'starting_hours': date.starting_hours,
                'starting_minutes': date.starting_minutes,
                'end_hours': date.end_hours,
                'end_minutes': date.end_minutes,
            }
            profiles = profile_dates.filter(
                date=date.id).values_list('profile__name', flat=True)
            avail_people = sorted(list(profiles))

            starting_time = avail_time['starting_hours'] * \
                60 + avail_time['starting_minutes']
            end_time = avail_time['end_hours'] * \
                60 + avail_time['end_minutes']

            append_results = []

            for intersect_idx, cmp_avail_time in enumerate(result[day]['avail_time']):
                cmp_starting_time = cmp_avail_time['starting_hours'] * \
                    60 + cmp_avail_time['starting_minutes']
                cmp_end_time = cmp_avail_time['end_hours'] * \
                    60 + cmp_avail_time['end_minutes']

                intersection = intersect_time(
                    starting_time, end_time, cmp_starting_time, cmp_end_time)

                if not intersection:
                    continue

                intersection_starting_time, intersection_end_time = intersection
                s = set(
                    result[day]['avail_people'][intersect_idx] + avail_people)

                append_results.append({
                    'index': intersect_idx,
                    'avail_people': sorted(list(s)),
                    'cmp_avail_people': sorted(result[day]['avail_people'][intersect_idx]),
                    'starting_time': intersection_starting_time,
                    'end_time': intersection_end_time
                })

            for append_result in append_results:
                index = append_result['index']

                intersection_avail_people = append_result['avail_people']
                intersection_starting_time = append_result['starting_time']
                intersection_end_time = append_result['end_time']

                starting_time_minutes = avail_time['starting_hours'] * \
                    60 + avail_time['starting_minutes']
                end_time_minutes = avail_time['end_hours'] * \
                    60 + avail_time['end_minutes']

                times = [
                    (min(intersection_starting_time, starting_time_minutes),
                     max(intersection_starting_time, starting_time_minutes)),
                    (min(intersection_starting_time, intersection_end_time),
                     max(intersection_starting_time, intersection_end_time)),
                    (min(intersection_end_time, end_time_minutes),
                     max(intersection_end_time, end_time_minutes)),
                ]

                times = [
                    {'starting_hours': e[0] // 60, 'starting_minutes': e[0] % 60, 'end_hours': e[1] // 60, 'end_minutes': e[1] % 60} for e in times
                ]

                for idx, time in enumerate(times):
                    if time['starting_hours'] * 60 + time['starting_minutes'] >= time['end_hours'] * 60 + time['end_minutes']:
                        continue

                    indices = [idx for idx, t in enumerate(
                        result[day]['avail_time']) if t == time]

                    selected_avail_people = [
                        avail_people, intersection_avail_people, avail_people][idx]

                    if indices:
                        for index in indices:
                            selected_avail_people = sorted(
                                list(set(selected_avail_people + result[day]['avail_people'][index])))

                        result[day]['avail_time'] = [
                            x for idx, x in enumerate(result[day]['avail_time']) if idx not in indices]
                        result[day]['count'] = [
                            x for idx, x in enumerate(result[day]['count']) if idx not in indices]
                        result[day]['avail_people'] = [
                            x for idx, x in enumerate(result[day]['avail_people']) if idx not in indices]

                    result[day]['avail_time'].append(time)
                    result[day]['count'].append(
                        len(selected_avail_people))
                    result[day]['avail_people'].append(
                        selected_avail_people)

            if not append_results:
                result[day]['avail_time'].append(avail_time)
                result[day]['count'].append(len(avail_people))
                result[day]['avail_people'].append(avail_people)

        dict_result = {day: [{'avail_time': avail_time, 'count': count, 'avail_people': avail_people}
                             for avail_time, count, avail_people in zip(result[day]['avail_time'], result[day]['count'], result[day]['avail_people'])] for day in constants.week}

        def unique(lst):
            return [k for j, k in enumerate(lst) if k not in lst[j + 1:]]

        dict_result = {day: sorted(unique(v), key=lambda x: tuple(x['avail_time']))
                       for day, v in dict_result.items()}

        def flatten(t):
            return [item for sublist in t for item in sublist]

        times = flatten([[(day, tuple(e['avail_time'].values()))]
                         for v in dict_result.values() for e in v])

        duplications = set()

        while times != (remove_duplicated
                        := (set(times) - (duplicated
                                          := set([(x[0], (x[1][0], x[1][1], y[1][2], y[1][3])) for x in times for y in times if x[0] == y[0] and x[1][2] == y[1][0] and x[1][3] == y[1][1]])))):
            duplications |= duplicated
            times = remove_duplicated

        result = {day: {
            'avail_time': [],
            'count': [],
            'avail_people': []
        } for day in constants.week}

        for day in dict_result:
            for elem in dict_result[day]:
                if (day, tuple(elem['avail_time'].values())) in duplications:
                    continue
                for k, v in elem.items():
                    result[day][k].append(v)

        return result


class ClubsSerializer(serializers.ModelSerializer):
    class Meta:
        model = Clubs
        fields = '__all__'


class ProfilesSerializer(serializers.ModelSerializer):
    clubs = serializers.SerializerMethodField()
    dates = serializers.SerializerMethodField()
    nickname = serializers.SerializerMethodField()

    class Meta:
        model = Profiles
        fields = '__all__'

    @ swagger_serializer_method(serializer_or_field=ClubsSerializer(many=True))
    def get_clubs(self, obj):
        entries = ClubEntries.objects.filter(
            profile=obj.id).select_related('club')
        return [ClubsSerializer(entry.club).data for entry in entries]

    @ swagger_serializer_method(serializer_or_field=ProfilesDateCalculatorType)
    def get_dates(self, obj):
        calculator = ProfilesDateCalculator(obj)
        return calculator.calculate()

    @ swagger_serializer_method(serializer_or_field=serializers.CharField())
    def get_nickname(self, obj):
        return obj.user.username


class ClubsWithDateSerializer(serializers.ModelSerializer):
    dates = serializers.SerializerMethodField()

    class Meta:
        model = Clubs
        fields = '__all__'

    @ swagger_serializer_method(serializer_or_field=ClubsWithDateCalculatorType)
    def get_dates(self, obj):
        calculator = ClubsWithDateCalculator(obj)
        return calculator.calculate()


class ClubsWithDatePageSerializer(serializers.Serializer):
    count = serializers.IntegerField()
    next = serializers.CharField(allow_null=True)
    previous = serializers.CharField(allow_null=True)
    results = ClubsWithDateSerializer(many=True)


class DatesSerializer(serializers.ModelSerializer):
    class Meta:
        model = Dates
        fields = '__all__'


class ProfileDatesSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProfileDates
        fields = '__all__'


class SuccessSerializer(serializers.Serializer):
    success = serializers.BooleanField()


class ErrorSerializer(serializers.Serializer):
    error = serializers.CharField()


class ShareSerializer(serializers.Serializer):
    uri = serializers.CharField()

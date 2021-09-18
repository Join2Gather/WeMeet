from config.models import ClubEntries, Clubs, Dates, ProfileDates, Profiles
from rest_framework import serializers


class ProfilesSerializer(serializers.ModelSerializer):
    clubs = serializers.SerializerMethodField()
    dates = serializers.SerializerMethodField()

    class Meta:
        model = Profiles
        fields = '__all__'
    
    def get_clubs(self, obj):
        return [ClubsSerializer(entry.club).data for entry in ClubEntries.objects.filter(profile=obj.id)]

    def get_dates(self, obj):
        week = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat']
        dates = {}
        
        for pd in ProfileDates.objects.filter(profile=obj.id):
            date = pd.date
            club = pd.club
            is_temporary_reserved = pd.is_temporary_reserved
            if not dates.get(club):
                dates[club] = {}
                for day in week:
                    dates[club][day] = []
                dates[club]['club'] = club
                dates[club]['is_temporary_reserved'] = is_temporary_reserved
            time = date.hour + date.minute / 100    
            dates[club][week[date.day]].append(time)
        
        for club in dates.keys():
            for day in week:
                dates[club][day].sort()
        
        return list(dates.values())

class ClubsWithDateSerializer(serializers.ModelSerializer):
    dates = serializers.SerializerMethodField()

    class Meta:
        model = Clubs
        fields = '__all__'

    def get_dates(self, obj):
        week = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat']
        dates = {key: [] for key in week}  
        for pd in ProfileDates.objects.filter(club=obj.id):
            date = pd.date
            is_temporary_reserved = pd.is_temporary_reserved
            dates['is_temporary_reserved'] = is_temporary_reserved
            time = date.hour + date.minute / 100    
            dates[week[date.day]].append(time)
        
        for day in week:
            dates[day].sort()
        
        return dates


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
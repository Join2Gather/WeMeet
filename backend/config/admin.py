from django.contrib import admin
from config import models

@admin.register(models.Profiles)
class ProfileAdmin(admin.ModelAdmin):
    pass

@admin.register(models.ProfileDates)
class ProfileDateAdmin(admin.ModelAdmin):
    pass

@admin.register(models.Clubs)
class ClubAdmin(admin.ModelAdmin):
    pass

@admin.register(models.ClubEntries)
class ClubEntryAdmin(admin.ModelAdmin):
    pass

@admin.register(models.Dates)
class DateAdmin(admin.ModelAdmin):
    pass

from django.contrib import admin

# Register your models here.
from . import models


class MovieAdmin(admin.ModelAdmin):
    fields =['release_year','title','length']

    search_fields = ['title','release_year']

    list_filter = ['release_year','length','title']

    list_display = ['title','release_year','length']


class CustomerAdmin(admin.ModelAdmin):
    fields = ['phone','last_name','first_name']

    search_fields = ['last_name','first_name','phone']

admin.site.register(models.Customer,CustomerAdmin)
admin.site.register(models.Movie,MovieAdmin)

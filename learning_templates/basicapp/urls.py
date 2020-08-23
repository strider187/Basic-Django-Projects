from django.conf.urls import url
from basicapp import views

# Template Tagging variable

app_name = 'basic_app'

urlpatterns = [
    url(r'^relative/$', views.relative, name = 'relative'),
    url(r'^other/$', views.other, name = 'other'),

]

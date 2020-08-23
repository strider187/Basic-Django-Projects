from django.conf.urls import url
from AppTwo import views

urlpatterns = [
    url(r'^$', views.help, name = 'help'),
    # url(r'^http://127.0.0.1:8000/users/$',views.users, name = 'users'),
]

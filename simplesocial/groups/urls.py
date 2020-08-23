# from django.conf.urls import url
# from . import views
#
# app_name = 'groups'
#
# urlpatterns = [
#     url(r'^$',views.ListGroup.as_view(),name='all'),
#     url(r'^new/$',views.CreateGroup.as_view(),name='create'),
#     url(r'^post/in/(?P<slug>[-\w]+)/$^',views.SingleGroup.as_view(),name='single'),
#     url(r'^join/(?P<slug>[-\w]+)/$',views.JoinGroup.as_view(),name='join'),
#     url(r'^leave/(?P<slug>[-\w]+)/$',views.LeaveGroup.as_view(),name='leave'),
# ]
from django.conf.urls import url
from django.views.generic.base import RedirectView

from . import views

app_name = 'groups'

urlpatterns = [
    url(r"^$", views.ListGroups.as_view(), name="all"),
    url(r"^new/$", views.CreateGroup.as_view(), name="create"),
    url(r"^posts/in/(?P<slug>[-\w]+)/$",views.SingleGroup.as_view(),name="single"),
    url(r"join/(?P<slug>[-\w]+)/$",views.JoinGroup.as_view(),name="join"),
    url(r"leave/(?P<slug>[-\w]+)/$",views.LeaveGroup.as_view(),name="leave"),
    url(r'^favicon\.ico$',RedirectView.as_view(url='/static/images/favicon.ico', permanent=True)),
]

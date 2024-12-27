
from django.contrib import admin
from django.urls import path
from users import views as userview
from dates import views as eventview
urlpatterns = [
    path('admin/', admin.site.urls),
    path('signup/',userview.signup),
    path('validate/', userview.validate),
    path('login/', userview.login),
    path('addevent/', eventview.addEvent),
    path('searchevents/', eventview.search_events),
    path('logout/',userview.logout),
    path('get_user_events/', eventview.get_user_events),
]

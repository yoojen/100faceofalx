from rest_framework import routers
from .users import views as UserViews
from .user_profile import views as UserProfilesViews 
from .accounts import views as AccountViews


router = routers.DefaultRouter()
router.register(r'users', UserViews.UserViewSet, basename="users")
router.register(r'profiles', UserProfilesViews.UserProfileViewSet, basename="profiles")
router.register(r'acc', AccountViews.AccountViewSet, basename="accounts")
urlpatterns = router.urls

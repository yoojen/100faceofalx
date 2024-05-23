from rest_framework import routers
from api.views import UserViewSet, UserProfileViewSet

router = routers.DefaultRouter()
router.register(r'users', UserViewSet, basename="users")
router.register(r'profiles', UserProfileViewSet, basename="profiles")
urlpatterns = router.urls

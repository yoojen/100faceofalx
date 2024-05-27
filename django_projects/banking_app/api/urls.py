from rest_framework import routers
from .users import views as UserViews
from .user_profile import views as UserProfilesViews 
from .accounts import views as AccountViews
from .transaction import views as TransactionViews


router = routers.DefaultRouter()
router.register(r'users', UserViews.UserViewSet, basename="users")
router.register(r'profiles', UserProfilesViews.UserProfileViewSet, basename="profiles")
router.register(r'accounts', AccountViews.AccountViewSet, basename="accounts")
router.register(r'transactions', TransactionViews.TransactionsViewSet, basename='transactions')
urlpatterns = router.urls

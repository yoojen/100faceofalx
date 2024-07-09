from rest_framework.permissions import BasePermission

class IsOwner(BasePermission):
    """Check if account instance belongs to current user"""

    def has_permission(self, request, view):
        if not request.user.is_authenticated:
            return False
        return super().has_permission(request, view)
    
    def has_object_permission(self, request, view, obj):
        return obj.customer == request.user


class IsManagerOrTeller(BasePermission):
    """Check if current user is chashier or manager"""

    def has_permission(self, request, view):
        if not request.user.is_authenticated:
            return False
        if request.user.type not in ['TELLER', 'MANAGER', 'ADMIN']:
            return False
        return True

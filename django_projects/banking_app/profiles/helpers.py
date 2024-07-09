from django.contrib.auth.mixins import PermissionRequiredMixin, UserPassesTestMixin
from django.shortcuts import redirect, render
from django.contrib import messages

def check_permission(perms: list):
    """Decorator to check against argument user passed permissions"""
    def decorater(view_func):
        def func(request, *args, **kwargs):
            if not request.user.is_authenticated:
                return redirect('profiles:login')
            res = [request.user.has_perm(perm) for perm in perms]
            if all(element == True for element in res):
                return view_func(request, *args, **kwargs)
            else:
                if request.user.type == "TELLER":
                    messages.warning(request, "Can not process that!")
                    return render(request, "transactions/404_error_teller.html")
                if request.user.type == "CUSTOMER":
                    messages.warning(request, "Can not process that!")
                    return render(request, "transactions/404_error_customer.html")
        return func
    return decorater


class TestUserMixin(UserPassesTestMixin):
    def test_func(self):
        if self.request.user.is_authenticated:
            return True
        return False

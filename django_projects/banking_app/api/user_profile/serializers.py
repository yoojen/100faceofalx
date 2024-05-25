from rest_framework import serializers
from profiles.models import Profile, User

class ProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = Profile
        fields = "__all__"

    @staticmethod
    def check_phone_number(telephone):
        user = User.objects.filter(telephone=telephone)
        if user:
            return user
        raise ValueError("No user found")

    def already_exists(self, value):
        user = Profile.objects.filter(customer=value).first()
        if user:
            raise ValueError("Profile already exists")

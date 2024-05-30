from rest_framework import serializers
from profiles.models import Profile, User

class ProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = Profile
        fields = "__all__"



    def validate_telephone(self, value):
        if not value.startswith("+250"):
            raise serializers.ValidationError(
                "Phone number must starts with +250")
        if len(value) != 13:
            raise serializers.ValidationError(
                "Phone number must be equal to 13")
        return value
    
    def validate(self, data):
        telephone = data['telephone']
        customer = data['customer']
        if not customer:
            raise serializers.ValidationError("No user found")
        user_profile = Profile.objects.filter(telephone=telephone).first()
        if user_profile:
            raise serializers.ValidationError("Profile already exists")
        return data


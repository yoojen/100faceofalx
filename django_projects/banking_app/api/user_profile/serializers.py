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
        user = User.objects.filter(telephone=value).first()
        if not user:
            raise serializers.ValidationError("No user found")
    
        return value
    
    def create(self, **validated_data):
        user = User.objects.filter(telephone=validated_data.get('telephone')).first()
        if not user:
            raise serializers.ValidationError("No user found")
        user_profile = Profile.objects.filter(telephone=user.telephone).first()
        if user_profile:
            raise serializers.ValidationError("Profile already exists")
        return Profile.objects.create(**validated_data)


class ProfilePictureSerializer(serializers.ModelSerializer):
    class Meta:
        model = Profile
        fields = ["image"]


class ProfilePartialUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Profile
        fields = "__all__"
        read_only_fields = ["customer", "telephone"]

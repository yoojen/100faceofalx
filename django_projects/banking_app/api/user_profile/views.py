from rest_framework.response import Response
from rest_framework import status
from rest_framework.viewsets import ModelViewSet
from rest_framework.decorators import action
from rest_framework.permissions import BasePermission, IsAdminUser, IsAuthenticated
from api.accounts.helpers import IsManagerOrTeller
from .serializers import (
    ProfilePartialUpdateSerializer, ProfilePictureSerializer, 
    ProfileSerializer,
    )
from profiles.models import Profile, User
from datetime import datetime


class IsOwnerOfProfile(BasePermission):
    def has_object_permission(self, request, view, obj):
        if not request.user.is_authenticated:
            return False
        if request.user != obj.customer:
            return False
        return True
    
    def has_permission(self, request, view):
        if not request.user.is_authenticated:
            return False
        return super().has_permission(request, view)

class UserProfileViewSet(ModelViewSet):
    queryset = Profile.objects.all()
    serializer_class = ProfileSerializer


    def get_permissions(self):
        if self.action in ['create']:
            self.permission_classes = [ IsAdminUser | IsManagerOrTeller]
        if self.action in ['destroy', 'update']:
            self.permission_classes = [IsAdminUser]
        if self.action in ['retrieve', 'list']:
            self.permission_classes = [IsAdminUser | IsManagerOrTeller | IsOwnerOfProfile]
        return [permission() for permission in self.permission_classes]
    
    def get_serializer(self, *args, **kwargs):
        if self.action in ['update']:
            self.serializer_class = ProfilePartialUpdateSerializer
        elif self.action in ['update_profile_picture']:
            self.serializer_class = ProfilePictureSerializer
        else:
            self.serializer_class = ProfileSerializer
        return super().get_serializer(*args, **kwargs)
    
    def get_queryset(self):
        if self.request.user.type == 'CUSTOMER':
            qs = self.queryset.filter(customer=self.request.user).all()
            UserProfileViewSet.queryset = qs
            return self.queryset
        else:
            return self.queryset
    
    def get_object(self):
        obj = super().get_object()
        self.check_object_permissions(self.request, obj)
        return obj
    
    def list(self, request):
        serializer = self.get_serializer(self.queryset, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
    
    def retrieve(self, request, pk=None):
        profile = self.get_object()
        serializer = self.get_serializer(profile)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def create(self, request):
        try:
            data = request.data.copy()
            telephone = data.pop('telephone')
            user = User.objects.filter(telephone=telephone).first()
            if not user:
                raise ValueError("No user found")
            data["customer"] = user.id
            serializer = self.get_serializer(data=data)
            serializer.is_valid(raise_exception=True)
            instance = serializer.save()
            return Response({"id": instance.id, "message": "User Profile created"})
        except Exception as e:
            return Response({"message": str(e)}, status=status.HTTP_400_BAD_REQUEST)

    def update(self, request, pk=None):

        try:
            profile = self.get_object()
            serializer = ProfilePartialUpdateSerializer(
                profile, data=request.data, partial=True)
            serializer.is_valid(raise_exception=True)
            serializer.save()
            return Response({"message": "Updated successfully",
                             "updated_fields": serializer.validated_data},
                            status=status.HTTP_201_CREATED)
        except Exception as e:
            return Response({"errors": str(e)})

    def delete(self, request, pk=None):
        try:
            profile = self.queryset.get(pk=pk)
            profile.delete()
            return Response({"message": "User profile deleted successfully"}, 
                            status=status.HTTP_204_NO_CONTENT)
        except Exception as e:
            return Response({"message": str(e)}, status=status.HTTP_400_BAD_REQUEST)

    @action(detail=True, methods=["POST"], url_path='update-profile-pic', 
            url_name='update_profile_pic', permission_classes=[IsOwnerOfProfile])
    def update_profile_picture(self, request, pk=None):
        try:
            data = request.data
            obj = self.get_object()
            serializer = self.get_serializer(obj, data=data, partial=True)
            serializer.is_valid(raise_exception=True)
            serializer.save()
            return Response({"message": "Profile picture updated successfully"}, 
                            status=status.HTTP_201_CREATED)
        except Exception as e:
            return Response({"errors": str(e), "message": "Something went wrong"}, 
                            status=status.HTTP_400_BAD_REQUEST)

    @action(detail=False, methods=["GET"], url_path='user-birth',url_name='user_birth',
            permission_classes=[IsAdminUser | IsManagerOrTeller])
    def user_birth(self, request):
        """Return user based on year of birth"""
        for k in request.query_params.keys():
            if not request.query_params.get('dob') or k not in ['dob']:
                return Response({"errors": "Please provide query"}, status=status.HTTP_400_BAD_REQUEST)
        try:
            dob = request.query_params.get('dob')
            profiles = self.queryset.filter(dob__year=dob).all()
            serializer = self.get_serializer(profiles, many=True)

            return Response(serializer.data, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({"errors": str(e), "message": "Something went wrong"}, 
                            status=status.HTTP_400_BAD_REQUEST)

    @action(detail=False, methods=['GET'], url_path='age-gt', url_name='age_gt',
            permission_classes=[IsAdminUser | IsManagerOrTeller])
    def user_age_gt(self, request):
        """Select users with age gt requested age"""
        try:
            dob = request.query_params.get('dob')
            profiles = self.queryset.filter(dob__year__gt=dob)
            serializer = self.get_serializer(profiles, many=True)
            return Response(serializer.data, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({"errors": str(e)}, status=status.HTTP_400_BAD_REQUEST)

    @action(detail=False, methods=['GET'], url_path="age-lt", url_name="age_lt",
            permission_classes=[IsAdminUser | IsManagerOrTeller])
    def user_age_lt(self, request):
        """Select users with age lt requested age"""
        try:
            dob = request.query_params.get('dob')
            profiles = self.queryset.filter(dob__year__lt=dob)
            serializer = self.get_serializer(profiles, many=True)
            return Response(serializer.data, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({"errors": str(e)}, status=status.HTTP_400_BAD_REQUEST)

    @action(detail=False, methods=['GET'], url_path='user-location', url_name='user_location',
            permission_classes=[IsAdminUser | IsManagerOrTeller])
    def user_provice_district(self, request):
        """Select users with age lt requested age"""
        try:
            province = request.query_params.get(
                'province') if request.query_params.get('province') else ''
            district = request.query_params.get(
                'district') if request.query_params.get('district') else ''
            if province and district:
                data = {
                    "province": province,
                    "district": district,
                }
            elif province and not district:
                data = {"province": province}
            else:
                data = {"district": district}

            profiles = self.queryset.filter(**data).all()
            serializer = self.get_serializer(profiles, many=True)
            return Response(serializer.data, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({"errors": str(e)}, status=status.HTTP_400_BAD_REQUEST)

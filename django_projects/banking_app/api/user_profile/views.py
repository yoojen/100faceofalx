from rest_framework.response import Response
from rest_framework import status
from rest_framework.viewsets import ModelViewSet
from rest_framework.decorators import action
from rest_framework.permissions import IsAdminUser, IsAuthenticated, BasePermission
from api.accounts.helpers import IsManagerOrTeller
from .serializers import (
    ProfilePartialUpdateSerializer, ProfilePictureSerializer, 
    ProfileSerializer,
    )
from profiles.models import Profile, User
from django.shortcuts import get_object_or_404
from datetime import datetime


class IsOwnerOfProfile(BasePermission):
    def has_permission(self, request, view):
        try:
            obj = view.get_object()
            if obj != request.user:
                return False
        except Exception:
            return False
        return True
    
    def has_object_permission(self, request, view, obj):
        if not request.user.is_authenticated:
            return False
        if request.user != obj.customer:
            return False
        return True

class UserProfileViewSet(ModelViewSet):
    queryset = None
    serializer_class = ProfileSerializer

    def get_queryset(self):
        queryset = Profile.objects.all()
        try:
            if self.request.user.type == 'CUSTOMER':
                UserProfileViewSet.queryset = queryset.filter(
                    customer=self.request.user).all()
                queryset = UserProfileViewSet.queryset
            UserProfileViewSet.queryset = queryset
            return queryset
        except Exception as e:
            return Response({"errors": str(e), "message": "Something went wrong"},
                            status=status.HTTP_400_BAD_REQUEST)
    
    def get_object(self):
        obj = super().get_object()
        self.check_object_permissions(self.request, obj)
        return obj
    
    def get_permissions(self):
        if self.action in ['create']:
            self.permission_classes = [IsAdminUser | IsManagerOrTeller]
        elif self.action in ['destroy', 'update']:
            self.permission_classes = [IsAdminUser]
        elif self.action in ['retrieve', 'list']:
            self.permission_classes = [IsAdminUser | IsManagerOrTeller | IsOwnerOfProfile]
        elif self.action in ['update_profile_picture']:
            self.permission_classes = [IsOwnerOfProfile]
        else:
            self.permission_classes = [IsAdminUser | IsManagerOrTeller]

        return [permission() for permission in self.permission_classes]
    
    def list(self, request):
        serializer = ProfileSerializer(self.queryset, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def create(self, request):
        try:
            data = request.data.copy()
            telephone = data.get('telephone')
            user = User.objects.filter(telephone=telephone).first()
            if not user:
                raise ValueError("No user found")
            data["customer"] = user.id
            serializer = ProfileSerializer(data=data)
            serializer.is_valid(raise_exception=True)
            instance = serializer.save()
            return Response({"user": instance.id, "message": "User Profile created"})
        except Exception as e:
            return Response({"message": str(e)}, status=status.HTTP_400_BAD_REQUEST)

    def retrieve(self, request, pk=None):
        profile = self.get_object()
        serializer = ProfileSerializer(profile)
        return Response(serializer.data, status=status.HTTP_200_OK)

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

    @action(detail=True, methods=["POST"], url_path='update-profile-pic', url_name='update_profile_pic')
    def update_profile_picture(request, pk=None):
        try:
            data = request.data
            serializer = ProfilePictureSerializer(data=data)
            serializer.is_valid(raise_exception=True)
        except Exception as e:
            return Response({"errors": str(e), "message": "Something went wrong"})
        return Response(serializer.data, status=status.HTTP_201_CREATED)

    @action(detail=False, methods=["GET"])
    def user_birth(self, request):
        """Return user based on year of birth"""
        for k in request.query_params.keys():
            print(request.query_params.keys())
            if not request.query_params.get('dob') or k not in ['dob']:
                return Response({"errors": "Please provide query"}, status=status.HTTP_400_BAD_REQUEST)
        try:
            dob = request.query_params.get('dob')
            profiles = self.queryset.filter(dob=datetime.strptime(
                dob, "%Y-%m-%d")).all()
            serializer = ProfileSerializer(profiles, many=True)

            return Response(serializer.data, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({"errors": str(e), "message": "Something went wrong"}, 
                            status=status.HTTP_400_BAD_REQUEST)

    @action(detail=False, methods=['GET'])
    def user_age_gt(self, request):
        """Select users with age gt requested age"""
        try:
            profiles = self.queryset.filter(dob__gt=datetime.strptime(
                                            request.query_params.get('dob'), "%Y-%m-%d"))
            serializer = ProfileSerializer(profiles, many=True)
            return Response(serializer.data, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({"errors": str(e)}, status=status.HTTP_400_BAD_REQUEST)

    @action(detail=False, methods=['GET'])
    def user_age_lt(self, request):
        """Select users with age lt requested age"""
        try:
            profiles = self.queryset.filter(dob__lt=datetime.strptime(
                                            request.query_params.get('dob'), "%Y-%m-%d"))
            serializer = ProfileSerializer(profiles, many=True)
            return Response(serializer.data, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({"errors": str(e)}, status=status.HTTP_400_BAD_REQUEST)

    @action(detail=False, methods=['GET'])
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
            serializer = ProfileSerializer(profiles, many=True)
            return Response(serializer.data, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({"errors": str(e)}, status=status.HTTP_400_BAD_REQUEST)

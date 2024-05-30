from rest_framework.response import Response
from rest_framework import status
from rest_framework.viewsets import ViewSet
from rest_framework.decorators import action
from .serializers import ProfileSerializer
from profiles.models import Profile, User
from django.shortcuts import get_object_or_404
from datetime import datetime

class UserProfileViewSet(ViewSet):
    queryset = Profile.objects.all()
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
        profile = get_object_or_404(self.queryset, pk=pk)
        serializer = ProfileSerializer(profile)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def update(self, request, pk=None):

        try:
            profile = self.queryset.get(pk=pk)
            serializer = ProfileSerializer(
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

    @action(detail=False, methods=["GET"])
    def user_birth(self, request):
        """Return user based on year of birth"""
        print(request.query_params.keys())
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

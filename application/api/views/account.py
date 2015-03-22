from django.contrib.auth import authenticate, login, logout

from django.contrib.auth.models import User
from api.models import UserProfile, Restaurant
from api.serializers import ProfileSerializer, UserSerializer

from django.views.decorators.csrf import ensure_csrf_cookie

from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status

from django.http import HttpResponse
import json


@ensure_csrf_cookie
@api_view(['GET','POST','PUT','DELETE'])
def profile(request, pk=None):

    if pk:
        if pk == 'self':
            user = User.objects.get(pk=request.user.pk)
        else:
            user = User.objects.get(pk=pk)
        profile = UserProfile.objects.get(user=user)

    if request.method == 'GET':

        # returns a single profile
        if pk:
            output = ProfileSerializer(profile)

        # returns profiles that are restaurateur
        elif 'restaurateur' in request.GET:
            profiles = UserProfile.objects.filter(is_restaurateur=True)
            output = ProfileSerializer(profiles, many=True)

        # returns all profiles
        else:
            profiles = UserProfile.objects.all()
            output = ProfileSerializer(profiles, many=True)

        return Response(output.data)

    elif request.method == 'POST':

        # creates a profile
        request.data['user']['username'] = request.data['user']['email']
        request.data['adresse'] = [request.data['adresse']]
        profile = ProfileSerializer(data=request.data)
        if profile.is_valid():
            profile.save()
            return Response(profile.data,
                            status=status.HTTP_201_CREATED)
        return Response(profile.errors,
                        status=status.HTTP_400_BAD_REQUEST)

    elif request.method == 'PUT':
        userdata = request.data.pop('user')
        user = User.objects.get(pk=request.user.pk)
        user = UserSerializer(user, data=userdata)
        if user.is_valid():
            user.save()
            profile = UserProfile.objects.get(user=user.data['pk'])
            profile = ProfileSerializer(profile, data=request.data, partial=True)
            if profile.is_valid():
                profile.save()
                return Response(user.data)

        return Response(user.errors, status=status.HTTP_400_BAD_REQUEST)

    elif request.method == 'DELETE':

        # deletes a profile
        profile.delete()
        user.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)


def user_login(request):

    # this is the login request
    if request.method == 'POST':
        info = json.loads(request.body)
        user = authenticate(username=info['username'],
                            password=info['password'])
        if user:
            login(request, user)
            profile = UserProfile.objects.get(user=user)
            profile = ProfileSerializer(profile)
            return HttpResponse(json.dumps({'success':True,
                                            'profile': profile.data}))

        else:
            return HttpResponse(json.dumps({'success':False,
                                            'reason': 'fail'}))

    else:
        return HttpResponse(json.dumps({'success':False}))

def user_logout(request):

    # this is the logout request
    logout(request)
    return HttpResponse(json.dumps({'success':True}))

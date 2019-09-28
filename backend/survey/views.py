from django.http import HttpResponse, HttpResponseBadRequest, JsonResponse
import json
from pudb import set_trace

# from rest_framework import viewsets
from rest_framework.response import Response
from rest_framework.status import (
    HTTP_201_CREATED,
    HTTP_400_BAD_REQUEST
)

from rest_framework.generics import (
    ListAPIView,
)


from rest_framework import viewsets, mixins
from survey.serializers import (
    SurveySerializer,
    AnswerSerializer,
    StatisticSerializer
)
from survey.serializers import UserSerializer
from .models import Survey, Answer
import io
from rest_framework import authentication, permissions
from rest_framework.views import APIView
from rest_framework import generics
from django.contrib.auth.models import User
from rest_framework.parsers import JSONParser
from django.utils import translation


class StatisticViewSet(mixins.RetrieveModelMixin, mixins.ListModelMixin, viewsets.GenericViewSet):
    serializer_class = StatisticSerializer
    queryset = Survey.objects.all()
    lookup_field = 'uuid'

    def retrieve(self, request, *args, **kwargs):
        instance = self.get_object()
        translation.activate(instance.lang)
        return super().retrieve(request, *args, **kwargs)


# class StatisticViewSet(viewsets.ModelViewSet):

#     serializer_class = StatisticSerializer
#     queryset = Survey.objects.all()
#     lookup_field = 'uuid'


class SurveyViewSet(viewsets.ModelViewSet):
    serializer_class = SurveySerializer
    queryset = Survey.objects.all()
    lookup_field = 'uuid'

    def __init__(self, *args, **kwargs):
        pass

    def handle_update_user_answer(self, mydata, instance):
        # set_trace()  # This is put to debug.

        real_answer = json.loads(instance.realAnswers)

        total_corrected_answer = self.get_total_corrected_answer(real_answer,
                                                                 mydata['answers'])

        if total_corrected_answer < 0:
            raise HttpResponseBadRequest("Your incomming data was not correct")

        valid_json_user_answer = json.dumps(
            mydata['answers'])  # Convert to a valid json

        my_data = {'answer_set': {
            'name': mydata['name'], 'total_correct': total_corrected_answer,
            'answers': valid_json_user_answer}}

        # my_data = {'name': 'mohsen'}

        survey_serializer = self.get_serializer(instance,
                                                data=my_data, partial=True)

        if survey_serializer.is_valid(raise_exception=True):
            self.perform_update(survey_serializer)
        else:
            raise HttpResponseBadRequest("Your incomming data was not correct")

    def handle_update_real_answer(self, data, instance):
        # set_trace()  # This is put to debug.

        valid_json_real_answer = json.dumps(
            data['realAnswers'])  # Convert to a valid json
        survey_serializer = self.get_serializer(
            instance, data={'realAnswers': valid_json_real_answer}, partial=True)
        validated = survey_serializer.is_valid(raise_exception=True)
        self.perform_update(survey_serializer)
        if getattr(instance, '_prefetched_objects_cache', None):
            # If 'prefetch_related' has been applied to a queryset, we need to
            # forcibly invalidate the prefetch cache on the instance.
            instance._prefetched_objects_cache = {}

        return Response(survey_serializer.data)

    def create(self, request, *args, **kwargs):
        # set_trace()  # This is put to debug.
        all_data = request.data
        translation.activate(all_data['lang'])
        serializer = self.get_serializer(data=all_data)
        aa = serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        headers = self.get_success_headers(serializer.data)
        return Response(serializer.data, status=HTTP_201_CREATED, headers=headers)

    def get_total_corrected_answer(self, real_answers, answers):
        real_answers.sort(key=lambda x: x['questionIndex'])
        answers.sort(key=lambda x: x['questionIndex'])

        if len(real_answers) != len(answers):
            return -1

        total_question = len(real_answers)  # Calculate total answers
        total_correct_answer = 0

        for question in range(0, total_question):
            if real_answers[question]['choice'] == answers[question]['choice']:
                total_correct_answer += 1
                answers[question]['correct'] = True
            else:
                answers[question]['correct'] = False

        return total_correct_answer

    def retrieve(self, request, *args, **kwargs):
        instance = self.get_object()
        translation.activate(instance.lang)

        serializer = self.get_serializer(instance)
        return Response(serializer.data)

    def update(self, request, *args, **kwargs):
        # set_trace()  # This is put to debug.

        data = request.data

        # Get original instance of model. here is Survey modelf
        instance = self.get_object()
        translation.activate(instance.lang)

        if 'answers' in data.keys():
            self.handle_update_user_answer(data, instance)
        elif 'realAnswers'in data.keys():
            self.handle_update_real_answer(data, instance)
        else:
            raise HttpResponseBadRequest("Your incomming data was not correct")

        # if not serializer.is_valid():
        #     print(serializer.errors)
        # print("salam")
        # self.perform_update(serializer)

        # if getattr(instance, '_prefetched_objects_cache', None):
        #     # If 'prefetch_related' has been applied to a queryset, we need to
        #     # forcibly invalidate the prefetch cache on the instance.
        #     instance._prefetched_objects_cache = {}

        return JsonResponse({'message': "Thank you for attending to my survey"}, status=200)
        # random_questions = self.random(5)

        # survey = Survey.objects.create(name=request['name'])

        # for item in random_questions:
        #     survey.questions.add(item)

        # return survey

    # def list(self, request):
    #     pass

    # def retrieve(self, request, pk=None):
    #     pass

    # def update(self, request, pk=None):
    #     pass

    # def partial_update(self, request, pk=None):
    #     pass

    # def destroy(self, request, pk=None):
    #     pass

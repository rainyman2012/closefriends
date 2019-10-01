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
    QuestionSerializer,
    StatisticSerializer
)
from survey.serializers import UserSerializer
from .models import Survey, Answer, Question
import io
from rest_framework import authentication, permissions
from rest_framework.views import APIView
from rest_framework import generics
from django.contrib.auth.models import User
from rest_framework.parsers import JSONParser
from rest_framework.renderers import JSONRenderer
from django.utils import translation
from django.views import View
from django.views.decorators.csrf import csrf_exempt
from django.utils.decorators import method_decorator
from django.middleware.csrf import get_token
from django.db.models import Q
import random


class QuestionListView(generics.ListAPIView):
    serializer_class = QuestionSerializer

    def get_queryset(self):
        return Question.objects.all()

    def get(self, request, *args, **kwargs):
        numberOfPicBaseQuestions = 11
        numberOfPicBaseQuestions = 4

        sex = kwargs.get('sex', '')
        lang = kwargs.get('lang', '')
        translation.activate(lang)

        id_list = Question.objects.filter(
            Q(sex__exact=sex) | Q(sex__isnull=True)).values_list('id', flat=True).order_by('id')

        cat1 = list(id_list)[0:17]
        cat2 = list(id_list)[17:]

        random_cat1_list = random.sample(
            list(cat1), k=min(len(cat1), numberOfPicBaseQuestions))
        random_cat2_list = random.sample(
            list(cat2), k=min(len(cat2), numberOfPicBaseQuestions))
        final_random_list = random_cat1_list + random_cat2_list
        query_set = Question.objects.filter(
            id__in=final_random_list)

        # random_list = random.sample(
        #     list(id_list), k=min(len(id_list), 1))

        # query_set = Question.objects.filter(
        #     id__in=random_list)

        # Get serilizer to serilize customize questy set
        serializer = self.get_serializer(query_set, many=True)
        return Response(serializer.data)


class VerifiedPasswordView(View):

    @method_decorator(csrf_exempt)
    def dispatch(self, *args, **kwargs):
        return super(VerifiedPasswordView, self).dispatch(*args, **kwargs)

    def post(self, request, *args, **kwargs):
        stream = io.BytesIO(request.body)
        data = JSONParser().parse(stream)
        verified = False
        if data['password'] and data['uuid']:
            verified = Survey.objects.verify_password(
                data['password'], data['uuid'])
        json = JSONRenderer().render(verified)

        return HttpResponse(json)


class StatisticViewSet(mixins.RetrieveModelMixin, mixins.ListModelMixin, viewsets.GenericViewSet):
    serializer_class = StatisticSerializer
    queryset = Survey.objects.all()
    lookup_field = 'uuid'

    def retrieve(self, request, *args, **kwargs):
        instance = self.get_object()
        translation.activate(instance.lang)
        return super().retrieve(request, *args, **kwargs)


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
        realAnswers = all_data.pop('realAnswers')
        questions = all_data.pop('questions')

        ttt = [d['id'] for d in questions]
        queryset = Question.objects.filter(id__in=ttt)

        translation.activate(all_data['lang'])
        serializer = self.get_serializer(data=all_data)
        aa = serializer.is_valid()
        instance = serializer.save()
        instance.questions.set(queryset)
        instance.realAnswers = json.dumps(realAnswers)
        instance.save()
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
            answers[question]['realAns'] = real_answers[question]['choice']

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

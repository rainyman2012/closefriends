from django.utils.translation import ugettext_lazy as _
from rest_framework import serializers
from .models import Question, Choice, Survey, Answer
from django.db.models import Count
from django.contrib.auth.models import User
from rest_framework.utils import html, model_meta, representation
from pudb import set_trace

try:
    import json
except ImportError:
    from django.utils import simplejson as json

try:
    from django.forms.utils import ValidationError
except ImportError:
    from django.forms.util import ValidationError
from django.db.models import Q


class ChoiceSerializer(serializers.ModelSerializer):
    class Meta:
        model = Choice
        fields = ('__all__')


class QuestionSerializer(serializers.ModelSerializer):
    choices = serializers.SerializerMethodField()

    class Meta:
        model = Question
        fields = ('choices', 'name', 'ask', 'sex')

    def get_choices(self, obj):
        queryset = obj.choice_set.all()
        serializer = ChoiceSerializer(queryset, many=True)
        return serializer.data


class AnswerSerializer(serializers.ModelSerializer):

    class Meta:
        model = Answer
        fields = ('name', 'total_correct', 'answers', 'correct_percentage')

    def update(self, instance, validated_data):
        raise_errors_on_nested_writes('update', self, validated_data)
        info = model_meta.get_field_info(instance)

        # Simply set each attribute on the instance, and then save it.
        # Note that unlike `.create()` we don't need to treat many-to-many
        # relationships as being a special case. During updates we already
        # have an instance pk for the relationships to be associated with.
        m2m_fields = []
        for attr, value in validated_data.items():
            if attr in info.relations and info.relations[attr].to_many:
                m2m_fields.append((attr, value))
            else:
                setattr(instance, attr, value)

        instance.save()

        # Note that many-to-many fields are set after updating instance.
        # Setting m2m fields triggers signals which could potentially change
        # updated instance and we do not want it to collide with .update()
        for attr, value in m2m_fields:
            field = getattr(instance, attr)
            field.set(value)

        return instance

    def validate_answers(self, value):
        if value:
            try:
                temp = json.loads(value)
            except ValueError as e:
                raise ValidationError(_("Enter valid JSON: ") + str(e))
        return value


class StatisticSerializer(serializers.ModelSerializer):
    answers = serializers.SerializerMethodField()
    participant_count = serializers.SerializerMethodField()
    total_questions = serializers.SerializerMethodField()
    questions = serializers.SerializerMethodField()

    class Meta:
        model = Survey
        fields = ('name', 'uuid', 'questions', 'answers',
                  'participant_count', 'total_questions')

    def get_answers(self, obj):
        queryset = obj.answer_set.all()
        serializer = AnswerSerializer(queryset, many=True)
        return serializer.data

    def get_participant_count(self, obj):
        return obj.answer_set.count()

    def get_total_questions(self, obj):
        return obj.questions.filter(Q(sex__exact=obj.sex) | Q(sex__isnull=True)).count()

    def get_questions(self, obj):
        queryset = Question.objects.filter(
            Q(sex__exact=obj.sex) | Q(sex__isnull=True))
        questions = QuestionSerializer(queryset, many=True, read_only=True)
        return questions.data


class SurveySerializer(serializers.ModelSerializer):
    questions = serializers.SerializerMethodField()

    answer_set = AnswerSerializer(write_only=True, required=False)

    class Meta:
        model = Survey
        fields = ('answer_set', 'questions', 'name',
                  'uuid', 'realAnswers', 'lang', 'sex')
        depth = 2  # we can set this to get all realation
        extra_kwargs = {
            'realAnswers': {'write_only': True},
        }

    def get_questions(self, obj):
        queryset = Question.objects.filter(
            Q(sex__exact=obj.sex) | Q(sex__isnull=True))
        questions = QuestionSerializer(queryset, many=True, read_only=True)
        return questions.data

    # Default `create` and `update` behavior...

    def create(self, validated_data):
        """
        We have a bit of extra checking around this in order to provide
        descriptive messages when something goes wrong, but this method is
        essentially just:

            return ExampleModel.objects.create(**validated_data)

        If there are many to many fields present on the instance then they
        cannot be set until the model is instantiated, in which case the
        implementation is like so:

            example_relationship = validated_data.pop('example_relationship')
            instance = ExampleModel.objects.create(**validated_data)
            instance.example_relationship = example_relationship
            return instance

        The default implementation also does not handle nested relationships.
        If you want to support writable nested relationships you'll need
        to write an explicit `.create()` method.
        """

        ModelClass = self.Meta.model

        # Remove many-to-many relationships from validated_data.
        # They are not valid arguments to the default `.create()` method,
        # as they require that the instance has already been saved.
        info = model_meta.get_field_info(ModelClass)
        many_to_many = {}
        for field_name, relation_info in info.relations.items():
            if relation_info.to_many and (field_name in validated_data):
                many_to_many[field_name] = validated_data.pop(field_name)

        try:
            instance = ModelClass._default_manager.create(**validated_data)
        except TypeError:
            tb = traceback.format_exc()
            msg = (
                'Got a `TypeError` when calling `%s.%s.create()`. '
                'This may be because you have a writable field on the '
                'serializer class that is not a valid argument to '
                '`%s.%s.create()`. You may need to make the field '
                'read-only, or override the %s.create() method to handle '
                'this correctly.\nOriginal exception was:\n %s' %
                (
                    ModelClass.__name__,
                    ModelClass._default_manager.name,
                    ModelClass.__name__,
                    ModelClass._default_manager.name,
                    self.__class__.__name__,
                    tb
                )
            )
            raise TypeError(msg)

        # Save many-to-many relationships after the instance is created.
        if many_to_many:
            for field_name, value in many_to_many.items():
                field = getattr(instance, field_name)
                field.set(value)

        return instance

    def update(self, instance, validated_data):
        answer_set_data = None

        if 'answer_set' in validated_data.keys():
            answer_set_data = validated_data.pop('answer_set')
        # set_trace()  # This is put to debug.

        info = model_meta.get_field_info(instance)
        # set_trace()  # This is put to debug.
        # Simply set each attribute on the instance, and then save it.
        # Note that unlike `.create()` we don't need to treat many-to-many
        # relationships as being a special case. During updates we already
        # have an instance pk for the relationships to be associated with.
        for attr, value in validated_data.items():
            if attr in info.relations and info.relations[attr].to_many:
                field = getattr(instance, attr)
                field.set(value)
            else:
                setattr(instance, attr, value)

        instance.save()

        if answer_set_data:
            user_answer = Answer(
                name=answer_set_data['name'], answers=answer_set_data['answers'], total_correct=answer_set_data['total_correct'])
            user_answer.save()

            instance.answer_set.add(user_answer)

        return instance


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['username', 'email']

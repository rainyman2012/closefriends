from django.db import models
from jsonfield import JSONField
import uuid
import base64
from PIL import Image

from django.db.models import Q
from django.db.models.signals import pre_save
from passlib.hash import pbkdf2_sha256


def generate_uuid():
    _uuid = base64.urlsafe_b64encode(uuid.uuid4().bytes)
    _uuid = _uuid.decode('utf-8').replace('=', '')
    return _uuid


class Target (models.Model):
    name = models.CharField(max_length=200, blank=True, null=True)

    def __str__(self):
        return self.name


class Question(models.Model):
    name = models.CharField(max_length=200, blank=True, null=True)
    ask = models.CharField(max_length=200, blank=True, null=True)
    sex = models.CharField(max_length=50, blank=True, null=True)
    target = models.ManyToManyField(Target)
    point = models.PositiveSmallIntegerField(blank=True, null=True)
    analyze = JSONField(null=True)

    def __str__(self):
        if self.name_en:
            return self.name_en
        else:
            return "--"


class Choice(models.Model):
    image = models.ImageField(
        upload_to="choices/", height_field=None, width_field=None, max_length=None)
    name = models.CharField(max_length=200, blank=True, null=True)

    question = models.ForeignKey(
        Question, blank=True, null=True, on_delete=models.CASCADE)

    def save(self, *args, **kwargs):
        super().save(*args, **kwargs)
        try:
            img = Image.open(self.image.path)
            if img.height > 300 or img.width > 300:
                output_size = (300, 400)
                img.thumbnail(output_size)
                img.save(self.image.path)
        except:
            pass

    def delete(self, *args, **kwargs):
        self.image.delete()
        super().delete(*args, **kwargs)

    def __str__(self):
        if self.name:
            return self.name
        elif self.image:
            return self.image.name.rsplit('/', 1)[-1]
        else:
            return "--"

    @property
    def imagename(self):
        img_name = self.image.name.rsplit('/', 1)[-1]
        return img_name


class AnswerManager(models.Manager):

    def get_all_answers(self):
        return "Ehsan"


class SurveyManager(models.Manager):

    def create(self, **kwargs):
        obj = super().create(**kwargs)
        obj.password = pbkdf2_sha256.encrypt(
            obj.password, rounds=12000, salt_size=32)
        obj.save()
        return obj

    def get_random_questions(self, num, obj):
        import random
        id_list = Question.objects.filter(
            Q(sex__exact=obj.sex) | Q(sex__isnull=True)).values_list('id', flat=True).order_by('id')
        cat1 = list(id_list)[0:17]
        cat2 = list(id_list)[17:]
        random_cat1_list = random.sample(
            list(cat1), k=min(len(cat1), 11))
        random_cat2_list = random.sample(
            list(cat2), k=min(len(cat2), 4))
        final_random_list = random_cat1_list + random_cat2_list
        query_set = Question.objects.filter(
            id__in=final_random_list)
        return query_set

    def get_model_fields(self):
        return self.model._meta.fields

    def get_questions(self, _uuid):
        return self.filter(uuid__exact=_uuid).first()

    def verify_password(self, password, uuid):
        obj = self.filter(uuid__iexact=uuid).first()
        if obj:
            return pbkdf2_sha256.verify(password, obj.password)
        return False


class Survey(models.Model):
    name = models.CharField(max_length=80)
    questions = models.ManyToManyField(Question)
    realAnswers = JSONField(null=True)
    uuid = models.CharField(max_length=32, blank=True,
                            null=True, default=generate_uuid)
    lang = models.CharField(max_length=10, default="fa")
    password = models.CharField(max_length=256, default="1234")

    sex = models.CharField(max_length=50, blank=True, null=True)

    objects = SurveyManager()

    @property
    def question_count(slef):
        return slef.questions.all().count()

    def __str__(self):
        return self.name


class Answer(models.Model):
    name = models.CharField(max_length=80)
    total_correct = models.IntegerField(null=True)
    free = models.BooleanField(default=False)
    answers = JSONField(null=True)
    survey = models.ForeignKey(
        Survey, blank=True, null=True, on_delete=models.CASCADE)

    objects = AnswerManager()

    @property
    def correct_percentage(self):
        percentage = int(self.total_correct) / \
            int(self.survey.question_count) * 100
        return '{percentage}'.format(percentage=percentage)

    def __str__(self):
        return self.name


# # ================================SIGNALES==========================================

# def encrypt_password(sender, **kwargs):
#     obj = kwargs['instance']
#     try:
#         if obj.questions:
#             obj.password = pbkdf2_sha256.encrypt(
#                 obj.password, rounds=12000, salt_size=32)
#     except:
#         pass


# pre_save.connect(encrypt_password, sender=Survey)

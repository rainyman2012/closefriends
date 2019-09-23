from modeltranslation.translator import translator, TranslationOptions
from survey.models import Question, Target


class QuestionTranslationOptions(TranslationOptions):
    fields = ('name', 'ask')


class TargetTranslationOptions(TranslationOptions):
    fields = ('name',)


translator.register(Question, QuestionTranslationOptions)
translator.register(Target, TargetTranslationOptions)
# You must run command below after adding aditional field to fields:
# python manage.py sync_translation_fields
# python manage.py makemigrations
# python manage.py migrate

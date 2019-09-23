from django.contrib import admin

from .models import Choice, Question, Survey, Answer, Target
from modeltranslation.admin import TranslationAdmin
from multiupload.admin import MultiUploadAdmin

from django.shortcuts import get_object_or_404


# Register your models here.


class ChoiceInlineAdmin(admin.TabularInline):
    model = Choice


class QuestionMultiuploadMixing(object):

    def process_uploaded_file(self, uploaded, question, request):
        if question:
            choice = question.choice_set.create(file=uploaded)
        else:
            choice = Choice.objects.create(file=uploaded, question=None)
        return {
            'url': choice.image.url,
            'thumbnail_url': choice.image.url,
            'id': choice.id,
            'name': choice.filename
        }


class QuestionAdmin(QuestionMultiuploadMixing, MultiUploadAdmin, TranslationAdmin):
    inlines = [ChoiceInlineAdmin, ]
    multiupload_form = True
    multiupload_list = False

    def delete_file(self, pk, request):
        '''
        Delete an image.
        '''
        obj = get_object_or_404(Choice, pk=pk)
        return obj.delete()


class ChoiceAdmin(QuestionMultiuploadMixing, MultiUploadAdmin):
    multiupload_form = False
    multiupload_list = True
    multiupload_limitconcurrentuploads = 6


class TargetAdmin(TranslationAdmin):
    pass


admin.site.register(Question, QuestionAdmin)
admin.site.register(Choice, ChoiceAdmin)
admin.site.register(Target, TargetAdmin)

admin.site.register(Survey)
admin.site.register(Answer)

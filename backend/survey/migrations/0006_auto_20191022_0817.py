# Generated by Django 2.2.3 on 2019-10-22 08:17

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('survey', '0005_auto_20191022_0815'),
    ]

    operations = [
        migrations.AlterModelOptions(
            name='survey',
            options={'permissions': [('create_general_survey', 'Can add, edit, delete, update a general survey'), ('create_marriage_survey', 'Can add, edit, delete, update a marriage survey'), ('can_see_analyze_survey', 'Can see analyze survey')]},
        ),
    ]

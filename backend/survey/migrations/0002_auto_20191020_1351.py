# Generated by Django 2.2.3 on 2019-10-20 13:51

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('survey', '0001_initial'),
    ]

    operations = [
        migrations.AlterModelOptions(
            name='survey',
            options={'permissions': [('create_general_survey', 'Can add, edit, delete, update a general survey'), ('create_marriage_survey', 'Can add, edit, delete, update a marriage survey')]},
        ),
    ]
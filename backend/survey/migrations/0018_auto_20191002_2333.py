# Generated by Django 2.2.3 on 2019-10-02 23:33

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('survey', '0017_auto_20191002_2323'),
    ]

    operations = [
        migrations.AlterField(
            model_name='general',
            name='like',
            field=models.PositiveIntegerField(default=0),
        ),
    ]
# Generated by Django 2.2.1 on 2020-07-29 10:49

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('videos', '0001_initial'),
    ]

    operations = [
        migrations.RenameField(
            model_name='customer',
            old_name='firsr_name',
            new_name='first_name',
        ),
    ]

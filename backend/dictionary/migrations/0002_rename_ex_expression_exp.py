# Generated by Django 5.1.3 on 2024-11-28 18:50

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('dictionary', '0001_initial'),
    ]

    operations = [
        migrations.RenameField(
            model_name='expression',
            old_name='ex',
            new_name='exp',
        ),
    ]

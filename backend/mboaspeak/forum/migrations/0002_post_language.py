# Generated by Django 5.1.3 on 2024-12-05 16:09

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('forum', '0001_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='post',
            name='language',
            field=models.CharField(default='', max_length=50),
            preserve_default=False,
        ),
    ]
# Generated by Django 5.0.3 on 2024-06-03 06:04

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('enjoy', '0002_alter_tourpackage_included_meals_and_more'),
    ]

    operations = [
        migrations.AlterField(
            model_name='tourpackage',
            name='picture',
            field=models.URLField(),
        ),
    ]

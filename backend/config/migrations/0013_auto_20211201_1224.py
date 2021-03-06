# Generated by Django 3.2.9 on 2021-12-01 12:24

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('config', '0012_auto_20211128_0223'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='profiledates',
            name='snapshot',
        ),
        migrations.AddField(
            model_name='clubsnapshots',
            name='profile',
            field=models.ForeignKey(default=None, null=True, on_delete=django.db.models.deletion.CASCADE, to='config.profiles'),
        ),
        migrations.AlterField(
            model_name='clubsnapshots',
            name='club',
            field=models.ForeignKey(default=None, null=True, on_delete=django.db.models.deletion.CASCADE, to='config.clubs'),
        ),
        migrations.CreateModel(
            name='ProfileDatesToSnapshot',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('profile_dates', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='config.profiledates')),
                ('snapshot', models.ForeignKey(default=None, null=True, on_delete=django.db.models.deletion.CASCADE, to='config.clubsnapshots')),
            ],
        ),
    ]

from django.db import migrations, models

class Migration(migrations.Migration):
    dependencies = [
        ('prediction', '0002_alter_usermodel_email'),
    ]
    operations = [
        migrations.AlterField(
            model_name='usermodel',
            name='password',
            field=models.CharField(max_length=255),
        ),
    ]

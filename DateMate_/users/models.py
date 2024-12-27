from django.db import models

# Create your models here.
class userData(models.Model):
    userName = models.CharField(max_length=200)
    password = models.CharField(max_length=200)
    email = models.EmailField(unique=True)
    email_varification = models.IntegerField(default=0)
    otp = models.IntegerField()
    def __str__(self):
        return self.userName

class token(models.Model):
    user = models.ForeignKey(userData, on_delete=models.CASCADE)
    token = models.CharField(max_length=256)
    def __str__(self):
        return f"Token for {self.user.userName}"
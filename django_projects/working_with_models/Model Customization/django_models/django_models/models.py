from django.db import models


class City(models.Model):
    name=models.CharField(max_length=256)
    population=models.BigIntegerField()
    latitude=models.FloatField()
    longitude=models.FloatField()

    def __str__(self) -> str:
        return f"{self.name}"
    

class President(models.Model):
    name=models.CharField(max_length=256)

    def __str__(self) -> str:
        return f"{self.name}"

class PresidentInfo(models.Model):
    bod=models.DateField()
    net_worth=models.CharField(max_length=256)
    president=models.OneToOneField(President, on_delete=models.CASCADE)




class Country(models.Model):
    name=models.CharField(max_length=256)
    population=models.BigIntegerField()
    size=models.BigIntegerField()
    current_president=models.OneToOneField(President,null=True, on_delete=models.SET_NULL)
    capital_city=models.OneToOneField(City, on_delete=models.CASCADE)

    def __str__(self) -> str:
        return f"{self.name}"


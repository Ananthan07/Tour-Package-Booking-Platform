import random,uuid
from django.db import models
from django.utils import timezone
from django.contrib.auth.models import User
from django.contrib.postgres.fields import JSONField


class TourPackage(models.Model):
    title = models.CharField(max_length=100)
    description = models.TextField(max_length=1200)
    picture = models.URLField(max_length=200)
    destination = models.CharField(max_length=100)
    start_date = models.DateField()
    end_date = models.DateField()
    availability = models.BooleanField(default=True)
    price = models.DecimalField(max_digits=10, decimal_places=2)
    itinerary = models.TextField()
    included_meals = models.TextField()
    transportation_details = models.TextField()

    def __str__(self):
        return self.title

class BookingRegister(models.Model):
    booking_id = models.UUIDField(default=uuid.uuid4, editable=False, unique=True)
    user = models.ForeignKey(User, on_delete=models.CASCADE, null=True, blank=True)
    tour_package = models.ForeignKey(TourPackage, on_delete=models.CASCADE, null=True, blank=True)
    booking_date = models.DateField()
    booking_time = models.CharField(max_length=10)
    quantity = models.PositiveIntegerField()
    participants = models.CharField(max_length=200)
    booking_qr = models.FileField(upload_to='booking_qr/', null=True, blank=True)
    booking_pdf = models.FileField(upload_to='booking_pdfs/', blank=True, null=True)
    tour_start_date = models.DateField()
    tour_end_date = models.DateField()
    total_price = models.DecimalField(max_digits=10, decimal_places=2)
    
    def save(self, *args, **kwargs):
        if not self.booking_id:
            self.booking_id = self.generate_unique_booking_id()
        super().save(*args, **kwargs)

    def generate_unique_booking_id(self):
        timestamp = timezone.now().strftime('%Y%m%d%H%M%S%f')[:-3]  # Remove microseconds
        unique_id = str(uuid.uuid4())[:8]  # Take first 8 characters of UUID
        return f'{timestamp}-{unique_id}'

from django.db import models

class Booking(models.Model):
    booking_pdf = models.FileField(upload_to='booking_pdfs/')



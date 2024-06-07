from rest_framework import serializers
from .models import TourPackage, BookingRegister
from django.contrib.auth.models import User
class TourPackageSerializer(serializers.ModelSerializer):
    class Meta:
        model = TourPackage
        fields = ['id', 'title', 'description', 'picture', 'destination', 'start_date', 'end_date', 'availability', 'price', 'itinerary', 'included_meals', 'transportation_details']

class BookingRegisterSerializer(serializers.ModelSerializer):
    class Meta:
        model = BookingRegister
        fields = ['user', 'tour_package', 'booking_date', 'booking_time', 'quantity', 'participants', 'tour_start_date', 'tour_end_date', 'booking_id', 'total_price', 'booking_qr', 'booking_pdf']

class ExtendedUserCreationSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('id', 'username', 'password', 'email')
        extra_kwargs = {'password': {'write_only': True}}

    def create(self, validated_data):
        user = User.objects.create_user(
            username=validated_data['username'],
            password=validated_data['password'],
            email=validated_data['email']
        )
        return user
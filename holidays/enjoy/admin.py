from django.contrib import admin
from .models import TourPackage, BookingRegister

class TourPackageAdmin(admin.ModelAdmin):
    list_display = ('title', 'destination', 'start_date', 'end_date', 'availability', 'price')
    search_fields = ('title', 'destination')
    list_filter = ('availability', 'start_date', 'end_date')
    ordering = ('start_date',)

class BookingRegisterAdmin(admin.ModelAdmin):
    list_display = ('booking_id', 'user', 'tour_package', 'booking_date', 'booking_time', 'quantity', 'total_price')
    search_fields = ('booking_id', 'user__username', 'tour_package__title')
    list_filter = ('booking_date', 'tour_start_date', 'tour_end_date')
    ordering = ('booking_date',)

admin.site.register(TourPackage, TourPackageAdmin)
admin.site.register(BookingRegister, BookingRegisterAdmin)

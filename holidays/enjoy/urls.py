from django.urls import path
from . import views
from django.conf import settings
from django.conf.urls.static import static
from.views import update_user_details
from .views import login, get_profile
urlpatterns = [
    path('register/',views.signup, name='register'),
    path('login/',views.login, name='login'),
    path('profile/', get_profile, name='profile'),
    path('logout/',views.logout, name='logout'),
    path('create/',views.create_package, name='create'),
    path('list/',views.list_packages, name='list'),
    path('listsingle/<int:pk>/', views.ReadOne, name='listsingle'),
    path('update/<int:pk>/',views.update_package, name='update'),
    path('delete/<int:pk>/',views.delete_package, name='delete'),
    path('search/<str:title>/', views.search_package, name='search'),
    
    
    # Booking

   path('accept-booking/<int:pk>/', views.accept_booking, name='accept_booking'),
    path('callback/', views.order_callback, name='razorpay_callback'),
    path('new-payment/', views.new_payment, name='razorpay_newpayment'),
    path('user/bookings/', views.user_bookings, name='user_bookings'),
    path('booking/<str:id>/qr/', views.get_booking_qr, name='getqr'),
    path('place/<int:package_id>/', views.get_single_place, name='get_single_place'),
    path('update-user-details/', update_user_details, name='update_user_details')
] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
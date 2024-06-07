from django.contrib.auth import authenticate
from rest_framework import status
from django import forms
from django.http import JsonResponse, HttpResponse
from django.shortcuts import get_object_or_404
from django.views.decorators.csrf import csrf_exempt
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny, IsAuthenticated, IsAdminUser
from django.contrib.auth.forms import UserCreationForm
from rest_framework.response import Response
from rest_framework.status import HTTP_200_OK, HTTP_400_BAD_REQUEST, HTTP_404_NOT_FOUND
from rest_framework.authtoken.models import Token
from enjoy.forms import CreateTourPackageForm
from rest_framework.exceptions import PermissionDenied
from datetime import datetime,date
from enjoy.models import BookingRegister
from .serializers import TourPackageSerializer, TourPackage, BookingRegisterSerializer
from razorpay import Client as RazorpayClient
from django.template.loader import get_template, render_to_string
from django.utils.html import strip_tags
from django.core.mail import EmailMessage
from xhtml2pdf import pisa
from io import BytesIO
import qrcode
from django.core.files import File
from django.conf import settings
from django.urls import reverse
from django.core.files.base import ContentFile
from django.contrib.auth.models import User, Group, Permission
import razorpay
from datetime import datetime

# Register a User

class ExtendedUserCreationForm(UserCreationForm):
    email = forms.EmailField(required=True)

    class Meta(UserCreationForm.Meta):
        fields = UserCreationForm.Meta.fields + ('email',)

@api_view(['POST'])
@permission_classes([AllowAny])
def signup(request):
    print("Request Data:", request.data)
    form = ExtendedUserCreationForm(request.data)
    if form.is_valid():
        user = form.save()
        print("User created successfully:", user)
        return Response("Account created successfully", status=status.HTTP_201_CREATED)
    else:
        print("Form errors:", form.errors)
        return Response(form.errors, status=status.HTTP_400_BAD_REQUEST)

# Login a User

@csrf_exempt
@api_view(["POST"])
@permission_classes((AllowAny,))
def login(request):
    username = request.data.get("username")
    password = request.data.get("password")

    if not username or not password:
        return Response({'error': 'Please provide both username and password'}, status=HTTP_400_BAD_REQUEST)
    
    user = authenticate(username=username, password=password)

    if not user:
        return Response({'error': 'Invalid username or password'}, status=HTTP_404_NOT_FOUND)
    
    token, _ = Token.objects.get_or_create(user=user)
    return Response({'id': user.id, 'username': user.username, 'token': token.key}, status=HTTP_200_OK)


# User Logout

@csrf_exempt
@api_view(["POST"])
@permission_classes([IsAuthenticated])
def logout(request):
    request.user.auth_token.delete()
    return Response({'Message': 'You are logged out'}, status=status.HTTP_200_OK)


# Add New package

@api_view(['POST'])
@permission_classes([AllowAny])
def create_package(request):
    serializer = TourPackageSerializer(data=request.data)
    if serializer.is_valid():
        instance = serializer.save()
        return Response({'id': instance.id}, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


# List package

@api_view(['GET'])
@permission_classes([AllowAny])
def list_packages(request):
    products = TourPackage.objects.all()
    serializer = TourPackageSerializer(products, many=True)
    return Response(serializer.data)


#List single package

@api_view(['GET'])
@permission_classes((AllowAny,))
def ReadOne(request, pk):
    product = get_object_or_404(TourPackage, pk=pk)
    serializer = TourPackageSerializer(product)
    return Response(serializer.data)


# Update package

@api_view(['PUT'])
@permission_classes([AllowAny])
def update_package(request, pk):
    tour_package = get_object_or_404(TourPackage, pk=pk)
    serializer = TourPackageSerializer(tour_package, data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


# Delete package
    
@api_view(['DELETE'])
@permission_classes([IsAuthenticated])
def delete_package(request, pk):
    TourPackage = get_object_or_404(TourPackage, pk=pk)
    TourPackage.delete()
    return Response(status=status.HTTP_204_NO_CONTENT)


# Search package

#@api_view(['GET'])
#@permission_classes([IsAuthenticated])
#def search_package(request, title):
 #    current_date = datetime.now().date()
  #   date_param = request.GET.get('date', None)
   #  if date_param:
    #     try:
     #        date_filter = datetime.strptime(date_param, '%Y-%m-%d').date()
      #   except ValueError:
       #      return Response({'error': 'Invalid date format. Use YYYY-MM-DD.'}, status=status.HTTP_400_BAD_REQUEST)
        # TourPackage = TourPackage.objects.filter(title__istartswith=title, shows__show_date__gte=date_filter)
     #else:
      #   TourPackage = TourPackage.objects.filter(title__istartswith=title, release_date__lte=current_date)

     ##if TourPackage.exists():
       #  serializer = TourPackageSerializer(TourPackage, many=True)
        # return Response(serializer.data)
     #else:
      #   return Response({'error': 'Tourpackage not found'}, status=status.HTTP_404_NOT_FOUND)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def search_package(request, title):
    # Query the TourPackage model for packages starting with the given title
    tour_packages = TourPackage.objects.filter(title__istartswith=title)

    if tour_packages.exists():
        # Serialize the query result
        serializer = TourPackageSerializer(tour_packages, many=True)
        return Response(serializer.data)
    else:
        # Return a 404 response if no packages are found
        return Response({'error': 'package not found'}, status=status.HTTP_404_NOT_FOUND)

# Razorpay client setup
razorpay_client = razorpay.Client(auth=("rzp_test_WywoaZPJVI7Dfo", "GOlZRG9dce2EsOeRNqKPH9tD"))

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def accept_booking(request, pk):
    user = request.user
    tour_package = get_object_or_404(TourPackage, pk=pk)
    data = request.data.copy()
    data['tour_package'] = tour_package.id
    data['booking_date'] = datetime.now().date()
    
    if user.is_authenticated:
        data['user_email'] = user.email
    else:
        data['user_email'] = 'anonymous@example.com'  # Or handle anonymous user case appropriately
    
    serializer = BookingRegisterSerializer(data=data)
    if serializer.is_valid():
        booking = serializer.save()
       
#datetime.now().date() 
        # Generate QR code for the booking
        qr = qrcode.QRCode(
            version=1,
            error_correction=qrcode.constants.ERROR_CORRECT_L,
            box_size=10,
            border=4,
        )
        qr_data = (
            f"Booking ID: {booking.booking_id}\n"
            f"Tour Package: {tour_package.title}\n"
            f"Start Date: {booking.tour_start_date}\n"
            f"End Date: {booking.tour_end_date}\n"
            f"Booking Time: {booking.booking_time}\n"
            f"Participants: {booking.participants}\n"
            f"Total Price: {booking.total_price}"
        )
        qr.add_data(qr_data)
        qr.make(fit=True)
        qr_img = BytesIO()
        img = qr.make_image(fill_color="black", back_color="white")
        img.save(qr_img)
        qr_img.seek(0)
        booking.booking_qr.save(f"booking_{booking.booking_id}.png", File(qr_img))

        # Generate PDF for booking
        template = get_template('booking_details.html')
        qr_code_url = booking.booking_qr.url
        context = {'booking_data': booking, 'tour_package': tour_package, 'booking_QR': qr_code_url}
        html_content = template.render(context)

        pdf_content = BytesIO()
        pisa.CreatePDF(BytesIO(html_content.encode('UTF-8')), dest=pdf_content)
        booking.booking_pdf.save(f"booking_{booking.booking_id}.pdf", ContentFile(pdf_content.getvalue()))

        # Send confirmation email
        subject = 'Booking Confirmation'
        to_email = request.user.email
        from_email = 'anand.heaven@admin.com'
        email_context = {'booking': booking, 'tour_package': tour_package}
        email_body_html = render_to_string('email_template.html', email_context)
        email_body_text = strip_tags(email_body_html)

        email = EmailMessage(
            subject,
            email_body_text,
            from_email,
            [to_email],
        )
        pdf_file_path = booking.booking_pdf.path
        email.attach_file(pdf_file_path, 'application/pdf')

        email.send()

        return Response(serializer.data, status=status.HTTP_201_CREATED)
    else:
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_booking_qr(request, id):
    booking = get_object_or_404(BookingRegister, booking_id=id)
    qr_image_url = request.build_absolute_uri(settings.MEDIA_URL + booking.booking_qr.name)
    return Response({'qr_image_url': qr_image_url})

@api_view(['GET'])
@permission_classes([AllowAny])
def get_single_place(request, package_id):
    tour_package = get_object_or_404(TourPackage, id=package_id)
    serializer = TourPackageSerializer(tour_package)
    return Response(serializer.data)

@csrf_exempt
@api_view(['POST'])
@permission_classes([AllowAny])
def new_payment(request):
    try:
        price = float(request.data.get('price', 0))
        product_name = request.data.get('product_name', '')
        amount = int(round(price * 100))  # Convert price to paise (Indian currency)
        new_order_response = razorpay_client.order.create({
            "amount": amount,
            "currency": "INR",
            "payment_capture": "1"
        })

        response_data = {
            "callback_url": "http://127.0.0.1:8000/api/callback/",
            "razorpay_key": "rzp_test_WywoaZPJVI7Dfo",
            "order": new_order_response,
            "product_name": product_name
        }

        return JsonResponse(response_data)

    except Exception as e:
        return JsonResponse({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@csrf_exempt
@api_view(['POST', 'GET'])
@permission_classes([AllowAny])
def order_callback(request):
    if request.method == "POST":
        try:
            if "razorpay_signature" in request.data:
                payment_verification = razorpay_client.utility.verify_payment_signature(request.data)
                if payment_verification:
                    return JsonResponse({"res": "Success"})
                else:
                    return JsonResponse({"res": "Failed"})
        except Exception as e:
            return JsonResponse({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    elif request.method == "GET":
        return JsonResponse({"message": "GET request received"})
    return JsonResponse({"error": "Method not allowed"}, status=status.HTTP_405_METHOD_NOT_ALLOWED)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def user_bookings(request):
    user_bookings = BookingRegister.objects.filter(user=request.user)
    serializer = BookingRegisterSerializer(user_bookings, many=True)
    return Response(serializer.data)

# @csrf_exempt
# @api_view(['GET'])
# @permission_classes([IsAuthenticated])
# def user_bookings(request):
#     if not request.user.is_authenticated:
#         return Response({"error": "User not authenticated"}, status=status.HTTP_401_UNAUTHORIZED)
    
#     user_bookings = BookingRegister.objects.filter(user=request.user)
#     serializer = BookingRegisterSerializer(user_bookings, many=True)
#     return Response(serializer.data)


@permission_classes([IsAuthenticated])
def get_booking_details(request, booking_id):
    booking = get_object_or_404(BookingRegister, booking_id=booking_id, user=request.user)
    serializer = BookingRegisterSerializer(booking)
    return Response(serializer.data)

#@login_required 
@csrf_exempt
@api_view(["POST"])
@permission_classes((AllowAny,))
def update_user_details(request):
    # Check if the request method is POST
    if request.method!= "POST":
        return JsonResponse({"error": "Only POST requests are allowed."}, status=405)

    # Extract the new username, new email, and new password from the request data
    new_username = request.data.get("new_username", None)
    new_email = request.data.get("new_email", None)
    new_password = request.data.get("new_password", None)  # New password field

    try:
        # Get the currently authenticated user
        user = request.user
    except AttributeError:  # In case there's no authenticated user
        return JsonResponse({"error": "Authentication required."}, status=401)

    # Update the user's username, email, and password
    if new_username:
        user.username = new_username
    if new_email:
        user.email = new_email
    if new_password:
        user.set_password(new_password)  # Securely hash the new password

    # Save the changes
    user.save()

    # Return a success response
    return JsonResponse({"message": "User details updated successfully.", "updated_user": {"id": user.id, "username": user.username, "email": user.email}})
@api_view(["GET"])
@permission_classes((IsAuthenticated,))
def get_profile(request):
    user = request.user
    try:
        profile = {
            'id': user.id,
            'username': user.username,
            'email': user.email,
            'password': user.password,
            'token': Token.objects.get(user=user).key,
        }
        return Response(profile, status=status.HTTP_200_OK)
    except User.DoesNotExist:
        return Response({'error': 'User not found'}, status=status.HTTP_404_NOT_FOUND)
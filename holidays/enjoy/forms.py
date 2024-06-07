from django.contrib.auth.forms import UserCreationForm
from django.contrib.auth.models import User
from django import forms
from .models import TourPackage
 
# Register User

class CreateUser(UserCreationForm):
    email = forms.EmailField()
    
    class Meta:
        model = User
        fields = ['username','email','password1','password2']

    def save(self, commit=True):
        user = super(CreateUser, self).save(commit=False)
        user.email = self.cleaned_data['email']
        if commit:
            user.save()
        return user
    

# Create a Tour Package
class CreateTourPackageForm(forms.ModelForm):
    class Meta:
        model = TourPackage
        fields = [
            'title',
            'description',
            'picture',
            'destination',
            'start_date',
            'end_date',
            'availability',
            'price',
            'itinerary',
            'included_meals',
            'transportation_details'
        ]

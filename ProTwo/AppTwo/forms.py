from django import forms
from AppTwo.models import User

class SignUp(forms.ModelForm):
    first_name = forms.CharField(max_length=100)
    last_name = forms.CharField(max_length = 100)
    email = forms.EmailField()
    # Meta class
    class Meta:
        model = User
        fields = '__all__'

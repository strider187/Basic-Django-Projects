from django import forms
from django.core import validators

def check_for_m(value):
    if value[0].lower() != 'm':
        raise forms.ValidationError("Name should start with m")



class FormName(forms.Form):
    name = forms.CharField(validators = [check_for_m])
    email = forms.EmailField()
    verify_email = forms.EmailField(label = 'Enter your email again!')
    text = forms.CharField(widget = forms.Textarea)



    def clean(self):
        clean_data = super().clean()
        email = clean_data['email']
        vmail = clean_data['verify_email']

        if email != vmail:
            raise forms.ValidationError("Emails don't match!")

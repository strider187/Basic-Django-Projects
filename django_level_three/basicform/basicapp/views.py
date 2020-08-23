from django.shortcuts import render
from . import forms
from django.http import HttpResponseRedirect
# Create your views here.

def index(request):
    return render(request,"basicapp/index.html")


def form_name_view(request):
    form = forms.FormName()

    if request.method == 'POST':
        form = forms.FormName(request.POST)

        if form.is_valid():
            # DO the work here
            print("THANK YOU REGISTERING!. REGISTERED USER DETAILS:")
            print(form.cleaned_data['name'])
            print(form.cleaned_data)


    return render(request, "basicapp/form_page.html",{'form':form})

from django.shortcuts import render
from django.http import HttpResponse
from AppTwo.models import User
from AppTwo.forms import SignUp
# Create your views here.

def index(request):
    return HttpResponse("<em>My Second App</em>")

def help(request):
    dict = {'help_me':"This is the help page coming from help_page.html via help of views.py"}
    return render(request,"AppTwo/help_page.html", context=dict)



def users(request):
    # user = User.objects.order_by("first_name")
    # user_dict = {'registered_users': user}
    # return render(request,"AppTwo/users.html", context=user_dict)
    form = SignUp()
    print('Users called')
    print(request)
    if request.method == 'POST':
        print('POST REQUEST GENERATED HERE!')
        form = SignUp(request.POST)

        if form.is_valid():
            form.save(commit=True)
            print('Valid Fom')
            print("THANK YOU REGISTERING!. REGISTERED USER DETAILS:")
            # print(new_user)
            return index(request)
        # print("Name: " + cleaned_data['first_name'] + " "+ cleaned_data['last_name'])
        # print('Email: ' + clean_data['email'])
        # print(cleaned_data)
        else:
            print("Impossible! You did something wrong")

    return render(request, "AppTwo/users.html",{'form':form})

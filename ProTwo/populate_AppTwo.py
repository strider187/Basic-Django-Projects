import os
os.environ.setdefault('DJANGO_SETTINGS_MODULE','ProTwo.settings')

import django
django.setup()

# x = 1
from AppTwo.models import User
import random
from faker import Faker

# Getting a faker object
fakegen = Faker()

def populate(n = 20):
    for turns in range(n):
        print("THE FAKE SCRIPT IN ITS ITERATION:{}",format(turns))

        # Creating some fake data
        fake_fname = fakegen.first_name()
        fake_lname = fakegen.last_name()
        fake_email = fakegen.email()

        # populate the User Table
        user = User.objects.get_or_create(first_name = fake_fname, last_name = fake_lname, email = fake_email)[0]

if __name__ == '__main__':
    print("THE POPULTING SCRIPT HAS BEGUN! GETTING SOME USERS IN THERE")
    populate(28)
    print("IT'S DONE!")

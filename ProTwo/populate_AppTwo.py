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
    '''
        This function is used to populate the User model present in the App. It uses the faker library for the task. If faker isn't available, install it using
        pip install faker
    '''
    print("Model fake population have started")
    for turns in range(n):
        print("THE FAKE SCRIPT IN ITS ITERATION:{}",format(turns))

        # Creating some fake data
        fake_fname = fakegen.first_name()
        fake_lname = fakegen.last_name()
        fake_email = fakegen.email()

        # populate the User Table
        user = User.objects.get_or_create(first_name = fake_fname, last_name = fake_lname, email = fake_email)[0]
        print("The {} iteration have finished".format(turns))

if __name__ == '__main__':
    populate(28)
    print("IT'S DONE!")

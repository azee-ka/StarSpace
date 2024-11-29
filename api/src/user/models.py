# src/user/models.py
from django.contrib.auth.models import AbstractUser
from django.db import models

def upload_to(instance, filename):
    return f'profile_pictures/{instance.username}/{filename}'


class BaseUser(AbstractUser):
    username = models.CharField(unique=True, max_length=150)
    display_name = models.CharField(max_length=255, blank=True, null=True)
    date_of_birth = models.DateField(null=True, blank=True)
    role = models.TextField(default='any')
    profile_picture = models.ImageField(upload_to='profile_pictures/', blank=True, null=True)
    is_private_profile = models.BooleanField(default=True)

    def switch_active_profile(self, new_active_profile):
        """
        Method to switch the active profile for the user.
        """
        # Perform any additional logic needed for the switch
        # For example, you might want to reset certain session data or perform cleanup

        # Set the new active profile
        self.active_profile = new_active_profile
        self.save()
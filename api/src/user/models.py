# src/user/models.py
from django.contrib.auth.models import AbstractBaseUser, BaseUserManager, PermissionsMixin
from django.db import models

def upload_to(instance, filename):
    return f'profile_pictures/{instance.username}/{filename}'

class BaseUserManager(BaseUserManager):
    def create_user(self, email, password=None, **extra_fields):
        """Create and return a regular user with an email and password."""
        if not email:
            raise ValueError('The Email field must be set')
        email = self.normalize_email(email)
        user = self.model(email=email, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, email, password=None, **extra_fields):
        """Create and return a superuser with an email and password."""
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)
        return self.create_user(email, password, **extra_fields)


class BaseUser(AbstractBaseUser, PermissionsMixin):
    email = models.EmailField(unique=True)
    password = models.CharField(max_length=255)
    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)
    date_joined = models.DateTimeField(auto_now_add=True)

    objects = BaseUserManager()

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = []

    def __str__(self):
        return self.email


class User(BaseUser):
    username_anon = models.CharField(max_length=150, unique=True, blank=True, null=True)
    username_pro = models.CharField(max_length=150, unique=True, blank=True, null=True)
    full_name = models.CharField(max_length=200, blank=True)
    bio = models.TextField(blank=True, null=True)
    profile_image = models.ImageField(upload_to='profile_images/', null=True, blank=True)
    role = models.CharField(max_length=50, choices=[('anonymous', 'Anonymous'), ('professional', 'Professional')], blank=True, null=True)
    is_verified = models.BooleanField(default=False)

    def __str__(self):
        return self.email

    def switch_role(self):
        """Switch between anonymous and professional identity."""
        if self.role == 'anonymous':
            self.role = 'professional'
        else:
            self.role = 'anonymous'
        self.save()

    def get_current_username(self):
        """Get the active username (based on the current role)."""
        return self.username_anon if self.role == 'anonymous' else self.username_pro

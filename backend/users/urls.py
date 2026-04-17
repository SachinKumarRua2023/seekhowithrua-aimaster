from django.urls import path
from . import views

urlpatterns = [
    # Google OAuth
    path('google/', views.google_auth, name='google-auth'),
    path('google/callback/', views.google_callback, name='google-callback'),

    # OTP Auth
    path('send-otp/', views.send_otp, name='send-otp'),
    path('verify-otp/', views.verify_otp, name='verify-otp'),

    # Standard auth
    path('login/', views.login, name='login'),
    path('register/', views.register, name='register'),
    path('logout/', views.logout, name='logout'),
    path('user/', views.get_user, name='get-user'),
]

import random
from django.http import JsonResponse
from django.shortcuts import render
from django.contrib.auth import password_validation
from django.contrib.auth.hashers import make_password, check_password
from django.template.loader import render_to_string
from django.core.mail import send_mail
from django.views.decorators.csrf import csrf_exempt
from django.utils.html import strip_tags

from users.models import userData
import secrets
from users.models import token
# Create your views here.
@csrf_exempt
def signup(request):
    if request.method == 'POST':
        username = request.POST.get('username')
        email = request.POST.get('email')
        password = request.POST.get('password')
        if userData.objects.filter(userName=username).exists():
            return JsonResponse({'error': 'Username already taken.'}, status=400)
        
        if userData.objects.filter(email=email).exists():
            return JsonResponse({'error': 'Email already registered.'}, status=400)
        

        try:
            password_validation.validate_password(password)
        except Exception as e:
            return JsonResponse({'error': str(e)}, status=400)
        otp = random.randint(1000, 9999)
        hashedPass = make_password(password)
        user = userData(userName = username, email= email, password= hashedPass, otp= otp)
        print('data stroed')
        subject = 'Email Verification - DateMate'
        message = render_to_string('otp_email_template.html', {'otp': otp})
        plain_message = strip_tags(message)
        print('messgage')
        try:
            send_mail(subject,plain_message,'vijayjoglekar07@gmail.com',[email],html_message=message)
        except Exception as e:
            print('mail sending failed')
            return JsonResponse({'error': f'Error sending email: {str(e)}'}, status=500)
        user.save()
        return JsonResponse({'message': 'OTP sent to your email. Please verify your OTP.'}, status = 200)


    else:
        return JsonResponse('invalid request type ', safe=False)
    

# validate otp
@csrf_exempt
def validate(request):
    if request.method == 'POST':
        username = request.POST.get('username')
        otp = request.POST.get('otp')
        print(username, otp)
        
        if userData.objects.filter(userName=username).exists():
            user = userData.objects.get(userName = username)
            print(type(otp) , type(user.otp))
            if user.otp == int(otp):
                user.email_varification = 1
                user.save()
                return JsonResponse({'message':'sucess'}, status= 200)
            else:
                print('invalid otp')
                return JsonResponse({'message':'invalid otp'}, status= 400)
        else:
            return JsonResponse({'message':'no such user is present '}, status= 400)
    else:
        return JsonResponse('invalid request type ', safe=False)
        


@csrf_exempt
def login(request):
    if request.method == 'POST':
        username = request.POST.get('username')
        password = request.POST.get('password')
        if userData.objects.filter(userName=username).exists() :
            user = userData.objects.get(userName = username)
            if user.email_varification == 1:
                 if check_password(password,user.password):
                    tokenv = secrets.token_hex(32)
                    tok = token(user= user, token= tokenv)
                    generated_token = tok.token
                    tok.save()
                    print('token send ')
                    return JsonResponse({'token':generated_token}, status = 200)
                 else:
                     return JsonResponse({'message': 'please enter correct password'}, status = 400)
            else:
                return JsonResponse({'message': 'first validate your email'}, status = 400)
        else:
            return JsonResponse({'message': 'user did not exist'}, status = 400)
    else:
        return JsonResponse('invalid request type ', safe=False)
    
@csrf_exempt
def logout(request):
    if request.method == 'POST':
        tok = request.POST.get('token')
        try:
            tokenObj = token.objects.get(token=tok)
            print(f"Token object before deletion: {tokenObj}")
            tokenObj.delete()  # This deletes the token from the database
            print("Token deleted successfully.")
            return JsonResponse({'message': 'Logout successful'}, status=200)
        except token.DoesNotExist:
            return JsonResponse({'error': 'Invalid token'}, status=400)
        except Exception as e:
            return JsonResponse({'error': str(e)}, status=500)

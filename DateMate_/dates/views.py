from django.http import JsonResponse
from django.shortcuts import render
from django.views.decorators.csrf import csrf_exempt
from users.models import token, userData
from dates.models import event
from django.db.models import Q
# Create your views here.
@csrf_exempt
def addEvent(request):
    if request.method != 'POST':
        return JsonResponse({'message': 'Method Not Allowed'}, status=405)

    try:
        tok = request.POST.get('token')
        title = request.POST.get('title')
        description = request.POST.get('description', '')
        date = request.POST.get('date')
        is_recurring = request.POST.get('is_recurring', 'false').lower() == 'true'

        # Validate required fields
        if not tok or not title or not date:
            return JsonResponse({'message': 'Missing required fields'}, status=400)

        # Validate token
        try:
            token_obj = token.objects.get(token=tok)
            user = token_obj.user
        except token.DoesNotExist:
            return JsonResponse({'message': 'Invalid or expired token'}, status=401)

        # Save event
        event_obj = event(user=user, title=title, description=description, date=date, is_recurring=is_recurring)
        event_obj.save()

        return JsonResponse({'message': 'Success', 'event_id': event_obj.id}, status=200)

    except Exception as e:
        return JsonResponse({'message': f'Error: {str(e)}'}, status=500)


@csrf_exempt
def search_events(request):
    if request.method == "GET":
        query = request.GET.get('query', '')  # Get the search query from URL
        token_value = request.headers.get('Authorization')  # Get the token from Authorization header
        
        if token_value:
            token_value = token_value.split(" ")[1]  # Extract the token part (after 'Bearer')
            try:
                # Find the user based on the token
                user_token = token.objects.get(token=token_value)
                user = user_token.user
            except token.DoesNotExist:
                return JsonResponse({'error': 'Invalid or expired token'}, status=401)
            
            # Filter events by the authenticated user and the search query
            if query:
                events = event.objects.filter(
                    Q(user=user) & (Q(title__icontains=query) | Q(description__icontains=query))
                )
            else:
                events = event.objects.filter(user=user)  # If no query, just return all user's events
            
            # Prepare the event data to return as JSON
            events_data = [
                {
                    'title': e.title,
                    'description': e.description,
                    'date': e.date,
                    'is_recurring': e.is_recurring
                }
                for e in events
            ]
            return JsonResponse({'events': events_data})
        else:
            return JsonResponse({'error': 'Token is required for authentication'}, status=401)
    else:
        return JsonResponse({'error': 'Invalid request method'}, status=400)
    

@csrf_exempt
def get_user_events(request):
    if request.method == 'POST':
        tok = request.POST.get('token')

        if tok:
            try:
                user = token.objects.get(token=tok).user 
                events = event.objects.filter(user=user)

                if events.exists():
                    event_data = [{
                        'title': event.title,
                        'description': event.description,
                        'date': event.date,
                        'is_recurring': event.is_recurring
                    } for event in events]
                    
                    return JsonResponse({'events': event_data}, status=200)
                else:
                    return JsonResponse({'message': 'No events found.'}, status=404)

            except token.DoesNotExist:
                return JsonResponse({'message': 'Invalid token or user not found'}, status=400)
        else:
            return JsonResponse({'message': 'Token is required'}, status=400)
        


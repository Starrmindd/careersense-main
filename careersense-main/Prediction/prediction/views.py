import joblib
import os
from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView
from django.contrib.auth.hashers import make_password, check_password

from .serializers import PredictionSerializer, SignInSerializer, SignUpSerializer, UserSerializer
from .models import UserModel
from utils.utility import predict_sentiment


class PredictionView(APIView):
    def post(self, request, *args, **kwargs):
        serializer = PredictionSerializer(data=request.data)
        if serializer.is_valid():
            model_path = os.path.join(os.path.dirname(__file__), '../ml_models/dtmodel.pkl')
            model = joblib.load(model_path)

            data = [
                serializer.validated_data['question1'],
                serializer.validated_data['question2'],
                serializer.validated_data['question3'],
                serializer.validated_data['question4'],
                serializer.validated_data['question5'],
                serializer.validated_data['question6'],
                serializer.validated_data['question7'],
                serializer.validated_data['question8'],
                serializer.validated_data['question9'],
                serializer.validated_data['question10'],
                serializer.validated_data['question11'],
                serializer.validated_data['question12'],
                serializer.validated_data['question13'],
                serializer.validated_data['question14'],
                serializer.validated_data['question15'],
                serializer.validated_data['question16'],
                serializer.validated_data['question17'],
                serializer.validated_data['question18'],
                serializer.validated_data['question19'],
            ]

            encoding_question7 = {
                'R Programming': 0, 'Information Security': 1, 'Shell Programming': 2,
                'Machine Learning': 3, 'Full Stack': 4, 'Hadoop': 5,
                'Python': 6, 'Distro Making': 7, 'App Development': 8
            }

            encoding_question8 = {
                'Database Security': 0, 'System Designing': 1, 'Web Technologies': 2,
                'Machine Learning': 3, 'Hacking': 4, 'Testing': 5,
                'Data Science': 6, 'Game Development': 7, 'Cloud Computing': 8
            }

            encoded_data = [
                int(data[0]), int(data[1]), int(data[2]), int(data[3]),
                int(data[4]), int(data[5]),
                encoding_question7[data[6]], encoding_question8[data[7]],
                int(data[8]), int(data[9]), int(data[10]), int(data[11]),
                int(data[12]), int(data[13]), int(data[14]), int(data[15]),
                int(data[16]), int(data[17]), int(data[18]),
            ]

            prediction = model.predict([encoded_data])
            prediction_probability = model.predict_proba([encoded_data])
            predicted_class = prediction[0]
            predicted_proba = prediction_probability[0][predicted_class]

            return Response({
                'prediction': predicted_class,
                'probability': predicted_proba
            }, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class SignUpView(APIView):
    def post(self, request, *args, **kwargs):
        serializer = SignUpSerializer(data=request.data)
        if serializer.is_valid():
            # Check if email already exists
            email = serializer.validated_data.get('email')
            if UserModel.objects.filter(email=email).exists():
                return Response({'success': False, 'message': 'User already exists'}, status=status.HTTP_400_BAD_REQUEST)
            # Hash password before saving
            user = serializer.save()
            user.password = make_password(request.data.get('password'))
            user.save()
            return Response({'success': True}, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class SignInView(APIView):
    def post(self, request, *args, **kwargs):
        serializer = SignInSerializer(data=request.data)
        if serializer.is_valid():
            email = serializer.validated_data['email']
            password = serializer.validated_data['password']
            try:
                user = UserModel.objects.get(email=email)
                # Check hashed password
                if check_password(password, user.password):
                    return Response({
                        'success': True,
                        'message': 'Login successful',
                        'name': user.name
                    }, status=status.HTTP_200_OK)
                else:
                    return Response({'success': False, 'message': 'Invalid credentials'}, status=status.HTTP_400_BAD_REQUEST)
            except UserModel.DoesNotExist:
                return Response({'success': False, 'message': 'User not found'}, status=status.HTTP_400_BAD_REQUEST)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class UserDetailsView(APIView):
    def get(self, request, *args, **kwargs):
        user = request.user
        serializer = UserSerializer(user)
        return Response(serializer.data, status=status.HTTP_200_OK)


class SentimentAnalysisView(APIView):
    def post(self, request, *args, **kwargs):
        try:
            if "text" in request.data:
                text_input = request.data["text"]
                predicted_sentiment = predict_sentiment(text_input)
                return Response({"prediction": predicted_sentiment}, status=status.HTTP_200_OK)
            else:
                return Response({"error": "No text provided"}, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class CheckEmailView(APIView):
    def post(self, request, *args, **kwargs):
        email = request.data.get('email')
        exists = UserModel.objects.filter(email=email).exists()
        return Response({'exists': exists}, status=status.HTTP_200_OK)


class ResetPasswordView(APIView):
    def post(self, request, *args, **kwargs):
        email = request.data.get('email')
        new_password = request.data.get('new_password')
        try:
            user = UserModel.objects.get(email=email)
            user.password = make_password(new_password)
            user.save()
            return Response({'success': True}, status=status.HTTP_200_OK)
        except UserModel.DoesNotExist:
            return Response({'success': False, 'message': 'User not found'}, status=status.HTTP_400_BAD_REQUEST)

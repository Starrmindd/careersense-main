import os
import json
import joblib
import logging
from dotenv import load_dotenv
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from google import genai
from google.genai import types

load_dotenv()
logger = logging.getLogger(__name__)

API_KEY = os.environ.get("GOOGLE_API_KEY")
client = genai.Client(api_key=API_KEY) if API_KEY else None

SYSTEM_PROMPT = """You are CareerSense AI, a career advisor for IT students at FUOYE, Nigeria.

YOUR GOAL: Predict the user's ideal IT career in as few messages as possible (maximum 4 exchanges).

STRICT RULES:
- Ask MAXIMUM 2 short questions per message
- After 3-4 exchanges, you MUST make a prediction — do not keep asking
- Be brief and friendly — no long paragraphs
- When ready to predict (after 3-4 exchanges), end your response with this exact JSON on a new line:
{"ready_to_predict": true, "answers": {"q1": <logical_reasoning 1-9>, "q2": <hackathons 0-6>, "q3": <coding_skill 1-9>, "q4": <public_speaking 1-9>, "q5": <self_learning 0 or 1>, "q6": <extra_courses 0 or 1>, "q7": "<one of: R Programming/Information Security/Shell Programming/Machine Learning/Full Stack/Hadoop/Python/Distro Making/App Development>", "q8": "<one of: Database Security/System Designing/Web Technologies/Machine Learning/Hacking/Testing/Data Science/Game Development/Cloud Computing>", "q9": <reading_writing 0-2>, "q10": <memory 0-2>, "q11": <subject_interest 0-9>, "q12": <career_area 0-5>, "q13": <company_type 0-9>, "q14": <takes_advice 0 or 1>, "q15": <books 0-30>, "q16": <management 0 or 1>, "q17": <work_style 0 or 1>, "q18": <team_work 0 or 1>, "q19": <introvert 0 or 1>}}

FLOW:
1. First message: Ask about their top IT interest AND coding skill (rate 1-9)
2. Second message: Ask about work style (team/solo, creative/analytical) AND goals
3. Third message: Ask one more clarifying question if needed, then predict
4. By message 4: ALWAYS produce the JSON prediction — never ask more questions

Use defaults for anything not mentioned (coding=5, logic=5, etc.). Make reasonable inferences."""


class ChatbotView(APIView):
    def post(self, request):
        if not client:
            return Response(
                {'response': 'AI service not configured. Please contact admin.', 'error': 'Missing GOOGLE_API_KEY'},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
        try:
            message = request.data.get('message', '')
            history = request.data.get('history', [])

            # Build conversation for Gemini
            contents = []
            for msg in history[-8:]:  # Keep last 8 messages only
                role = 'user' if msg['role'] == 'user' else 'model'
                contents.append(types.Content(role=role, parts=[types.Part(text=msg['content'])]))
            contents.append(types.Content(role='user', parts=[types.Part(text=message)]))

            response = client.models.generate_content(
                model='gemini-2.5-flash-lite',
                contents=contents,
                config=types.GenerateContentConfig(
                    system_instruction=SYSTEM_PROMPT,
                    temperature=0.5,
                    max_output_tokens=400,  # Keep responses short
                )
            )
            response_text = response.text

            # Check if AI included prediction JSON
            prediction = None
            probability = None

            if '"ready_to_predict": true' in response_text:
                try:
                    json_start = response_text.rfind('{')
                    json_end = response_text.rfind('}') + 1
                    json_str = response_text[json_start:json_end]
                    pred_data = json.loads(json_str)
                    if pred_data.get('ready_to_predict'):
                        answers = pred_data.get('answers', {})
                        prediction, probability = make_prediction(answers)
                        response_text = response_text[:json_start].strip()
                except Exception as e:
                    logger.error(f"Failed to parse prediction JSON: {e}")

            return Response({
                'response': response_text,
                'prediction': prediction,
                'probability': float(probability) if probability is not None else None,
            }, status=status.HTTP_200_OK)

        except Exception as e:
            logger.error(f"Chat error: {e}")
            return Response(
                {'error': str(e), 'response': f'Sorry, I encountered an error. Please try again.'},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )


def make_prediction(answers):
    try:
        model_path = os.path.join(os.path.dirname(__file__), '../ml_models/dtmodel.pkl')
        model = joblib.load(model_path)

        cert_map = {
            'R Programming': 0, 'Information Security': 1, 'Shell Programming': 2,
            'Machine Learning': 3, 'Full Stack': 4, 'Hadoop': 5,
            'Python': 6, 'Distro Making': 7, 'App Development': 8
        }
        workshop_map = {
            'Database Security': 0, 'System Designing': 1, 'Web Technologies': 2,
            'Machine Learning': 3, 'Hacking': 4, 'Testing': 5,
            'Data Science': 6, 'Game Development': 7, 'Cloud Computing': 8
        }

        data = [
            int(answers.get('q1', 5)), int(answers.get('q2', 1)),
            int(answers.get('q3', 5)), int(answers.get('q4', 5)),
            int(answers.get('q5', 1)), int(answers.get('q6', 1)),
            cert_map.get(answers.get('q7', 'Python'), 6),
            workshop_map.get(answers.get('q8', 'Web Technologies'), 2),
            int(answers.get('q9', 1)), int(answers.get('q10', 1)),
            int(answers.get('q11', 3)), int(answers.get('q12', 3)),
            int(answers.get('q13', 4)), int(answers.get('q14', 1)),
            int(answers.get('q15', 18)), int(answers.get('q16', 0)),
            int(answers.get('q17', 1)), int(answers.get('q18', 1)),
            int(answers.get('q19', 0)),
        ]

        prediction = model.predict([data])[0]
        probability = model.predict_proba([data])[0][prediction]
        return int(prediction), float(probability)
    except Exception as e:
        logger.error(f"Prediction error: {e}")
        return None, None

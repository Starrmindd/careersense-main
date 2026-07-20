import os
import json
import joblib
import logging
from dotenv import load_dotenv
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from groq import Groq

load_dotenv()
logger = logging.getLogger(__name__)

GROQ_API_KEY = os.environ.get("GROQ_API_KEY")

def get_groq_client():
    """Lazy-load Groq client to avoid import-time errors"""
    if not GROQ_API_KEY:
        return None
    try:
        return Groq(api_key=GROQ_API_KEY)
    except Exception as e:
        logger.error(f"Failed to initialize Groq client: {e}")
        return None

SYSTEM_PROMPT = """You are CareerSense AI, a career advisor for IT students at FUOYE, Nigeria.
Goal: predict the user's ideal IT career in max 4 exchanges.
Rules:
- Ask max 2 short questions per message. Be brief and friendly.
- By message 4, ALWAYS produce the prediction JSON — never keep asking.
- Output the JSON as plain text on a new line — NO markdown, NO code fences, NO backticks.
- End your final response with exactly this JSON:
{"ready_to_predict":true,"answers":{"q1":<1-9>,"q2":<0-6>,"q3":<1-9>,"q4":<1-9>,"q5":<0-1>,"q6":<0-1>,"q7":"<Full Stack|Python|Machine Learning|App Development|Information Security|Shell Programming|R Programming|Hadoop|Distro Making>","q8":"<Web Technologies|Data Science|Machine Learning|Cloud Computing|Database Security|System Designing|Hacking|Testing|Game Development>","q9":<0-2>,"q10":<0-2>,"q11":<0-9>,"q12":<0-5>,"q13":<0-9>,"q14":<0-1>,"q15":<0-30>,"q16":<0-1>,"q17":<0-1>,"q18":<0-1>,"q19":<0-1>}}
Use defaults (5 for numeric, "Python"/"Web Technologies") for anything unknown."""


class ChatbotView(APIView):
    def post(self, request):
        client = get_groq_client()
        if not client:
            return Response(
                {'response': 'AI service not configured.', 'error': 'Missing GROQ_API_KEY'},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
        try:
            message = request.data.get('message', '')
            history = request.data.get('history', [])

            # Build messages for Groq (OpenAI-compatible format)
            messages = [{"role": "system", "content": SYSTEM_PROMPT}]

            # Keep last 6 messages for context
            for msg in history[-6:]:
                role = 'user' if msg['role'] == 'user' else 'assistant'
                messages.append({"role": role, "content": msg['content']})

            messages.append({"role": "user", "content": message})

            response = client.chat.completions.create(
                model="llama-3.1-8b-instant",
                messages=messages,
                temperature=0.5,
                max_tokens=350,
            )

            response_text = response.choices[0].message.content

            prediction = None
            probability = None

            if '"ready_to_predict"' in response_text:
                try:
                    import re
                    # Remove markdown code fences
                    clean = re.sub(r'```(?:json)?', '', response_text).replace('```', '')

                    # Find the outermost JSON object
                    start = clean.find('{')
                    if start != -1:
                        depth = 0
                        end = start
                        for i, ch in enumerate(clean[start:], start):
                            if ch == '{': depth += 1
                            elif ch == '}':
                                depth -= 1
                                if depth == 0:
                                    end = i + 1
                                    break
                        json_str = clean[start:end]
                        pred_data = json.loads(json_str)
                        if pred_data.get('ready_to_predict'):
                            answers = pred_data.get('answers', {})
                            prediction, probability = make_prediction(answers)
                            # Remove everything from the JSON start onward
                            orig_start = response_text.find('{')
                            response_text = response_text[:orig_start].strip()
                            # Also clean any trailing code fences
                            response_text = re.sub(r'```+', '', response_text).strip()
                            if not response_text:
                                response_text = "Based on our conversation, here is your predicted IT career path!"
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
                {'error': str(e), 'response': 'Sorry, I encountered an error. Please try again.'},
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

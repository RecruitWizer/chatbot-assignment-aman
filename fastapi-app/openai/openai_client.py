# fastapi-app/openai/openai_client.py
import openai

OPENAI_API_KEY = "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"  # fallback in case of dotenv issue
openai.api_key = OPENAI_API_KEY

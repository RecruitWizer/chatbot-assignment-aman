# fastapi-app/openai/openai_client.py
import openai

OPENAI_API_KEY = "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"  # fallback in case of dotenv issue
openai.api_key = OPENAI_API_KEY

# fastapi-app/openai/openai_client.py
import openai

OPENAI_API_KEY = "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"  # fallback in case of dotenv issue
openai.api_key = OPENAI_API_KEY

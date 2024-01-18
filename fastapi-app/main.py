# fastapi-app/main.py
from dotenv import load_dotenv
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse
import openai
# from openai.openai_client import OPENAI_API_KEY
import sys, os
sys.path.append(".")

load_dotenv()

OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")
# print(OPENAI_API_KEY)
if OPENAI_API_KEY is None:
    raise EnvironmentError("OpenAI API key not found. Make sure it is set in the .env file.")

openai.api_key = OPENAI_API_KEY

app = FastAPI()

# CORS (Cross-Origin Resource Sharing) middleware for handling cross-origin requests
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Adjust as needed for your front-end's origin
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def read_root():
    return {"message": "Hello, FastAPI!"}

@app.get("/api/chatbot/{user_input}")
def get_chatbot_response(user_input: str):
    if not user_input:
        raise HTTPException(status_code=400, detail="User input cannot be empty.")

    # Use OpenAI to generate a response (this is a simplified example)
    response = openai.Completion.create(
        engine="gpt-3.5-turbo-instruct",  # Choose an appropriate engine
        prompt=user_input,
        max_tokens=50  # Adjust as needed
    )

    chatbot_response = response.choices[0]["text"]

    return {"response": chatbot_response}



# fastapi-app/main.py
from dotenv import load_dotenv
from fastapi import FastAPI, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse
from llama_index import GPTVectorStoreIndex, SimpleDirectoryReader, ServiceContext, LLMPredictor, PromptHelper
import asyncio
from pydantic import BaseModel
import openai
import sys, os, json

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

def construct_index(directory_path):
    max_input_size = 4096
    num_outputs = 5000
    max_chunk_overlap = 256
    chunk_size_limit = 3900

    print("*"*5, "Documents parsing initiated", "*"*5)
    file_metadata = lambda x : {"filename": x}
    reader = SimpleDirectoryReader(directory_path, file_metadata=file_metadata)
    print(reader)
    documents = reader.load_data()
    print("*"*5, "Documents parsing done", "*"*5)
    
    print(documents[0].extra_info)
    print(documents[0].doc_id)
    
    print()
    prompt_helper = PromptHelper(max_input_size, num_outputs, max_chunk_overlap, chunk_size_limit=chunk_size_limit)
    llm_predictor = LLMPredictor(llm=openai.ChatCompletion.create)
    
    service_context = ServiceContext.from_defaults(llm_predictor=llm_predictor, prompt_helper=prompt_helper)

    print("*"*5, "Index creation initiated", "*"*5)
    index = GPTVectorStoreIndex.from_documents(
        documents=documents, service_context=service_context
    )
    print("*"*5, "Index created", "*"*5)
    return index

data_directory = "./data"
index = construct_index(data_directory)
query_engine = index.as_query_engine(streaming=True)

# async def astreamer(generator):
#     try:
#         for i in generator:
#             yield (i)
#             await asyncio.sleep(.1)
#     except asyncio.CancelledError as e:
#         print('cancelled')

@app.get("/")
def read_root():
    return {"message": "Hello, FastAPI!"}

async def astreamer(generator):
    try:
        for i in generator:
            yield f"data: {i}\n\n"
            await asyncio.sleep(.1)
    except asyncio.CancelledError as e:
        print('cancelled')


# @app.get("/api/chatbot/{user_input}",  dependencies=[Depends(require_auth)])
@app.get("/api/chatbot/{user_input}")
async def get_chatbot_response(user_input: str):
    if not user_input:
        raise HTTPException(status_code=400, detail="User input cannot be empty.")

    # Use OpenAI to generate a response (this is a simplified example)
    response = openai.Completion.create(
        engine="gpt-3.5-turbo-instruct",  # Choose an appropriate engine
        prompt=user_input,
        max_tokens=50  # Adjust as needed
    )
    chatbot_response = response.choices[0]["text"]
    
    # return {"response": chatbot_response}

    return StreamingResponse(astreamer([chatbot_response]), media_type="text/plain")
    # return StreamingResponse(astreamer(response.response_ms), media_type="text/plain")
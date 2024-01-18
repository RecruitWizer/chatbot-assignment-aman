# fastapi-app/main.py
from dotenv import load_dotenv
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse
from llama_index import ServiceContext, GPTVectorStoreIndex, LLMPredictor, PromptHelper, SimpleDirectoryReader, load_index_from_storage, StorageContext, ServiceContext
import openai
import asyncio 
from types import FunctionType
from pydantic import BaseModel
# from openai.openai_client import OPENAI_API_KEY
import sys, os
sys.path.append(".")

load_dotenv()

OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")
# print(OPENAI_API_KEY)
if OPENAI_API_KEY is None:
    raise EnvironmentError("OpenAI API key not found. Make sure it is set in the .env file.")

openai.api_key = OPENAI_API_KEY
os.environ["OPENAI_API_KEY"] = OPENAI_API_KEY

app = FastAPI()

# CORS (Cross-Origin Resource Sharing) middleware for handling cross-origin requests
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Adjust as needed for your front-end's origin
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# def construct_index(directory_path):
#     max_input_size = 4096
#     num_outputs = 5000
#     max_chunk_overlap = 256
#     chunk_size_limit = 3900

#     print("*"*5, "Documents parsing initiated", "*"*5)
#     file_metadata = lambda x : {"filename": x}
#     reader = SimpleDirectoryReader(directory_path, file_metadata=file_metadata)
#     print(reader)
#     documents = reader.load_data()
#     print("*"*5, "Documents parsing done", "*"*5)
    
#     print(documents[0].extra_info)
#     print(documents[0].doc_id)
    
#     print()
#     # nodes = parser.get_nodes_from_documents(documents)
#     # index = GPTVectorStoreIndex(nodes)
#     prompt_helper = PromptHelper(max_input_size, num_outputs, max_chunk_overlap, chunk_size_limit=chunk_size_limit)
#     llm_predictor = LLMPredictor(llm=OpenAI(temperature=0, model_name="gpt-3.5-turbo", max_tokens=num_outputs))
    
#     service_context = ServiceContext.from_defaults(llm_predictor=llm_predictor, prompt_helper=prompt_helper)

#     # print("*"*5, "Index creation initiated", "*"*5)
#     index = GPTVectorStoreIndex.from_documents(
#         documents=documents, service_context = service_context
#     )
#     # print("*"*5, "Index created", "*"*5)
#     index.storage_context.persist("./jsons/contentstack_llm")
#     return index
    

class OpenAIPredictor:
    def __init__(self, api_key, model_name="gpt-3.5-turbo-instruct", temperature=0.7, max_tokens=150, streaming=False):
        self.api_key = api_key
        self.model_name = model_name
        self.temperature = temperature
        self.max_tokens = max_tokens
        self.streaming = streaming

    async def predict(self, prompt):
        async with openai.Stream.create(
            engine=self.model_name,
            prompt=prompt,
            temperature=self.temperature,
            max_tokens=self.max_tokens,
            stop=None if self.streaming else "\n",
        ) as response_stream:
            async for chunk in response_stream:
                yield chunk["choices"][0]["text"]

    async def predict_generator(self, prompts):
        for prompt in prompts:
            yield await self.predict(prompt)

class OpenAIStreamingPredictor(OpenAIPredictor):
    def __init__(self, api_key, model_name="gpt-3.5-turbo-instruct", temperature=0.7, max_tokens=150):
        super().__init__(api_key, model_name, temperature, max_tokens, streaming=True)


def get_index():
    max_input_size = 4000
    num_outputs = 1024
    max_chunk_overlap = 512
    chunk_size_limit = 3900
    predictor = OpenAIStreamingPredictor(api_key=OPENAI_API_KEY, model_name="gpt-3.5-turbo-instruct", temperature=0, max_tokens=num_outputs)
    
    prompt_helper = PromptHelper(max_input_size, num_outputs, max_chunk_overlap, chunk_size_limit=chunk_size_limit)
    service_context = ServiceContext.from_defaults(llm_predictor=predictor, prompt_helper=prompt_helper)
    
    return service_context

# construct_index("./documents")
storage_context = StorageContext.from_defaults(persist_dir="./data")
service_context = get_index()
index = load_index_from_storage(storage_context, service_context = service_context)

query_engine = index.as_query_engine(streaming = True)


async def astreamer(generator):
    try:
        async for i in generator:
            yield (i)
            await asyncio.sleep(.1)
    except asyncio.CancelledError as e:
        print('cancelled')

class Item(BaseModel):
    input_text: str

@app.post("/question_answering")
async def create_item(item: Item):
    # input_sentence = item.input_text
    input_sentence = 'who is Aman'
    print(input_sentence)
    response = query_engine.query(input_sentence)    
    return StreamingResponse(astreamer(response.response_gen), media_type="text/event-stream")
        

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

# from llama_index import GPTSimpteVectorIndex, SimpleDirectoryReader

# documents = SimpleDirectoryReader('./data').load_data()
# index = GPTSimpteVectorIndex.from_documents(documents)
# response = index.query("What did the author do growing up?" )
# print(response)


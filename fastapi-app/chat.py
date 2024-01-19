from typing import List

from fastapi.responses import StreamingResponse

from app.utils.json import json_to_model
from app.utils.index import get_index
from fastapi import APIRouter, Depends, HTTPException, Request, status
from llama_index import VectorStoreIndex
from llama_index.llms import MessageRole, ChatMessage
from pydantic import BaseModel

chat_router = r = APIRouter()

origins = [ 
    "http://localhost:3000", 
]

class _Message(BaseModel):
    role: MessageRole
    content: str

class _ChatData(BaseModel):
    messages: List[_Message]


@r.post("")
async def chat(
    request: Request,
    # Note: To support clients sending a JSON object using content-type "text/plain",
    # we need to use Depends(json_to_model(_ChatData)) here
    data: _ChatData = Depends(json_to_model(_ChatData)),
    index: VectorStoreIndex = Depends(get_index),
):
    # check preconditions and get last message
    if len(data.messages) == 0:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="No messages provided",
        )
    lastMessage = data.messages.pop()
    if lastMessage.role != MessageRole.USER:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Last message must be from user",
        )
    # convert messages coming from the request to type ChatMessage
    messages = [
        ChatMessage(
            role=m.role,
            content=m.content,
        )
        for m in data.messages
    ]

    # query chat engine
    chat_engine = index.as_chat_engine()
    response = chat_engine.stream_chat(lastMessage.content, messages)
    #print('token is ' + str(response.response_text))
   
    async def format_openai_response(response_text):
        # Split response into paragraphs based on double line breaks
        paragraphs = response_text.split("\n\n")

        # Format paragraphs with proper indentation
        formatted_response = "\n".join(f"<p>{paragraph}</p>" for paragraph in paragraphs)

        return formatted_response

    # stream response
    async def event_generator():
        final_response= response.response_gen
        for token in final_response:
            # If client closes connection, stop sending events
            if await request.is_disconnected():
                break
            yield token.encode()

    return StreamingResponse(event_generator(), media_type="text/plain")

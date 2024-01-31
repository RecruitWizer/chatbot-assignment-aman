# middleware/auth.py
from fastapi import HTTPException, Depends
from fastapi.security import OAuth2AuthorizationCodeBearer

security = OAuth2AuthorizationCodeBearer(tokenUrl="token")

def require_auth(token: str = Depends(security)):
    # Check if the user is authenticated
    if token:  # Replace with your actual authentication logic
        return True
    else:
        raise HTTPException(status_code=401, detail="Unauthorized")

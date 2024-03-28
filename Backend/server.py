
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from pymongo import MongoClient
from pymongo.server_api import ServerApi
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Adjust this to the domain of your frontend
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allow_headers=["*"],
)


# Connect to MongoDB Atlas (replace <username>, <password>, <dbname>, and <cluster-url> with your credentials)
client = MongoClient("mongodb+srv://mdnokib2000:FjQRoHlzq7gKyZtA@ip-lab.y4pic.mongodb.net/?retryWrites=true&w=majority&appName=ip-lab", server_api=ServerApi('1'))
db = client["TestDB"]
collection = db["users"]

class User(BaseModel):
    username: str
    password: str
    confirmPassword: str
    email: str
    phoneNumber: str

@app.post("/register")
async def register_user(user: User):
    # Backend validations
    if len(user.username) <= 5:
        raise HTTPException(status_code=400, detail="Username must have more than 5 characters")
    if user.password != user.confirmPassword:
        raise HTTPException(status_code=400, detail="Passwords do not match")
    if len(user.password) <= 6:
        raise HTTPException(status_code=400, detail="Password must have more than 6 characters")
    # Check for uniqueness in email, phone number, and username
    if collection.find_one({"username": user.username}):
        raise HTTPException(status_code=400, detail="Username already exists")
    if collection.find_one({"email": user.email}):
        raise HTTPException(status_code=400, detail="Email already exists")
    if collection.find_one({"phoneNumber": user.phoneNumber}):
        raise HTTPException(status_code=400, detail="Phone number already exists")
    if len(user.phoneNumber) != 11:
        raise HTTPException(status_code=400, detail="Phone number must have exactly 11 digits")
    
    # Save user data to MongoDB
    collection.insert_one(user.dict())
    
    return {"message": "User registered successfully"}

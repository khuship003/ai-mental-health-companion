from fastapi import FastAPI
from pydantic import BaseModel
from dotenv import load_dotenv
from google import genai
import os

load_dotenv()
from pymongo import MongoClient

mongo_client = MongoClient(os.getenv("MONGO_URI"))
db = mongo_client["mental_health_app"]
mood_collection = db["mood_entries"]

client = genai.Client(api_key=os.getenv("GEMINI_API_KEY"))

app = FastAPI()

class ChatRequest(BaseModel):
    message: str
    history: list = []

SYSTEM_PROMPT = """You are a supportive, empathetic mental health companion.
You listen actively, validate feelings, and offer gentle coping suggestions.
You are NOT a licensed therapist. For serious concerns, gently encourage
the user to reach out to a mental health professional or helpline."""
CRISIS_KEYWORDS = [
    "kill myself", "suicide", "end my life", "want to die",
    "self harm", "self-harm", "hurt myself", "no reason to live",
    "better off dead", "can't go on"
]

CRISIS_RESPONSE = (
    "I'm really concerned about what you just shared, and I want you to know "
    "you don't have to go through this alone. Please reach out to a mental health "
    "professional or a crisis helpline right now — they're trained to help in "
    "moments like this.\n\n"
    "If you're in India, you can call the AASRA helpline at 91-9820466726, "
    "available 24/7.\n\n"
    "If you're in immediate danger, please contact your local emergency services "
    "right away. Your life matters, and there are people who want to help."
)

def contains_crisis_language(message: str) -> bool:
    lowered = message.lower()
    return any(keyword in lowered for keyword in CRISIS_KEYWORDS)

@app.get("/")
def read_root():
    return {"message": "Hello! Your backend is alive."}

@app.post("/chat")
def chat(request: ChatRequest):
    if contains_crisis_language(request.message):
        return {"reply": CRISIS_RESPONSE}

    # Build the conversation so far into one text block
    conversation = SYSTEM_PROMPT + "\n\n"
    for msg in request.history:
        speaker = "User" if msg["role"] == "user" else "Companion"
        conversation += f"{speaker}: {msg['text']}\n"
    conversation += f"User: {request.message}\nCompanion:"

    response = client.models.generate_content(
        model="gemini-3.6-flash",
        contents=conversation
    )
    return {"reply": response.text}
from datetime import datetime

class MoodEntry(BaseModel):
    mood: int  # 1 to 5
    note: str = ""

@app.post("/mood")
def add_mood(entry: MoodEntry):
    mood_doc = {
        "mood": entry.mood,
        "note": entry.note,
        "timestamp": datetime.utcnow().isoformat()
    }
    mood_collection.insert_one(mood_doc)
    return {"status": "success", "message": "Mood logged!"}

@app.get("/mood/history")
def get_mood_history():
    entries = list(mood_collection.find({}, {"_id": 0}).sort("timestamp", -1))
    return {"entries": entries}
# 🧠 AI Mental Health Companion

A full-stack mobile application offering a supportive, AI-powered chat companion with mood tracking — built with React Native, FastAPI, Google Gemini, and MongoDB.

## 📱 Overview

This app provides a safe space for users to talk through their feelings with an empathetic AI companion, track their mood over time, and receive appropriate support resources — including built-in crisis detection that redirects users to real helplines when needed.

**Note:** This is a portfolio/learning project and is not a substitute for professional mental health care.

## ✨ Features

- **AI Chat Companion** — Context-aware conversations powered by Google Gemini, with full conversation memory so the AI remembers earlier parts of the chat
- **Crisis Detection** — Keyword-based safety layer that intercepts messages indicating self-harm risk and responds with verified helpline information instead of relying on AI-generated text
- **Mood Tracking** — Daily mood check-ins (1–5 scale with optional notes), persisted to a cloud database, with a scrollable history view
- **Tab Navigation** — Clean two-tab mobile UI (Chat + Mood) built with Expo Router
- **Real-time, Cross-Device Architecture** — Mobile app communicates with a locally-hosted Python backend over the local network

## 🛠️ Tech Stack

**Frontend**
- React Native (Expo)
- TypeScript
- Expo Router (file-based navigation)
- Axios

**Backend**
- Python, FastAPI
- Google Gemini API (`google-genai`)
- MongoDB Atlas (via PyMongo)
- Uvicorn (ASGI server)

## 🏗️ Architecture
React Native App (Expo)
│
│ HTTP requests
▼
FastAPI Backend (Python)
│
├──► Google Gemini API (AI responses)
└──► MongoDB Atlas (mood entry storage)


## 🚀 Getting Started

### Prerequisites
- Node.js and npm
- Python 3.10+
- A free [Google Gemini API key](https://aistudio.google.com/apikey)
- A free [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) cluster
- [Expo Go](https://expo.dev/go) app on your phone (for testing)

### Backend Setup
```bash
cd backend
python -m venv venv
venv\Scripts\activate        # Windows
# source venv/bin/activate   # Mac/Linux

pip install -r requirements.txt
```

Create a `.env` file in `backend/`:

GEMINI_API_KEY=your_gemini_api_key_here
MONGO_URI=your_mongodb_connection_string_here


Run the server:
```bash
uvicorn main:app --reload --host 0.0.0.0
```

### Frontend Setup
```bash
cd frontend
npm install
npx expo start
```

Update the `BACKEND_URL` constant in `src/app/index.tsx` and `src/app/explore.tsx` to match your machine's local IP address (find it via `ipconfig` on Windows or `ifconfig` on Mac/Linux).

Scan the QR code with Expo Go to run the app on your phone.

## 🔐 Safety Design

The backend checks every incoming message against a set of crisis-related keywords **before** it reaches the AI model. If a match is found, the app bypasses the AI entirely and returns a pre-written, verified response with crisis helpline information — ensuring consistent, appropriate handling of sensitive situations rather than leaving it to AI-generated text.

## 📌 Future Improvements

- Persist chat history across sessions
- User authentication
- More robust, ML-based crisis detection
- Push notifications for daily check-in reminders

## 👩‍💻 Author

Khushi Prakash
[GitHub](https://github.com/khuship003)
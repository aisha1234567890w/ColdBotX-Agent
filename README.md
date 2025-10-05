🧠 ColdBotX — Voice-Driven Lead Collection Agent

ColdBotX is an intelligent voice-based conversational agent that collects user information such as name, email, and phone number through speech or text input. It uses speech recognition and text-to-speech technologies to interact naturally with users and stores the collected data for further automation (e.g., CRM integration, Twilio voice call flows, and booking systems).

🚀 Current Features

🎙️ Speech-to-Text (STT) for user responses

🔊 Text-to-Speech (TTS) for agent prompts

✉️ Email and phone normalization (handles “at sign,” “dot,” etc.)

💾 Data storage (currently Excel, to be migrated to Postgres)

🧩 Fallback to typed input when voice fails

⚙️ Planned Enhancements

Integration with Twilio for real phone calls

Database migration to PostgreSQL

REST API endpoints for external systems

Orchestration via n8n or microservices

Booking and CRM connection

Setup Instructions

Clone the repo:

git clone https://github.com/aisha1234567890w/ColdBotX-Agent.git
ColdBotX-Agent


Create a virtual environment:

python -m venv .venv
.venv\Scripts\activate


Install dependencies:

pip install -r requirements.txt


Run the voice agent:

python agents/voice_agent.py
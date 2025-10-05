ColdBot – Automated Cold Calling Voice Agent

ColdBot is a Python-based voice assistant created for our Final Year Project (FYP) to automate **cold calling** tasks.  
It listens to spoken input, extracts user details (name, gender, email, phone), and stores them in an Excel file for follow-up.

Features
 Speech Recognition: Captures details through voice input.  
 Text-to-Speech: Speaks prompts and confirmations.  
 Excel Integration: Automatically creates `user_records.xlsx` and appends new entries with styled headers.  
 Data Cleaning: Normalizes email addresses and phone numbers (e.g., “at sign” → “@”, spoken numbers → digits).  
 Fallback Input: If speech fails, you can type responses.


Requirements

Install Python
- Install [Python 3.9+](https://www.python.org/downloads/).  
- During installation, tick **“Add Python to PATH.”**

Install Dependencies
Open a terminal (Command Prompt, PowerShell, or Git Bash) and run:
```bash
pip install pyttsx3 SpeechRecognition openpyxl pyaudio

import pyttsx3

engine = pyttsx3.init("sapi5")  # Force Windows voice engine
voices = engine.getProperty("voices")
engine.setProperty("voice", voices[0].id)  # Try voices[1] for female voice
engine.setProperty("rate", 175)

for text in ["Testing voice one", "Testing voice two", "Testing voice three"]:
    print(text)
    engine.say(text)

engine.runAndWait()

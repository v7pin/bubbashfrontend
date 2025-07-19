import os
import sys
import subprocess

# Auto install required packages if not installed
required_packages = ["fastapi", "uvicorn", "pandas", "transformers", "torch", "openai"]
for package in required_packages:
    try:
        __import__(package)
    except ImportError:
        subprocess.check_call([sys.executable, "-m", "pip", "install", package])

import pandas as pd
import numpy as np
from fastapi import FastAPI
from pydantic import BaseModel
from typing import Optional, List, Dict
import openai
import torch
from transformers import AutoTokenizer, AutoModelForSequenceClassification

# === CONFIG ===
OPENAI_API_KEY = os.getenv("OPENAI_API_KEY") or "your-openai-api-key-here"
openai.api_key = OPENAI_API_KEY

app = FastAPI()

MODEL_NAME = "distilbert-base-uncased-finetuned-sst-2-english"  # Replace with your intent model if needed

# --- Sample Data Generation ---
def generate_sample_transactions(num=100):
    from random import randint, choice, uniform
    categories = ["Shopping", "Food", "Entertainment", "Transport", "Bills", "Health"]
    transactions = []
    for i in range(num):
        transaction = {
            "transaction_id": f"T{i+1:04d}",
            "amount": round(uniform(50, 2000), 2),
            "category": choice(categories),
            "timestamp": f"2025-05-{randint(1,28):02d} {randint(0,23):02d}:{randint(0,59):02d}:00"
        }
        transactions.append(transaction)
    df = pd.DataFrame(transactions)
    os.makedirs("data", exist_ok=True)
    df.to_csv("data/sample_transactions.csv", index=False)
    print("Generated data/sample_transactions.csv")

def generate_sample_bubbles():
    bubbles = [
        {"bubble_name": "Shopping", "budget": 10000, "spent": 4500},
        {"bubble_name": "Food", "budget": 8000, "spent": 5200},
        {"bubble_name": "Entertainment", "budget": 5000, "spent": 2100},
        {"bubble_name": "Transport", "budget": 3000, "spent": 1200},
        {"bubble_name": "Bills", "budget": 7000, "spent": 6400},
        {"bubble_name": "Health", "budget": 4000, "spent": 1500},
    ]
    df = pd.DataFrame(bubbles)
    os.makedirs("data", exist_ok=True)
    df.to_csv("data/sample_bubbles.csv", index=False)
    print("Generated data/sample_bubbles.csv")

def ensure_sample_data():
    if not os.path.isfile("data/sample_transactions.csv"):
        generate_sample_transactions(100)
    else:
        print("sample_transactions.csv found, skipping generation.")
    if not os.path.isfile("data/sample_bubbles.csv"):
        generate_sample_bubbles()
    else:
        print("sample_bubbles.csv found, skipping generation.")

# Load data after ensuring sample data exists
def load_data():
    transactions = pd.read_csv("data/sample_transactions.csv")
    bubbles = pd.read_csv("data/sample_bubbles.csv")
    return transactions, bubbles

# Load intent detection model and tokenizer
tokenizer = AutoTokenizer.from_pretrained(MODEL_NAME)
model = AutoModelForSequenceClassification.from_pretrained(MODEL_NAME)

INTENT_KEYWORDS = {
    "total_spend": ["how much", "total spend", "spent overall", "total expenses"],
    "bubble_spend": ["spent in bubble", "how much in", "spending in", "used from"],
    "bubble_balance": ["balance in bubble", "remaining budget", "left in bubble"],
    "saving_tips": ["saving tips", "how to save", "reduce spend", "budget advice"],
}

chat_history: Dict[str, List[Dict]] = {}

class Query(BaseModel):
    user_id: str
    question: str

def detect_intent_keywords(question: str) -> Optional[str]:
    question_lower = question.lower()
    for intent, keywords in INTENT_KEYWORDS.items():
        if any(kw in question_lower for kw in keywords):
            return intent
    return None

def predict_intent_transformer(question: str) -> str:
    inputs = tokenizer(question, return_tensors="pt")
    outputs = model(**inputs)
    probs = torch.nn.functional.softmax(outputs.logits, dim=-1)
    pred_label = torch.argmax(probs).item()
    # This is a placeholder mapping - adjust as per your model classes
    return "general"

def parse_intent(question: str) -> str:
    intent = detect_intent_keywords(question)
    if intent:
        return intent
    return predict_intent_transformer(question)

def fetch_bubble_name(question: str, bubbles_df) -> Optional[str]:
    question_lower = question.lower()
    for bubble in bubbles_df["bubble_name"]:
        if bubble.lower() in question_lower:
            return bubble
    return None

def generate_response(intent: str, question: str, transactions_df, bubbles_df) -> str:
    if intent == "total_spend":
        total = transactions_df["amount"].sum()
        return f"You have spent ₹{total:.2f} in total."

    if intent == "bubble_spend":
        bubble = fetch_bubble_name(question, bubbles_df)
        if bubble:
            spent = bubbles_df.loc[bubbles_df["bubble_name"] == bubble, "spent"].values[0]
            return f"You have spent ₹{spent} from your '{bubble}' bubble."
        else:
            return "Please specify a valid bubble name."

    if intent == "bubble_balance":
        bubble = fetch_bubble_name(question, bubbles_df)
        if bubble:
            budget = bubbles_df.loc[bubbles_df["bubble_name"] == bubble, "budget"].values[0]
            spent = bubbles_df.loc[bubbles_df["bubble_name"] == bubble, "spent"].values[0]
            balance = budget - spent
            return f"Your balance in '{bubble}' bubble is ₹{balance}."
        else:
            return "Please specify a valid bubble name."

    if intent == "saving_tips":
        return "Try reducing dining out, use cashback offers, and set monthly limits on discretionary spending."

    # Default: call OpenAI for other questions
    return call_openai_api(question)

def call_openai_api(question: str) -> str:
    prompt = f"You are a helpful finance assistant. Answer this question concisely:\nQ: {question}\nA:"
    try:
        response = openai.Completion.create(
            engine="text-davinci-003",
            prompt=prompt,
            max_tokens=150,
            temperature=0.5,
            n=1,
            stop=["\n"],
        )
        return response.choices[0].text.strip()
    except Exception:
        return "Sorry, I am unable to answer right now. Please try again later."

@app.post("/chat")
async def chat(query: Query):
    user_id = query.user_id
    question = query.question.strip()

    if user_id not in chat_history:
        chat_history[user_id] = []
    chat_history[user_id].append({"role": "user", "content": question})

    intent = parse_intent(question)
    answer = generate_response(intent, question, transactions_df, bubbles_df)

    chat_history[user_id].append({"role": "bot", "content": answer})

    return {"answer": answer}

if __name__ == "__main__":
    ensure_sample_data()
    transactions_df, bubbles_df = load_data()
    import uvicorn
    print("Starting FastAPI server at http://127.0.0.1:8000")
    uvicorn.run(app, host="0.0.0.0", port=8000)

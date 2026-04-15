"""
AI Master - Advanced Backend
SeekhoWithRua | Gemma 4 powered tutor with emotion-awareness & conversation memory
"""

from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
import google.generativeai as genai
import os
import datetime
import re

app = Flask(__name__, static_folder='.')
CORS(app)

# ── CONFIG ──
GEMMA_API_KEY = os.environ.get('GEMMA_API_KEY', 'AIzaSyDLoPaH86c7QD0UFozSOVL5877uuLkbP6g')
genai.configure(api_key=GEMMA_API_KEY)

model = genai.GenerativeModel(
    model_name="gemma-4-31b-it",
    generation_config=genai.GenerationConfig(
        temperature=0.7,
        top_p=0.95,
        max_output_tokens=2048,
    )
)

# ── SYSTEM PROMPT (emotion-adaptive) ──
BASE_SYSTEM = """You are AI Master — an expert coding tutor and AI teacher for SeekhoWithRua.

CORE RULES (NEVER BREAK THESE):
1. NEVER show your internal reasoning, drafts, thought process, asterisks, or bullet-point planning.
2. NEVER output lines like "* Role: ...", "* Draft 1:", "* Tone:", "* Constraint:" — those are FORBIDDEN.
3. Respond ONLY with the final, clean, polished answer. No preamble.
4. Use Markdown properly: headers, code blocks (with language), bullet points, bold.
5. Always include working code examples with ```language ... ``` blocks.
6. Be concise but thorough. No padding.

EXPERTISE:
- Python, JavaScript, TypeScript, React, Node.js, FastAPI, Flask
- Machine Learning, Deep Learning, Data Science, NLP
- SQL, MongoDB, Redis, databases
- DevOps, Git, Docker, APIs
- Algorithms, Data Structures
- System Design

TEACHING STYLE:
- Explain concepts → show code → explain the code
- For beginners: use analogies, simple language
- For advanced users: go deep, mention trade-offs, best practices
- Always offer to go deeper or show variations
- Spot and gently correct typos/errors in the user's question
"""

EMOTION_ADDONS = {
    "confused":   "\n\nUser seems CONFUSED — be extra clear, use a simple analogy first, then explain step-by-step.",
    "frustrated": "\n\nUser seems FRUSTRATED — be empathetic, acknowledge the difficulty, reassure them, then solve it calmly.",
    "excited":    "\n\nUser is EXCITED — match their energy! Be enthusiastic, go deep, suggest cool extensions.",
    "curious":    "\n\nUser is CURIOUS — satisfy their curiosity with extra detail, interesting facts, and related concepts.",
    "struggling": "\n\nUser is STRUGGLING — break it into the smallest possible steps. Be patient and encouraging.",
    "happy":      "\n\nUser is happy — keep the good vibes, move to the next level of complexity if appropriate.",
    "neutral":    "",
}


def build_system_prompt(emotion: str) -> str:
    addon = EMOTION_ADDONS.get(emotion, "")
    return BASE_SYSTEM + addon


def clean_response(text: str) -> str:
    """Remove any leaked internal reasoning lines."""
    lines = text.split('\n')
    cleaned = []
    skip_patterns = [
        r'^\* (User|Role|Tone|Constraint|Draft \d|Correction|What|Key|Why|Analysis):',
        r'^\*Draft \d+\*:',
        r'^\* \*Draft',
        r'^- (Role|Tone|Constraint|Draft):',
    ]
    for line in lines:
        skip = any(re.match(p, line.strip()) for p in skip_patterns)
        if not skip:
            cleaned.append(line)
    result = '\n'.join(cleaned).strip()
    # Remove leading asterisk lines
    result = re.sub(r'^(\* [A-Z][^:]+: .+\n?)+', '', result, flags=re.MULTILINE).strip()
    return result


def format_history_for_gemma(messages: list) -> list:
    """Convert frontend message history to Gemma chat format."""
    formatted = []
    for msg in messages:
        role = 'user' if msg.get('role') == 'user' else 'model'
        formatted.append({
            'role': role,
            'parts': [msg.get('content', '')]
        })
    return formatted


# ── ROUTES ──

@app.route('/')
def serve_frontend():
    return send_from_directory('.', 'index.html')


@app.route('/api/chat', methods=['POST', 'OPTIONS'])
def chat():
    if request.method == 'OPTIONS':
        return jsonify({}), 200

    try:
        data = request.get_json()

        # Support both old (message) and new (messages array) format
        if 'messages' in data:
            messages = data['messages']
            emotion = data.get('emotion', 'neutral')
        else:
            # Legacy single-message format
            messages = [{'role': 'user', 'content': data.get('message', '')}]
            emotion = 'neutral'

        if not messages:
            return jsonify({'error': 'No messages provided'}), 400

        system_prompt = build_system_prompt(emotion)

        # Build Gemma history (all but last message)
        history = format_history_for_gemma(messages[:-1]) if len(messages) > 1 else []
        current_user_msg = messages[-1]['content']

        # Prepend system prompt to first user message if no history
        if not history:
            current_user_msg = f"{system_prompt}\n\n---\n\n{current_user_msg}"
        else:
            # Add system as first turn context
            if history[0]['role'] != 'user' or 'AI Master' not in history[0]['parts'][0]:
                history.insert(0, {
                    'role': 'user',
                    'parts': [f"{system_prompt}\n\nReady to help!"]
                })
                history.insert(1, {
                    'role': 'model',
                    'parts': ["Absolutely! I'm AI Master, your expert coding tutor. What do you want to learn or build today?"]
                })

        chat_session = model.start_chat(history=history)
        response = chat_session.send_message(current_user_msg)

        raw_text = response.text
        clean_text = clean_response(raw_text)

        return jsonify({
            'success': True,
            'response': clean_text,
            'emotion_detected': emotion,
            'provider': 'Gemma 4',
            'timestamp': datetime.datetime.now().isoformat(),
            'tokens_used': len(clean_text.split())
        })

    except Exception as e:
        print(f"[ERROR] {str(e)}")
        return jsonify({
            'success': False,
            'error': 'Failed to get response',
            'details': str(e)
        }), 500


@app.route('/api/health', methods=['GET'])
def health():
    return jsonify({
        'status': 'ok',
        'model': 'Gemma 4',
        'version': '2.0.0',
        'features': ['emotion-detection', 'conversation-memory', 'code-highlighting', 'markdown'],
        'timestamp': datetime.datetime.now().isoformat()
    })


if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5000))
    print(f"🚀 AI Master v2.0 running on port {port}")
    app.run(debug=True, host='0.0.0.0', port=port)
from flask import Flask, request, jsonify, send_from_directory
from textblob import TextBlob
import os

app = Flask(__name__, static_folder='../frontend', static_url_path='')

# Serve the frontend
@app.route('/')
def index():
    return send_from_directory(app.static_folder, 'index.html')

# Sentiment analysis endpoint
@app.route('/api/sentiment', methods=['POST'])
def analyze_sentiment():
    data = request.get_json()
    text = data.get('text', '')
    if not text:
        return jsonify({'error': 'No text provided'}), 400

    # Analyze sentiment using TextBlob
    blob = TextBlob(text)
    polarity = blob.sentiment.polarity  # range -1 to 1

    # Determine sentiment label
    if polarity > 0.1:
        sentiment = 'positive'
        reply = "That sounds great! 😊"
    elif polarity < -0.1:
        sentiment = 'negative'
        reply = "Oh no, I'm sorry to hear that. 😔"
    else:
        sentiment = 'neutral'
        reply = "I see. Tell me more!"

    return jsonify({
        'sentiment': sentiment,
        'polarity': polarity,
        'reply': reply
    })

if __name__ == '__main__':
    app.run(debug=True)
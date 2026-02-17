document.addEventListener('DOMContentLoaded', () => {
    const messagesDiv = document.getElementById('messages');
    const userInput = document.getElementById('userInput');
    const sendBtn = document.getElementById('sendBtn');

    // Function to add a message to the chat
    function addMessage(text, sender) {
        const messageDiv = document.createElement('div');
        messageDiv.classList.add('message', sender === 'user' ? 'user-message' : 'bot-message');
        messageDiv.textContent = text;
        messagesDiv.appendChild(messageDiv);
        messagesDiv.scrollTop = messagesDiv.scrollHeight; // auto-scroll
    }

    // Function to send user message to backend and get bot reply
    async function sendMessage(message) {
        addMessage(message, 'user');

        try {
            const response = await fetch('/api/sentiment', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ text: message })
            });

            const data = await response.json();
            if (response.ok) {
                // Bot reply: sentiment + predefined reply
                const botReply = `**Sentiment:** ${data.sentiment} (${data.polarity.toFixed(2)})\n${data.reply}`;
                addMessage(botReply, 'bot');
            } else {
                addMessage('Sorry, something went wrong.', 'bot');
            }
        } catch (error) {
            console.error('Error:', error);
            addMessage('Network error. Is the backend running?', 'bot');
        }
    }

    // Event listeners
    sendBtn.addEventListener('click', () => {
        const message = userInput.value.trim();
        if (message) {
            sendMessage(message);
            userInput.value = '';
        }
    });

    userInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            sendBtn.click();
        }
    });
});

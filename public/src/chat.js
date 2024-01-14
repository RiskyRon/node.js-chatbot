// chat.js

function addMessage(sender, message) {
  const chat = document.getElementById('chat');
  const messageElem = document.createElement('div');
  messageElem.classList.add('p-2', 'rounded', 'bg-gray-700', 'self-start');

  if (sender === 'user') {
    messageElem.classList.add('bg-blue-500');
  } else {
    messageElem.classList.add('bg-gray-500');
  }

  messageElem.innerText = message;
  chat.appendChild(messageElem);
  chat.scrollTop = chat.scrollHeight;
}

document.getElementById('message-form').addEventListener('submit', function(event) {
  event.preventDefault();
  const input = document.getElementById('message-input');
  const message = input.value.trim();
  if(message) {
    addMessage('user', message);
    fetch('/message', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ message: message }),
    })
    .then(response => response.json())
    .then(data => addMessage('bot', data.message))
    .catch(error => console.error('Error:', error));
  }
  input.value = ''; 
  input.focus();
});
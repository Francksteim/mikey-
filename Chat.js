const apiKey = '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';
const model = 'openai/gpt-3.5-turbo'; // Tu peux changer pour mistralai/mistral-7b-instruct

const messagesDiv = document.getElementById('messages');
const input = document.getElementById('input');
const send = document.getElementById('send');

send.addEventListener('click', async () => {
  const userMessage = input.value.trim();
  if (!userMessage) return;

  appendMessage("👤", userMessage);
  input.value = "";

  try {
    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: model,
        messages: [
          { role: "system", content: "Tu es un assistant utile et gentil." },
          { role: "user", content: userMessage }
        ]
      })
    });

    const data = await response.json();

    if (data.choices && data.choices.length > 0) {
      const botMessage = data.choices[0].message.content;
      appendMessage("🤖", botMessage);
    } else {
      appendMessage("❌", "Erreur dans la réponse de l'API.");
    }
  } catch (error) {
    console.error(error);
    appendMessage("❌", "Erreur du serveur.");
  }
});

function appendMessage(sender, text) {
  const div = document.createElement("div");
  div.className = "msg";
  div.innerHTML = `<strong>${sender}</strong> : ${text}`;
  messagesDiv.appendChild(div);
  messagesDiv.scrollTop = messagesDiv.scrollHeight;
}
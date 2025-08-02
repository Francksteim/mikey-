const sendBtn = document.getElementById("send");
const messageInput = document.getElementById("messageInput");
const chatMessages = document.getElementById("chatMessages");
const typingIndicator = document.getElementById("typingIndicator");

const API_URL = "/api/chat"; // 🔒 Utilise la route proxy backend
const MODEL = "openai/gpt-4";
const MAX_TOKENS = 500;

sendBtn.addEventListener("click", async () => {
  const userMessage = messageInput.value.trim();
  if (userMessage === "") return;

  addMessage("user", userMessage);
  messageInput.value = "";
  typingIndicator.style.display = "block";

  try {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: MODEL,
        messages: [{ role: "user", content: userMessage }],
        max_tokens: MAX_TOKENS
      })
    });

    const data = await response.json();
    console.log("Réponse API proxy :", data);

    const botReply = data?.choices?.[0]?.message?.content || data?.error?.message || "Erreur de réponse.";
    addMessage("bot", botReply);
  } catch (error) {
    console.error("Erreur Proxy API :", error);
    addMessage("bot", "😵 Une erreur s'est produite côté serveur.");
  } finally {
    typingIndicator.style.display = "none";
  }
});

function addMessage(role, text) {
  const messageDiv = document.createElement("div");
  messageDiv.className = `message ${role}`;
  messageDiv.innerHTML = role === "bot"
    ? `<div class="message-avatar">🤖</div><div class="message-bubble">${text}</div>`
    : `<div class="message-bubble">${text}</div><div class="message-avatar">👤</div>`;
  chatMessages.appendChild(messageDiv);
  chatMessages.scrollTop = chatMessages.scrollHeight;
}
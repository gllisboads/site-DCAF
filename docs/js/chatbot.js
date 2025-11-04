// ================================
// Chatbot Gemini direto no front-end
// ================================

// ⚠️ Coloque aqui sua chave da API (sem aspas extras)
const GEMINI_API_KEY = "AIzaSyAZigbzIGAEuBHt6f8H_lZMSsLZ7jcZTLE";

// Cria a interface do chatbot
const chatbotContainer = document.createElement("div");
chatbotContainer.id = "chatbot-container";
chatbotContainer.innerHTML = `
  <div id="chatbot-box">
    <div id="chatbot-header">💬 Chat DCAF (Gemini)</div>
    <div id="chatbot-messages"></div>
    <div id="chatbot-input-area">
      <input type="text" id="chatbot-input" placeholder="Digite sua pergunta..." />
      <button id="chatbot-send">Enviar</button>
    </div>
  </div>
`;
document.body.appendChild(chatbotContainer);

// Envia a pergunta ao modelo Gemini
async function sendToGemini(message) {
  try {
    const response = await fetch("http://127.0.0.1:5000/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message })
    });

    const data = await response.json();
    if (data.reply) {
      return data.reply;
    } else {
      return `⚠️ Erro: ${data.error || "sem resposta"}`;
    }
  } catch (error) {
    console.error("Erro:", error);
    return `⚠️ Falha na conexão com o servidor.`;
  }
}


// Função para exibir mensagens
function addMessage(sender, text) {
  const messages = document.getElementById("chatbot-messages");
  const msg = document.createElement("div");
  msg.className = sender;
  msg.textContent = text;
  messages.appendChild(msg);
  messages.scrollTop = messages.scrollHeight;
}

// Evento de envio
document.getElementById("chatbot-send").addEventListener("click", async () => {
  const input = document.getElementById("chatbot-input");
  const userMessage = input.value.trim();
  if (!userMessage) return;

  addMessage("user", userMessage);
  input.value = "";

  addMessage("bot", "⏳ Pensando...");
  const reply = await sendToGemini(userMessage);
  document.querySelector("#chatbot-messages .bot:last-child").textContent = reply;
});

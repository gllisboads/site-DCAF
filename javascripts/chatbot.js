document.addEventListener("DOMContentLoaded", function () {
  const chatContainer = document.createElement("div");
  chatContainer.id = "ollama-chat";
  chatContainer.style.cssText = `
    position: fixed; bottom: 20px; right: 20px; width: 350px; height: 500px;
    background: white; border: 1px solid #ccc; border-radius: 12px;
    box-shadow: 0 4px 20px rgba(0,0,0,0.15); z-index: 10000;
    display: flex; flex-direction: column; font-family: sans-serif;
  `;

  chatContainer.innerHTML = `
    <div style="padding: 12px; background: #3b82f6; color: white; border-radius: 12px 12px 0 0; font-weight: bold;">
      Chatbot Local (Ollama)
      <span style="float: right; cursor: pointer;" onclick="document.getElementById('ollama-chat').remove()">×</span>
    </div>
    <div id="chat-messages" style="flex: 1; padding: 10px; overflow-y: auto; font-size: 14px;"></div>
    <div style="display: flex; border-top: 1px solid #eee;">
      <input id="chat-input" type="text" placeholder="Digite sua pergunta..." 
             style="flex: 1; padding: 10px; border: none; outline: none; font-size: 14px;" />
      <button onclick="sendMessage()" style="padding: 0 15px; background: #3b82f6; color: white; border: none; cursor: pointer;">Enviar</button>
    </div>
  `;

  document.body.appendChild(chatContainer);

  window.sendMessage = async function () {
    const input = document.getElementById("chat-input");
    const message = input.value.trim();
    if (!message) return;

    const messagesDiv = document.getElementById("chat-messages");
    messagesDiv.innerHTML += `<div style="margin: 8px 0; text-align: right;"><small><strong>Você:</strong> ${message}</small></div>`;
    input.value = "";

    messagesDiv.innerHTML += `<div style="margin: 8px 0; text-align: left;"><small><strong>IA:</strong> <span id="thinking">pensando...</span></small></div>`;
    const thinking = document.getElementById("thinking");

    try {
      const response = await fetch("https://reimagined-umbrella-v6prq9w5xqp52pqxw-11434.app.github.dev/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "llama3",
          messages: [{ role: "user", content: message }],
          stream: false
        })
      });

      if (!response.ok) throw new Error("Erro na API");

      const data = await response.json();
      thinking.innerHTML = data.message.content.replace(/\n/g, "<br>");
    } catch (err) {
      thinking.innerHTML = "Erro: Não foi possível conectar ao Ollama.";
      console.error(err);
    }

    messagesDiv.scrollTop = messagesDiv.scrollHeight;
  };

  document.getElementById("chat-input").addEventListener("keypress", function(e) {
    if (e.key === "Enter") sendMessage();
  });
});
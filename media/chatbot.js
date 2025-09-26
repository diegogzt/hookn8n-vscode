// Obtener referencia a la API de VS Code
const vscode = acquireVsCodeApi();

// Estado del chatbot
let isTyping = false;
let messageCount = 0;
let webhookUrl = "";

document.addEventListener("DOMContentLoaded", () => {
  initializeChatbot();
});

function initializeChatbot() {
  // Elementos DOM
  const sendButton = document.getElementById("sendButton");
  const messageInput = document.getElementById("messageInput");
  const chatMessages = document.getElementById("chatMessages");
  const charCount = document.getElementById("charCount");
  const webhookInput = document.getElementById("webhookInput");
  const testButton = document.getElementById("testButton");
  const toggleConfig = document.getElementById("toggleConfig");
  const webhookConfig = document.querySelector(".webhook-config");
  const webhookStatus = document.getElementById("webhookStatus");

  // Cargar configuración guardada
  loadSavedConfig();

  // Event listeners
  setupEventListeners();

  // Mensaje inicial
  addWelcomeMessage();

  function setupEventListeners() {
    // Envío de mensajes
    sendButton.addEventListener("click", handleSendMessage);

    messageInput.addEventListener("keypress", (event) => {
      if (event.key === "Enter" && !event.shiftKey) {
        event.preventDefault();
        handleSendMessage();
      }
    });

    // Auto-resize del textarea
    messageInput.addEventListener("input", () => {
      updateCharCount();
      autoResizeTextarea(messageInput);
    });

    // Configuración del webhook
    if (webhookInput) {
      webhookInput.addEventListener("input", handleWebhookChange);
      webhookInput.addEventListener("blur", saveWebhookUrl);
    }

    if (testButton) {
      testButton.addEventListener("click", testWebhook);
    }

    if (toggleConfig) {
      toggleConfig.addEventListener("click", toggleWebhookConfig);
    }

    // Escuchar mensajes de la extensión
    window.addEventListener("message", handleExtensionMessage);
  }

  function handleSendMessage() {
    const messageText = messageInput.value.trim();
    if (messageText && !isTyping) {
      appendMessage("user", messageText, getCurrentTime());
      messageInput.value = "";
      updateCharCount();
      autoResizeTextarea(messageInput);

      // Mostrar indicador de escritura
      showTypingIndicator();

      // Enviar mensaje a través del webhook o extensión
      sendMessageToBackend(messageText);
    }
  }

  async function sendMessageToBackend(message) {
    try {
      if (webhookUrl) {
        // Enviar a webhook de N8N
        await sendToWebhook(message);
      } else {
        // Enviar a la extensión
        vscode.postMessage({
          command: "sendMessage",
          text: message,
        });
      }
    } catch (error) {
      console.error("Error enviando mensaje:", error);
      hideTypingIndicator();
      appendMessage(
        "bot",
        "❌ ERROR: No se pudo enviar el mensaje. Verifica la configuración del webhook.",
        getCurrentTime()
      );
    }
  }

  async function sendToWebhook(message) {
    try {
      const response = await fetch(webhookUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: message,
          timestamp: new Date().toISOString(),
          source: "ai-code-assistant",
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      let botResponse = "Respuesta recibida del webhook";
      const contentType = response.headers.get("content-type") || "";

      if (contentType.includes("application/json")) {
        // Respuesta en formato JSON
        try {
          const data = await response.json();
          botResponse =
            data.response || data.message || data.text || JSON.stringify(data);
        } catch (jsonError) {
          console.warn("Error parseando JSON:", jsonError);
          botResponse = await response.text();
        }
      } else {
        // Respuesta en texto plano
        botResponse = await response.text();
      }

      hideTypingIndicator();
      appendMessage("bot", botResponse, getCurrentTime());
      updateWebhookStatus("connected");
    } catch (error) {
      console.error("Error del webhook:", error);
      hideTypingIndicator();
      appendMessage(
        "bot",
        `❌ ERROR DEL WEBHOOK: ${error.message}`,
        getCurrentTime()
      );
      updateWebhookStatus("disconnected");
    }
  }

  function handleExtensionMessage(event) {
    const message = event.data;
    switch (message.command) {
      case "receiveMessage":
        hideTypingIndicator();
        appendMessage(
          "bot",
          message.text,
          message.timestamp || getCurrentTime()
        );
        break;
      case "configLoaded":
        // Cargar configuración guardada
        if (message.webhookUrl && webhookInput) {
          webhookInput.value = message.webhookUrl;
          webhookUrl = message.webhookUrl;
          if (isValidUrl(webhookUrl)) {
            testWebhook(true);
          }
        }
        break;
    }
  }

  function appendMessage(sender, text, timestamp) {
    const messageElement = document.createElement("div");
    messageElement.classList.add("message", `${sender}-message`);

    // Los avatares ahora usan CSS ::before para los iconos
    messageElement.innerHTML = `
            <div class="message-avatar"></div>
            <div class="message-content">
                <div class="message-text">${formatMessage(text)}</div>
                <div class="message-time">${timestamp}</div>
            </div>
        `;

    chatMessages.appendChild(messageElement);
    scrollToBottom();
    messageCount++;
  }

  function formatMessage(text) {
    // Formateo básico para código y enlaces
    return text
      .replace(/`([^`]+)`/g, "<code>$1</code>")
      .replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>")
      .replace(/\*([^*]+)\*/g, "<em>$1</em>")
      .replace(/\n/g, "<br>");
  }

  function showTypingIndicator() {
    if (isTyping) return;

    isTyping = true;
    const typingElement = document.createElement("div");
    typingElement.classList.add("message", "bot-message", "typing-indicator");
    typingElement.id = "typingIndicator";

    typingElement.innerHTML = `
            <div class="message-avatar"></div>
            <div class="message-content">
                <div class="typing-dots">
                    <div class="typing-dot"></div>
                    <div class="typing-dot"></div>
                    <div class="typing-dot"></div>
                </div>
            </div>
        `;

    chatMessages.appendChild(typingElement);
    scrollToBottom();

    // Deshabilitar botón de envío
    sendButton.disabled = true;
  }

  function hideTypingIndicator() {
    isTyping = false;
    const typingElement = document.getElementById("typingIndicator");
    if (typingElement) {
      typingElement.remove();
    }

    // Rehabilitar botón de envío
    sendButton.disabled = false;
  }

  function updateCharCount() {
    const count = messageInput.value.length;
    const maxLength = 1000;

    if (charCount) {
      charCount.textContent = `${count}/${maxLength}`;

      // Cambiar color según el límite
      charCount.className = "";
      if (count > maxLength * 0.9) {
        charCount.classList.add("error");
      } else if (count > maxLength * 0.8) {
        charCount.classList.add("warning");
      }
    }
  }

  function autoResizeTextarea(textarea) {
    textarea.style.height = "auto";
    textarea.style.height = Math.min(textarea.scrollHeight, 120) + "px";
  }

  function scrollToBottom() {
    setTimeout(() => {
      chatMessages.scrollTop = chatMessages.scrollHeight;
    }, 100);
  }

  function getCurrentTime() {
    return new Date().toLocaleTimeString("es-ES", {
      hour: "2-digit",
      minute: "2-digit",
    });
  }

  function handleWebhookChange() {
    const url = webhookInput.value.trim();
    webhookUrl = url;

    if (url && isValidUrl(url)) {
      updateWebhookStatus("testing");
      // Auto-test después de 1 segundo sin cambios
      clearTimeout(webhookInput.testTimeout);
      webhookInput.testTimeout = setTimeout(() => {
        testWebhook(true);
      }, 1000);
    } else {
      updateWebhookStatus("disconnected");
    }
  }

  function saveWebhookUrl() {
    // Guardar en almacenamiento local de VS Code
    vscode.postMessage({
      command: "saveConfig",
      key: "webhookUrl",
      value: webhookUrl,
    });
  }

  function loadSavedConfig() {
    // Solicitar configuración guardada
    vscode.postMessage({
      command: "loadConfig",
    });
  }

  async function testWebhook(silent = false) {
    if (!webhookUrl || !isValidUrl(webhookUrl)) {
      if (!silent) {
        alert("Por favor, ingresa una URL válida para el webhook");
      }
      updateWebhookStatus("disconnected");
      return;
    }

    updateWebhookStatus("testing");

    try {
      const response = await fetch(webhookUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: "[TEST] Test de conexión del AI Code Assistant",
          timestamp: new Date().toISOString(),
          source: "ai-code-assistant",
          test: true,
        }),
      });

      if (response.ok) {
        updateWebhookStatus("connected");
        if (!silent) {
          // Leer la respuesta para mostrarla
          const contentType = response.headers.get("content-type") || "";
          let responseText = "";

          if (contentType.includes("application/json")) {
            try {
              const data = await response.json();
              responseText =
                data.response ||
                data.message ||
                data.text ||
                JSON.stringify(data);
            } catch {
              responseText = await response.text();
            }
          } else {
            responseText = await response.text();
          }

          appendMessage(
            "bot",
            `✅ CONEXIÓN EXITOSA: Respuesta - "${responseText}"`,
            getCurrentTime()
          );
        }
      } else {
        throw new Error(`HTTP ${response.status}`);
      }
    } catch (error) {
      updateWebhookStatus("disconnected");
      if (!silent) {
        appendMessage(
          "bot",
          `❌ ERROR DE CONEXIÓN: ${error.message}`,
          getCurrentTime()
        );
      }
    }
  }

  function updateWebhookStatus(status) {
    if (!webhookStatus) return;

    webhookStatus.className = `webhook-status ${status}`;

    const statusTexts = {
      connected: "● CONECTADO",
      disconnected: "○ DESCONECTADO",
      testing: "◐ PROBANDO...",
    };

    webhookStatus.innerHTML = `
            <span class="status-indicator"></span>
            ${statusTexts[status] || "Desconocido"}
        `;
  }

  function toggleWebhookConfig() {
    if (!webhookConfig) return;

    webhookConfig.classList.toggle("collapsed");
    toggleConfig.textContent = webhookConfig.classList.contains("collapsed")
      ? "Mostrar configuración"
      : "Ocultar configuración";
  }

  function isValidUrl(string) {
    try {
      new URL(string);
      return true;
    } catch (_) {
      return false;
    }
  }

  function addWelcomeMessage() {
    setTimeout(() => {
      appendMessage(
        "bot",
        `¡Hola! 👋 Soy tu AI Code Assistant.

${
  webhookUrl
    ? "🔗 Conectado a tu webhook de N8N"
    : "⚙️ Configura un webhook para conectar con N8N"
}

Puedo ayudarte con programación, desarrollo, automatización y mucho más. ¡Pregúntame lo que necesites!`,
        getCurrentTime()
      );
    }, 500);
  }
}

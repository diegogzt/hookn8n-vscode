// Get VS Code API reference
const vscode = acquireVsCodeApi();

// Chatbot state
let isTyping = false;
let messageCount = 0;
let webhookUrl = "";

document.addEventListener("DOMContentLoaded", () => {
  initializeChatbot();
});

function initializeChatbot() {
  // DOM elements
  const sendButton = document.getElementById("sendButton");
  const messageInput = document.getElementById("messageInput");
  const chatMessages = document.getElementById("chatMessages");
  const charCount = document.getElementById("charCount");
  const webhookInput = document.getElementById("webhookInput");
  const testButton = document.getElementById("testButton");
  const toggleConfig = document.getElementById("toggleConfig");
  const webhookConfig = document.querySelector(".webhook-config");
  const webhookStatus = document.getElementById("webhookStatus");

  // Load saved configuration
  loadSavedConfig();

  // Event listeners
  setupEventListeners();

  // Initial message
  addWelcomeMessage();

  function setupEventListeners() {
    // Message sending
    sendButton.addEventListener("click", handleSendMessage);

    messageInput.addEventListener("keypress", (event) => {
      if (event.key === "Enter" && !event.shiftKey) {
        event.preventDefault();
        handleSendMessage();
      }
    });

    // Textarea auto-resize
    messageInput.addEventListener("input", () => {
      updateCharCount();
      autoResizeTextarea(messageInput);
    });

    // Webhook configuration
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

    // Listen to extension messages
    window.addEventListener("message", handleExtensionMessage);
  }

  function handleSendMessage() {
    const messageText = messageInput.value.trim();
    if (messageText && !isTyping) {
      appendMessage("user", messageText, getCurrentTime());
      messageInput.value = "";
      updateCharCount();
      autoResizeTextarea(messageInput);

      // Show typing indicator
      showTypingIndicator();

      // Send message through webhook or extension
      sendMessageToBackend(messageText);
    }
  }

  async function sendMessageToBackend(message) {
    try {
      if (webhookUrl) {
        // Send to N8N webhook
        await sendToWebhook(message);
      } else {
        // Send to extension
        vscode.postMessage({
          command: "sendMessage",
          text: message,
        });
      }
    } catch (error) {
      console.error("Error sending message:", error);
      hideTypingIndicator();
      appendMessage(
        "bot",
        "❌ ERROR: Could not send message. Check webhook configuration.",
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

      let botResponse = "Response received from webhook";
      const contentType = response.headers.get("content-type") || "";

      if (contentType.includes("application/json")) {
        // JSON response
        try {
          const data = await response.json();
          botResponse =
            data.response || data.message || data.text || JSON.stringify(data);
        } catch (jsonError) {
          console.warn("Error parsing JSON:", jsonError);
          botResponse = await response.text();
        }
      } else {
        // Plain text response
        botResponse = await response.text();
      }

      hideTypingIndicator();
      appendMessage("bot", botResponse, getCurrentTime());
      updateWebhookStatus("connected");
    } catch (error) {
      console.error("Webhook error:", error);
      hideTypingIndicator();
      appendMessage(
        "bot",
        `❌ WEBHOOK ERROR: ${error.message}`,
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
        // Load saved configuration
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

    // Avatars now use CSS ::before for icons
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
    // Basic formatting for code and links
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

    // Disable send button
    sendButton.disabled = true;
  }

  function hideTypingIndicator() {
    isTyping = false;
    const typingElement = document.getElementById("typingIndicator");
    if (typingElement) {
      typingElement.remove();
    }

    // Enable send button
    sendButton.disabled = false;
  }

  function updateCharCount() {
    const count = messageInput.value.length;
    const maxLength = 1000;

    if (charCount) {
      charCount.textContent = `${count}/${maxLength}`;

      // Change color based on limit
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
    return new Date().toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });
  }

  function handleWebhookChange() {
    const url = webhookInput.value.trim();
    webhookUrl = url;

    if (url && isValidUrl(url)) {
      updateWebhookStatus("testing");
      // Auto-test after 1 second without changes
      clearTimeout(webhookInput.testTimeout);
      webhookInput.testTimeout = setTimeout(() => {
        testWebhook(true);
      }, 1000);
    } else {
      updateWebhookStatus("disconnected");
    }
  }

  function saveWebhookUrl() {
    // Save to VS Code local storage
    vscode.postMessage({
      command: "saveConfig",
      key: "webhookUrl",
      value: webhookUrl,
    });
  }

  function loadSavedConfig() {
    // Request saved configuration
    vscode.postMessage({
      command: "loadConfig",
    });
  }

  async function testWebhook(silent = false) {
    if (!webhookUrl || !isValidUrl(webhookUrl)) {
      if (!silent) {
                    alert("Please enter a valid webhook URL");
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
          message: "[TEST] AI Code Assistant connection test",
          timestamp: new Date().toISOString(),
          source: "ai-code-assistant",
          test: true,
        }),
      });

      if (response.ok) {
        updateWebhookStatus("connected");
        if (!silent) {
          // Read response to show it
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
            `✅ CONNECTION SUCCESSFUL: Response - "${responseText}"`,
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
          `❌ CONNECTION ERROR: ${error.message}`,
          getCurrentTime()
        );
      }
    }
  }

  function updateWebhookStatus(status) {
    if (!webhookStatus) return;

    webhookStatus.className = `webhook-status ${status}`;

    const statusTexts = {
      connected: "● CONNECTED",
      disconnected: "○ DISCONNECTED",
      testing: "◐ TESTING...",
    };

    webhookStatus.innerHTML = `
            <span class="status-indicator"></span>
            ${statusTexts[status] || "Unknown"}
        `;
  }

  function toggleWebhookConfig() {
    if (!webhookConfig) return;

    webhookConfig.classList.toggle("collapsed");
    toggleConfig.textContent = webhookConfig.classList.contains("collapsed")
      ? "Show configuration"
      : "Hide configuration";
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
        `Hello! 👋 I'm your AI Code Assistant.

${
  webhookUrl
    ? "🔗 Connected to your N8N webhook"
    : "⚙️ Configure a webhook to connect with N8N"
}

I can help you with programming, development, automation and much more. Ask me anything you need!`,
        getCurrentTime()
      );
    }, 500);
  }
}

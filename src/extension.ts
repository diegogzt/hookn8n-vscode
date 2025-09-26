import * as vscode from "vscode";
import { RagService } from "./ragService";
import { ChatBotViewProvider } from "./chatbotViewProvider";
import * as fs from "fs";
import * as path from "path";

export function activate(context: vscode.ExtensionContext) {
  console.log("ChatBot RAG Extension is now active!");

  // Registrar el proveedor de vista para la barra lateral
  const chatbotViewProvider = new ChatBotViewProvider(context);
  vscode.window.createTreeView("chatbotView", {
    treeDataProvider: chatbotViewProvider,
    showCollapseAll: true,
  });

  // Comando principal para abrir el ChatBot
  const disposable = vscode.commands.registerCommand("chatbot.start", () => {
    const panel = vscode.window.createWebviewPanel(
      "chatbotRAG",
      "ChatBot RAG",
      vscode.ViewColumn.One,
      {
        enableScripts: true,
        retainContextWhenHidden: true,
        localResourceRoots: [
          vscode.Uri.joinPath(context.extensionUri, "media"),
          vscode.Uri.joinPath(context.extensionUri, "resources"),
        ],
      }
    );

    const ragService = new RagService();
    panel.webview.html = getWebviewContent(panel.webview, context.extensionUri);

    // Manejar mensajes del webview
    panel.webview.onDidReceiveMessage(
      async (message: any) => {
        switch (message.command) {
          case "sendMessage":
            try {
              const response = await ragService.generateResponse(message.text);
              panel.webview.postMessage({
                command: "receiveMessage",
                text: response,
                timestamp: new Date().toLocaleTimeString("es-ES", {
                  hour: "2-digit",
                  minute: "2-digit",
                }),
              });
            } catch (error) {
              panel.webview.postMessage({
                command: "receiveMessage",
                text: "Error: No se pudo procesar tu mensaje.",
                timestamp: new Date().toLocaleTimeString("es-ES", {
                  hour: "2-digit",
                  minute: "2-digit",
                }),
              });
            }
            break;

          case "saveConfig":
            // Guardar configuración en el workspace
            context.globalState.update(message.key, message.value);
            break;

          case "loadConfig":
            // Enviar configuración guardada
            const savedWebhookUrl = context.globalState.get("webhookUrl", "");
            panel.webview.postMessage({
              command: "configLoaded",
              webhookUrl: savedWebhookUrl,
            });
            break;
        }
      },
      undefined,
      context.subscriptions
    );
  });

  // Comando adicional para mostrar en la barra lateral
  const showSidebarCommand = vscode.commands.registerCommand(
    "chatbot.showInSidebar",
    () => {
      vscode.commands.executeCommand("workbench.view.extension.chatbotView");
    }
  );

  context.subscriptions.push(disposable, showSidebarCommand);
}

function getWebviewContent(
  webview: vscode.Webview,
  extensionUri: vscode.Uri
): string {
  try {
    // Leer el archivo HTML
    const htmlPath = vscode.Uri.joinPath(
      extensionUri,
      "resources",
      "webview.html"
    );
    let htmlContent = fs.readFileSync(htmlPath.fsPath, "utf8");

    // Convertir rutas relativas a URIs de webview
    const cssUri = webview.asWebviewUri(
      vscode.Uri.joinPath(extensionUri, "media", "chatbot.css")
    );
    const jsUri = webview.asWebviewUri(
      vscode.Uri.joinPath(extensionUri, "media", "chatbot.js")
    );
    const iconUri = webview.asWebviewUri(
      vscode.Uri.joinPath(extensionUri, "media", "icons", "chatbot-icon.svg")
    );
    const sendIconUri = webview.asWebviewUri(
      vscode.Uri.joinPath(extensionUri, "media", "icons", "send-icon.svg")
    );

    // Reemplazar rutas en el HTML
    htmlContent = htmlContent
      .replace("../media/chatbot.css", cssUri.toString())
      .replace("../media/chatbot.js", jsUri.toString())
      .replace("../media/icons/chatbot-icon.svg", iconUri.toString())
      .replace("../media/icons/send-icon.svg", sendIconUri.toString());

    // Agregar CSP
    const cspSource = webview.cspSource;
    htmlContent = htmlContent.replace(
      '<meta name="viewport" content="width=device-width, initial-scale=1.0">',
      `<meta name="viewport" content="width=device-width, initial-scale=1.0">
            <meta http-equiv="Content-Security-Policy" content="default-src 'none'; style-src ${cspSource} 'unsafe-inline'; script-src ${cspSource} 'unsafe-inline'; img-src ${cspSource} data:; connect-src https: http:;">`
    );

    return htmlContent;
  } catch (error) {
    console.error("Error loading HTML file:", error);

    // Fallback HTML si no se puede leer el archivo
    const cssUri = webview.asWebviewUri(
      vscode.Uri.joinPath(extensionUri, "media", "chatbot.css")
    );
    const jsUri = webview.asWebviewUri(
      vscode.Uri.joinPath(extensionUri, "media", "chatbot.js")
    );
    const iconUri = webview.asWebviewUri(
      vscode.Uri.joinPath(extensionUri, "media", "icons", "chatbot-icon.svg")
    );
    const sendIconUri = webview.asWebviewUri(
      vscode.Uri.joinPath(extensionUri, "media", "icons", "send-icon.svg")
    );

    return `<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="Content-Security-Policy" content="default-src 'none'; style-src ${webview.cspSource} 'unsafe-inline'; script-src ${webview.cspSource} 'unsafe-inline'; img-src ${webview.cspSource} data:; connect-src https: http:;">
    <title>ChatBot RAG</title>
    <link rel="stylesheet" href="${cssUri}">
</head>
<body>
    <div class="chat-container">
        <header class="chat-header">
            <h1>
                <img src="${iconUri}" alt="ChatBot Icon" class="chat-icon"> 
                ChatBot RAG
            </h1>
        </header>

        <div class="webhook-config">
            <input 
                type="url" 
                id="webhookInput" 
                class="webhook-input"
                placeholder="URL del webhook de N8N (ej: https://tu-n8n.com/webhook/chatbot)"
            >
            <button id="testButton" class="test-button">🔧 Probar</button>
            <div id="webhookStatus" class="webhook-status disconnected">
                <span class="status-indicator"></span>
                🔴 Desconectado
            </div>
            <div class="action-buttons">
                <button id="toggleConfig" class="toggle-config">Ocultar configuración</button>
            </div>
        </div>

        <main class="chat-messages" id="chatMessages"></main>

        <div class="input-area">
            <textarea 
                id="messageInput" 
                placeholder="Escribe tu pregunta aquí..." 
                rows="1" 
                maxlength="1000"
                autocomplete="off"
                spellcheck="true"
            ></textarea>
            <button id="sendButton" title="Enviar mensaje (Enter)">
                <img src="${sendIconUri}" alt="Enviar">
            </button>
        </div>

        <div class="input-info">
            <span id="charCount">0/1000</span>
            <div class="action-buttons">
                <button class="action-button" onclick="clearChat()">🗑️ Limpiar</button>
                <button class="action-button" onclick="exportChat()">📥 Exportar</button>
            </div>
        </div>
    </div>
    <script src="${jsUri}"></script>
</body>
</html>`;
  }
}

export function deactivate() {}

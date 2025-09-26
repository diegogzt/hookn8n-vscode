import * as vscode from "vscode";
import { RagService } from "./ragService";

export class WebviewPanel {
  public static currentPanel: WebviewPanel | undefined;

  private readonly panel: vscode.WebviewPanel;
  private readonly extensionUri: vscode.Uri;
  private readonly ragService: RagService;

  private constructor(panel: vscode.WebviewPanel, extensionUri: vscode.Uri) {
    this.panel = panel;
    this.extensionUri = extensionUri;
    this.ragService = new RagService();

    this.panel.onDidDispose(() => this.dispose());
    this.panel.webview.onDidReceiveMessage((message: any) => {
      switch (message.command) {
        case "sendMessage":
          this.handleSendMessage(message.text);
          return;
      }
    });

    this.update();
  }

  public static createOrShow(extensionUri: vscode.Uri): WebviewPanel {
    const panel = vscode.window.createWebviewPanel(
      "chatbot",
      "ChatBot RAG",
      vscode.ViewColumn.One,
      {
        enableScripts: true,
        retainContextWhenHidden: true,
        localResourceRoots: [
          vscode.Uri.joinPath(extensionUri, "media"),
          vscode.Uri.joinPath(extensionUri, "resources"),
        ],
      }
    );

    WebviewPanel.currentPanel = new WebviewPanel(panel, extensionUri);
    return WebviewPanel.currentPanel;
  }

  private update() {
    this.panel.title = "ChatBot RAG";
    this.panel.webview.html = this.getWebviewContent();
  }

  private getWebviewContent(): string {
    const cssUri = this.panel.webview.asWebviewUri(
      vscode.Uri.joinPath(this.extensionUri, "media", "chatbot.css")
    );
    const jsUri = this.panel.webview.asWebviewUri(
      vscode.Uri.joinPath(this.extensionUri, "media", "chatbot.js")
    );
    const iconUri = this.panel.webview.asWebviewUri(
      vscode.Uri.joinPath(
        this.extensionUri,
        "media",
        "icons",
        "chatbot-icon.svg"
      )
    );
    const sendIconUri = this.panel.webview.asWebviewUri(
      vscode.Uri.joinPath(this.extensionUri, "media", "icons", "send-icon.svg")
    );

    return `<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="Content-Security-Policy" content="default-src 'none'; style-src ${this.panel.webview.cspSource} 'unsafe-inline'; script-src ${this.panel.webview.cspSource} 'unsafe-inline'; img-src ${this.panel.webview.cspSource} data:;">
    <title>ChatBot RAG</title>
    <link rel="stylesheet" href="${cssUri}">
</head>
<body>
    <div class="chat-container">
        <header class="chat-header">
            <h1><img src="${iconUri}" alt="ChatBot Icon" class="chat-icon"> ChatBot RAG</h1>
        </header>
        <main class="chat-messages" id="chatMessages">
            <div class="message bot-message">
                <div class="message-content">
                    <div class="message-text">
                        ¡Hola! Soy tu asistente ChatBot RAG. Puedo ayudarte con preguntas sobre programación.
                    </div>
                </div>
            </div>
        </main>
        <div class="input-area">
            <textarea id="messageInput" placeholder="Escribe tu pregunta aquí..." rows="1" maxlength="1000"></textarea>
            <button id="sendButton">
                <img src="${sendIconUri}" alt="Enviar">
            </button>
        </div>
        <div class="input-info">
            <span id="charCount">0/1000</span>
        </div>
    </div>
    <script src="${jsUri}"></script>
</body>
</html>`;
  }

  private async handleSendMessage(text: string) {
    try {
      const response = await this.ragService.generateResponse(text);
      this.panel.webview.postMessage({
        command: "receiveMessage",
        text: response,
        timestamp: new Date().toLocaleTimeString(),
      });
    } catch (error) {
      console.error("Error handling message:", error);
      this.panel.webview.postMessage({
        command: "receiveMessage",
        text: "Error: No se pudo procesar tu mensaje.",
        timestamp: new Date().toLocaleTimeString(),
      });
    }
  }

  public dispose() {
    WebviewPanel.currentPanel = undefined;
    this.panel.dispose();
  }
}

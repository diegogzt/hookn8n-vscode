import * as vscode from "vscode";

export class ChatbotProvider implements vscode.Disposable {
  private ragService: any;
  private webviewPanel: any;

  constructor(context: vscode.ExtensionContext) {
    // Inicializar servicios aquí si es necesario
  }

  showChat(): void {
    // Método para mostrar el chat - implementación movida a extension.ts
    vscode.commands.executeCommand("chatbot.start");
  }

  dispose(): void {
    // Limpiar recursos si es necesario
  }
}

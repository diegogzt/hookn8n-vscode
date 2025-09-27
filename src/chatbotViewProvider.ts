import * as vscode from "vscode";

export class ChatBotViewProvider
  implements vscode.TreeDataProvider<ChatBotItem>
{
  constructor(private context: vscode.ExtensionContext) {}

  getTreeItem(element: ChatBotItem): vscode.TreeItem {
    return element;
  }

  getChildren(element?: ChatBotItem): Thenable<ChatBotItem[]> {
    if (!element) {
      // Elementos raíz
      return Promise.resolve([
        new ChatBotItem(
          "🚀 Abrir ChatBot",
          "Iniciar nueva conversación",
          vscode.TreeItemCollapsibleState.None,
          {
            command: "chatbot.start",
            title: "Abrir ChatBot",
            arguments: [],
          }
        ),
        new ChatBotItem(
          "⚙️ Configuration",
          "Configurar webhook y opciones",
          vscode.TreeItemCollapsibleState.Expanded
        ),
        new ChatBotItem(
          "📚 Help",
          "Información y documentación",
          vscode.TreeItemCollapsibleState.Expanded
        ),
      ]);
    } else if (element.label === "⚙️ Configuration") {
      return Promise.resolve([
        new ChatBotItem(
          "🔗 Configurar Webhook N8N",
          "Configurar integración con N8N",
          vscode.TreeItemCollapsibleState.None,
          {
            command: "chatbot.start",
            title: "Configurar Webhook",
            arguments: [],
          }
        ),
        new ChatBotItem(
          "🔄 Reiniciar ChatBot",
          "Reiniciar la extensión",
          vscode.TreeItemCollapsibleState.None,
          {
            command: "workbench.action.reloadWindow",
            title: "Reiniciar",
            arguments: [],
          }
        ),
      ]);
    } else if (element.label === "📚 Help") {
      return Promise.resolve([
        new ChatBotItem(
          "❓ Cómo usar",
          "Guía de uso del ChatBot",
          vscode.TreeItemCollapsibleState.None,
          {
            command: "vscode.open",
            title: "Ver documentación",
            arguments: [vscode.Uri.parse("https://github.com/")],
          }
        ),
        new ChatBotItem(
          "🐛 Reportar problema",
          "Reportar un error o sugerencia",
          vscode.TreeItemCollapsibleState.None,
          {
            command: "vscode.open",
            title: "Reportar problema",
            arguments: [vscode.Uri.parse("https://github.com/")],
          }
        ),
      ]);
    }

    return Promise.resolve([]);
  }
}

class ChatBotItem extends vscode.TreeItem {
  constructor(
    public readonly label: string,
    public readonly tooltip: string,
    public readonly collapsibleState: vscode.TreeItemCollapsibleState,
    public readonly command?: vscode.Command
  ) {
    super(label, collapsibleState);
    this.tooltip = tooltip;
    this.command = command;

    // Asignar iconos según el tipo
    if (label.includes("🚀")) {
      this.iconPath = new vscode.ThemeIcon("comment-discussion");
    } else if (label.includes("⚙️")) {
      this.iconPath = new vscode.ThemeIcon("settings-gear");
    } else if (label.includes("📚")) {
      this.iconPath = new vscode.ThemeIcon("book");
    } else if (label.includes("🔗")) {
      this.iconPath = new vscode.ThemeIcon("link");
    } else if (label.includes("🔄")) {
      this.iconPath = new vscode.ThemeIcon("refresh");
    } else if (label.includes("❓")) {
      this.iconPath = new vscode.ThemeIcon("question");
    } else if (label.includes("🐛")) {
      this.iconPath = new vscode.ThemeIcon("bug");
    }
  }
}

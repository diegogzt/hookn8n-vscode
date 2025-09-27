# N8N Webhook Chat - VS Code Extension

[![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)](https://marketplace.visualstudio.com/items?itemName=dgtovar.n8n-webhook-chat)
[![Visual Studio Code](https://img.shields.io/badge/VS%20Code-^1.74.0-brightgreen.svg)](https://code.visualstudio.com/)
[![License](https://img.shields.io/badge/license-MIT-green.svg)](LICENSE)

## 🤖 Description

**N8N Webhook Chat** is a Visual Studio Code extension that provides a powerful chat interface connected to N8N webhooks. Designed for developers who want to integrate their VS Code environment with N8N automation workflows and custom AI assistants.

## ✨ Key Features

- 🔗 **N8N Webhook Integration**: Direct connection to your N8N workflows
- � **Real-time Chat**: Instant communication with your automation systems
- 🎨 **Modern Interface**: Clean and intuitive design
- 📱 **Responsive**: Adapts to different panel sizes
- 💾 **Persistence**: Saves webhook configuration and chat history
- ⚡ **Fast**: Instant webhook responses without interrupting workflow
- 🔧 **Configurable**: Easy webhook URL configuration

## 🚀 Installation

1. **From VS Code Marketplace**:

   - Open VS Code
   - Go to Extensions (`Ctrl+Shift+X`)
   - Search for "N8N Webhook Chat"
   - Click "Install"

2. **Manual Installation**:
   ```bash
   code --install-extension dgtovar.n8n-webhook-chat
   ```

## 📖 Usage

### Quick Access

- **Command Palette**: `Ctrl+Shift+P` → "N8N Webhook Chat"
- **Sidebar**: "N8N Webhook Chat" panel in explorer
- **Context Menu**: Right-click on files

### N8N Webhook Configuration

1. Open the chatbot
2. Configure your webhook URL in the top section
3. Click "Test Connection"
4. Done! The chatbot will use your custom webhook

### Available Commands

- `chatbot.start`: Open N8N Webhook Chat
- `chatbot.showInSidebar`: Show in sidebar

## 🔧 Configuration

### N8N Webhook

```json
{
  "message": "Your question here",
  "timestamp": "2025-09-26T10:30:00.000Z",
  "source": "n8n-webhook-chat"
}
```

**Expected Response**:

- JSON: `{"response": "Bot response"}`
- Plain text: `"Direct response"`

## 🎨 Screenshots

- Main interface with Purple Heart theme
- Sidebar panel integrated in VS Code
- N8N webhook configuration
- Example conversation with code

## 🛠️ Development

### Requirements

- Node.js >= 16.x
- TypeScript >= 4.9.x
- VS Code >= 1.74.0

### Local Installation

```bash
git clone https://github.com/diegogzt/hookn8n-vscode.git
cd hookn8n-vscode
npm install
npm run compile
```

### Package

```bash
npm install -g vsce
vsce package
```

## 📝 Changelog

### v1.0.0

- 🎉 Initial release
- 🔗 Complete N8N webhook integration
- � Real-time chat interface
- 📱 Responsive and modern design
- ⚡ Performance optimization

## 🤝 Contributing

Contributions are welcome!

1. Fork the project
2. Create your branch: `git checkout -b feature/new-feature`
3. Commit your changes: `git commit -m 'Add new feature'`
4. Push to branch: `git push origin feature/new-feature`
5. Open a Pull Request

## 📄 License

This project is under the MIT License. See [LICENSE](LICENSE) for details.

## 🐛 Report Bugs

Found a problem? [Report an issue](https://github.com/diegogzt/hookn8n-vscode/issues)

## 📧 Contact

- **Author**: diegogzt
- **GitHub**: [diegogzt](https://github.com/diegogzt)

---

⭐ **If you like this extension, give it a star on GitHub!**

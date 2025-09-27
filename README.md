# AI Code Assistant - VS Code Extension

[![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)](https://marketplace.visualstudio.com/items?itemName=dgtovar.ai-code-assistant)
[![Visual Studio Code](https://img.shields.io/badge/VS%20Code-^1.74.0-brightgreen.svg)](https://code.visualstudio.com/)
[![License](https://img.shields.io/badge/license-MIT-green.svg)](LICENSE)

## 🤖 Description

**AI Code Assistant** is an intelligent Visual Studio Code extension that provides an advanced AI programming assistant. Designed for developers seeking a modern and efficient tool to get code help, solve technical problems, and automate development tasks through N8N webhooks.

## ✨ Key Features

- 🎯 **Intelligent Assistant**: Contextual responses for programming questions
- 🔗 **N8N Integration**: Connect with custom webhooks for automation
- 🎨 **Modern Interface**: Purple Heart design with elegant dark theme
- 📱 **Responsive**: Adapts to different panel sizes
- 💾 **Persistence**: Saves configuration and conversation history
- ⚡ **Fast**: Instant responses without interrupting your workflow
- 🔧 **Configurable**: Multiple customization options

## 🚀 Installation

1. **From VS Code Marketplace**:
   - Open VS Code
   - Go to Extensions (`Ctrl+Shift+X`)
   - Search for "AI Code Assistant"
   - Click "Install"

2. **Manual Installation**:
   ```bash
   code --install-extension dgtovar.ai-code-assistant
   ```

## 📖 Usage

### Quick Access
- **Command Palette**: `Ctrl+Shift+P` → "AI Code Assistant"
- **Sidebar**: "AI Code Assistant" panel in explorer
- **Context Menu**: Right-click on files

### N8N Webhook Configuration
1. Open the chatbot
2. Configure your webhook URL in the top section
3. Click "Test Connection"
4. Done! The chatbot will use your custom webhook

### Available Commands
- `chatbot.start`: Open AI Code Assistant
- `chatbot.showInSidebar`: Show in sidebar

## 🔧 Configuration

### N8N Webhook
```json
{
  "message": "Your question here",
  "timestamp": "2025-09-26T10:30:00.000Z", 
  "source": "ai-code-assistant"
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
- ✨ Purple Heart interface with dark theme
- 🔗 Complete integration with N8N webhooks
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

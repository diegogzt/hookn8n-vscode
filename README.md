# AI Code Assistant - VS Code Extension

[![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)](https://marketplace.visualstudio.com/items?itemName=dgtovar.ai-code-assistant)
[![Visual Studio Code](https://img.shields.io/badge/VS%20Code-^1.74.0-brightgreen.svg)](https://code.visualstudio.com/)
[![License](https://img.shields.io/badge/license-MIT-green.svg)](LICENSE)

## 🤖 Descripción

**AI Code Assistant** es una extensión inteligente para Visual Studio Code que proporciona un asistente de programación avanzado con IA. Diseñada para desarrolladores que buscan una herramienta moderna y eficiente para obtener ayuda con código, resolver problemas técnicos y automatizar tareas de desarrollo mediante webhooks N8N.

## ✨ Características Principales

- 🎯 **Asistente Inteligente**: Respuestas contextuales para preguntas de programación
- 🔗 **Integración N8N**: Conecta con webhooks personalizados para automatización
- 🎨 **Interfaz Moderna**: Diseño Purple Heart con tema oscuro elegante  
- 📱 **Responsive**: Se adapta a diferentes tamaños de panel
- 💾 **Persistencia**: Guarda configuración y historial de conversaciones
- ⚡ **Rápido**: Respuestas instantáneas sin interrumpir tu flujo de trabajo
- 🔧 **Configurable**: Múltiples opciones de personalización

## 🚀 Instalación

1. **Desde VS Code Marketplace**:
   - Abre VS Code
   - Ve a Extensions (`Ctrl+Shift+X`)
   - Busca "ChatBot RAG"
   - Click en "Install"

2. **Instalación manual**:
   ```bash
   code --install-extension dgtovar.ai-code-assistant
   ```

## 📖 Uso

### Acceso Rápido
- **Paleta de Comandos**: `Ctrl+Shift+P` → "AI Code Assistant"  
- **Barra Lateral**: Panel "CHATBOT RAG" en el explorador
- **Menú Contextual**: Click derecho en archivos

### Configuración N8N Webhook
1. Abre el chatbot
2. Configura tu webhook URL en la sección superior
3. Click en "Probar Conexión" 
4. ¡Listo! El chatbot usará tu webhook personalizado

### Comandos Disponibles
- `chatbot.start`: Abrir ChatBot RAG
- `chatbot.showInSidebar`: Mostrar en barra lateral

## 🔧 Configuración

### Webhook N8N
```json
{
  "message": "Tu pregunta aquí",
  "timestamp": "2025-09-26T10:30:00.000Z", 
  "source": "vscode-chatbot"
}
```

**Respuesta esperada**:
- JSON: `{"response": "Respuesta del bot"}`
- Texto plano: `"Respuesta directa"`

## 🎨 Capturas de Pantalla

- Interfaz principal con tema Purple Heart
- Panel lateral integrado en VS Code  
- Configuración de webhook N8N
- Conversación ejemplo con código

## 🛠️ Desarrollo

### Requisitos
- Node.js >= 16.x
- TypeScript >= 4.9.x
- VS Code >= 1.74.0

### Instalación local
```bash
git clone https://github.com/dgtovar/ai-code-assistant-vscode
cd ai-code-assistant-vscode
npm install
npm run compile
```

### Empaquetar
```bash
npm install -g vsce
vsce package
```

## 📝 Changelog

### v1.0.0
- 🎉 Lanzamiento inicial
- ✨ Interfaz Purple Heart con tema oscuro
- 🔗 Integración completa con webhooks N8N
- 📱 Diseño responsive y moderno
- ⚡ Optimización de rendimiento

## 🤝 Contribución

¡Las contribuciones son bienvenidas! 

1. Fork el proyecto
2. Crea tu branch: `git checkout -b feature/nueva-caracteristica`
3. Commit tus cambios: `git commit -m 'Añadir nueva característica'`
4. Push al branch: `git push origin feature/nueva-caracteristica`
5. Abre un Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT. Consulta [LICENSE](LICENSE) para más detalles.

## 🐛 Reportar Bugs

¿Encontraste un problema? [Reporta un issue](https://github.com/dgtovar/ai-code-assistant-vscode/issues)

## 📧 Contacto

- **Autor**: dgtovar
- **GitHub**: [dgtovar](https://github.com/dgtovar)

---

⭐ **¡Si te gusta esta extensión, dale una estrella en GitHub!**

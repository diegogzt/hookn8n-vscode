import * as vscode from 'vscode';

const CONFIG_KEY = 'vscodeRagChatbot';

export function loadConfig(): vscode.WorkspaceConfiguration {
    return vscode.workspace.getConfiguration(CONFIG_KEY);
}

export function saveConfig(config: any): Thenable<void> {
    return vscode.workspace.getConfiguration(CONFIG_KEY).update('', config, vscode.ConfigurationTarget.Global);
}

export function getDefaultConfig(): any {
    return {
        apiUrl: 'https://api.example.com',
        timeout: 5000,
        enableLogging: true,
    };
}
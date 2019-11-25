'use strict';
import * as vscode from 'vscode';
import { BlinkMindPanel } from './blink-mind-panel';

export function activate(context: vscode.ExtensionContext): void {

    const startCommand = vscode.commands.registerCommand('vscode-blink-mind.start', () => {
        BlinkMindPanel.CreateOrShow(context.extensionPath);
    });

    context.subscriptions.push(startCommand);
}

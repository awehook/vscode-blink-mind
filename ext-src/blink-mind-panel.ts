import * as vscode from 'vscode';
import * as path from 'path';
import { writeFileToDisk } from './utils';

export class BlinkMindPanel {
  public static openedPanels: Map<string, BlinkMindPanel> = new Map();
  private static readonly viewType: string = 'blink-mind';
  private static readonly extentionPrefix: string = 'vscode-blink-mind';

  private readonly _webViewPanel: vscode.WebviewPanel;
  private readonly _extentionPath: string;
  private _document: vscode.TextDocument;
  private _filePath: string;
  private _disposables: vscode.Disposable[] = [];

  constructor(
    extentionPath: string,
    column: vscode.ViewColumn,
    document: vscode.TextDocument
  ) {
    this._extentionPath = extentionPath;
    this._document = document;
    this._filePath = this._document.fileName;

    this._webViewPanel = vscode.window.createWebviewPanel(
      BlinkMindPanel.viewType,
      'Mindmap Editor ' + this._filePath,
      column,
      {
        enableScripts: true,
        localResourceRoots: [
          vscode.Uri.file(path.join(this._extentionPath, 'build'))
        ]
      }
    );

    this._webViewPanel.webview.html = this._getHtmlForWebview();

    this._webViewPanel.webview.onDidReceiveMessage(this.webViewMsgHandler);

    // vscode.workspace.onDidSaveTextDocument(() => this.onDocumentChanged());
    vscode.window.onDidChangeActiveTextEditor(() => this.onDocumentChanged());

    this._webViewPanel.onDidDispose(
      () => this.dispose(),
      null,
      this._disposables
    );
  }

  private webViewMsgHandler = message => {
    // console.log('webViewMsgHandler', message);
    switch (message.command) {
      case 'save':
        writeFileToDisk(this._filePath, message.data);
        break;
      case 'loaded':
        this.onDocumentChanged();
        break;
    }
  };

  private onDocumentChanged() {
    // console.log('onDocumentChanged');
    const json: string = this.getJson();
    const obj = { model: json };
    const data = JSON.stringify(obj);
    // console.log('postMessage:', obj);
    this._webViewPanel.webview.postMessage(obj);
  }

  private getJson(): string {
    let json: string = '';
    if (this._document) {
      json = this._document.getText();
    }
    return json;
  }

  public static CreateOrShow(
    extentionPath: string,
    document: vscode.TextDocument
  ): void {
    const column = vscode.ViewColumn.One;
    if (BlinkMindPanel.openedPanels.has(document.fileName))
      BlinkMindPanel.openedPanels
        .get(document.fileName)
        ._webViewPanel.reveal(column);
    else {
      const panel = new BlinkMindPanel(extentionPath, column, document);
      BlinkMindPanel.openedPanels.set(document.fileName, panel);
    }
  }

  private _getHtmlForWebview() {
    const manifest = require(path.join(
      this._extentionPath,
      'build',
      'asset-manifest.json'
    ));
    const mainScript = manifest['main.js'];
    const mainStyle = manifest['main.css'];

    const scriptPathOnDisk = vscode.Uri.file(
      path.join(this._extentionPath, 'build', mainScript)
    );
    const scriptUri = scriptPathOnDisk.with({ scheme: 'vscode-resource' });
    const stylePathOnDisk = vscode.Uri.file(
      path.join(this._extentionPath, 'build', mainStyle)
    );
    const styleUri = stylePathOnDisk.with({ scheme: 'vscode-resource' });

    const nonce = getNonce();

    const html = `<!DOCTYPE html>
			<html lang="en">
			<head>
				<meta charset="utf-8">
				<meta name="viewport" content="width=device-width,initial-scale=1,shrink-to-fit=no">
				<meta name="theme-color" content="#ffffff">
				<title>React App</title>
				<link rel="stylesheet" type="text/css" href="${styleUri}">
				<meta http-equiv="Content-Security-Policy" content="default-src 'none'; font-src 'self' data: vscode-resource:; img-src data: vscode-resource: https:; script-src 'nonce-${nonce}' 'unsafe-eval' 'unsafe-inline';style-src vscode-resource: 'unsafe-inline' http: https: data:;">
				<base href="${vscode.Uri.file(path.join(this._extentionPath, 'build')).with({
          scheme: 'vscode-resource'
        })}/">
			</head>

			<body>
				<noscript>You need to enable JavaScript to run this app.</noscript>
				<div id="root"></div>
				
				<script nonce="${nonce}" src="${scriptUri}"></script>
			</body>
      </html>`;
    return html;
  }

  public dispose() {
    BlinkMindPanel.openedPanels.delete(this._filePath);

    this._webViewPanel.dispose();
    while (this._disposables.length) {
      const x = this._disposables.pop();
      if (x) {
        x.dispose();
      }
    }
  }
}

function getNonce() {
  let text = '';
  const possible =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  for (let i = 0; i < 32; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return text;
}

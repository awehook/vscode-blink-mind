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
        //TODO 对于具有非常复杂的UI或状态且无法快速保存和恢复的webview，我们可以直接使用retainContextWhenHidden选项
        retainContextWhenHidden: true,
        enableScripts: true,
        localResourceRoots: [
          vscode.Uri.file(path.join(this._extentionPath, 'build'))
        ]
      }
    );

    this._webViewPanel.webview.html = this._getHtmlForWebview();

    this._webViewPanel.webview.onDidReceiveMessage(this.webViewMsgHandler);

    // vscode.workspace.onDidSaveTextDocument(() => this.onDocumentChanged());
    // why? ActiveTextEditor
    vscode.window.onDidChangeActiveTextEditor(() => {
      console.log('onDidChangeActiveTextEditor');
    });

    // 注意这里是在_webViewPanel的onDidDispose里调用this.dispose()
    this._webViewPanel.onDidDispose(
      () => this.dispose(),
      null,
      this._disposables
    );
  }

  private _autoSaveData: any;

  private webViewMsgHandler = message => {
    // console.log('webViewMsgHandler', message.command);
    switch (message.command) {
      case 'save':
        writeFileToDisk(this._filePath, message.data, true);
        break;
      case 'auto-save':
        this._autoSaveData = message.data;
        break;
      // TODO 有没有办法直接把数据初始化到webview中
      case 'loaded':
        this.onDocumentChanged();
        break;
    }
  };

  private onDocumentChanged() {
    if (this._webViewPanel && this._webViewPanel.webview) {
      // console.log('onDocumentChanged');
      const json: string = this.getJson();
      const obj = { type: 'doc-change', model: json };
      this._webViewPanel.webview.postMessage(obj);
    }
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

  public writeAutoSaveDataToDisk() : Promise<any> {
    console.log('writeAutoSaveDataToDisk');
    return writeFileToDisk(this._filePath, this._autoSaveData, false);
  }

  public dispose() {
    console.log('blink-mind-panel dispose');
    this.writeAutoSaveDataToDisk();
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

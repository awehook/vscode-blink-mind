import * as vscode from "vscode";
import * as path from "path";

export class BlinkMindPanel {
  public static currentPanel: BlinkMindPanel | undefined;

  private static readonly viewType: string = "blink-mind";
  private static readonly extentionPrefix: string = "vscode-blink-mind";

  private readonly _webViewPanel: vscode.WebviewPanel;
  private readonly _extentionPath: string;
  private _currentEditor: vscode.TextEditor | undefined;
  private _disposables: vscode.Disposable[] = [];

  constructor(extentionPath: string, column: vscode.ViewColumn) {
    this._extentionPath = extentionPath;
    this._currentEditor = vscode.window.activeTextEditor;
    this._webViewPanel = vscode.window.createWebviewPanel(
      BlinkMindPanel.viewType,
      "Mindmap Editor",
      column,
      {
        enableScripts: true,
        localResourceRoots: [
          vscode.Uri.file(path.join(this._extentionPath, "build"))
        ]
      }
    );

    this._webViewPanel.webview.html = this._getHtmlForWebview();

    this._webViewPanel.onDidDispose(
      () => this.dispose(),
      null,
      this._disposables
    );
  }

  public static CreateOrShow(extentionPath: string): void {
    const column = vscode.ViewColumn.Three;

    if (BlinkMindPanel.currentPanel) {
      BlinkMindPanel.currentPanel._webViewPanel.reveal(column);
    } else {
      BlinkMindPanel.currentPanel = new BlinkMindPanel(extentionPath, column);
    }
  }

  private _getHtmlForWebview() {
    const manifest = require(path.join(
      this._extentionPath,
      "build",
      "asset-manifest.json"
    ));
    const mainScript = manifest["main.js"];
    const mainStyle = manifest["main.css"];

    const scriptPathOnDisk = vscode.Uri.file(
      path.join(this._extentionPath, "build", mainScript)
    );
    const scriptUri = scriptPathOnDisk.with({ scheme: "vscode-resource" });
    const stylePathOnDisk = vscode.Uri.file(
      path.join(this._extentionPath, "build", mainStyle)
    );
    const styleUri = stylePathOnDisk.with({ scheme: "vscode-resource" });

    const nonce = getNonce();

    const html = `<!DOCTYPE html>
			<html lang="en">
			<head>
				<meta charset="utf-8">
				<meta name="viewport" content="width=device-width,initial-scale=1,shrink-to-fit=no">
				<meta name="theme-color" content="#ffffff">
				<title>React App</title>
				<link rel="stylesheet" type="text/css" href="${styleUri}">
				<meta http-equiv="Content-Security-Policy" content="default-src 'none'; font-src 'self' data: vscode-resource:; img-src vscode-resource: https:; script-src 'nonce-${nonce}' 'unsafe-eval';style-src vscode-resource: 'unsafe-inline' http: https: data:;">
				<base href="${vscode.Uri.file(path.join(this._extentionPath, "build")).with({
          scheme: "vscode-resource"
        })}/">
			</head>

			<body>
				<noscript>You need to enable JavaScript to run this app.</noscript>
				<div id="root"></div>
				
				<script nonce="${nonce}" src="${scriptUri}"></script>
			</body>
      </html>`;
      console.log(html);
      return html;
  }

  public dispose() {
    BlinkMindPanel.currentPanel = undefined;

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
  let text = "";
  const possible =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  for (let i = 0; i < 32; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return text;
}

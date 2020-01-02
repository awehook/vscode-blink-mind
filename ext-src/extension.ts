import * as vscode from 'vscode';
import { BlinkMindPanel } from './blink-mind-panel';
import templateJson from './mindmap/template.json';
import fs from 'fs';
import path from 'path';

const matchableFileTypes: string[] = ['bm', 'blinkmind'];

export function activate(context: vscode.ExtensionContext): void {
  const startCommand = vscode.commands.registerCommand(
    'vscode-blink-mind.start',
    doc => {
      let document: vscode.TextDocument;
      if (doc != null) document = doc;
      else {
        document =
          vscode.window.activeTextEditor &&
          vscode.window.activeTextEditor.document;
      }
      if (!document) {
        vscode.window.showErrorMessage('You need to select a document!');
        return;
      }
      BlinkMindPanel.CreateOrShow(context.extensionPath, document);
    }
  );

  vscode.workspace.onDidOpenTextDocument(doc => {
    const fullname = doc.fileName;
    const extName = path.extname(fullname).slice(1);
    console.log('onDidOpenTextDocument',fullname,extName);
    if (!matchableFileTypes.includes(extName)) return;
    vscode.commands.executeCommand('vscode-blink-mind.start', doc);
  });

  const createNewMindMapCommand = vscode.commands.registerCommand(
    'vscode-blink-mind.create-new-mindmap',
    () => {
      vscode.window
        .showInputBox({
          placeHolder: 'Enter file name'
        })
        .then(filename => {
          let targetFolder = vscode.workspace.rootPath;
          const fullname = path.join(targetFolder, filename + '.blinkmind');
          const data = JSON.stringify(templateJson, null, 2);
          fs.writeFile(fullname, data, function(err) {
            if (err) {
              vscode.window.showErrorMessage(err.message);
            }

            vscode.workspace.openTextDocument(fullname).then(doc => {
              const editor = vscode.window.activeTextEditor;
              vscode.window
                .showTextDocument(doc, editor.viewColumn)
                .then(editor => {
                  BlinkMindPanel.CreateOrShow(context.extensionPath, doc);
                });
            });
          });
        });
    }
  );
  context.subscriptions.push(startCommand);
  context.subscriptions.push(createNewMindMapCommand);
}

export function deactivate(context: vscode.ExtensionContext) {
  const promises : Promise<any>[] = [];
  BlinkMindPanel.openedPanels.forEach((panel)=>{
    promises.push(panel.writeAutoSaveDataToDisk());
  })
  return Promise.all(promises);
}

import fs from 'fs';
import * as vscode from 'vscode';
export function writeFileToDisk(fileName: string, data: any) {
  fs.writeFile(fileName, data, (err: any) => {
    if (err) {
      vscode.window.showErrorMessage(`write ${fileName} failed`);
      console.log(err);
      throw err;
    }
    vscode.window.showInformationMessage(`write ${fileName} successed`);
  });
}

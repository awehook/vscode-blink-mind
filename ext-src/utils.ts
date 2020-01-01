import fs from 'fs';
import * as vscode from 'vscode';
import { resolve } from 'dns';
export function writeFileToDisk(fileName: string, data: any, showTip: boolean) : Promise<any> {
  return new Promise((resolve,reject)=>{
    fs.writeFile(fileName, data, (err: any) => {
      if (err) {
        vscode.window.showErrorMessage(`write ${fileName} failed`);
        console.log(err);
        reject(err);
      }
      if (showTip)
        vscode.window.showInformationMessage(`write ${fileName} successed`);
      resolve(true);
    });
  })
  
}

# vscode-blink-mind

[vscode-blink-mind](https://github.com/awehook/vscode-blink-mind) is a extention for create and editing mind map in vscode.

![image](https://github.com/awehook/images/raw/master/vscode-blink-mind/webpack-mindmap.png)
# Features

- Infinite canvas size for mind map editing.
- Markdown editor for topic and topic notes. 

![image](https://github.com/awehook/images/raw/master/vscode-blink-mind/rich-mark-down-editor.png)
- HotKey support. 

![image](https://github.com/awehook/images/raw/master/blink-mind/hotkey.png)

- Reorganize the diagram by drag and drop. 

![image](https://github.com/awehook/images/raw/master/blink-mind/drag-and-drop.png)
- Multiple theme. 

![image](https://github.com/awehook/images/raw/master/blink-mind/blink-mind-theme.png)
- Every topic's style include font style, border style, link style can be customize. 

![image](https://github.com/awehook/images/raw/master/blink-mind/style-editor.png)
- Focus Mode, Any topic can be used as the root node of the diagram.You can navigate by the breadcrumbs. 

![image](https://github.com/awehook/images/raw/master/blink-mind/focus-mode.png)


# Usage Tips

##  How to create a new mind map?

Run `View -> Command Palette` or `Ctrl/Command + Shift + P`, open the command Palette, then input Mind

![image](https://github.com/awehook/images/raw/master/vscode-blink-mind/create-new-mindmap.png)

Select Mindmap editor: Create new mindmap

then input the file name.

You can input file name like xxx, that will create a xxx.blinkmind in your opened folder's root.

And you can input file name like `xxx`, that will create a file with the full path `${currentFolderPath}/xxx.blinkmind`. `$ {currentFolderPath} represents the path of the folder you are currently opening.

In addition, you can also input file name like `dir1/xxx`,that will create a file with the full path `${currentFolderPath}/dir1/xxx.blinkmind`.

## How to open a mind map file

Now vscode-blink-mind only support .blinkmind and .bm suffix file.

Normally, opening these suffix files will open the Mind Map Editor immediately by default. If the mind map editor is not open, run `View -> Command Palette` or `Ctrl/Command + Shift + P`, open the command Palette,then input Mind, 
![image](https://github.com/awehook/images/raw/master/vscode-blink-mind/create-new-mindmap.png)
Select Mindmap editor: Start Mindmap editor session

# For Developers
## Debug
```bash
yarn install
yarn build
```
Then open Launch Extention debug configuration item in the debug panel.

## Build vsix package
```
yarn package
```







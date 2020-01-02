# vscode-blink-mind

<p align="center">
<a href="https://marketplace.visualstudio.com/items?itemName=awehook.vscode-blink-mind" target="__blank"><img src="https://img.shields.io/visual-studio-marketplace/d/awehook.vscode-blink-mind.svg?color=4bdbe3" alt="Visual Studio Marketplace Downloads" /></a>
<a href="https://marketplace.visualstudio.com/items?itemName=awehook.vscode-blink-mind" target="__blank"><img src="https://img.shields.io/visual-studio-marketplace/i/awehook.vscode-blink-mind.svg?color=63ba83" alt="Visual Studio Marketplace Installs" /></a>
<a href="https://marketplace.visualstudio.com/items?itemName=awehook.vscode-blink-mind" target="__blank"><img src="https://vsmarketplacebadge.apphb.com/trending-monthly/awehook.vscode-blink-mind.svg?color=a1b858" alt="Marketplace Trending Monthly" /></a>
<br/>
<a href="https://github.com/awehook/vscode-blink-mind" target="__blank"><img src="https://img.shields.io/github/last-commit/awehook/vscode-blink-mind.svg?color=a38eed" alt="GitHub last commit" /></a>
<a href="https://github.com/awehook/vscode-blink-mind/issues" target="__blank"><img src="https://img.shields.io/github/issues/awehook/vscode-blink-mind.svg?color=c977be" alt="GitHub issues" /></a>
<a href="https://github.com/awehook/vscode-blink-mind" target="__blank"><img alt="GitHub stars" src="https://img.shields.io/github/stars/awehook/vscode-blink-mind?style=social"></a>
</p>


[vscode-blink-mind](https://github.com/awehook/vscode-blink-mind) is a extention for create and editing mind map in vscode.

![image](https://github.com/awehook/images/raw/master/vscode-blink-mind/webpack-mindmap.png)

# Change Logs
## v0.0.7
- Auto save documents when close the editor panel or exit vscode.
- When editing the topic content, press ctrl + enter will complete the editing.
- Every topic can reference other topics by click the context menu: Set Reference Topics, then select the topics that you want to reference, then click the confirm button. If a topic has some reference topics, you can click the reference icon to open the reference list panel.In the reference list panel, you can navigate to any reference topic just by click it. You also can remove the reference by click remove button.

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

- Add topology diagram as an attchment to the topic, the topology diagram can be edited by the editor.

![image](https://github.com/awehook/images/raw/master/vscode-blink-mind/context-menu-edit-topology.png)

![image](https://github.com/awehook/images/raw/master/vscode-blink-mind/topology-diagram.png)


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







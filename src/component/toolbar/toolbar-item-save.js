import { iconClassName, ToolbarItem,IconName } from '@blink-mind/renderer-react';
import React from 'react';

export function ToolbarItemSave(props) {
  const onClickSave = e => {
    const { controller } = props;
    const json = controller.run('serializeModel', props);
    const jsonStr = JSON.stringify(json, null, 2);
    window.vscode.postMessage({
      command: 'save',
      data: jsonStr
    });
  };

  return (
    <ToolbarItem
      className={iconClassName(IconName.SAVE)}
      onClick={onClickSave}
    ></ToolbarItem>
  );
}

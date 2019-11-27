import cx from 'classnames';
import { iconClassName } from '@blink-mind/renderer-react';
import React from 'react';

export function ToolbarItemSave(props) {
  const onClickSave = e => {
    const { diagram } = props;
    const diagramProps = diagram.getDiagramProps();
    const { controller } = diagramProps;
    const json = controller.run('serializeModel', diagramProps);
    const jsonStr = JSON.stringify(json, null, 2);
    window.vscode.postMessage({
      command: 'save',
      data: jsonStr
    });
  };

  return (
    <div
      className={cx('bm-toolbar-item', iconClassName('save'))}
      onClick={onClickSave}
    ></div>
  );
}

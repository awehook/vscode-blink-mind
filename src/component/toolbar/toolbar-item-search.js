import cx from 'classnames';
import { OpType } from '@blink-mind/core';
import { iconClassName } from '@blink-mind/renderer-react';
import { FOCUS_MODE_SEARCH } from '@blink-mind/plugins';
import React from 'react';

export function ToolbarItemSearch(props) {
  const onClickSearch = e => {
    const { diagram } = props;
    const diagramProps = diagram.getDiagramProps();
    const { controller } = diagramProps;
    controller.run('operation', {
      ...diagramProps,
      opType: OpType.SET_FOCUS_MODE,
      focusMode: FOCUS_MODE_SEARCH
    });
  };

  return (
    <div
      className={cx('bm-toolbar-item', iconClassName('search'))}
      onClick={onClickSearch}
    ></div>
  );
}

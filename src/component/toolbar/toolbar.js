import React from 'react';
import cx from 'classnames';
import { Popover, Menu, MenuItem, MenuDivider } from '@blueprintjs/core';
import './Toolbar.css';
import { iconClassName } from '@blink-mind/renderer-react';

import { ToolbarItemLayout } from './toolbar-item-layout';
import { ToolbarItemTheme } from './toolbar-item-theme';
import { ToolbarItemSave } from './toolbar-item-save';
import { ToolbarItemSearch } from './toolbar-item-search';

// import debug from "debug";
// const log = debug("app");

export class Toolbar extends React.PureComponent {
  renderExportItem() {
    const { onClickExportJson } = this.props;
    return (
      <div className={cx('bm-toolbar-item', iconClassName('export'))}>
        <Popover enforceFocus={false}>
          <div className="bm-toolbar-popover-target" />
          <Menu>
            <MenuItem text="JSON(.json)" onClick={onClickExportJson} />
            <MenuDivider />
          </Menu>
        </Popover>
      </div>
    );
  }
  render() {
    const props = this.props;
    const { onClickUndo, onClickRedo, canUndo, canRedo } = props;

    return (
      <div className="bm-toolbar">
        {ToolbarItemSave(props)}
        {ToolbarItemTheme(props)}
        {ToolbarItemLayout(props)}
        {ToolbarItemSearch(props)}

        <div
          className={cx('bm-toolbar-item', iconClassName('undo'), {
            'bm-toolbar-item-disabled': !canUndo
          })}
          onClick={onClickUndo}
        />

        <div
          className={cx('bm-toolbar-item', iconClassName('redo'), {
            'bm-toolbar-item-disabled': !canRedo
          })}
          onClick={onClickRedo}
        />
      </div>
    );
  }
}

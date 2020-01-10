import { ToolbarItemSave } from './toolbar-item-save';
import { ToolbarItemTheme } from './toolbar-item-theme';
import './Toolbar.css';

export function ToolbarPlugin() {
  return {
    customizeToolbar(props, next) {
      const res = next();
      res.push(
        {
          order: 0,
          element: ToolbarItemSave
        },
        {
          order: 1,
          element: ToolbarItemTheme
        }
      );
      return res;
    }
  };
}

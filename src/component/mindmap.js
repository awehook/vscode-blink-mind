import React from 'react';
import { Diagram } from '@blink-mind/renderer-react';
import RichTextEditorPlugin from '@blink-mind/plugin-rich-text-editor';
import { JsonSerializerPlugin } from '@blink-mind/plugin-json-serializer';
import { ThemeSelectorPlugin } from '@blink-mind/plugin-theme-selector';
import TopologyDiagramPlugin from '@blink-mind/plugin-topology-diagram';
import {
  TopicReferencePlugin,
  SearchPlugin,
  UndoRedoPlugin,
  TagsPlugin
} from '@blink-mind/plugins';
import { ToolbarPlugin } from './toolbar';
import { generateSimpleModel } from '../utils';
import '@blink-mind/renderer-react/lib/main.css';
import '@blink-mind/plugins/lib/main.css';
import debug from 'debug';
const log = debug('app');

const vscode = acquireVsCodeApi(); // eslint-disable-line no-undef

const plugins = [
  ToolbarPlugin(),
  RichTextEditorPlugin(),
  ThemeSelectorPlugin(),
  TopicReferencePlugin(),
  SearchPlugin(),
  UndoRedoPlugin(),
  TagsPlugin(),
  TopologyDiagramPlugin(),
  JsonSerializerPlugin()
];

export class Mindmap extends React.Component {
  constructor(props) {
    super(props);
    this.initModel();
  }

  componentWillMount() {
    window.vscode = vscode;
    window.addEventListener('message', event => {
      const message = event.data; // The JSON data our extension sent
      if (!message || message === '') return;
      switch (message.type) {
        case 'doc-change':
          this.handleMsgDocChange(message);
          break;
      }
    });
  }

  handleMsgDocChange(message) {
    console.log('handleMsgDocChange');
    const props = this.diagram.getDiagramProps();
    const { controller } = props;

    if (message.model !== '') {
      const obj = JSON.parse(message.model);
      const model = controller.run('deserializeModel', { controller, obj });
      this.diagram.openNewModel(model);
    }

    this.setUpPersistence();
  }

  componentDidMount() {
    window.vscode.postMessage({
      command: 'loaded'
    });
  }

  setUpPersistence() {
    let lastSaveModel;
    setInterval(() => {
      const diagramProps = this.diagram.getDiagramProps();
      const { model } = diagramProps;
      if (lastSaveModel !== model) {
        console.log('autosave');
        lastSaveModel = model;
        const { controller } = diagramProps;
        const json = controller.run('serializeModel', diagramProps);
        const jsonStr = JSON.stringify(json, null, 2);
        window.vscode.postMessage({
          command: 'auto-save',
          data: jsonStr
        });
      }
    }, 1000);
  }

  diagram;
  diagramRef = ref => {
    this.diagram = ref;
    this.setState({});
  };

  initModel() {
    this.state = { model: null };
  }

  renderDiagram() {
    return (
      <Diagram
        ref={this.diagramRef}
        model={this.state.model}
        onChange={this.onChange}
        plugins={plugins}
      />
    );
  }

  onChange = (model, callback) => {
    this.setState(
      {
        model
      },
      callback
    );
  };

  render() {
    return <div className="mindmap">{this.renderDiagram()}</div>;
  }
}

export default Mindmap;

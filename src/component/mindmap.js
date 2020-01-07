import React from 'react';
import { Diagram } from '@blink-mind/renderer-react';
import RichTextEditorPlugin from '@blink-mind/plugin-rich-text-editor';
import { JsonSerializerPlugin } from '@blink-mind/plugin-json-serializer';
import { ThemeSelectorPlugin } from '@blink-mind/plugin-theme-selector';
import TopologyDiagramPlugin from '@blink-mind/plugin-topology-diagram';
import { TopicReferencePlugin, SearchPlugin } from '@blink-mind/plugins';
import { Toolbar } from './toolbar/toolbar';
import { generateSimpleModel } from '../utils';
import '@blink-mind/renderer-react/lib/main.css';
import '@blink-mind/plugins/lib/main.css';
import debug from 'debug';
const log = debug('app');

const vscode = acquireVsCodeApi(); // eslint-disable-line no-undef

const plugins = [
  RichTextEditorPlugin(),
  ThemeSelectorPlugin(),
  TopicReferencePlugin(),
  SearchPlugin(),
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
    const obj = JSON.parse(message.model);
    const props = this.diagram.getDiagramProps();
    const { controller } = props;
    const model = controller.run('deserializeModel', { controller, obj });
    this.diagram.openNewModel(model);
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
    const model = generateSimpleModel();
    this.state = { model };
  }

  onClickOpenFile = e => {
    const input = document.createElement('input');
    const props = this.diagram.getDiagramProps();
    const { controller } = props;
    input.type = 'file';
    input.accept = '.json';
    log('add onchange');
    input.addEventListener('change', evt => {
      const file = evt.target.files[0];
      const fr = new FileReader();
      log('add fr onload');
      fr.onload = evt => {
        const txt = evt.target.result;
        let obj = JSON.parse(txt);
        log('OpenFile:', obj);
        let model = controller.run('deserializeModel', { controller, obj });
        log('OpenFile:', model);
        this.setState({ model });
      };
      fr.readAsText(file);
    });
    input.click();
  };

  onClickUndo = e => {
    const props = this.diagram.getDiagramProps();
    const { controller } = props;
    controller.run('undo', props);
  };

  onClickRedo = e => {
    const props = this.diagram.getDiagramProps();
    const { controller } = props;
    controller.run('redo', props);
  };

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

  renderToolbar() {
    const props = this.diagram.getDiagramProps();
    const { controller } = props;
    const canUndo = controller.run('canUndo', props);
    const canRedo = controller.run('canRedo', props);
    const toolbarProps = {
      onClickOpenFile: this.onClickOpenFile,
      onClickUndo: this.onClickUndo,
      onClickRedo: this.onClickRedo,
      canUndo,
      canRedo,
      diagram: this.diagram
    };
    return <Toolbar {...toolbarProps} />;
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
    return (
      <div className="mindmap">
        {this.diagram && this.renderToolbar()}
        {this.renderDiagram()}
      </div>
    );
  }
}

export default Mindmap;

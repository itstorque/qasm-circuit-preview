'use babel';

import QasmCircuitPreviewView from './qasm-circuit-preview-view';
import { CompositeDisposable } from 'atom';

export default {

  qasmCircuitPreviewView: null,
  modalPanel: null,
  subscriptions: null,

  activate(state) {
    this.qasmCircuitPreviewView = new QasmCircuitPreviewView(state.qasmCircuitPreviewViewState);

    panel_generator = {"left": atom.workspace.addLeftPanel, "right": atom.workspace.addRightPanel, "modal": atom.workspace.addModalPanel}

    atom.workspace.open(this.qasmCircuitPreviewView, {item: this.qasmCircuitPreviewView.getElement()});

    // Events subscribed to in atom's system can be easily cleaned up with a CompositeDisposable
    this.subscriptions = new CompositeDisposable();

    // Register command that toggles QasmCircuitPreviewView view
    this.subscriptions.add(atom.commands.add('atom-workspace', {
      'qasm-circuit-preview:toggle': () => this.qasmCircuitPreviewView.toggle(),
    }));
  },

  deactivate() {
    this.subscriptions.dispose();
    this.qasmCircuitPreviewView.destroy();
  },

  serialize() {
    return {
      qasmCircuitPreviewViewState: this.qasmCircuitPreviewView.serialize()
    };
  }

};

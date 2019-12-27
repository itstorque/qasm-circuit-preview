'use babel';

import QasmCircuitPreviewView from './qasm-circuit-preview-view';
import { CompositeDisposable } from 'atom';

export default {

  qasmCircuitPreviewView: null,
  modalPanel: null,
  subscriptions: null,

  activate(state) {
    this.qasmCircuitPreviewView = new QasmCircuitPreviewView(state.qasmCircuitPreviewViewState);
    this.modalPanel = atom.workspace.addModalPanel({
      item: this.qasmCircuitPreviewView.getElement(),
      visible: false
    });

    // Events subscribed to in atom's system can be easily cleaned up with a CompositeDisposable
    this.subscriptions = new CompositeDisposable();

    // Register command that toggles this view
    this.subscriptions.add(atom.commands.add('atom-workspace', {
      'qasm-circuit-preview:toggle': () => this.toggle()
    }));
  },

  deactivate() {
    this.modalPanel.destroy();
    this.subscriptions.dispose();
    this.qasmCircuitPreviewView.destroy();
  },

  serialize() {
    return {
      qasmCircuitPreviewViewState: this.qasmCircuitPreviewView.serialize()
    };
  },

  toggle() {
    return (
      this.modalPanel.isVisible() ?
      this.modalPanel.hide() :
      this.modalPanel.show()
    );
  }


};

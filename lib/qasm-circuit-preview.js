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

    // this.modalPanel.element

    if (this.modalPanel.isVisible()) {

      try {

        image = this.modalPanel.element.getElementsByTagName("img")[0]

        console.log(image)

        const message = this.modalPanel.element.getElementsByClassName("message")[0];

        console.log(message)

        const button = this.modalPanel.element.getElementsByClassName("btn")[0];

        console.log(button)

        // this.render_circuit(this, undefined)

      }
      catch(error) {
        console.error(error);
      }

    }

    return (
      this.modalPanel.isVisible() ?
      this.modalPanel.hide() :
      this.modalPanel.show()
    );
    atom.script
  },

  render_circuit(caller, on_complete) {

    new (require("atom").BufferedProcess)({

      command: "python3",
      args: [script_path],

      stdout: function(out) {

        if (on_complete) { return on_complete() }
        else {

          if (caller.modalPanel.isVisible()) {

            var d = new Date();

            dark_str = caller.qasmCircuitPreviewView.is_dark ? "dark" : "light"

            image.src = "/Users/tareqdandachi/delete/qcp_" + dark_str + ".png";
            message.textContent = out;

          }

        }

      },

      stderr: function(out) { console.log("ERR", out); },

    });

  }


};

'use babel';

export default class QasmCircuitPreviewView {

  constructor(serializedState) {
    // Create root element
    this.element = document.createElement('div');
    this.element.classList.add('qasm-circuit-preview');

    t = this.element

    script_path = '/Users/tareqdandachi/github/qasm-circuit-preview/helpers/qasm-drawer.py'

    editor = atom.workspace.getActivePaneItem()
    path = editor.buffer.file.path
    path = '/Users/tareqdandachi/github/language-qasm/test/qft.qasm' //overwriting for test purposes

    new (require("atom").BufferedProcess)({

      command: "python3",
      args: [script_path],

      stdout: function(out) {
        const message = document.createElement('div');
        message.textContent = out;
        message.classList.add('message');
        t.appendChild(message);
      },

      stderr: function(out) { console.log("ERR", out); },

    });

  }

  // Returns an object that can be retrieved when package is activated
  serialize() {}

  // Tear down any state and detach
  destroy() {
    this.element.remove();
  }

  getElement() {
    return this.element;
  }

}

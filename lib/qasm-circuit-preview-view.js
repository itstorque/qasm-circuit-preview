'use babel';

export default class QasmCircuitPreviewView {

  constructor(serializedState) {
    // Create root element
    this.element = document.createElement('div');
    this.element.classList.add('qasm-circuit-preview');

    this.is_dark = true;

    t = this.element

    script_path = '/Users/tareqdandachi/github/qasm-circuit-preview/helpers/qasm-drawer.py'

    editor = atom.workspace.getActivePaneItem()
    path = editor.buffer.file.path
    path = '/Users/tareqdandachi/github/language-qasm/test/qft.qasm' //overwriting for test purposes

    new (require("atom").BufferedProcess)({

      command: "python3",
      args: [script_path, this.is_dark],

      stdout: function(out) {

        const message = document.createElement('div');
        message.textContent = out;
        message.classList.add('message');

        const image = document.createElement('img');

        var dark_str = this.is_dark ? "dark" : "light"

        image.src = '/Users/tareqdandachi/delete/qcp_' + dark_str + '.png';

        const button = document.createElement('div');
        button.textContent = "Toggle Dark Circuit";
        button.classList.add('btn');
        button.classList.add('btn-primary');
        button.onclick = function(){
          this.is_dark = !this.is_dark
          var dark_str = this.is_dark ? "dark" : "light"
          image.src = '/Users/tareqdandachi/delete/qcp_' + dark_str + '.png';
        };

        t.appendChild(image);
        t.appendChild(message);
        t.appendChild(button);

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

'use babel';

export default class QasmCircuitPreviewView {

  constructor(serializedState) {
    // Create root element
    this.element = document.createElement('div');
    this.element.classList.add('qasm-circuit-preview');

    QasmClass = this;

    QasmClass.is_dark = true;

    QasmClass.drawer_path = '/Users/tareqdandachi/github/qasm-circuit-preview/helpers/qasm-drawer.py'

    editor = atom.workspace.getActiveTextEditor()
    path = editor.buffer.file.path

    const message = document.createElement('div');
    const image = document.createElement('img');
    const theme_button = document.createElement('div');
    const reload_button = document.createElement('div');
    const loader = document.createElement('div');

    QasmClass.loader = loader

    loader.innerHTML = '<div class="loader"><div></div><div></div><div></div><div></div></div>';

    message.classList.add('message');

    theme_button.classList.add('btn');
    theme_button.classList.add('btn-primary');
    theme_button.textContent = "Toggle Dark Circuit";

    theme_button.onclick = function() {

      QasmClass.is_dark = !QasmClass.is_dark

      console.log("theme_button", QasmClass.is_dark)

      image.src = QasmClass.generateSrc('/Users/tareqdandachi/delete', 'qcp', QasmClass.is_dark, 'png');

    };

    reload_button.classList.add('btn');
    reload_button.classList.add('btn-primary');
    reload_button.textContent = "Re-render Circuit";

    reload_button.onclick = function() {

      console.log("reload_button", QasmClass.is_dark)

      image.src = QasmClass.generateSrc('/Users/tareqdandachi/delete', 'qcp', QasmClass.is_dark, 'png');

      QasmClass.requestImage(QasmClass, image, message, true);

    };

    this.element.appendChild(loader);
    this.element.appendChild(image);
    this.element.appendChild(message);
    this.element.appendChild(theme_button);
    this.element.appendChild(reload_button);

    this.requestImage(QasmClass, image, message);

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

  requestImage(QasmClass, image, message, hard=false) {

    QasmClass.loader.style.opacity = 1;

    if (hard) {

      image.style.opacity = 0;
      message.style.opacity = 0;

    }

    editor = atom.workspace.getActiveTextEditor()

    new (require("atom").BufferedProcess)({

      command: "python3",
      args: [QasmClass.drawer_path, editor.buffer.file.path],

      stdout: function(out) {

        message.textContent = out;

        image.src = QasmClass.generateSrc('/Users/tareqdandachi/delete', 'qcp', QasmClass.is_dark, 'png');

        image.style.opacity = 1;
        message.style.opacity = 1;
        QasmClass.loader.style.opacity = 0;

      },

      stderr: function(out) { console.log("ERR", out); },

    });

  }

  generateSrc(folder_path, base_name, is_dark, extension) {

    var d = new Date();

    var dark_str = is_dark ? "dark" : "light";

    return folder_path + '/' + base_name + '_' + dark_str + '.' + extension + "?=" + d.getTime()

  }

  getTitle() {
    return 'QASM Circuit Preview';
  }
  getURI() {
    return 'atom://qasm-circuit-preview';
  }
  getAllowedLocations() {
    return ["right", "bottom"];
  }
  getPreferredLocation() {
    return "right";
  }


}

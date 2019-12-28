'use babel';

export default class QasmCircuitPreviewView {

  constructor(serializedState) {
    // Create root element
    this.element = document.createElement('div');
    this.element.classList.add('qasm-circuit-preview');

    QasmClass = this;

    QasmClass.is_dark = true;
    QasmClass.reverse_bits = false;

    QasmClass.drawer_path = '/Users/tareqdandachi/github/qasm-circuit-preview/helpers/qasm-drawer.py'

    editor = atom.workspace.getActiveTextEditor()
    path = editor.buffer.file.path

    QasmClass.elementControllers = {}

    QasmClass.content = document.createElement('div');
    const loader = document.createElement('div');
    QasmClass.content.classList.add('content');

    QasmClass.elementControllers.message = document.createElement('div');
    QasmClass.elementControllers.image = document.createElement('img');
    QasmClass.elementControllers.graph = document.createElement('img');

    const theme_button = document.createElement('div');
    const reload_button = document.createElement('div');
    const reverse_bits_button = document.createElement('div');

    QasmClass.loader = loader

    loader.innerHTML = '<div class="loader"><div></div><div></div><div></div><div></div></div>';

    QasmClass.elementControllers.message.classList.add('message');

    theme_button.classList.add('btn');
    theme_button.classList.add('btn-primary');
    theme_button.textContent = "Toggle Dark Circuit";

    theme_button.onclick = function() {

      QasmClass.is_dark = !QasmClass.is_dark

      QasmClass.elementControllers.image.src = QasmClass.generateSrc('/Users/tareqdandachi/delete', 'qcp', QasmClass.is_dark, 'png');

      QasmClass.elementControllers.graph.src = QasmClass.generateSrc('/Users/tareqdandachi/delete', 'statevector', QasmClass.is_dark, 'png');

    };

    reload_button.classList.add('btn');
    reload_button.classList.add('btn-primary');
    reload_button.textContent = "Re-render Circuit";

    reload_button.onclick = function() {

      QasmClass.elementControllers.image.src = QasmClass.generateSrc('/Users/tareqdandachi/delete', 'qcp', QasmClass.is_dark, 'png');

      QasmClass.requestImage(QasmClass, true);

    };

    reverse_bits_button.classList.add('btn');
    reverse_bits_button.classList.add('btn-primary');
    reverse_bits_button.textContent = "Reverse Bits";

    reverse_bits_button.onclick = function() {

      QasmClass.reverse_bits = !QasmClass.reverse_bits

      QasmClass.requestImage(QasmClass, true);

    };

    // QasmClass.content.appendChild(QasmClass.elementControllers.image);
    // QasmClass.content.appendChild(QasmClass.elementControllers.message);
    // QasmClass.content.appendChild(QasmClass.elementControllers.graph);

    this.addTab(QasmClass.content, "Circuit", QasmClass.elementControllers.image);
    this.addTab(QasmClass.content, "Logs", QasmClass.elementControllers.message);
    this.addTab(QasmClass.content, "Graph", QasmClass.elementControllers.graph);

    this.element.appendChild(QasmClass.content);
    this.element.appendChild(loader);

    this.element.appendChild(theme_button);
    this.element.appendChild(reload_button);
    this.element.appendChild(reverse_bits_button);

    this.requestImage(QasmClass);

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

  requestImage(QasmClass, hard=false) {

    QasmClass.loader.style.opacity = 1;

    if (hard) {

      QasmClass.content.style.opacity = 0;

    }

    editor = atom.workspace.getActiveTextEditor()

    new (require("atom").BufferedProcess)({

      command: "python3",
      args: [QasmClass.drawer_path, editor.buffer.file.path, QasmClass.reverse_bits],

      stdout: function(out) {

        // ERROR>

        QasmClass.elementControllers.message.textContent = out;

        QasmClass.elementControllers.image.src = QasmClass.generateSrc('/Users/tareqdandachi/delete', 'qcp', QasmClass.is_dark, 'png');

        QasmClass.elementControllers.graph.src = QasmClass.generateSrc('/Users/tareqdandachi/delete', 'statevector', QasmClass.is_dark, 'png');

        QasmClass.content.style.opacity = 1;
        QasmClass.loader.style.opacity = 0;

      },

      stderr: function(out) {

        console.log("ERR", out);

        QasmClass.elementControllers.message.textContent = out;

        QasmClass.elementControllers.image.src = QasmClass.generateSrc('/Users/tareqdandachi/delete', 'qcp', QasmClass.is_dark, 'png');

        QasmClass.elementControllers.graph.src = QasmClass.generateSrc('/Users/tareqdandachi/delete', 'statevector', QasmClass.is_dark, 'png');

        QasmClass.content.style.opacity = 1;
        QasmClass.loader.style.opacity = 0;

     },

    });

  }

  generateSrc(folder_path, base_name, is_dark, extension) {

    var d = new Date();

    var dark_str = is_dark ? "dark" : "light";

    return folder_path + '/' + base_name + '_' + dark_str + '.' + extension + "?=" + d.getTime()

  }

  showOutput() {



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

  filterSTDOUT(text) {
    return (text, logs)
  }

  generateTab(tab_title, element) {

    tab_id = tab_title.split(' ').join('_');

    tab = document.createElement("div");
    label = document.createElement("label");
    checkbox = document.createElement("input");
    tab_content = document.createElement("div");

    tab.classList.add('tab');
    tab_content.classList.add('tab-content');
    label.setAttribute("for", tab_id);
    label.textContent = tab_title;
    checkbox.id = tab_id;
    checkbox.type = "checkbox";

    tab.appendChild(checkbox);
    tab.appendChild(label);
    tab.appendChild(tab_content);

    tab_content.appendChild(element);

    return tab

  }

  addTab(parent, tab_title, element) {

    tab = this.generateTab(tab_title, element);

    parent.appendChild(tab);

  }


}

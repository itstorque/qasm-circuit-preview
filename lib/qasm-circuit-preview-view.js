'use babel';

import { PackageManager } from 'atom';

export default class QasmCircuitPreviewView {

  constructor(serializedState) {
    // Create root element
    this.element = document.createElement('div');
    this.element.classList.add('qasm-circuit-preview');

    QasmClass = this;

    QasmClass.path = atom.packages.getPackageDirPaths() + '/qasm-circuit-preview/'

    QasmClass.is_dark = true;
    QasmClass.reverse_bits = false;

    QasmClass.drawer_path = QasmClass.path + 'helpers/qasm-drawer.py'

    editor = atom.workspace.getActiveTextEditor()
    path = editor.buffer.file.path

    QasmClass.elementControllers = {}

    QasmClass.content = document.createElement('div');
    const loader = document.createElement('div');
    QasmClass.content.classList.add('content');

    this.createQasmElements(QasmClass, {"error": "div", "message": "div", "image": "img", "graph": "img", "button_container": "div"})

    const theme_button = document.createElement('div');
    const reload_button = document.createElement('div');
    const reverse_bits_button = document.createElement('div');

    QasmClass.loader = loader

    loader.innerHTML = '<div class="loader"><div></div><div></div><div></div><div></div></div>';

    theme_button.classList.add('btn');
    theme_button.classList.add('btn-primary');
    theme_button.textContent = "Toggle Dark Circuit";

    theme_button.onclick = function() {

      QasmClass.is_dark = !QasmClass.is_dark

      QasmClass.elementControllers.image.src = QasmClass.generateSrc('qcp', QasmClass.is_dark, 'png');

      QasmClass.elementControllers.graph.src = QasmClass.generateSrc('statevector', QasmClass.is_dark, 'png');

    };

    reload_button.classList.add('btn');
    reload_button.classList.add('btn-primary');
    reload_button.textContent = "Re-render Circuit";

    reload_button.onclick = function() {

      QasmClass.elementControllers.image.src = QasmClass.generateSrc('qcp', QasmClass.is_dark, 'png');

      QasmClass.requestImage(QasmClass, true);

    };

    reverse_bits_button.classList.add('btn');
    reverse_bits_button.classList.add('btn-primary');
    reverse_bits_button.textContent = "Reverse Bits";

    reverse_bits_button.onclick = function() {

      QasmClass.reverse_bits = !QasmClass.reverse_bits

      QasmClass.requestImage(QasmClass, true);

    };

    tabsToAdd = { "Circuit": QasmClass.elementControllers.image,
                  "Logs": QasmClass.elementControllers.message,
                  "Graph": QasmClass.elementControllers.graph}

    this.addTabs(QasmClass.content, tabsToAdd);

    this.element.appendChild(QasmClass.elementControllers.error);
    this.element.appendChild(QasmClass.content);
    this.element.appendChild(loader);

    QasmClass.elementControllers.button_container.appendChild(theme_button);
    QasmClass.elementControllers.button_container.appendChild(reload_button);
    QasmClass.elementControllers.button_container.appendChild(reverse_bits_button);

    this.element.appendChild(QasmClass.elementControllers.button_container)

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

        QasmClass.showOutput(out);

        QasmClass.elementControllers.image.src = QasmClass.generateSrc('qcp', QasmClass.is_dark, 'png');

        QasmClass.elementControllers.graph.src = QasmClass.generateSrc('statevector', QasmClass.is_dark, 'png');

        QasmClass.content.style.opacity = 1;
        QasmClass.loader.style.opacity = 0;

      },

      stderr: function(out) {

        console.log("ERR", out);

        QasmClass.elementControllers.message.textContent = out;

        QasmClass.elementControllers.image.src = QasmClass.generateSrc('qcp', QasmClass.is_dark, 'png');

        QasmClass.elementControllers.graph.src = QasmClass.generateSrc('statevector', QasmClass.is_dark, 'png');

        QasmClass.content.style.opacity = 1;
        QasmClass.loader.style.opacity = 0;

     },

    });

  }

  generateSrc(base_name, is_dark, extension) {

    var d = new Date();

    var dark_str = is_dark ? "dark" : "light";

    return QasmClass.path + '/temp/' + base_name + '_' + dark_str + '.' + extension + "?=" + d.getTime()

  }

  showOutput(out) {

    this.elementControllers.message.textContent = out;

    if (out.includes("ERROR>")) {

      error_msg = "Error" + out.split('ERROR>')[1].split('>')[0]
      this.elementControllers.error.textContent = error_msg;

    } else {
      this.elementControllers.error.textContent = "";
    }

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

  addTabs(parent, tabDictionary) {

    for (var tab_title in tabDictionary) {

      tab = this.generateTab(tab_title, tabDictionary[tab_title]);

      parent.appendChild(tab);

    }

  }

  createQasmElements(QasmClass, elementDictionary) {

    for (var id in elementDictionary) {

      tag = elementDictionary[id];

      newElementString = "document.createElement('" + tag + "')";

      eval("QasmClass.elementControllers."+ id + " = " + newElementString);

      eval("QasmClass.elementControllers."+ id + ".classList = '" + id + "'");

    }

  }

}

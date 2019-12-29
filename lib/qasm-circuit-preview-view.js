'use babel';

import { PackageManager } from 'atom';

export default class QasmCircuitPreviewView {

  constructor(serializedState) {
    // Create root element
    this.element = document.createElement('div');
    this.element.classList.add('qasm-circuit-preview');

    QASM = this;

    QASM.path = atom.packages.getPackageDirPaths() + '/qasm-circuit-preview/'

    QASM.is_dark = true;
    QASM.reverse_bits = false;

    QASM.drawer_path = QASM.path + 'helpers/qasm-drawer.py'

    editor = atom.workspace.getActiveTextEditor()
    path = editor.buffer.file.path

    QASM.elementControllers = {}

    QASM.content = document.createElement('div');
    const loader = document.createElement('div');
    QASM.content.classList.add('content');

    this.createQasmElements(QASM, {"error": "div", "message": "div", "image": "img", "graph_container": "div", "graph": "img", "button_container": "div"})

    QASM.elementControllers.graph_selector = document.createElement('select');

    var graph_options = ["bell_state_count", "dag", "hinton", "pauli_vector_representation", "qsphere_representation", "density_matrix_cityscape"];

    for (var i = 0; i < graph_options.length; i++) {
      var graph_option = document.createElement("option");
      graph_option.value = graph_options[i];
      graph_option.text = graph_options[i];
      QASM.elementControllers.graph_selector.appendChild(graph_option);
    }

    this.elementControllers.graph_selector.onchange = function(){ QASM.reloadSRC(QASM) };

    const theme_button = document.createElement('div');
    const reload_button = document.createElement('div');
    const reverse_bits_button = document.createElement('div');

    QASM.loader = loader

    loader.innerHTML = '<div class="loader"><div></div><div></div><div></div><div></div></div>';

    theme_button.classList.add('btn');
    theme_button.classList.add('btn-primary');
    theme_button.textContent = "Toggle Dark Circuit";

    theme_button.onclick = function() {

      QASM.is_dark = !QASM.is_dark

      QASM.reloadSRC(QASM)

    };

    reload_button.classList.add('btn');
    reload_button.classList.add('btn-primary');
    reload_button.textContent = "Re-render Circuit";

    reload_button.onclick = function() {

      QASM.reloadSRC(QASM)

      QASM.requestImage(QASM, true);

    };

    reverse_bits_button.classList.add('btn');
    reverse_bits_button.classList.add('btn-primary');
    reverse_bits_button.textContent = "Reverse Bits";

    reverse_bits_button.onclick = function() {

      QASM.reverse_bits = !QASM.reverse_bits

      QASM.requestImage(QASM, true);

    };

    tabsToAdd = { "Circuit": QASM.elementControllers.image,
                  "Logs": QASM.elementControllers.message,
                  "Graph": QASM.elementControllers.graph_container}

    this.addTabs(QASM.content, tabsToAdd);

    QASM.elementControllers.graph_container.appendChild(QASM.elementControllers.graph_selector)
    QASM.elementControllers.graph_container.appendChild(QASM.elementControllers.graph)

    this.element.appendChild(QASM.elementControllers.error);
    this.element.appendChild(QASM.content);
    this.element.appendChild(loader);

    QASM.elementControllers.button_container.appendChild(theme_button);
    QASM.elementControllers.button_container.appendChild(reload_button);
    QASM.elementControllers.button_container.appendChild(reverse_bits_button);

    this.element.appendChild(QASM.elementControllers.button_container)

    this.requestImage(QASM);

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

  requestImage(QASM, hard=false) {

    QASM.loader.style.opacity = 1;

    if (hard) {

      QASM.content.style.opacity = 0;

    }

    editor = atom.workspace.getActiveTextEditor()

    new (require("atom").BufferedProcess)({

      command: "python3",
      args: [QASM.drawer_path, editor.buffer.file.path, QASM.reverse_bits],

      stdout: function(out) {

        // ERROR>

        QASM.showOutput(out);

        QASM.reloadSRC(QASM)

        QASM.content.style.opacity = 1;
        QASM.loader.style.opacity = 0;

      },

      stderr: function(out) {

        console.log("ERR", out);

        QASM.elementControllers.message.textContent = out;

        QASM.reloadSRC(QASM)

        QASM.content.style.opacity = 1;
        QASM.loader.style.opacity = 0;

     },

    });

  }

  generateSrc(base_name, is_dark, extension) {

    var d = new Date();

    var dark_str = is_dark ? "dark" : "light";

    return QASM.path + '/temp/' + base_name + '_' + dark_str + '.' + extension + "?=" + d.getTime()

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

  createQasmElements(QASM, elementDictionary) {

    for (var id in elementDictionary) {

      tag = elementDictionary[id];

      newElementString = "document.createElement('" + tag + "')";

      eval("QASM.elementControllers."+ id + " = " + newElementString);

      eval("QASM.elementControllers."+ id + ".classList = '" + id + "'");

    }

  }

  reloadSRC(QASM) {

    QASM.elementControllers.image.src = QASM.generateSrc('circuit', QASM.is_dark, 'png');

    QASM.elementControllers.graph.src = QASM.generateSrc(QASM.elementControllers.graph_selector.value, QASM.is_dark, 'png');

  }

}

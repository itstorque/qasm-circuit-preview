'use babel';

import { PackageManager } from 'atom';
import QasmElementControllers from './qasm-element-controllers';

export default class QasmCircuitPanelView {

  constructor(serializedState) {
    // Create root element
    this.element = document.createElement('div');
    this.element.classList.add('side-panel');

    Panel = this;

    this.qasmElementController = new QasmElementControllers()

    Panel.temp_path = atom.packages.getPackageDirPaths() + '/qasm-circuit-preview/temp/'

    this.elementControllers = {}

    this.qasmElementController.createQasmElements(Panel, {"detail": "img"})

    this.element.appendChild(Panel.elementControllers.detail);

    Panel.elementControllers.detail.src = Panel.temp_path + "circuit_dark.png"

    // Create message element
    const message = document.createElement('div');
    message.textContent = 'The QasmCircuitPreview package is Alive! It\'s ALIVE!';
    message.classList.add('message');
    this.element.appendChild(message);

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

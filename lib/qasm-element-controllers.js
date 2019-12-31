'use babel';

export default class QasmElementControllers {

  createQasmElements(QASMView, elementDictionary) {

    for (var id in elementDictionary) {

      tag = elementDictionary[id];

      newElementString = "document.createElement('" + tag + "')";

      eval("QASMView.elementControllers."+ id + " = " + newElementString);

      eval("QASMView.elementControllers."+ id + ".classList = '" + id + "'");

    }

  }

}

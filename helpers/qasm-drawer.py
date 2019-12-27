from qiskit import QuantumCircuit
import matplotlib as mpl

circuit = QuantumCircuit.from_qasm_file('/Users/tareqdandachi/github/language-qasm/test/qft.qasm')

figure = circuit.draw(output="mpl")
figure.tight_layout()
figure.savefig('/Users/tareqdandachi/delete/qcp.png')
print(circuit.draw())

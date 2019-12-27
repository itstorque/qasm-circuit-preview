from qiskit import QuantumCircuit
import matplotlib as mpl

circuit = QuantumCircuit.from_qasm_file('/Users/tareqdandachi/github/language-qasm/test/qft.qasm')

circuit.draw(output="mpl").savefig('/Users/tareqdandachi/delete/qcp.png')
print(circuit.draw())

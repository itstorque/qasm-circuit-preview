from qiskit import QuantumCircuit
import matplotlib as plt
import sys

from qiskit import QuantumRegister, ClassicalRegister
from qiskit import Aer, execute
from qiskit.tools.visualization import plot_state_city
from qiskit.providers.aer import StatevectorSimulator

if __name__ == "__main__":

    path = sys.argv[1]
    reverse_bits = sys.argv[2]=="true"

    if path[-5:].lower() != ".qasm":
        print("WARNING: File Extension Not that of a QASM file [.qasm]\n", path)

    try:
        circuit = QuantumCircuit.from_qasm_file(path)

        style = {}
        dark_style = {'backgroundcolor': '#000000', 'gatecolor': '#ffffff', 'linecolor': '#ffffff', 'textcolor': '#ffffff', 'compress': True}

        figure = circuit.draw(output="mpl", style=style, plot_barriers=True, reverse_bits=reverse_bits)
        figure.tight_layout()
        figure.savefig('/Users/tareqdandachi/delete/qcp_light.png')

        simulator = Aer.get_backend('statevector_simulator')
        result = execute(circuit, simulator).result()
        statevector = result.get_statevector(circuit)

        figure_statevector = plot_state_city(statevector, title='Bell state')
        figure_statevector.savefig('/Users/tareqdandachi/delete/statevector_light.png')

        plt.style.use("dark_background")

        figure_dark = circuit.draw(output="mpl", style=dark_style, plot_barriers=True, reverse_bits=reverse_bits) #add save as button
        figure_dark.tight_layout()
        figure_dark.savefig('/Users/tareqdandachi/delete/qcp_dark.png')

        figure_statevector = plot_state_city(statevector, title='Bell state')
        figure_statevector.savefig('/Users/tareqdandachi/delete/statevector_dark.png')

    except Exception as e:

        print("ERROR drawing file:", sys.argv[1] + ":\n\n", e)

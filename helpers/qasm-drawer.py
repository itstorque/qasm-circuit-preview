from qiskit import QuantumCircuit
import matplotlib as plt
import sys

from qiskit import QuantumRegister, ClassicalRegister
from qiskit import Aer, execute
from qiskit.tools.visualization import plot_histogram
from qiskit.providers.aer import StatevectorSimulator

if __name__ == "__main__":

    path = sys.argv[1]
    reverse_bits = sys.argv[2]=="true"

    if path[-5:].lower() != ".qasm":
        print("WARNING: File Extension Not that of a QASM file [.qasm]\n", path)

    try:
        circuit = QuantumCircuit.from_qasm_file(path)

        print("LOG> Parsed QASM Successfully")

        style = {}
        dark_style = {'backgroundcolor': '#000000', 'linecolor': '#ffffff', 'textcolor': '#ffffff'}

        figure = circuit.draw(output="mpl", style=style, plot_barriers=True, reverse_bits=reverse_bits)
        figure.tight_layout()
        figure.savefig('/Users/tareqdandachi/delete/qcp_light.png')

        print("LOG> Rendered Circuit")

        print("SIZE>", circuit.size())
        print("DEPTH>", circuit.depth())
        print("WIDTH>", circuit.width())
        print("OP_BREAKDOWN>", circuit.count_ops())
        print("TENSOR_FACTORS>", circuit.num_tensor_factors())

        simulator = Aer.get_backend('qasm_simulator')
        result = execute(circuit, simulator).result()
        counts = result.get_counts(circuit)

        print("LOG> Calculated Counts:", counts)

        figure_statevector = plot_histogram(counts, title='Bell-State counts')
        figure_statevector.savefig('/Users/tareqdandachi/delete/statevector_light.png')

        plt.style.use("dark_background")

        figure_dark = circuit.draw(output="mpl", style=dark_style, plot_barriers=True, reverse_bits=reverse_bits) #add save as button
        figure_dark.tight_layout()
        figure_dark.savefig('/Users/tareqdandachi/delete/qcp_dark.png')

        figure_statevector = plot_histogram(counts, title='Bell-State counts')
        figure_statevector.savefig('/Users/tareqdandachi/delete/statevector_dark.png')

    except Exception as e:

        print("ERROR> drawing file:", sys.argv[1] + ":\n\n", e)

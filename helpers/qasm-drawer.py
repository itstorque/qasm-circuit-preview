from qiskit import QuantumCircuit
import matplotlib as plt
import sys
import os

from qiskit import QuantumRegister, ClassicalRegister
from qiskit import Aer, execute
from qiskit.tools.visualization import plot_histogram, plot_state_qsphere, plot_state_city, plot_state_paulivec, plot_state_hinton
from qiskit.providers.aer import StatevectorSimulator

from qiskit.dagcircuit import DAGCircuit
from qiskit.converters import circuit_to_dag
from qiskit.visualization import dag_drawer
from PIL import Image
import PIL.ImageOps

temp_path = "ERROR"

def dark_style(dark):

    plt.style.use("dark_background" if dark else "default")

def bell_state_counts(circuit):

    simulator = Aer.get_backend('qasm_simulator')
    result = execute(circuit, simulator).result()
    counts = result.get_counts(circuit)

    print("LOG> Calculated Counts:", counts)

    dark_style(False)

    figure_statevector = plot_histogram(counts, title='Bell-State counts')
    figure_statevector.tight_layout()
    figure_statevector.savefig(temppath('bell_state_count_light.png'))

    dark_style(True)

    figure_statevector = plot_histogram(counts, title='Bell-State counts')
    figure_statevector.savefig(temppath('bell_state_count_dark.png'))

def dag(circuit):

    dag = circuit_to_dag(circuit)
    image = dag_drawer(dag, filename=temppath("dag_light.png"))

    image = Image.open(temppath("dag_light.png"))
    inverted_image = PIL.ImageOps.invert(image.convert('L'))
    inverted_image.save(temppath("dag_dark.png"))

def calc_statevector(circuit):

    backend = Aer.get_backend('statevector_simulator')
    job = execute(circuit, backend).result()

    return job.get_statevector(circuit)

def hinton(statevector):

    dark_style(False)

    figure = plot_state_hinton(statevector)
    figure.savefig(temppath('hinton_light.png'))

    dark_style(True)

    figure = plot_state_hinton(statevector)
    figure.savefig(temppath('hinton_dark.png'))

def paulivec(statevector):

    dark_style(False)

    figure = plot_state_paulivec(statevector)
    figure.savefig(temppath('pauli_vector_representation_light.png'))

    dark_style(True)

    figure = plot_state_paulivec(statevector)
    figure.savefig(temppath('pauli_vector_representation_dark.png'))

def qsphere(statevector):

    dark_style(False)

    figure = plot_state_qsphere(statevector)
    figure.savefig(temppath('qsphere_representation_light.png'))

    dark_style(True)

    figure = plot_state_qsphere(statevector)
    figure.savefig(temppath('qsphere_representation_dark.png'))

def city(statevector):

    dark_style(False)

    figure = plot_state_city(statevector)
    figure.savefig(temppath('density_matrix_cityscape_light.png'))

    dark_style(True)

    figure = plot_state_city(statevector)
    figure.savefig(temppath('density_matrix_cityscape_dark.png'))

def temppath(filename):

    return temp_path+filename

if __name__ == "__main__":

    temp_path = sys.argv[0].split("helpers")[0]+"temp/"

    try: os.mkdir(temp_path)
    except: pass

    path = sys.argv[1]
    reverse_bits = sys.argv[2]=="true"

    if path[-5:].lower() != ".qasm":
        print("WARNING: File Extension Not that of a QASM file [.qasm]\n", path)

    completeCircuitParsing = False
    completeCircuitDrawing = False
    completeCircuitQASMSim = False
    completeCircuitStateVecSim = False

    try:
        circuit = QuantumCircuit.from_qasm_file(path)

        completeCircuitParsing = True

        print("LOG> Parsed QASM Successfully")

        plt.pyplot.margins(tight=True)

        style_dict = {'fold': 10, 'compress': True}
        dark_style_dict = {'backgroundcolor': '#000000', 'linecolor': '#ffffff', 'textcolor': '#ffffff', 'compress': True, 'fold': 10}

        dark_style(False)

        figure = circuit.draw(output="mpl", style=style_dict, plot_barriers=True, reverse_bits=reverse_bits)
        figure.tight_layout()
        figure.savefig(temppath('circuit_light.png'))

        dark_style(True)

        figure_dark = circuit.draw(output="mpl", style=dark_style_dict, plot_barriers=True, reverse_bits=reverse_bits) #add save as button
        figure_dark.tight_layout()
        figure_dark.savefig(temppath('circuit_dark.png'))

        completeCircuitDrawing = True

        plt.style.use("default")

        print("LOG> Rendered Circuit")

        print("SIZE>", circuit.size())
        print("DEPTH>", circuit.depth())
        print("WIDTH>", circuit.width())
        print("OP_BREAKDOWN>", circuit.count_ops())
        print("TENSOR_FACTORS>", circuit.num_tensor_factors())

        bell_state_counts(circuit)
        dag(circuit)

        completeCircuitQASMSim = True

        statevector = calc_statevector(circuit)
        hinton(statevector)
        paulivec(statevector)
        qsphere(statevector)
        city(statevector)

        completeCircuitStateVecSim = True

    except Exception as e:

        if not completeCircuitParsing:
            print("ERROR> Error parsing file:", sys.argv[1] + ":\n\n", e + "\n\nAre you sure this is a QASM file?")

        elif not completeCircuitDrawing:
            print("ERROR> Error drawing file:", sys.argv[1] + ":\n\n", e)

        elif not completeCircuitQASMSim:
            print("ERROR> Failed simulating circuit:", sys.argv[1] + ":\n\n", e)

        elif not completeCircuitQASMSim:
            print("ERROR> Failed statevector simulations:", sys.argv[1] + ":\n\n", e)

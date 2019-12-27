from qiskit import QuantumCircuit
import matplotlib as plt
import sys

if __name__ == "__main__":

    circuit = QuantumCircuit.from_qasm_file('/Users/tareqdandachi/github/language-qasm/test/qft.qasm')

    is_dark = sys.argv[1] == "true"

    style = {}
    dark_style = {'backgroundcolor': '#000000', 'gatecolor': '#ffffff', 'linecolor': '#ffffff', 'textcolor': '#ffffff', 'compress': True}

    if is_dark:
        style = dark_style
        plt.style.use('dark_background')

    figure = circuit.draw(output="mpl", style=style, plot_barriers=True, reverse_bits=False) #add save as button
    figure.tight_layout()
    figure.savefig('/Users/tareqdandachi/delete/qcp.png')
    print(circuit.draw())

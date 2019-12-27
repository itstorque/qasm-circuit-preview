from qiskit import QuantumCircuit
import matplotlib as plt
import sys

if __name__ == "__main__":

    circuit = QuantumCircuit.from_qasm_file('/Users/tareqdandachi/github/language-qasm/test/qft.qasm')

    style = {}
    dark_style = {'backgroundcolor': '#000000', 'gatecolor': '#ffffff', 'linecolor': '#ffffff', 'textcolor': '#ffffff', 'compress': True}

    figure = circuit.draw(output="mpl", style=style, plot_barriers=True, reverse_bits=False)
    figure.tight_layout()
    figure.savefig('/Users/tareqdandachi/delete/qcp_light.png')

    plt.style.use("dark_background")

    figure_dark = circuit.draw(output="mpl", style=dark_style, plot_barriers=True, reverse_bits=False) #add save as button
    figure_dark.tight_layout()
    figure_dark.savefig('/Users/tareqdandachi/delete/qcp_dark.png')

    print(circuit.draw())

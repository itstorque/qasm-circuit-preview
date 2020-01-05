## Error Messages

### Error Parsing File

This usually arises from two main issues:

1. The file being rendered isn't a QASM file or doesn't use QASM syntax as documented by [IBM's Qiskit](https://github.com/qiskit/qiskit-terra).

2. The file uses custom non-opaque gates, which is currently unsupported by the ast_to_dag module in Qiskit.

##### Fix for #1:

Try checking if your document follows the QASM syntax and modify it accordingly.

##### Fix for #2:

One way to preview how the circuit will look like is converting the definition of the gate into an opaque gate.

```QASM
// non-opaque gate
gate majority a,b,c
{
  cx c,b;
  cx c,a;
  ccx a,b,c;
}

// opaque definition of the same gate
opaque majority a,b,c;
```

Opaque gates contain no logic inside of them, which is why the Aer simulator will fail in populating the details & graph section of the plugin. [See "Failed Simulating Circuit" for more info]

### Failed Simulating Circuit

The gates used in the circuit must be defined in the library `qelib1.inc`, if they aren't there is no way for the simulators to infer the logic happening in them. Unfortunately, qiskit-terra doesn't support transparent gates to contain the logic when parsing directly from QASM code. You can follow the status of the support of transparent gates on [qiskit-terra's repository](https://github.com/qiskit/qiskit-terra).

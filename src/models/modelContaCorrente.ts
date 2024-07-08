import { Conta } from "./modelConta";
import { Cliente } from "src/models/modelCliente";

export class ContaCorrente extends Conta {
  limiteChequeEspecial: number = 100;

  constructor(numeroConta: string, saldo: number, client: Cliente) {
    super('CORRENTE', numeroConta, saldo, client);
  }
}

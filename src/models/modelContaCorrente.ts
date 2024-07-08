import { Conta } from "./modelConta";
import { Cliente } from "src/models/modelCliente";
import { ContaDTO } from "./modelConta";

export class ContaCorrente extends Conta {
  limiteChequeEspecial: number = 100;

  constructor(numeroConta: string, saldo: number, client: Cliente) {
    super('CORRENTE', numeroConta, saldo, client);
  }
}
export class ContaCorrenteDTO extends ContaDTO {
  limiteChequeEspecial: number;

  constructor(contaCorrente: ContaCorrente) {
    super(contaCorrente);
    this.limiteChequeEspecial = contaCorrente.limiteChequeEspecial;
  }
}

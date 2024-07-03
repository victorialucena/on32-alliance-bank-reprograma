import { Conta } from "./modelConta";
import { Cliente } from "../../cliente/model/modelCliente";

export class ContaPoupanca extends Conta {
  taxaDeJuros: number;

  constructor(numeroConta: string, saldo: number, client: Cliente, taxaDeJuros: number) {
    super('POUPANCA', numeroConta, saldo, client);
    this.taxaDeJuros = taxaDeJuros;
  }

  calcularTaxaDeJuros(): number {
    return this.saldo * (this.taxaDeJuros / 100);
  }
}
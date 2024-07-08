import { Conta } from "./modelConta";
import { Cliente } from "./modelCliente";
import { ContaDTO } from "./modelConta";

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

export class ContaPoupancaDTO extends ContaDTO {
  taxaDeJuros: number;

  constructor(contaPoupanca: ContaPoupanca) {
    super(contaPoupanca);
    this.taxaDeJuros = contaPoupanca.taxaDeJuros;
  }

  calcularTaxaDeJuros(): number {
    return this.saldo * (this.taxaDeJuros / 100);
  }
}
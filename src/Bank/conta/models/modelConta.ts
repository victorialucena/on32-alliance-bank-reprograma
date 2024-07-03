import { Cliente } from "../../cliente/model/modelCliente";
import { v4 as uuidv4 } from "uuid";


export class Conta {
  id: string;
  tipo: 'CORRENTE' | 'POUPANCA';
  numeroConta: string;
  saldo: number;
  client: Cliente;

  constructor(tipo: 'CORRENTE' | 'POUPANCA', numeroConta: string, saldo: number, client: Cliente) {
    this.id = uuidv4();
    this.tipo = tipo;
    this.numeroConta = numeroConta;
    this.saldo = saldo;
    this.client = client;
  }

  depositar(valor: number): void {}

  sacar(valor: number): void {}

  transferir(valor: number, paraConta: Conta): void {}
}

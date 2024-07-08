import { Cliente } from "./modelCliente";
import { v4 as uuidv4 } from "uuid";
import { ClienteDTO } from "./modelCliente";


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
}

export class ContaDTO {
  id: string;
  tipo: 'CORRENTE' | 'POUPANCA';
  numeroConta: string;
  saldo: number;
  client: ClienteDTO;

  constructor(conta: Conta) {
    this.id = conta.id;
    this.tipo = conta.tipo;
    this.numeroConta = conta.numeroConta;
    this.saldo = conta.saldo;
    this.client = new ClienteDTO(conta.client);
  }
}

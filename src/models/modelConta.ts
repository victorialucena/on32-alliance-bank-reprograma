import { Cliente } from "./modelCliente";
import { v4 as uuidv4 } from "uuid";
import { ClienteDTO } from "./modelCliente";
import { OperacoesConta } from "src/interfaces/metodosConta";


export class Conta implements OperacoesConta {
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

  depositar(valor: number): void{};
  verificarSaldo(): void{};
  sacar(valor: number): void{};
  transferir(valor: number, paraConta: Conta): void{};
}

export class ContaDTO implements OperacoesConta {
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

  depositar(valor: number): void{};
  verificarSaldo(): void{};
  sacar(valor: number): void{};
  transferir(valor: number, paraConta: Conta): void{};
}

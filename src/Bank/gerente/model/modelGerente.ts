import { v4 as uuidv4 } from "uuid";
import { Cliente } from "src/Bank/cliente/model/modelCliente";
import { Conta } from "src/Bank/conta/models/modelConta";

export class Gerente {
  id: string;
  nome: string;
  clientes: Cliente[];


  constructor(nome: string, clientes: Cliente[]) {
    this.id = uuidv4();
    this.nome = nome;
    this.clientes = clientes
  }


  abrirConta(conta: Conta): void { }
  fecharConta(contaId: string): void { }
  mudarTipoConta(contaId: string, novoTipo: string): void { }
}
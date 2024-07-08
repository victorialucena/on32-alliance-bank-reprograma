import { v4 as uuidv4 } from "uuid";
import { Cliente } from "src/models/modelCliente";
import { Conta } from "src/models/modelConta";

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
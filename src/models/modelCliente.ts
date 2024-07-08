import { Conta } from "./modelConta";
import { v4 as uuidv4 } from "uuid";
import { Gerente } from "src/models/modelGerente";

export class Cliente {
  id: string;
  name: string;
  address: string;
  phone: string;
  salaryIncome: number;
  gerente: Gerente
  contas: Conta[];

  constructor(name: string, address: string, phone: string, salaryIncome: number, gerente: Gerente) {
    this.id = uuidv4();
    this.name = name;
    this.address = address;
    this.phone = phone;
    this.salaryIncome = salaryIncome;
    this.contas = [];
    this.gerente = gerente;
  }

  abrirConta(conta: Conta): void { }
  fecharConta(contaId: string): void { }
  mudarTipoConta(contaId: string, novoTipo: string): void { }
}
import { v4 as uuidv4 } from "uuid";
import { Gerente } from "src/models/modelGerente";
import { ContaCorrente } from "./modelContaCorrente";
import { ContaPoupanca } from "./modelContaPoupanca";
import { ContaCorrenteDTO } from "./modelContaCorrente";
import { ContaPoupancaDTO } from "./modelContaPoupanca";
import { GerenteDTO } from "src/models/modelGerente";
import { Conta, ContaDTO } from "./modelConta";

export class Cliente {

  public conta: Conta[] = []

  id: string;
  name: string;
  address: string;
  phone: string;
  salaryIncome: number;
  gerente?: Gerente;

  constructor(name: string, address: string, phone: string, salaryIncome: number, gerente?: Gerente) {
    this.id = uuidv4();
    this.name = name;
    this.address = address;
    this.phone = phone;
    this.salaryIncome = salaryIncome;
    this.conta = this.conta;
    this.gerente = gerente;
  }
}

export class ClienteDTO {

  public conta: ContaDTO[] = []

  id: string;
  name: string;
  address: string;
  phone: string;
  salaryIncome: number;
  gerente?: GerenteDTO;

  constructor(cliente: Cliente) {
    this.id = cliente.id;
    this.name = cliente.name;
    this.address = cliente.address;
    this.phone = cliente.phone;
    this.salaryIncome = cliente.salaryIncome;
    this.conta = cliente.conta.map(conta => new ContaDTO(conta));
    this.gerente = cliente.gerente ? new GerenteDTO(cliente.gerente) : undefined;
  }
}

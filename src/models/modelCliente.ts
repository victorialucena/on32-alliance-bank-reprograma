import { v4 as uuidv4 } from "uuid";
import { Gerente } from "src/models/modelGerente";
import { ContaCorrente } from "./modelContaCorrente";
import { ContaPoupanca } from "./modelContaPoupanca";
import { ContaCorrenteDTO } from "./modelContaCorrente";
import { ContaPoupancaDTO } from "./modelContaPoupanca";
import { GerenteDTO } from "src/models/modelGerente";

export class Cliente {
  id: string;
  name: string;
  address: string;
  phone: string;
  salaryIncome: number;
  contas: (ContaCorrente | ContaPoupanca)[];
  gerente?: Gerente;

  constructor(name: string, address: string, phone: string, salaryIncome: number, gerente?: Gerente) {
    this.id = uuidv4();
    this.name = name;
    this.address = address;
    this.phone = phone;
    this.salaryIncome = salaryIncome;
    this.contas = [];
    this.gerente = gerente;
  }
}

export class ClienteDTO {
  id: string;
  name: string;
  address: string;
  phone: string;
  salaryIncome: number;
  contas: (ContaCorrenteDTO | ContaPoupancaDTO)[];
  gerente?: GerenteDTO;

  constructor(cliente: Cliente) {
    this.id = cliente.id;
    this.name = cliente.name;
    this.address = cliente.address;
    this.phone = cliente.phone;
    this.salaryIncome = cliente.salaryIncome;
    this.contas = cliente.contas.map(conta => {
      if (conta instanceof ContaCorrente) {
        return new ContaCorrenteDTO(conta);
      } else if (conta instanceof ContaPoupanca) {
        return new ContaPoupancaDTO(conta);
      } else {
        throw new Error("Tipo de conta desconhecido");
      }
    });
    this.gerente = cliente.gerente ? new GerenteDTO(cliente.gerente) : undefined;
  }
}

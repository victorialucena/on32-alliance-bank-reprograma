import { v4 as uuidv4 } from "uuid";
import { Gerente } from "src/models/modelGerente";
import { Conta, ContaDTO } from "./modelConta";

export class Cliente {
  public conta: Conta[] = []

  id: string;
  name: string;
  address: string;
  phone: string;
  salaryIncome: number;
  gerenteId?: string;

  constructor(name: string, address: string, phone: string, salaryIncome: number, gerenteId?: string) {
    this.id = uuidv4();
    this.name = name;
    this.address = address;
    this.phone = phone;
    this.salaryIncome = salaryIncome;
    this.gerenteId = gerenteId;
  }
}

export class ClienteDTO {
  public conta: Conta[] = []

  id: string;
  name: string;
  address: string;
  phone: string;
  salaryIncome: number;
  gerenteId?: string;

  constructor(cliente: Cliente) {
    this.id = cliente.id;
    this.name = cliente.name;
    this.address = cliente.address;
    this.phone = cliente.phone;
    this.salaryIncome = cliente.salaryIncome;
    this.conta = cliente.conta.map(conta => new ContaDTO(conta));
    this.gerenteId = cliente.gerenteId;
  }
}

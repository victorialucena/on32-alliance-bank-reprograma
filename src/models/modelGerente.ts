import { v4 as uuidv4 } from "uuid";
import { Cliente, ClienteDTO } from "src/models/modelCliente";

export class Gerente {
  id: string;
  nome: string;
  clientes: Cliente[] = [];

  constructor(nome: string) {
    this.id = uuidv4();
    this.nome = nome;
  }
}

export class GerenteDTO {
  id: string;
  nome: string;
  clientes: ClienteDTO[];

  constructor(gerente: Gerente) {
    this.id = gerente.id;
    this.nome = gerente.nome;
    this.clientes = gerente.clientes.map(cliente => new ClienteDTO(cliente));
  }
}

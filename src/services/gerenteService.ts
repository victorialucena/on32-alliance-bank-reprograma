import { Injectable } from '@nestjs/common';
import { Gerente } from '../models/modelGerente';
import { ClienteService } from './clienteService';

@Injectable()
export class GerenteService {
  private gerentes: Gerente[] = [];

  constructor(private readonly clienteService: ClienteService) { }

  createGerente(nome: string): Gerente {
    const newGerente = new Gerente(nome);
    this.gerentes.push(newGerente);
    return newGerente;
  }

  findGerenteById(id: string): Gerente | undefined {
    return this.gerentes.find(gerente => gerente.id === id);
  }

  associateCliente(gerenteId: string, clienteId: string): void {
    const gerente = this.findGerenteById(gerenteId);
    if (!gerente) {
      throw new Error(`Gerente com ID ${gerenteId} não encontrado.`);
    }

    const cliente = this.clienteService.findClienteById(clienteId);
    if (!cliente) {
      throw new Error(`Cliente com ID ${clienteId} não encontrado.`);
    }

    cliente.gerenteId = gerenteId;
    gerente.clientes.push(cliente);
  }

  removeCliente(gerenteId: string, clienteId: string): void {
    const gerente = this.findGerenteById(gerenteId);
    if (!gerente) {
      throw new Error(`Gerente com ID ${gerenteId} não encontrado.`);
    }

    const clienteIndex = gerente.clientes.findIndex(cliente => cliente.id === clienteId);
    if (clienteIndex === -1) {
      throw new Error(`Cliente com ID ${clienteId} não encontrado.`);
    }

    gerente.clientes[clienteIndex].gerenteId = undefined;
    gerente.clientes.splice(clienteIndex, 1);
  }

  getAllGerentes(): Gerente[] {
    return this.gerentes;
  }

  
}

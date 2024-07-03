import { Injectable } from '@nestjs/common';
import { Gerente } from './model/modelGerente';
import { ClienteService } from '../cliente/cliente.service'; 

@Injectable()
export class GerenteService {
  private gerentes: Gerente[] = [];

  constructor(private readonly clienteService: ClienteService) {} 

  createGerente(nome: string): Gerente {
    const newGerente = new Gerente(nome, []);
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

    gerente.clientes.push(cliente);
  }

  removeCliente(gerenteId: string, clienteId: string): void {
    const gerente = this.findGerenteById(gerenteId);
    if (!gerente) {
      throw new Error(`Gerente com ID ${gerenteId} não encontrado.`);
    }

    gerente.clientes = gerente.clientes.filter(cliente => cliente.id !== clienteId);
  }
}

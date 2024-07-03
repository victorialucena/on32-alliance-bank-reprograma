import { Injectable } from '@nestjs/common';
import { Gerente } from '../models/modelGerente';
import { Cliente } from '../models/modelCliente';

@Injectable()
export class GerenteService {

 private gerentes: Gerente[] = [];

 createGerente(nome: string, clientes: Cliente[]): Gerente {
  const newGerente = new Gerente(nome, clientes);
  this.gerentes.push(newGerente);
  return newGerente;
 }

 findAllGerentes(): Gerente[] {
  return this.gerentes;
 }

 findGerenteById(id: string): Gerente {
  return this.gerentes.find(gerente => gerente.id === id);
 }

 addCliente(gerenteId: string, cliente: Cliente): Gerente {
  const gerente = this.findGerenteById(gerenteId);
  if (gerente) {
   gerente.clientes.push(cliente);
  }
  return gerente;
 }

 removeCliente(gerenteId: string, clienteId: string): Gerente {
  const gerente = this.findGerenteById(gerenteId);
  if (gerente) {
   gerente.clientes = gerente.clientes.filter(cliente => cliente.id !== clienteId);
  }
  return gerente;
 }
}

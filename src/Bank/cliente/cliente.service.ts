import { Injectable } from '@nestjs/common';
import { Cliente } from '../models/modelCliente';

@Injectable()
export class ClienteService {
 private clientes: Cliente[] = [];

 createCliente(nome: string, endereco: string, telefone: string, rendaSalarial: number): Cliente {
   const newCliente = new Cliente(nome, endereco, telefone, rendaSalarial);
   this.clientes.push(newCliente);
   return newCliente;
 }

 findAllClientes(): Cliente[] {
   return this.clientes;
 }

 findClienteById(id: string): Cliente {
   return this.clientes.find(cliente => cliente.id === id);
 }

}

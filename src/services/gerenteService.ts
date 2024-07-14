import { BadRequestException, Inject, Injectable, NotFoundException, forwardRef } from '@nestjs/common';
import { Gerente } from '../models/modelGerente';
import { ClienteService } from './clienteService';
import { ContaService } from './contaService';
import { ContaCorrenteDTO } from 'src/models/modelContaCorrente';
import { ContaPoupancaDTO } from 'src/models/modelContaPoupanca';

@Injectable()
export class GerenteService {
  private gerentes: Gerente[] = [];

  constructor(
    @Inject(forwardRef(() => ContaService))
    @Inject(forwardRef(() => ClienteService))
    private readonly contaService: ContaService,
    private readonly clienteService: ClienteService
  ) {}


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

  createContaParaCliente(gerenteId: string, clienteId: string, tipo: 'CORRENTE' | 'POUPANCA', taxaDeJuros?: number, saldoInicial: number = 0): ContaCorrenteDTO | ContaPoupancaDTO {
    const gerente = this.findGerenteById(gerenteId);
    if (!gerente) {
      throw new NotFoundException(`Gerente com ID ${gerenteId} não encontrado.`);
    }

    const cliente = this.clienteService.findClienteById(clienteId);
    if (!cliente) {
      throw new NotFoundException(`Cliente com ID ${clienteId} não encontrado.`);
    }

    if (cliente.gerenteId !== gerente.id) {
      throw new BadRequestException('O gerente não está autorizado a abrir conta para este cliente.');
    }

    return this.contaService.createConta(clienteId, tipo, taxaDeJuros, saldoInicial);
  }

  mudarTipoDeContaParaCliente(gerenteId: string, clienteId: string, numeroConta: string, novoTipo: 'CORRENTE' | 'POUPANCA', taxaDeJuros?: number){
    const gerente = this.findGerenteById(gerenteId);
    if (!gerente) {
      throw new NotFoundException(`Gerente com ID ${gerenteId} não encontrado.`);
    }

    const cliente = this.clienteService.findClienteById(clienteId);
    if (!cliente) {
      throw new NotFoundException(`Cliente com ID ${clienteId} não encontrado.`);
    }

    if (cliente.gerenteId !== gerente.id) {
      throw new BadRequestException('O gerente não está autorizado a abrir conta para este cliente.');
    }

    return this.contaService.mudarTipoDeConta(numeroConta, novoTipo, taxaDeJuros)
  }

  fecharContaParaCliente(gerenteId: string, clienteId: string, numeroConta: string){
    const gerente = this.findGerenteById(gerenteId);
    if (!gerente) {
      throw new NotFoundException(`Gerente com ID ${gerenteId} não encontrado.`);
    }

    const cliente = this.clienteService.findClienteById(clienteId);
    if (!cliente) {
      throw new NotFoundException(`Cliente com ID ${clienteId} não encontrado.`);
    }

    if (cliente.gerenteId !== gerente.id) {
      throw new BadRequestException('O gerente não está autorizado a abrir conta para este cliente.');
    }

    return this.contaService.fecharConta(numeroConta)

  }

}

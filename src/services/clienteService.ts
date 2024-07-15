import { v4 as uuidv4 } from 'uuid';
import { Cliente } from '../models/modelCliente';
import { ContaCorrente, ContaCorrenteDTO } from '../models/modelContaCorrente';
import { ContaPoupanca, ContaPoupancaDTO } from '../models/modelContaPoupanca';
import { BadRequestException, ForbiddenException, forwardRef, Inject, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { ContaService } from './contaService';
import { Gerente } from 'src/models/modelGerente';

@Injectable()
export class ClienteService {
  private clientes: Cliente[] = [];

  constructor(
    @Inject(forwardRef(() => ContaService))
    private readonly contaService: ContaService,
  ) {}

  createCliente(name: string, address: string, phone: string, salaryIncome: number, gerenteId?: string): Cliente {
    const newCliente = new Cliente(name, address, phone, salaryIncome, gerenteId);
    this.clientes.push(newCliente);
    return newCliente;
  }

  async getAllClientes(): Promise<Cliente[]> {
    return this.clientes;
  }

  findClienteById(id: string): Cliente | undefined {
    return this.clientes.find(cliente => cliente.id === id);
  }

  updateCliente(cliente: Cliente): void {
    const index = this.clientes.findIndex(c => c.id === cliente.id);
    if (index !== -1) {
      this.clientes[index] = cliente;
    }
  }
  abrirContaParaCliente(idCliente: string, tipo: 'CORRENTE' | 'POUPANCA', taxaDeJuros?: number) {
    const contaDTO = this.contaService.createConta(idCliente, tipo, taxaDeJuros);
    const cliente = this.findClienteById(idCliente);
    if (cliente) {
        this.updateCliente(cliente); 
    }
    return contaDTO;
  }

  mudarTipoDeConta(idCliente: string, numeroConta: string, novoTipo: 'CORRENTE' | 'POUPANCA', taxaDeJuros?: number){
    const contaNova = this.contaService.mudarTipoDeConta(numeroConta, novoTipo, taxaDeJuros);
    const cliente = this.findClienteById(idCliente);
    if (cliente) {
      this.updateCliente(cliente); 
  }
  return contaNova;
  }

  fecharConta(idCliente: string, numeroConta: string): boolean {
    const cliente = this.findClienteById(idCliente);
    if (!cliente) {
      throw new NotFoundException('Cliente não encontrado.');
    }

    const conta = cliente.conta.find(conta => conta.numeroConta === numeroConta);
    if (!conta) {
      throw new NotFoundException('Conta não encontrada para o cliente.');
    }

    const contaFechada = this.contaService.fecharConta(numeroConta);
    if (contaFechada) {
      cliente.conta = cliente.conta.filter(conta => conta.numeroConta !== numeroConta);
      this.updateCliente(cliente);
    }

    return contaFechada;
  }

  buscarContaPorNumero(numeroConta: string): ContaCorrente | ContaPoupanca | undefined {
    return this.contaService.findContaByNumero(numeroConta);
  }
  
  async verificarProprietarioDaConta(clienteId: string, numeroConta: string): Promise<boolean> {
    const conta = await this.contaService.findContaByNumero(numeroConta);
    if (!conta) {
      throw new NotFoundException('Conta não encontrada.');
    }
    return conta.client.id === clienteId;
  }

  async depositarNaConta(clienteId: string, numeroConta: string, valor: number): Promise<void> {
    const isProprietario = await this.verificarProprietarioDaConta(clienteId, numeroConta);
    if (!isProprietario) {
      throw new ForbiddenException('Você não tem permissão para realizar esta operação.');
    }

    await this.contaService.depositar(numeroConta, valor);
  }

  async transferirEntreContas(clienteId: string, numeroContaOrigem: string, numeroContaDestino: string, valor: number): Promise<boolean> {
    const isProprietarioOrigem = await this.verificarProprietarioDaConta(clienteId, numeroContaOrigem);
    if (!isProprietarioOrigem) {
      throw new ForbiddenException('Você não tem permissão para realizar esta operação na conta de origem.');
    }

    const isProprietarioDestino = await this.verificarProprietarioDaConta(clienteId, numeroContaDestino);
    if (!isProprietarioDestino) {
      throw new ForbiddenException('Você não tem permissão para realizar esta operação na conta de destino.');
    }

    return this.contaService.transferir(numeroContaOrigem, valor, numeroContaDestino);
  }

  async sacarDaConta(clienteId: string, contaNumero: string, valor: number): Promise<boolean> {
    const isProprietario = await this.verificarProprietarioDaConta(clienteId, contaNumero);
    if (!isProprietario) {
      throw new ForbiddenException('Você não tem permissão para realizar esta operação.');
    }

    return this.contaService.sacar(contaNumero, valor);
  }

}

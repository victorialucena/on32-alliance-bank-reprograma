import { v4 as uuidv4 } from 'uuid';
import { Cliente } from '../models/modelCliente';
import { ContaCorrente, ContaCorrenteDTO } from '../models/modelContaCorrente';
import { ContaPoupanca, ContaPoupancaDTO } from '../models/modelContaPoupanca';
import { BadRequestException, forwardRef, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { ContaService } from './contaService';
import { Gerente } from 'src/models/modelGerente';

@Injectable()
export class ClienteService {
  private clientes: Cliente[] = [];

  constructor(
    @Inject(forwardRef(() => ContaService))
    private readonly contaService: ContaService,
  ) {}

  createCliente(name: string, address: string, phone: string, salaryIncome: number, gerente?: Gerente): Cliente {
    const newCliente = new Cliente(name, address, phone, salaryIncome, gerente);
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
        this.updateCliente(cliente); // Atualiza o cliente na lista
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

}

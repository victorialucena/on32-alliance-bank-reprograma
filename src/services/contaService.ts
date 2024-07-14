import { BadRequestException, Injectable, NotFoundException, forwardRef } from '@nestjs/common';
import { ContaCorrente, ContaCorrenteDTO } from '../models/modelContaCorrente';
import { ContaPoupanca, ContaPoupancaDTO } from '../models/modelContaPoupanca';
import { ClienteService } from './clienteService';
import { Inject } from '@nestjs/common';
import { Conta } from 'src/models/modelConta';
import { Cliente } from 'src/models/modelCliente';


@Injectable()
export class ContaService {
  private contas: (ContaCorrente | ContaPoupanca)[] = [];

  constructor(
    @Inject(forwardRef(() => ClienteService))
    private readonly clienteService: ClienteService,
  ) {}

  createConta(clienteId: string, tipo: 'CORRENTE' | 'POUPANCA', taxaDeJuros?: number, saldoInicial: number = 0): ContaCorrenteDTO | ContaPoupancaDTO {
    const cliente = this.clienteService.findClienteById(clienteId);
    if (!cliente) {
      throw new NotFoundException('Cliente não encontrado.');
    }
  
    let newConta: ContaCorrente | ContaPoupanca;
  
    if (tipo === 'CORRENTE') {
      if (cliente.salaryIncome >= 500) {
        const numeroConta = this.generateRandomAccountNumber();
        newConta = new ContaCorrente(numeroConta, saldoInicial, cliente);
      } else {
        throw new BadRequestException('O cliente não atende aos requisitos mínimos para abrir uma conta corrente.');
      }
    } else if (tipo === 'POUPANCA') {
      if (typeof taxaDeJuros !== 'number') {
        throw new BadRequestException('A taxa de juros deve ser fornecida para uma conta poupança.');
      }
      const numeroConta = this.generateRandomAccountNumber();
      newConta = new ContaPoupanca(numeroConta, saldoInicial, cliente, taxaDeJuros);
    } else {
      throw new BadRequestException('Tipo de conta inválido.');
    }

    this.contas.push(newConta);
    cliente.conta.push(newConta);
    
    if (newConta instanceof ContaCorrente) {
      return new ContaCorrenteDTO(newConta);
    } else if (newConta instanceof ContaPoupanca) {
      return new ContaPoupancaDTO(newConta);
    }
  }

  mudarTipoDeConta(numeroConta: string, novoTipo: 'CORRENTE' | 'POUPANCA', taxaDeJuros?: number): ContaCorrenteDTO | ContaPoupancaDTO {
    const contaIndex = this.contas.findIndex(conta => conta.numeroConta === numeroConta);
    if (contaIndex === -1) {
      throw new NotFoundException('Conta não encontrada.');
    }

    const contaAtual = this.contas[contaIndex];
    const cliente = contaAtual.client;

    this.contas.splice(contaIndex, 1);
    const contaClienteIndex = cliente.conta.findIndex(conta => conta.numeroConta === numeroConta);
    cliente.conta.splice(contaClienteIndex, 1);

    return this.createConta(cliente.id, novoTipo, taxaDeJuros, contaAtual.saldo);
  }

  fecharConta(numeroConta: string): boolean {
    const contaIndex = this.contas.findIndex(conta => conta.numeroConta === numeroConta);
    if (contaIndex === -1) {
      throw new NotFoundException('Conta não encontrada.');
    }

    this.contas.splice(contaIndex, 1);
    return true;
  }

  depositar(conta: ContaCorrente | ContaPoupanca, valor: number): void {
    conta.depositar(valor);
  }

  sacar(conta: ContaCorrente | ContaPoupanca, valor: number): boolean {
    if (valor <= conta.saldo) {
      conta.saldo -= valor;
      return true;
    }
    return false;
  }

  transferir(contaOrigem: ContaCorrente | ContaPoupanca, valor: number, contaDestino: ContaCorrente | ContaPoupanca): boolean {
    if (this.sacar(contaOrigem, valor)) {
      this.depositar(contaDestino, valor);
      return true;
    }
    return false;
  }

  findContaByNumero(numeroConta: string): ContaCorrente | ContaPoupanca | undefined {
    return this.contas.find(conta => conta.numeroConta === numeroConta);
  }

  async findAllContas(): Promise<Conta[]> {
    return this.contas;
  }

  generateRandomAccountNumber(): string {
    const min = 1000;
    const max = 9999;
    const randomNumber = Math.floor(Math.random() * (max - min + 1)) + min;
    const numeroConta = `CC-${randomNumber}`;
    return numeroConta;
  }

  getClienteDaConta(numeroConta: string): Cliente | undefined {
    const conta = this.findContaByNumero(numeroConta);
    return conta ? conta.client : undefined;
  }
  
}

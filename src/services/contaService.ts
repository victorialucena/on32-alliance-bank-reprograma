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
    this.clienteService.updateCliente(cliente);

    
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
    this.clienteService.updateCliente(cliente);

    return this.createConta(cliente.id, novoTipo, taxaDeJuros, contaAtual.saldo);
  }

  fecharConta(numeroConta: string): boolean {
    const contaIndex = this.contas.findIndex(conta => conta.numeroConta === numeroConta);
    if (contaIndex === -1) {
      throw new NotFoundException('Conta não encontrada.');
    }
    const conta = this.contas[contaIndex];
    const cliente = conta.client;
    cliente.conta = cliente.conta.filter(c => c.numeroConta !== numeroConta);
    this.clienteService.updateCliente(cliente);
    this.contas.splice(contaIndex, 1);
    return true;
  }

  async depositar(numeroConta: string, valor: number): Promise<void> {
    const conta = await this.findContaByNumero(numeroConta);
    if (!conta) {
      throw new NotFoundException('Conta não encontrada.');
    }

    if (valor <= 0) {
      throw new BadRequestException('O valor do depósito deve ser maior que zero.');
    }

    conta.saldo += valor;
  }


  async sacar(numeroConta: string, valor: number): Promise<boolean> {
    const conta = this.findContaByNumero(numeroConta);
    if (!conta) {
      throw new NotFoundException('Conta não encontrada.');
    }

    if (valor > 0 && valor <= conta.saldo) {
      conta.saldo -= valor;
      return true;
    }
    return false;
  }

  async transferir(numeroContaOrigem: string, valor: number, numeroContaDestino: string): Promise<boolean> {
    const contaOrigem = this.findContaByNumero(numeroContaOrigem);
    const contaDestino = this.findContaByNumero(numeroContaDestino);

    if (!contaOrigem || !contaDestino) {
      throw new NotFoundException('Contas não encontradas.');
    }

    if (await this.sacar(numeroContaOrigem, valor)) {
      await this.depositar(numeroContaDestino, valor);
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
